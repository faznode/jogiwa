// Every write follows one path (04-page-specs/flows.md): connect → network → risk acceptance on first trade →
// pre-sign summary with simulation → wallet → toast (pending → preconfirmed → confirmed | failed). Nothing signs unseen.
import { useCallback, type ReactNode } from 'react'
import { mutate } from 'swr'
import { useDataSource } from '../data/hooks'
import type { TxRequest, TxResult } from '../data/types'
import { track } from '../lib/analytics'
import { walletErrorMessage } from '../lib/errors'
import { t } from '../lib/i18n'
import { NETWORK } from '../lib/params'
import { openSheet, pushToast, updateToast } from '../state/stores'
import { useWallet, WalletError } from '../wallet/wallet'

export interface PlanRow {
  label: ReactNode
  value: ReactNode
  strong?: boolean
}

export interface TxPlan {
  request: TxRequest
  rows: PlanRow[]
  warnings?: string[]
  tone?: 'buy' | 'sell' | 'primary'
  progress?: ReactNode
  slippagePct?: number
  receipt: (result: TxResult) => string
}

const NEEDS_TERMS = new Set(['buy', 'sell', 'deposit', 'launch'])
const REFRESH = new Set(['portfolio', 'creator', 'season', 'profile', 'launches', 'windows'])

export function useTxRunner() {
  const { wallet } = useWallet()
  const ds = useDataSource()
  return useCallback(
    async (plan: TxPlan): Promise<TxResult | null> => {
      if (wallet.getState().status !== 'connected' && !(await openSheet('connect'))) return null
      if (wallet.getState().chainId !== NETWORK.chainId && !(await openSheet('network'))) return null
      const address = wallet.getState().address
      if (!address) return null
      if (NEEDS_TERMS.has(plan.request.kind)) {
        const account = await ds.getAccount(address).catch(() => null)
        if (account && !account.tosAccepted && !(await openSheet('risk'))) return null
      }
      if (!(await openSheet('presign', { plan }))) return null

      const trade = plan.request.kind === 'buy' || plan.request.kind === 'sell'
      const id = pushToast({ kind: 'tx', title: t('tx.pending'), phase: 'pending' })
      if (trade) track('trade_submitted', { side: plan.request.kind, slippage: plan.slippagePct ?? 0 })
      try {
        const result = await wallet.send(plan.request, (u) => {
          if (u.phase === 'preconfirmed') {
            updateToast(id, { title: t('tx.preconfirmed'), phase: 'preconfirmed' })
            if (trade) track('trade_preconfirmed_ms', { ms: u.elapsedMs })
          }
          if (u.phase === 'confirmed' && u.result) {
            updateToast(id, { title: t('tx.confirmed'), phase: 'confirmed', body: plan.receipt(u.result), href: `${NETWORK.explorer}/tx/${u.hash}` })
            if (trade) track('trade_confirmed_ms', { ms: u.elapsedMs })
          }
        })
        mutate((key) => Array.isArray(key) && REFRESH.has(String(key[0])))
        return result
      } catch (e) {
        const code = e instanceof WalletError ? e.code : 'reverted'
        updateToast(id, { title: t('tx.failed'), phase: 'failed', body: walletErrorMessage(code, { slippagePct: plan.slippagePct }) })
        track('error_shown', { glossary_key: code })
        return null
      }
    },
    [wallet, ds],
  )
}
