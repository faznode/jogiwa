// WalletPort: what the UI needs from a wallet. Production: wagmi + viem (+ embedded provider, Q21) in a lazy chunk.
// Prototype: MockWallet, driven by the mock controls (reject next request, wrong network, chain missing, tx outcome).
import { createContext, useContext, useState, useSyncExternalStore, type ReactNode } from 'react'
import { getWorld } from '../data/mock/world'
import { NETWORK } from '../lib/params'
import type { TxError, TxRequest, TxResult } from '../data/types'

export type WalletStatus = 'disconnected' | 'connecting' | 'connected'
export type WalletKind = 'embedded' | 'injected'
export type WalletErrorCode = 'userRejected' | 'noProvider' | 'chainMissing' | TxError
export type TxPhase = 'pending' | 'preconfirmed' | 'confirmed' | 'failed'

export interface WalletState {
  status: WalletStatus
  kind: WalletKind | null
  address: string | null
  chainId: number | null
  chainKnown: boolean
  signedIn: boolean
}

export interface TxUpdate {
  phase: TxPhase
  hash?: string
  error?: WalletErrorCode
  result?: TxResult
  elapsedMs: number
}

export class WalletError extends Error {
  constructor(public code: WalletErrorCode) {
    super(code)
  }
}

export interface WalletPort {
  getState(): WalletState
  subscribe(listener: () => void): () => void
  connect(kind: WalletKind): Promise<void>
  disconnect(): void
  switchNetwork(): Promise<void>
  addNetwork(): Promise<void>
  signMessage(purpose: 'session' | 'terms'): Promise<void>
  send(request: TxRequest, onUpdate: (update: TxUpdate) => void): Promise<TxResult>
}

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms))

export class MockWallet implements WalletPort {
  private state: WalletState = { status: 'disconnected', kind: null, address: null, chainId: null, chainKnown: true, signedIn: false }
  private listeners = new Set<() => void>()
  private watching = false

  getState = () => this.state
  subscribe = (listener: () => void) => {
    this.listeners.add(listener)
    if (!this.watching) {
      this.watching = true
      getWorld().onControls(() => {
        const c = getWorld().controls
        if (this.state.status === 'connected') {
          const chainId = c.wrongNetwork ? 1 : NETWORK.chainId
          if (chainId !== this.state.chainId || this.state.chainKnown === c.chainMissing) this.set({ chainId, chainKnown: !c.chainMissing })
        }
      })
    }
    return () => this.listeners.delete(listener)
  }

  private set(patch: Partial<WalletState>) {
    this.state = { ...this.state, ...patch }
    this.listeners.forEach((l) => l())
  }

  private rejectsNext() {
    const w = getWorld()
    if (!w.controls.rejectNext) return false
    w.setControls({ rejectNext: false })
    return true
  }

  async connect(kind: WalletKind) {
    this.set({ status: 'connecting', kind })
    await wait(700)
    if (this.rejectsNext()) {
      this.set({ status: 'disconnected', kind: null })
      throw new WalletError('userRejected')
    }
    const w = getWorld()
    this.set({ status: 'connected', address: w.user, chainId: w.controls.wrongNetwork ? 1 : NETWORK.chainId, chainKnown: !w.controls.chainMissing })
  }

  disconnect() {
    this.set({ status: 'disconnected', kind: null, address: null, chainId: null, signedIn: false })
  }

  async switchNetwork() {
    await wait(500)
    if (this.rejectsNext()) throw new WalletError('userRejected')
    if (!this.state.chainKnown) throw new WalletError('chainMissing')
    this.set({ chainId: NETWORK.chainId })
    getWorld().setControls({ wrongNetwork: false })
  }

  async addNetwork() {
    await wait(600)
    if (this.rejectsNext()) throw new WalletError('userRejected')
    this.set({ chainKnown: true, chainId: NETWORK.chainId })
    getWorld().setControls({ chainMissing: false, wrongNetwork: false })
  }

  async signMessage(purpose: 'session' | 'terms') {
    await wait(650)
    if (this.rejectsNext()) throw new WalletError('userRejected')
    if (purpose === 'session') this.set({ signedIn: true })
  }

  async send(request: TxRequest, onUpdate: (update: TxUpdate) => void): Promise<TxResult> {
    const started = performance.now()
    const elapsed = () => Math.round(performance.now() - started)
    const w = getWorld()
    const from = this.state.address ?? w.user
    await wait(550)
    if (this.rejectsNext()) {
      onUpdate({ phase: 'failed', error: 'userRejected', elapsedMs: elapsed() })
      throw new WalletError('userRejected')
    }
    const slow = w.controls.chainSlow ? 4 : 1
    const outcome = w.controls.outcome
    if (outcome !== 'success') w.setControls({ outcome: 'success' })
    onUpdate({ phase: 'pending', elapsedMs: elapsed() })
    await wait(320 * slow)
    if (outcome === 'timeout') {
      await wait(3500)
      onUpdate({ phase: 'failed', error: 'timeout', elapsedMs: elapsed() })
      throw new WalletError('timeout')
    }
    const invalid = outcome === 'slippage' ? 'slippage' : outcome === 'reverted' ? 'reverted' : w.validate(request, from)
    if (invalid) {
      onUpdate({ phase: 'failed', error: invalid, elapsedMs: elapsed() })
      throw new WalletError(invalid)
    }
    const result = w.apply(request, from)
    onUpdate({ phase: 'preconfirmed', hash: result.hash, result, elapsedMs: elapsed() })
    await wait(900 * slow)
    onUpdate({ phase: 'confirmed', hash: result.hash, result, elapsedMs: elapsed() })
    return result
  }
}

const WalletContext = createContext<WalletPort | null>(null)

export function WalletProvider({ children }: { children: ReactNode }) {
  const [wallet] = useState<WalletPort>(() => new MockWallet())
  return <WalletContext value={wallet}>{children}</WalletContext>
}

export function useWallet() {
  const wallet = useContext(WalletContext)
  if (!wallet) throw new Error('WalletProvider missing')
  const state = useSyncExternalStore(wallet.subscribe, wallet.getState, wallet.getState)
  const wrongNetwork = state.status === 'connected' && state.chainId !== NETWORK.chainId
  return { wallet, state, connected: state.status === 'connected', wrongNetwork, ready: state.status === 'connected' && !wrongNetwork }
}
