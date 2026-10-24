// One trade widget before and after graduation (masterplan IQuoteMarket, J4): curve while Open/Full, locked pool after graduation.
import { quoteBuy, quoteSell, spotPrice } from './curve'
import { PARAMS } from './params'
import type { Pool, Side, TokenState } from '../data/types'

const FEE = PARAMS.feePct / 100

export interface MarketState {
  state: TokenState
  creditQ: number
  pool: Pool | null
  creatorTaxPct: number
}

export interface Quote {
  side: Side
  input: number
  output: number
  fee: number
  tax: number
  impactPct: number
  refund: number
  priceAfter: number
}

export const marketPrice = (m: MarketState) => (m.state === 'graduated' && m.pool ? m.pool.q / m.pool.t : spotPrice(m.creditQ))

export function quote(m: MarketState, side: Side, input: number): Quote {
  const amount = Math.max(0, input)
  if (m.state === 'graduated' && m.pool) return poolQuote(m.pool, side, amount, m.creatorTaxPct)
  if (side === 'buy') {
    const b = quoteBuy(m.creditQ, amount, m.creatorTaxPct)
    return { side, input: b.gross + b.refund, output: b.tokensOut, fee: b.fee, tax: b.tax, impactPct: b.impactPct, refund: b.refund, priceAfter: spotPrice(b.newQ) }
  }
  const s = quoteSell(m.creditQ, amount, m.creatorTaxPct)
  return { side, input: amount, output: s.out, fee: s.fee, tax: s.tax, impactPct: s.impactPct, refund: 0, priceAfter: spotPrice(s.newQ) }
}

export function poolQuote(pool: Pool, side: Side, amount: number, taxPct: number): Quote {
  const k = pool.q * pool.t
  const spot = pool.q / pool.t
  if (side === 'buy') {
    const net = amount * (1 - FEE - taxPct / 100)
    const out = pool.t - k / (pool.q + net)
    const avg = out > 0 ? net / out : spot
    return { side, input: amount, output: out, fee: amount * FEE, tax: (amount * taxPct) / 100, impactPct: Math.max(0, (avg / spot - 1) * 100), refund: 0, priceAfter: (pool.q + net) / (pool.t - out) }
  }
  const gross = pool.q - k / (pool.t + amount)
  const avg = amount > 0 ? gross / amount : spot
  return { side, input: amount, output: gross * (1 - FEE - taxPct / 100), fee: gross * FEE, tax: (gross * taxPct) / 100, impactPct: Math.max(0, (1 - avg / spot) * 100), refund: 0, priceAfter: (pool.q - gross) / (pool.t + amount) }
}

export const minReceived = (q: Quote, slippagePct: number) => q.output * (1 - slippagePct / 100)
