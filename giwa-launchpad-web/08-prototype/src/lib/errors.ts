// Error glossary `[06-copy/copy-system.md]`: what happened, then what to do. Never raw revert data.
import { RequestError } from '../data/DataSource'
import { formatSC } from './format'
import { t } from './i18n'
import { PARAMS } from './params'
import type { WalletErrorCode } from '../wallet/wallet'

export function walletErrorMessage(code: WalletErrorCode, vars: { slippagePct?: number; tier?: number } = {}): string {
  switch (code) {
    case 'userRejected':
      return t('errors.userRejected')
    case 'slippage':
      return t('errors.slippage', { slippage: `${vars.slippagePct ?? 2}%` })
    case 'insufficientBalance':
      return t('errors.insufficientBalance')
    case 'windowCap':
      return t('errors.windowCap', { cap: formatSC(PARAMS.capByTier[(vars.tier ?? 1) as 0 | 1 | 2], { trim: true }) })
    case 'tierGate':
      return t('errors.tierGate')
    case 'windowClosed':
      return t('errors.windowClosed')
    case 'paused':
      return t('errors.paused')
    case 'wrongNetwork':
      return t('errors.wrongNetwork')
    case 'timeout':
      return t('errors.timeout')
    case 'reverted':
      return t('errors.reverted')
    case 'chainMissing':
      return t('errors.chainMissing')
    case 'noProvider':
      return t('errors.noProvider')
    default:
      return t('errors.unknown')
  }
}

export function requestErrorMessage(error: unknown, secondsLeft?: number): string {
  if (error instanceof RequestError && error.code === 'rateLimited') return t('errors.rateLimited', { seconds: secondsLeft ?? error.retryAfterSec })
  return t('errors.unknown')
}
