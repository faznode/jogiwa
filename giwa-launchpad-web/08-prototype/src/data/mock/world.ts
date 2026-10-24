// MOCK DATA ENGINE (prototype only). A seeded, deterministic world plus a live simulation that follows the masterplan
// state machine: Window → Settling → Open → Full → Graduated `[03 §2–3]`. Nothing here is real activity.
import { clearWindow, quoteBuy, quoteSell, tokenReserve } from '../../lib/curve'
import { marketPrice, poolQuote } from '../../lib/market'
import { LIMIT_BUCKETS, PARAMS, type LimitBucket, type Tier } from '../../lib/params'
import { between, fakeAddress, fakeHash, intBetween, mulberry32, pick, type Rng } from '../../lib/prng'
import { EDGE_CASES, EXTRA_NAMES, FEATURED, GENERIC_LINES, THINGS, type SeedLaunch } from './catalogue'
import type {
  Account,
  FeedDelta,
  Holder,
  LaunchDetail,
  LaunchSummary,
  Pool,
  PricePoint,
  TokenDelta,
  TokenState,
  Trade,
  TxError,
  TxRequest,
  TxResult,
  WalletLabel,
  WindowEntry,
  WindowInfo,
} from '../types'

const SEED = 20261024
const GENESIS = Date.UTC(2026, 9, 1)
const MAX_TRADES = 500
const FEE = PARAMS.feePct / 100
export const USER_ADDRESS = '0x5b9e3c1d7f2a48e6b0c9d14f8a7e2b63c50d9a1e'

export interface MockControls {
  rate: number
  delivery: 'gateway' | 'raw'
  indexerLag: boolean
  chainSlow: boolean
  paused: boolean
  pendingChange: boolean
  rateLimitNext: boolean
  apiErrorNext: boolean
  wrongNetwork: boolean
  chainMissing: boolean
  rejectNext: boolean
  noEth: boolean
  attestationTier: Tier
  outcome: 'success' | 'slippage' | 'reverted' | 'timeout'
}

export const DEFAULT_CONTROLS: MockControls = {
  rate: 3,
  delivery: 'gateway',
  indexerLag: false,
  chainSlow: false,
  paused: false,
  pendingChange: false,
  rateLimitNext: false,
  apiErrorNext: false,
  wrongNetwork: false,
  chainMissing: false,
  rejectNext: false,
  noEth: false,
  attestationTier: 1,
  outcome: 'success',
}

interface TokenRec {
  address: string
  name: string
  ticker: string
  image: string | null
  description: string
  links: string[]
  creator: string
  creatorScore: number | null
  taxPct: number
  openingPct: number
  teamWallets: Set<string>
  clusterWallets: Set<string>
  manifestHash: string
  manifestOk: boolean
  createdAt: number
  windowEndsAt: number
  settleAt: number | null
  graduateAt: number | null
  state: TokenState
  q: number
  pool: Pool | null
  buyers: string[]
  buyerSet: Set<string>
  balances: Map<string, number>
  costs: Map<string, number>
  fullSince: number | null
  graduatedAt: number | null
  moderation: 'ok' | 'review' | 'hidden'
  flags: ('churn' | 'cluster')[]
  entries: WindowEntry[]
  clearing: WindowInfo['clearing']
  allocations: Map<string, { tokens: number; refund: number }>
  clearingPrice: number
  trades: Trade[]
  chart: PricePoint[]
  rewardsEpoch: number
  creatorFeesLifetime: number
  creatorFeesClaimed: number
  vestingTotal: number
  vestingReleased: number
  seq: number
}

interface Pending {
  seqFrom: number
  trades: Trade[]
  count: number
  chart: PricePoint[]
  window: boolean
  holders: boolean
}

const VAULT = (token: string) => `0xvault${token.slice(7, 42)}`
const r2 = (n: number) => Math.round(n * 100) / 100

const rngWallets = mulberry32(SEED)
const WALLETS = Array.from({ length: 640 }, () => {
  const roll = rngWallets()
  return { address: fakeAddress(rngWallets), tier: (roll < 0.1 ? 0 : roll < 0.78 ? 1 : 2) as Tier }
})
const VERIFIED = WALLETS.filter((w) => w.tier > 0)
const TIER_OF = new Map(WALLETS.map((w) => [w.address, w.tier]))

function tickerFrom(name: string, taken: Set<string>) {
  const words = name.toUpperCase().replace(/[^A-Z ]/g, '').split(' ').filter(Boolean)
  let base = words.length === 1 ? words[0].slice(0, 5) : (words[0].slice(0, 3) + words.slice(1).map((w) => w[0]).join('')).slice(0, 6)
  let n = 2
  const original = base
  while (taken.has(base)) base = `${original}${n++}`
  taken.add(base)
  return base
}

export class MockWorld {
  readonly user = USER_ADDRESS
  readonly genesis = GENESIS
  controls: MockControls = { ...DEFAULT_CONTROLS }
  meter = { eventsPerSec: 0, frameP95: 0 }

  private tokens = new Map<string, TokenRec>()
  private order: string[] = []
  private tickers = new Set<string>()
  private listeners = new Map<string, Set<(d: unknown) => void>>()
  private controlListeners = new Set<() => void>()
  private dirty = new Map<string, Pending>()
  private added: string[] = []
  private accountDirty = false
  private budget = 0
  private spawnIndex = 16
  private nextSpawnAt = 0
  private timers: ReturnType<typeof setInterval>[] = []
  private raf = 0
  private running = false
  private eventCount = 0
  private frames: number[] = []
  private lastFrame = 0
  private nextId = 1
  private seasonStart: number
  account = {
    attestationTier: 1 as Tier,
    registered: true,
    sc: 137.5,
    eth: 0.0042,
    nextClaimAt: 0,
    tosAccepted: false,
    history: [] as { day: number; amount: number }[],
    rewards: new Map<string, { amount: number; epoch: number }>(),
  }

  constructor(now = Date.now()) {
    this.seasonStart = now - 11.4 * 86_400_000
    this.account.history = Array.from({ length: 11 }, (_, i) => ({ day: i + 1, amount: i === 3 || i === 7 ? 0 : 20 })).filter((h) => h.amount > 0)
    this.seed(now)
  }

  // ---------- seeding ----------
  private seed(now: number) {
    const rng = mulberry32(SEED + 1)
    const list: SeedLaunch[] = [...FEATURED, ...EDGE_CASES]
    const extraStates: TokenState[] = ['open', 'open', 'graduated', 'open', 'full', 'open', 'graduated', 'open', 'open', 'open', 'graduated', 'open', 'open', 'open', 'open', 'graduated']
    EXTRA_NAMES.slice(0, 16).forEach((name, i) => {
      const state = extraStates[i]
      const credit = state === 'open' ? Math.round(between(rng, 160, 2300)) : PARAMS.creditGoal
      const people =
        state === 'open' ? Math.max(2, Math.min(24, Math.round((credit / PARAMS.creditGoal) * 20 + between(rng, -3, 4)))) : state === 'full' ? intBetween(rng, 14, 23) : intBetween(rng, 30, 150)
      list.push({
        name,
        ticker: '',
        image: null,
        description: pick(rng, GENERIC_LINES).replace('{thing}', pick(rng, THINGS)),
        state,
        credit,
        people,
        ageMin: state === 'graduated' ? between(rng, 1800, 14000) : between(rng, 20, 900),
        fullForMin: state === 'full' ? between(rng, 30, 600) : undefined,
        taxPct: rng() < 0.2 ? pick(rng, [0.5, 1, 2]) : 0,
        openingPct: rng() < 0.6 ? pick(rng, [0.5, 1, 2, 3]) : 0,
        teamWallets: rng() < 0.4 ? intBetween(rng, 1, 2) : 0,
      })
    })
    for (const s of list) this.createFromSeed(s, rng, now)
    this.account.nextClaimAt = now - 60_000
    this.nextSpawnAt = now + 75_000
  }

  private blankRec(s: SeedLaunch, rng: Rng, now: number, creator: string): TokenRec {
    const address = fakeAddress(rng)
    const windowEndsAt = s.state === 'window' ? now + (s.windowLeftSec ?? 100) * 1000 : now - s.ageMin * 60_000 + PARAMS.windowSec * 1000
    const teamWallets = new Set(Array.from({ length: s.teamWallets ?? 0 }, () => pick(rng, VERIFIED).address))
    const clusterWallets = new Set(s.flags?.includes('cluster') ? Array.from({ length: 4 }, () => pick(rng, VERIFIED).address) : [])
    return {
      address,
      name: s.name,
      ticker: s.ticker || tickerFrom(s.name, this.tickers),
      image: s.image,
      description: s.description,
      links: s.image ? [`https://t.me/${s.ticker.toLowerCase()}_testnet`, `https://x.com/${s.ticker.toLowerCase()}_testnet`] : [],
      creator,
      creatorScore: creator === USER_ADDRESS ? 64 : Math.round(between(rng, 20, 92)),
      taxPct: s.taxPct ?? 0,
      openingPct: s.openingPct ?? 0,
      teamWallets,
      clusterWallets,
      manifestHash: fakeHash(rng),
      manifestOk: s.manifestOk ?? true,
      createdAt: windowEndsAt - PARAMS.windowSec * 1000,
      windowEndsAt,
      settleAt: null,
      graduateAt: null,
      state: s.state === 'graduated' || s.state === 'full' || s.state === 'open' ? 'window' : s.state,
      q: 0,
      pool: null,
      buyers: [],
      buyerSet: new Set(),
      balances: new Map(),
      costs: new Map(),
      fullSince: null,
      graduatedAt: null,
      moderation: s.moderation ?? 'ok',
      flags: s.flags ?? [],
      entries: [],
      clearing: null,
      allocations: new Map(),
      clearingPrice: 0,
      trades: [],
      chart: [],
      rewardsEpoch: 0,
      creatorFeesLifetime: 0,
      creatorFeesClaimed: 0,
      vestingTotal: 0,
      vestingReleased: 0,
      seq: 1,
    }
  }

  private createFromSeed(s: SeedLaunch, rng: Rng, now: number) {
    const creator = s.creatorIsUser ? USER_ADDRESS : pick(rng, VERIFIED).address
    const rec = this.blankRec(s, rng, now, creator)
    if (s.ticker) this.tickers.add(s.ticker)
    this.tokens.set(rec.address, rec)
    this.order.push(rec.address)
    if (rec.openingPct) rec.entries.push({ owner: VAULT(rec.address), amount: r2(this.openingDeposit(rec.openingPct, rec.taxPct)), bucket: null, label: 'team' })
    if (s.state === 'window') {
      const n = s.name === 'Rain Frog' ? 13 : 1
      for (let i = 0; i < n; i++) {
        const w = pick(rng, VERIFIED)
        rec.entries.push({ owner: w.address, amount: r2(between(rng, 6, PARAMS.capByTier[w.tier])), bucket: rng() < 0.15 ? pick(rng, LIMIT_BUCKETS.slice(1, 4)) : null, label: this.labelFor(rec, w.address) })
      }
      return
    }
    this.synthesize(rec, s, rng, now)
  }

  private openingDeposit(pct: number, taxPct: number) {
    const tokens = (PARAMS.supply * pct) / 100
    const q = (PARAMS.q0 * PARAMS.supply) / (PARAMS.supply - tokens) - PARAMS.q0
    return q / (1 - FEE - taxPct / 100)
  }

  private synthesize(rec: TokenRec, s: SeedLaunch, rng: Rng, now: number) {
    const targetPeople = s.state === 'graduated' ? Math.max(PARAMS.peopleNeeded, Math.round(s.people * 0.45)) : s.people
    const n = Math.max(2, Math.min(24, Math.round(targetPeople * between(rng, 0.35, 0.7))))
    for (let i = 0; i < n; i++) {
      const w = pick(rng, VERIFIED)
      if (rec.entries.some((e) => e.owner === w.address)) continue
      rec.entries.push({ owner: w.address, amount: r2(between(rng, 6, PARAMS.capByTier[w.tier])), bucket: rng() < 0.12 ? pick(rng, LIMIT_BUCKETS.slice(1, 3)) : null, label: this.labelFor(rec, w.address) })
    }
    if (s.name === 'Late Cat') rec.entries.push({ owner: USER_ADDRESS, amount: 30, bucket: null, label: 'you' })
    this.settle(rec, rec.windowEndsAt + 2000, true)
    if (s.name === 'Late Cat') {
      // the user's allocation stays unclaimed so Portfolio shows a window claim
    } else {
      rec.allocations.forEach((a, owner) => this.credit(rec, owner, a.tokens))
      rec.allocations.clear()
    }

    const start = rec.windowEndsAt + 4000
    const gradAt = s.state === 'graduated' ? start + (now - start) * 0.35 : null
    const curveEnd = gradAt ?? (s.state === 'full' ? now - (s.fullForMin ?? 10) * 60_000 : now - 25_000)
    const targetCredit = s.state === 'open' ? s.credit : PARAMS.creditGoal
    const userAt = s.userHolds && !rec.buyerSet.has(USER_ADDRESS) ? rec.buyers.length : -1
    const buys = Math.max(targetPeople - rec.buyers.length, Math.ceil((targetCredit - rec.q) / 28), 1)
    const sells = Math.round(buys * 0.24)
    const plan: ('b' | 's')[] = [...Array(buys).fill('b'), ...Array(sells).fill('s')]
    for (let i = plan.length - 1; i > 0; i--) {
      const j = Math.floor(rng() * (i + 1))
      ;[plan[i], plan[j]] = [plan[j], plan[i]]
    }
    const span = Math.max(60_000, curveEnd - start)
    let buysLeft = buys
    plan.forEach((step, i) => {
      const ts = start + (span * (i + 1)) / (plan.length + 1)
      if (step === 's') {
        const seller = this.randomHolder(rec, rng)
        if (seller) this.applySell(rec, seller, (rec.balances.get(seller) ?? 0) * between(rng, 0.15, 0.6), ts)
        return
      }
      const wantNew = rec.buyers.length < targetPeople
      const wallet = rec.buyers.length === userAt && !rec.buyerSet.has(USER_ADDRESS) ? USER_ADDRESS : wantNew ? this.freshWallet(rec, rng) : pick(rng, rec.buyers)
      const remaining = Math.max(0, targetCredit - rec.q)
      let amount = Math.max(2, Math.min(PARAMS.capByTier[2], (remaining / Math.max(1, buysLeft)) * between(rng, 0.6, 1.4) * (1 + sells / buys)))
      if (s.state === 'open') amount = Math.min(amount, Math.max(1, remaining / (1 - FEE)))
      if (rec.buyers.length < targetPeople - 1) amount = Math.min(amount, Math.max(1, (PARAMS.creditGoal - rec.q - 40) / 2))
      buysLeft--
      if (wallet === USER_ADDRESS) this.applyBuy(rec, wallet, 25, ts)
      else this.applyBuy(rec, wallet, amount, ts)
    })
    if (s.state === 'open' && rec.q < targetCredit - 1) this.applyBuy(rec, this.freshWallet(rec, rng), (targetCredit - rec.q) / (1 - FEE), curveEnd)
    if (s.state !== 'open') {
      let guard = 0
      while (rec.buyers.length < targetPeople && guard++ < 400) {
        if (!this.applyBuy(rec, this.freshWallet(rec, rng), 4, curveEnd)) {
          const seller = this.randomHolder(rec, rng)
          if (seller) this.applySell(rec, seller, (rec.balances.get(seller) ?? 0) * 0.3, curveEnd)
        }
      }
      guard = 0
      while (rec.q < PARAMS.creditGoal - 1e-6 && guard++ < 200) this.applyBuy(rec, pick(rng, rec.buyers), PARAMS.capByTier[2], curveEnd)
      rec.fullSince = s.state === 'full' ? now - (s.fullForMin ?? 10) * 60_000 : curveEnd
    }
    if (s.state === 'graduated' && gradAt) {
      this.graduate(rec, gradAt, true)
      const poolTrades = Math.max(0, s.people - rec.buyers.length) + 20
      const poolSpan = now - 20_000 - gradAt
      for (let i = 0; i < poolTrades; i++) {
        const ts = gradAt + (poolSpan * (i + 1)) / (poolTrades + 1)
        if (rng() < 0.25) {
          const seller = this.randomHolder(rec, rng)
          if (seller) this.applySell(rec, seller, (rec.balances.get(seller) ?? 0) * between(rng, 0.1, 0.5), ts)
        } else {
          const wallet = rec.buyers.length < s.people ? this.freshWallet(rec, rng) : pick(rng, rec.buyers)
          this.applyBuy(rec, wallet, between(rng, 4, 60), ts)
        }
      }
      if (rec.creator === USER_ADDRESS) this.account.rewards.set(rec.address, { amount: 1.84, epoch: 4 })
    }
    if (s.state === 'full' && rec.buyers.length >= PARAMS.peopleNeeded) rec.graduateAt = now + 180_000
    rec.state = s.state
    if (rec.creator === USER_ADDRESS) rec.creatorFeesClaimed = rec.creatorFeesLifetime * 0.62
    rec.rewardsEpoch = r2(rec.trades.filter((t) => t.ts > now - 86_400_000).reduce((sum, t) => sum + t.amountSC * FEE * 0.3, 0))
    rec.chart = downsample(rec.chart, 360)
  }

  private freshWallet(rec: TokenRec, rng: Rng) {
    if (rec.clusterWallets.size && rng() < 0.3) {
      const c = [...rec.clusterWallets].find((w) => !rec.buyerSet.has(w))
      if (c) return c
    }
    for (let i = 0; i < 20; i++) {
      const w = pick(rng, VERIFIED).address
      if (!rec.buyerSet.has(w)) return w
    }
    return fakeAddress(rng)
  }

  private randomHolder(rec: TokenRec, rng: Rng) {
    const holders = [...rec.balances.entries()].filter(([w, b]) => b > 1 && w !== USER_ADDRESS && !w.startsWith('0xvault'))
    return holders.length ? pick(rng, holders)[0] : null
  }

  private labelFor(rec: TokenRec, wallet: string): WalletLabel | null {
    if (wallet === USER_ADDRESS) return 'you'
    if (rec.teamWallets.has(wallet) || wallet.startsWith('0xvault') || wallet === rec.creator) return 'team'
    if (rec.clusterWallets.has(wallet)) return 'cluster'
    return null
  }

  private credit(rec: TokenRec, wallet: string, tokens: number) {
    rec.balances.set(wallet, (rec.balances.get(wallet) ?? 0) + tokens)
  }

  // ---------- core market actions (shared by seeding, live stream and the user's wallet) ----------
  private applyBuy(rec: TokenRec, wallet: string, gross: number, ts: number): { tokens: number; spent: number; holderNumber: number | null } | null {
    let tokens: number
    let spent: number
    let fee: number
    let tax: number
    if (rec.state === 'graduated' && rec.pool) {
      const qte = poolQuote(rec.pool, 'buy', gross, rec.taxPct)
      const net = gross * (1 - FEE - rec.taxPct / 100)
      rec.pool = { q: rec.pool.q + net, t: rec.pool.t - qte.output }
      tokens = qte.output
      spent = gross
      fee = qte.fee
      tax = qte.tax
    } else {
      const qte = quoteBuy(rec.q, gross, rec.taxPct)
      if (qte.tokensOut <= 0) return null
      rec.q = qte.newQ
      tokens = qte.tokensOut
      spent = qte.gross
      fee = qte.fee
      tax = qte.tax
      if (rec.q >= PARAMS.creditGoal - 1e-6 && rec.state !== 'window' && rec.state !== 'settling') {
        if (rec.state !== 'full') rec.fullSince = ts
        rec.state = 'full'
      }
    }
    this.credit(rec, wallet, tokens)
    rec.costs.set(wallet, (rec.costs.get(wallet) ?? 0) + spent)
    let holderNumber: number | null = null
    const tier = wallet === USER_ADDRESS ? this.userTier() : TIER_OF.get(wallet) ?? 1
    if (!rec.buyerSet.has(wallet) && tier > 0) {
      rec.buyerSet.add(wallet)
      rec.buyers.push(wallet)
      holderNumber = rec.buyers.length
    }
    rec.creatorFeesLifetime += fee * 0.4 + tax
    rec.rewardsEpoch += fee * 0.3
    this.record(rec, { side: 'buy', amountSC: spent, tokens, wallet, ts })
    return { tokens, spent, holderNumber }
  }

  private applySell(rec: TokenRec, wallet: string, tokensIn: number, ts: number): { out: number } | null {
    const balance = rec.balances.get(wallet) ?? 0
    const tokens = Math.min(balance, tokensIn)
    if (tokens <= 0) return null
    let out: number
    let fee: number
    let tax: number
    if (rec.state === 'graduated' && rec.pool) {
      const qte = poolQuote(rec.pool, 'sell', tokens, rec.taxPct)
      const gross = qte.output / (1 - FEE - rec.taxPct / 100)
      rec.pool = { q: rec.pool.q - gross, t: rec.pool.t + tokens }
      out = qte.output
      fee = qte.fee
      tax = qte.tax
    } else {
      const qte = quoteSell(rec.q, tokens, rec.taxPct)
      rec.q = qte.newQ
      out = qte.out
      fee = qte.fee
      tax = qte.tax
      if (rec.state === 'full' && rec.q < PARAMS.creditGoal - 1e-6) {
        rec.state = 'open'
        rec.fullSince = null
        rec.graduateAt = null
      }
    }
    rec.balances.set(wallet, balance - tokens)
    rec.creatorFeesLifetime += fee * 0.4 + tax
    rec.rewardsEpoch += fee * 0.3
    this.record(rec, { side: 'sell', amountSC: out, tokens, wallet, ts })
    return { out }
  }

  private record(rec: TokenRec, t: { side: 'buy' | 'sell'; amountSC: number; tokens: number; wallet: string; ts: number }) {
    const price = marketPrice({ state: rec.state, creditQ: rec.q, pool: rec.pool, creatorTaxPct: rec.taxPct })
    const trade: Trade = { id: `t${this.nextId++}`, ts: t.ts, side: t.side, amountSC: t.amountSC, tokens: t.tokens, wallet: t.wallet, label: this.labelFor(rec, t.wallet), price }
    rec.trades.unshift(trade)
    if (rec.trades.length > MAX_TRADES) rec.trades.length = MAX_TRADES
    const last = rec.chart[rec.chart.length - 1]
    const point = { ts: t.ts, price }
    if (last && t.ts - last.ts < 1000) rec.chart[rec.chart.length - 1] = point
    else rec.chart.push(point)
    if (rec.chart.length > 2400) rec.chart.splice(0, rec.chart.length - 2400)
    rec.seq++
    if (this.running) {
      const p = this.pending(rec)
      p.trades.unshift(trade)
      if (p.trades.length > 60) p.trades.length = 60
      p.count++
      p.chart.push(point)
      p.holders = true
    }
  }

  private settle(rec: TokenRec, ts: number, silent = false) {
    const result = clearWindow(rec.entries, rec.taxPct)
    const included = rec.entries.filter((e) => !result.excludedOwners.has(e.owner))
    const includedTotal = included.reduce((s, e) => s + e.amount, 0)
    for (const e of rec.entries) {
      if (result.excludedOwners.has(e.owner)) rec.allocations.set(e.owner, { tokens: 0, refund: e.amount })
      else rec.allocations.set(e.owner, { tokens: (result.tokens * e.amount) / includedTotal, refund: 0 })
    }
    rec.q = result.newQ
    rec.clearingPrice = result.price
    rec.clearing = { price: result.price, participants: included.filter((e) => !e.owner.startsWith('0xvault')).length, tokens: result.tokens, refunded: result.refunded }
    for (const e of included) {
      if (e.owner.startsWith('0xvault')) {
        rec.vestingTotal = rec.allocations.get(e.owner)?.tokens ?? 0
        continue
      }
      const tier = e.owner === USER_ADDRESS ? this.userTier() : TIER_OF.get(e.owner) ?? 1
      if (tier > 0 && !rec.buyerSet.has(e.owner)) {
        rec.buyerSet.add(e.owner)
        rec.buyers.push(e.owner)
      }
      rec.costs.set(e.owner, (rec.costs.get(e.owner) ?? 0) + e.amount)
    }
    const vault = VAULT(rec.address)
    rec.allocations.delete(vault)
    rec.creatorFeesLifetime += includedTotal * (FEE * 0.4 + rec.taxPct / 100)
    rec.chart.push({ ts: rec.createdAt, price: result.price }, { ts: rec.windowEndsAt, price: result.price })
    rec.state = rec.q >= PARAMS.creditGoal - 1e-6 ? 'full' : 'open'
    if (rec.state === 'full') rec.fullSince = ts
    rec.settleAt = null
    if (!silent) {
      rec.seq++
      const p = this.pending(rec)
      p.window = true
      p.holders = true
      p.chart.push(...rec.chart.slice(-2))
      if (rec.allocations.has(USER_ADDRESS)) this.accountDirty = true
    }
  }

  private graduate(rec: TokenRec, ts: number, silent = false) {
    rec.state = 'graduated'
    rec.graduatedAt = ts
    rec.graduateAt = null
    rec.pool = { q: PARAMS.creditGoal, t: (PARAMS.supply * PARAMS.poolSharePct) / 100 }
    if (!silent) {
      rec.seq++
      this.pending(rec).holders = true
    }
  }

  // ---------- live loop ----------
  start() {
    if (this.running || typeof window === 'undefined') return
    this.running = true
    const params = new URLSearchParams(window.location.search)
    const rate = Number(params.get('rate'))
    if (rate >= 0 && params.has('rate')) this.controls.rate = Math.min(1000, rate)
    if (params.get('delivery') === 'raw') this.controls.delivery = 'raw'
    this.timers.push(setInterval(() => this.tick(), 100))
    this.timers.push(setInterval(() => this.measure(), 1000))
    this.scheduleFlush()
    const frame = (ts: number) => {
      if (this.lastFrame) this.frames.push(ts - this.lastFrame)
      if (this.frames.length > 240) this.frames.shift()
      this.lastFrame = ts
      if (this.controls.delivery === 'raw') this.flush()
      this.raf = requestAnimationFrame(frame)
    }
    this.raf = requestAnimationFrame(frame)
  }

  private flushTimer: ReturnType<typeof setInterval> | null = null
  private scheduleFlush() {
    if (this.flushTimer) clearInterval(this.flushTimer)
    this.flushTimer = setInterval(() => {
      if (this.controls.delivery === 'gateway') this.flush()
    }, 250)
  }

  private measure() {
    this.meter.eventsPerSec = this.eventCount
    this.eventCount = 0
    const sorted = [...this.frames].sort((a, b) => a - b)
    this.meter.frameP95 = sorted.length ? Math.round(sorted[Math.floor(sorted.length * 0.95)] * 10) / 10 : 0
    this.controlListeners.forEach((l) => l())
  }

  private tick() {
    const now = Date.now()
    this.advance(now)
    if (document.hidden) return
    this.budget += this.controls.rate / 10
    let n = Math.floor(this.budget)
    this.budget -= n
    if (!n) return
    const active = this.order.map((a) => this.tokens.get(a)!).filter((r) => r.state !== 'settling')
    const weights = active.map((r) => (r.state === 'window' ? 4 : r.state === 'open' ? 3 : r.state === 'full' ? 1 : 1.5) * (r.moderation === 'hidden' ? 0.1 : 1))
    const total = weights.reduce((s, w) => s + w, 0)
    while (n-- > 0) {
      let roll = Math.random() * total
      let i = 0
      while (roll > weights[i] && i < weights.length - 1) roll -= weights[i++]
      this.randomEvent(active[i], now)
      this.eventCount++
    }
  }

  private randomEvent(rec: TokenRec, now: number) {
    const rnd = Math.random
    if (rec.state === 'window') {
      const w = pick(rnd, VERIFIED)
      if (rec.entries.some((e) => e.owner === w.address)) return
      rec.entries.push({ owner: w.address, amount: r2(between(rnd, 5, PARAMS.capByTier[w.tier])), bucket: rnd() < 0.15 ? pick(rnd, LIMIT_BUCKETS.slice(1, 4)) : null, label: this.labelFor(rec, w.address) })
      rec.seq++
      this.pending(rec).window = true
      return
    }
    const sell = rec.state === 'full' ? rnd() < 0.6 : rnd() < 0.36
    if (sell) {
      const seller = this.randomHolder(rec, rnd)
      if (seller) this.applySell(rec, seller, (rec.balances.get(seller) ?? 0) * between(rnd, 0.1, 0.7), now)
      return
    }
    if (rec.state === 'full') return
    const fresh = rnd() < (rec.buyers.length < PARAMS.peopleNeeded ? 0.3 : 0.18)
    const wallet = fresh ? this.freshWallet(rec, rnd) : rec.buyers.length ? pick(rnd, rec.buyers) : this.freshWallet(rec, rnd)
    if (wallet === USER_ADDRESS) return
    this.applyBuy(rec, wallet, 2 + 38 * rnd() ** 2, now)
  }

  private advance(now: number) {
    for (const address of this.order) {
      const rec = this.tokens.get(address)!
      if (rec.state === 'window' && now >= rec.windowEndsAt) {
        rec.state = 'settling'
        rec.settleAt = now + 2500
        rec.seq++
        this.pending(rec).window = true
      } else if (rec.state === 'settling' && rec.settleAt && now >= rec.settleAt) {
        this.settle(rec, now)
        rec.allocations.forEach((a, owner) => {
          if (owner !== USER_ADDRESS) this.credit(rec, owner, a.tokens)
        })
        for (const owner of [...rec.allocations.keys()]) if (owner !== USER_ADDRESS) rec.allocations.delete(owner)
      } else if (rec.state === 'full') {
        const ready = rec.buyers.length >= PARAMS.peopleNeeded || (rec.fullSince !== null && now >= rec.fullSince + PARAMS.fallbackSec * 1000)
        if (ready && rec.graduateAt === null) rec.graduateAt = now + 30_000
        if (rec.graduateAt !== null && now >= rec.graduateAt) this.graduate(rec, now)
      }
    }
    if (now >= this.nextSpawnAt) {
      this.nextSpawnAt = now + 75_000
      this.spawn(now)
    }
  }

  private spawn(now: number) {
    const base = EXTRA_NAMES[this.spawnIndex % EXTRA_NAMES.length]
    const round = Math.floor(this.spawnIndex / EXTRA_NAMES.length)
    this.spawnIndex++
    const name = round ? `${base} ${round + 1}` : base
    const rng = mulberry32(SEED + this.spawnIndex * 7)
    const rec = this.blankRec({ name, ticker: '', image: null, description: pick(rng, GENERIC_LINES).replace('{thing}', pick(rng, THINGS)), state: 'window', credit: 0, people: 0, ageMin: 0, windowLeftSec: 120 }, rng, now, pick(rng, VERIFIED).address)
    rec.state = 'window'
    this.tokens.set(rec.address, rec)
    this.order.push(rec.address)
    this.added.push(rec.address)
  }

  private pending(rec: TokenRec): Pending {
    let p = this.dirty.get(rec.address)
    if (!p) {
      p = { seqFrom: rec.seq, trades: [], count: 0, chart: [], window: false, holders: false }
      this.dirty.set(rec.address, p)
    }
    return p
  }

  private flush() {
    if (!this.dirty.size && !this.added.length && !this.accountDirty) return
    const changed: LaunchSummary[] = []
    for (const [address, p] of this.dirty) {
      const rec = this.tokens.get(address)!
      const summary = this.summary(rec)
      changed.push(summary)
      const subs = this.listeners.get(`token:${address}`)
      if (subs?.size) {
        const delta: TokenDelta = {
          seqFrom: p.seqFrom,
          seqTo: rec.seq,
          summary,
          trades: p.trades.slice(0, 50),
          droppedTrades: Math.max(0, p.count - 50),
          chartPoints: p.chart,
          window: p.window ? this.windowInfo(rec) : undefined,
          holdersTop: p.holders ? this.holders(rec, 50) : undefined,
          pool: rec.pool,
          rewardsEpochSC: rec.rewardsEpoch,
        }
        subs.forEach((cb) => cb(delta))
      }
      if (p.trades.some((t) => t.wallet === USER_ADDRESS)) this.accountDirty = true
    }
    this.dirty.clear()
    const added = this.added.map((a) => this.summary(this.tokens.get(a)!))
    this.added = []
    const feedSubs = this.listeners.get('feed')
    if (feedSubs?.size && (changed.length || added.length)) {
      const delta: FeedDelta = { changed, added }
      feedSubs.forEach((cb) => cb(delta))
    }
    if (this.accountDirty) {
      this.accountDirty = false
      this.emit(`account:${USER_ADDRESS}`, this.getAccount(USER_ADDRESS))
    }
  }

  // ---------- reads ----------
  subscribe(topic: string, cb: (d: unknown) => void) {
    let set = this.listeners.get(topic)
    if (!set) this.listeners.set(topic, (set = new Set()))
    set.add(cb)
    this.start()
    if (topic === 'status') queueMicrotask(() => cb(this.status()))
    if (topic.startsWith('account:')) queueMicrotask(() => cb(this.getAccount(topic.slice(8))))
    return () => set!.delete(cb)
  }

  private emit(topic: string, payload: unknown) {
    this.listeners.get(topic)?.forEach((cb) => cb(payload))
  }

  onControls(cb: () => void) {
    this.controlListeners.add(cb)
    return () => this.controlListeners.delete(cb)
  }

  setControls(patch: Partial<MockControls>) {
    this.controls = { ...this.controls, ...patch }
    if ('attestationTier' in patch) this.account.attestationTier = this.controls.attestationTier
    this.controlListeners.forEach((l) => l())
    this.emit('status', this.status())
    this.emit(`account:${USER_ADDRESS}`, this.getAccount(USER_ADDRESS))
  }

  resetAsNewUser() {
    this.account.registered = false
    this.account.sc = 0
    this.account.tosAccepted = false
    this.account.nextClaimAt = 0
    this.account.history = []
    this.setControls({})
  }

  block(now = Date.now()) {
    return Math.floor((now - GENESIS) / 1000)
  }

  status() {
    const now = Date.now()
    const head = this.block(now)
    const lag = this.controls.indexerLag ? 150 : 1
    const pendingOp = this.controls.pendingChange ? this.governance().ops[0] : null
    return {
      chain: this.controls.chainSlow ? ('degraded' as const) : ('ok' as const),
      indexer: this.controls.indexerLag ? ('degraded' as const) : ('ok' as const),
      app: 'ok' as const,
      chainHead: head,
      indexerHead: head - lag,
      lagBlocks: lag,
      checkedAt: now,
      paused: this.controls.paused ? { id: 'p-live', reason: 'mock drill to test the pause banner', startedAt: now - 600_000, endsAt: now + 6 * 86_400_000, active: true } : null,
      pendingOp,
    }
  }

  userTier(): Tier {
    return this.account.registered ? this.account.attestationTier : 0
  }

  getAccount(address: string): Account {
    if (address !== USER_ADDRESS) return { address, attestationTier: TIER_OF.get(address) ?? 1, registered: true, tier: TIER_OF.get(address) ?? 1, sc: 0, eth: 0, claimable: 0, nextClaimAt: null, tosAccepted: true }
    const tier = this.userTier()
    const now = Date.now()
    const claimable = tier > 0 && now >= this.account.nextClaimAt ? PARAMS.rationByTier[tier] : 0
    return {
      address,
      attestationTier: this.account.attestationTier,
      registered: this.account.registered,
      tier,
      sc: r2(this.account.sc),
      eth: this.controls.noEth ? 0 : this.account.eth,
      claimable,
      nextClaimAt: tier > 0 ? this.account.nextClaimAt : null,
      tosAccepted: this.account.tosAccepted,
    }
  }

  summary(rec: TokenRec): LaunchSummary {
    const price = marketPrice({ state: rec.state, creditQ: rec.q, pool: rec.pool, creatorTaxPct: rec.taxPct })
    let holders = 0
    rec.balances.forEach((b, w) => {
      if (b > 0.5 && !w.startsWith('0xvault')) holders++
    })
    const holding = rec.buyers.filter((b) => (rec.balances.get(b) ?? 0) > 0.5 || rec.allocations.has(b)).length
    const stillHoldingPct = rec.buyers.length ? Math.round((holding / rec.buyers.length) * 100) : 0
    const ageH = (Date.now() - rec.createdAt) / 3_600_000
    const people = rec.state === 'window' || rec.state === 'settling' ? 0 : rec.buyers.length
    return {
      address: rec.address,
      name: rec.name,
      ticker: rec.ticker,
      image: rec.image,
      creator: rec.creator,
      creatorScore: rec.creatorScore,
      state: rec.state,
      createdAt: rec.createdAt,
      windowEndsAt: rec.windowEndsAt,
      people,
      holders,
      stillHoldingPct,
      creditQ: rec.q,
      price: rec.state === 'window' || rec.state === 'settling' ? clearWindow(rec.entries, rec.taxPct).price : price,
      changePct: rec.clearingPrice ? (price / rec.clearingPrice - 1) * 100 : 0,
      participants: new Set(rec.entries.filter((e) => !e.owner.startsWith('0xvault')).map((e) => e.owner)).size,
      fullSince: rec.fullSince,
      graduatedAt: rec.graduatedAt,
      moderation: rec.moderation,
      flags: rec.flags,
      hasImageFlag: rec.moderation === 'review',
      rank: (people * (stillHoldingPct / 100) + (rec.state === 'window' ? 6 : 0)) / (1 + ageH / 18),
    }
  }

  windowInfo(rec: TokenRec): WindowInfo {
    const participants = new Set(rec.entries.filter((e) => !e.owner.startsWith('0xvault')).map((e) => e.owner)).size
    return {
      entries: rec.entries.map((e) => ({ ...e })),
      total: rec.entries.reduce((s, e) => s + e.amount, 0),
      participants,
      estimatePrice: clearWindow(rec.entries, rec.taxPct).price,
      clearing: rec.clearing,
    }
  }

  holders(rec: TokenRec, limit = 50): Holder[] {
    const supplyHeld = PARAMS.supply
    return [...rec.balances.entries()]
      .filter(([, b]) => b > 0.5)
      .sort((a, b) => b[1] - a[1])
      .slice(0, limit)
      .map(([wallet, tokens]) => ({ wallet, tokens, sharePct: (tokens / supplyHeld) * 100, label: this.labelFor(rec, wallet) }))
  }

  detail(rec: TokenRec): LaunchDetail {
    return {
      ...this.summary(rec),
      description: rec.description,
      links: rec.links,
      creatorTaxPct: rec.taxPct,
      openingOrderPct: rec.openingPct,
      teamWallets: [...rec.teamWallets],
      manifestHash: rec.manifestHash,
      manifestOk: rec.manifestOk,
      window: this.windowInfo(rec),
      trades: rec.trades.slice(0, 200),
      holdersTop: this.holders(rec, 50),
      chart: rec.chart.slice(),
      pool: rec.pool,
      rewardsEpochSC: rec.rewardsEpoch,
      seq: rec.seq,
      asOfBlock: this.block() - (this.controls.indexerLag ? 150 : 1),
    }
  }

  find(idOrTicker: string): TokenRec | undefined {
    const key = idOrTicker.toLowerCase()
    return this.tokens.get(key) ?? [...this.tokens.values()].find((r) => r.ticker.toLowerCase() === key || r.address.toLowerCase() === key)
  }

  all() {
    return this.order.map((a) => this.tokens.get(a)!)
  }

  balanceOf(rec: TokenRec, wallet: string) {
    return rec.balances.get(wallet) ?? 0
  }

  allocationOf(rec: TokenRec, wallet: string) {
    return rec.allocations.get(wallet) ?? null
  }

  vesting(rec: TokenRec) {
    const total = rec.vestingTotal
    if (!rec.graduatedAt) {
      const expired = Date.now() >= rec.createdAt + PARAMS.vestingExpiryDays * 86_400_000
      return { total, released: rec.vestingReleased, releasable: expired ? total - rec.vestingReleased : 0, startedAt: null }
    }
    const vested = Math.min(1, (Date.now() - rec.graduatedAt) / (PARAMS.vestingDays * 86_400_000)) * total
    return { total, released: rec.vestingReleased, releasable: Math.max(0, vested - rec.vestingReleased), startedAt: rec.graduatedAt }
  }

  creatorFees(rec: TokenRec) {
    return { claimable: Math.max(0, rec.creatorFeesLifetime - rec.creatorFeesClaimed), lifetime: rec.creatorFeesLifetime }
  }

  buyerNumber(rec: TokenRec, wallet: string) {
    const i = rec.buyers.indexOf(wallet)
    return i >= 0 ? i + 1 : null
  }

  seasonDay(now = Date.now()) {
    return Math.min(PARAMS.seasonDays, Math.floor((now - this.seasonStart) / 86_400_000) + 1)
  }

  governance() {
    const t0 = this.seasonStart
    return {
      ops: [
        { id: 'op-3', title: 'Opening window length for new launches (experiment arm)', from: '120 s', to: '180 s', eta: Date.now() + 31 * 3_600_000, status: 'pending' as const },
        { id: 'op-2', title: 'Register the GIWA faucet attester in the identity registry', from: 'not registered', to: 'registered', eta: t0 + 2 * 86_400_000, status: 'executed' as const },
        { id: 'op-1', title: 'Holder share of trade fees', from: '30%', to: '35%', eta: t0 + 5 * 86_400_000, status: 'cancelled' as const },
      ],
      pauses: [{ id: 'p-1', reason: 'indexer incident drill', startedAt: t0 + 3 * 86_400_000, endsAt: t0 + 3 * 86_400_000 + 7_200_000, active: false }],
      audits: [] as { title: string; url: string }[],
    }
  }

  // ---------- writes (called by the mock wallet after signing) ----------
  validate(req: TxRequest, from: string): TxError | null {
    const rec = req.token ? this.find(req.token) : undefined
    const acct = this.getAccount(from)
    const paused = this.controls.paused
    switch (req.kind) {
      case 'buy':
        if (!rec || rec.state === 'window' || rec.state === 'settling' || rec.state === 'full') return 'reverted'
        if (paused) return 'paused'
        if ((req.amount ?? 0) > acct.sc + 1e-9) return 'insufficientBalance'
        if (rec.state === 'open' && Date.now() < rec.windowEndsAt + PARAMS.humansFirstSec * 1000 && acct.tier === 0) return 'tierGate'
        return null
      case 'sell':
        if (!rec || rec.state === 'window' || rec.state === 'settling') return 'reverted'
        return (req.amount ?? 0) > this.balanceOf(rec, from) + 1e-6 ? 'insufficientBalance' : null
      case 'deposit': {
        if (!rec || rec.state !== 'window') return 'windowClosed'
        if (paused) return 'paused'
        if (acct.tier === 0) return 'tierGate'
        const existing = rec.entries.find((e) => e.owner === from)?.amount ?? 0
        if (existing + (req.amount ?? 0) > PARAMS.capByTier[acct.tier] + 1e-9) return 'windowCap'
        return (req.amount ?? 0) > acct.sc + 1e-9 ? 'insufficientBalance' : null
      }
      case 'launch': {
        if (paused) return 'paused'
        const cost = PARAMS.launchFee + (req.launch?.openingOrderPct ? this.openingDeposit(req.launch.openingOrderPct, req.launch.creatorTaxPct) : 0)
        return cost > acct.sc + 1e-9 ? 'insufficientBalance' : null
      }
      case 'graduate':
        return rec && rec.state === 'full' && (rec.buyers.length >= PARAMS.peopleNeeded || (rec.fullSince !== null && Date.now() >= rec.fullSince + PARAMS.fallbackSec * 1000)) ? null : 'reverted'
      default:
        return null
    }
  }

  launchCost(openingOrderPct: number, taxPct: number) {
    return PARAMS.launchFee + (openingOrderPct ? this.openingDeposit(openingOrderPct, taxPct) : 0)
  }

  apply(req: TxRequest, from: string): TxResult {
    const now = Date.now()
    const hash = fakeHash(Math.random)
    const rec = req.token ? this.find(req.token) : undefined
    const result: TxResult = { hash, token: rec?.address }
    switch (req.kind) {
      case 'buy': {
        const r = rec && this.applyBuy(rec, from, req.amount ?? 0, now)
        if (r) {
          this.account.sc -= r.spent
          result.tokens = r.tokens
          result.holderNumber = r.holderNumber
        }
        break
      }
      case 'sell': {
        const r = rec && this.applySell(rec, from, req.amount ?? 0, now)
        if (r) {
          this.account.sc += r.out
          result.amount = r.out
        }
        break
      }
      case 'deposit': {
        if (!rec) break
        const existing = rec.entries.find((e) => e.owner === from)
        if (existing) existing.amount = r2(existing.amount + (req.amount ?? 0))
        else rec.entries.push({ owner: from, amount: req.amount ?? 0, bucket: req.bucket ?? null, label: 'you' })
        this.account.sc -= req.amount ?? 0
        rec.seq++
        this.pending(rec).window = true
        result.amount = req.amount
        break
      }
      case 'cancelDeposit': {
        if (!rec) break
        const entry = rec.entries.find((e) => e.owner === from)
        if (entry) {
          rec.entries = rec.entries.filter((e) => e !== entry)
          this.account.sc += entry.amount
          result.amount = entry.amount
          rec.seq++
          this.pending(rec).window = true
        }
        break
      }
      case 'claimWindow': {
        const alloc = rec && rec.allocations.get(from)
        if (rec && alloc) {
          this.credit(rec, from, alloc.tokens)
          this.account.sc += alloc.refund
          rec.allocations.delete(from)
          result.tokens = alloc.tokens
          result.amount = alloc.refund
          this.pending(rec).holders = true
        }
        break
      }
      case 'launch': {
        const l = req.launch!
        const rng = mulberry32(now % 100000)
        const fresh = this.blankRec({ name: l.name, ticker: l.ticker, image: l.image, description: l.description, state: 'window', credit: 0, people: 0, ageMin: 0, windowLeftSec: PARAMS.windowSec, taxPct: l.creatorTaxPct, openingPct: l.openingOrderPct }, rng, now, from)
        fresh.links = l.links
        fresh.state = 'window'
        fresh.creatorScore = 64
        this.tickers.add(l.ticker)
        if (l.openingOrderPct) fresh.entries.push({ owner: VAULT(fresh.address), amount: r2(this.openingDeposit(l.openingOrderPct, l.creatorTaxPct)), bucket: null, label: 'team' })
        this.account.sc -= this.launchCost(l.openingOrderPct, l.creatorTaxPct)
        this.tokens.set(fresh.address, fresh)
        this.order.push(fresh.address)
        this.added.push(fresh.address)
        result.token = fresh.address
        break
      }
      case 'claimFees': {
        const list = rec ? [rec] : this.all().filter((r) => r.creator === from)
        let total = 0
        for (const r of list) {
          const c = this.creatorFees(r).claimable
          r.creatorFeesClaimed += c
          total += c
        }
        this.account.sc += total
        result.amount = total
        break
      }
      case 'release': {
        if (!rec) break
        const v = this.vesting(rec)
        rec.vestingReleased += v.releasable
        this.credit(rec, rec.creator, v.releasable)
        result.tokens = v.releasable
        break
      }
      case 'graduate': {
        if (!rec) break
        this.graduate(rec, now)
        const bounty = (PARAMS.creditGoal * PARAMS.keeperBountyBps) / 10_000
        this.account.sc += bounty
        result.amount = bounty
        break
      }
      case 'register':
        this.account.registered = true
        break
      case 'claimCredit': {
        const acct = this.getAccount(from)
        this.account.sc += acct.claimable
        this.account.history.push({ day: this.seasonDay(), amount: acct.claimable })
        const next = new Date()
        next.setUTCHours(24, 0, 0, 0)
        this.account.nextClaimAt = next.getTime()
        result.amount = acct.claimable
        break
      }
      case 'claimRewards': {
        let total = 0
        for (const [token, reward] of this.account.rewards) {
          if (!req.token || req.token === token) {
            total += reward.amount
            this.account.rewards.delete(token)
          }
        }
        this.account.sc += total
        result.amount = total
        break
      }
      case 'acceptTerms':
        this.account.tosAccepted = true
        break
    }
    this.accountDirty = true
    if (!this.running) this.start()
    return result
  }
}

function downsample(points: PricePoint[], max: number) {
  if (points.length <= max) return points
  const sorted = [...points].sort((a, b) => a.ts - b.ts)
  const step = sorted.length / max
  const out: PricePoint[] = []
  for (let i = 0; i < max; i++) out.push(sorted[Math.floor(i * step)])
  out.push(sorted[sorted.length - 1])
  return out
}

let world: MockWorld | null = null
export function getWorld() {
  if (!world) world = new MockWorld()
  return world
}

export type { LimitBucket }
export const reserveAfter = tokenReserve
