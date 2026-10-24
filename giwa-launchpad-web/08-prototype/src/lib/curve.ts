import { LIMIT_BUCKETS, PARAMS, type LimitBucket } from './params'

// Constant-product curve with a virtual quote reserve `[F01, 03 §3]`. q = tracked quote (net SC in the curve).
const K = PARAMS.q0 * PARAMS.supply
const FEE = PARAMS.feePct / 100

export const START_PRICE = PARAMS.q0 / PARAMS.supply
export const FULL_PRICE = (PARAMS.q0 + PARAMS.creditGoal) ** 2 / K

export const spotPrice = (q: number) => (PARAMS.q0 + q) ** 2 / K
export const tokenReserve = (q: number) => K / (PARAMS.q0 + q)
export const tokensSold = (q: number) => PARAMS.supply - tokenReserve(q)

export interface BuyQuote {
  gross: number
  fee: number
  tax: number
  net: number
  tokensOut: number
  avgPrice: number
  impactPct: number
  refund: number
  newQ: number
}

export function quoteBuy(q: number, grossIn: number, taxPct: number): BuyQuote {
  const keep = 1 - FEE - taxPct / 100
  const room = Math.max(0, PARAMS.creditGoal - q)
  let gross = Math.max(0, grossIn)
  let net = gross * keep
  let refund = 0
  if (net > room) {
    const used = room / keep
    refund = gross - used
    gross = used
    net = room
  }
  const newQ = q + net
  const tokensOut = tokenReserve(q) - tokenReserve(newQ)
  const spot = spotPrice(q)
  const avgPrice = tokensOut > 0 ? net / tokensOut : spot
  return { gross, fee: gross * FEE, tax: (gross * taxPct) / 100, net, tokensOut, avgPrice, impactPct: Math.max(0, (avgPrice / spot - 1) * 100), refund, newQ }
}

export interface SellQuote {
  tokensIn: number
  grossOut: number
  fee: number
  tax: number
  out: number
  avgPrice: number
  impactPct: number
  newQ: number
}

export function quoteSell(q: number, tokensIn: number, taxPct: number): SellQuote {
  const tokens = Math.max(0, tokensIn)
  const newQ = Math.max(0, K / (tokenReserve(q) + tokens) - PARAMS.q0)
  const grossOut = Math.max(0, q - newQ)
  const fee = grossOut * FEE
  const tax = (grossOut * taxPct) / 100
  const spot = spotPrice(q)
  const avgPrice = tokens > 0 ? grossOut / tokens : spot
  return { tokensIn: tokens, grossOut, fee, tax, out: grossOut - fee - tax, avgPrice, impactPct: Math.max(0, (1 - avgPrice / spot) * 100), newQ }
}

export interface WindowDeposit {
  owner: string
  amount: number
  bucket: LimitBucket
}

export interface WindowClearing {
  price: number
  included: number
  refunded: number
  tokens: number
  newQ: number
  excludedOwners: Set<string>
}

/** All deposits clear as one buy at one price; buckets below P1 are refunded and the window clears again at P2 ≤ P1 `[03 §3.2]`. */
export function clearWindow(deposits: WindowDeposit[], taxPct: number): WindowClearing {
  const run = (list: WindowDeposit[]) => {
    const total = list.reduce((sum, d) => sum + d.amount, 0)
    const quote = quoteBuy(0, total, taxPct)
    return { total, quote, price: quote.tokensOut > 0 ? quote.net / quote.tokensOut : START_PRICE }
  }
  const first = run(deposits)
  const excluded = deposits.filter((d) => d.bucket !== null && d.bucket * START_PRICE < first.price)
  const kept = excluded.length ? deposits.filter((d) => !excluded.includes(d)) : deposits
  const second = excluded.length ? run(kept) : first
  return {
    price: second.price,
    included: second.total,
    refunded: excluded.reduce((sum, d) => sum + d.amount, 0),
    tokens: second.quote.tokensOut,
    newQ: second.quote.newQ,
    excludedOwners: new Set(excluded.map((d) => d.owner)),
  }
}

export const bucketLabelValue = (bucket: LimitBucket) => (bucket === null ? null : bucket)
export const ALL_BUCKETS = LIMIT_BUCKETS
