// MOCK implementation of DataSource. Adds realistic latency and the failure switches from the mock controls
// (rate limit, request error) so every error and loading state can be reviewed.
import { RequestError, type DataSource, type Topic } from '../DataSource'
import type { Claim, FeedName, LeaderRow, PointsCategory, TxRequest } from '../types'
import { PARAMS, RESERVED_NAMES } from '../../lib/params'
import { fakeAddress, mulberry32 } from '../../lib/prng'
import { sanitizeDisplayText } from '../../lib/text'
import { getWorld, USER_ADDRESS } from './world'

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms))

async function request<T>(fn: () => T, delay = 120 + Math.random() * 260): Promise<T> {
  const w = getWorld()
  await wait(delay)
  if (w.controls.rateLimitNext) {
    w.setControls({ rateLimitNext: false })
    throw new RequestError('rateLimited', 20)
  }
  if (w.controls.apiErrorNext) {
    w.setControls({ apiErrorNext: false })
    throw new RequestError('unknown')
  }
  return fn()
}

const progress = (s: { creditQ: number; people: number }) => Math.min(s.creditQ / PARAMS.creditGoal, s.people / PARAMS.peopleNeeded)

export class MockDataSource implements DataSource {
  readonly kind = 'mock' as const

  listLaunches(feed: FeedName, query?: string) {
    return request(() => {
      const w = getWorld()
      let list = w.all().filter((r) => r.moderation !== 'hidden').map((r) => w.summary(r))
      const q = query?.trim().toLowerCase()
      if (q) return list.filter((s) => sanitizeDisplayText(s.name).toLowerCase().includes(q) || s.ticker.toLowerCase().includes(q))
      if (feed === 'rising') list = list.filter((s) => s.state !== 'graduated').sort((a, b) => b.rank - a.rank)
      if (feed === 'new') list = list.sort((a, b) => b.createdAt - a.createdAt)
      if (feed === 'graduating') list = list.filter((s) => (s.state === 'open' || s.state === 'full') && progress(s) >= 0.45).sort((a, b) => progress(b) - progress(a))
      if (feed === 'graduated') list = list.filter((s) => s.state === 'graduated').sort((a, b) => (b.graduatedAt ?? 0) - (a.graduatedAt ?? 0))
      return list
    })
  }

  listOpenWindows() {
    return request(() => {
      const w = getWorld()
      return w.all().filter((r) => (r.state === 'window' || r.state === 'settling') && r.moderation !== 'hidden').map((r) => w.summary(r)).sort((a, b) => a.windowEndsAt - b.windowEndsAt)
    })
  }

  getLaunch(idOrTicker: string) {
    return request(() => {
      const w = getWorld()
      const rec = w.find(idOrTicker)
      return rec ? w.detail(rec) : null
    })
  }

  getHolders(address: string) {
    return request(() => {
      const w = getWorld()
      const rec = w.find(address)
      return rec ? w.holders(rec, 500) : []
    })
  }

  getAccount(address: string) {
    return request(() => getWorld().getAccount(address), 60)
  }

  getPortfolio(address: string) {
    return request(() => {
      const w = getWorld()
      const positions = w
        .all()
        .filter((r) => w.balanceOf(r, address) > 0.5)
        .map((r) => {
          const token = w.summary(r)
          const tokens = w.balanceOf(r, address)
          return { token, tokens, costSC: r.costs.get(address) ?? 0, valueSC: tokens * token.price, buyerNumber: w.buyerNumber(r, address) }
        })
      const claims: Claim[] = []
      for (const r of w.all()) {
        const alloc = w.allocationOf(r, address)
        if (alloc && (alloc.tokens > 0 || alloc.refund > 0)) claims.push({ id: `window-${r.address}`, kind: 'window', token: w.summary(r), amount: alloc.tokens, unit: 'tokens' })
        if (r.creator === address) {
          const fees = w.creatorFees(r)
          if (fees.claimable > 0.01) claims.push({ id: `fees-${r.address}`, kind: 'fees', token: w.summary(r), amount: fees.claimable, unit: 'SC' })
        }
      }
      if (address === USER_ADDRESS) {
        for (const [token, reward] of w.account.rewards) {
          const rec = w.find(token)
          if (rec) claims.push({ id: `rewards-${token}`, kind: 'rewards', token: w.summary(rec), amount: reward.amount, unit: 'SC', epoch: reward.epoch })
        }
      }
      return { positions, claims }
    })
  }

  getCreator(address: string) {
    return request(() => {
      const w = getWorld()
      const launches = w
        .all()
        .filter((r) => r.creator === address)
        .map((r) => {
          const fees = w.creatorFees(r)
          return { token: w.summary(r), claimableSC: fees.claimable, lifetimeSC: fees.lifetime, vesting: w.vesting(r) }
        })
      const mine = address === USER_ADDRESS
      return {
        launches,
        score: mine ? 64 : (launches[0]?.token.creatorScore ?? 20),
        subscores: mine ? { graduations: 72, retention: 61, clean: 100, dead: 84, clusters: 93 } : { graduations: 40, retention: 50, clean: 90, dead: 70, clusters: 80 },
        tier: w.getAccount(address).tier,
      }
    })
  }

  getProfile(address: string) {
    return request(() => {
      const w = getWorld()
      const launches = w.all().filter((r) => r.creator === address && r.moderation !== 'hidden').map((r) => w.summary(r))
      const seed = parseInt(address.slice(2, 10), 16) || 1
      return {
        address,
        tier: w.getAccount(address).tier,
        score: launches.length ? (address === USER_ADDRESS ? 64 : launches[0].creatorScore) : null,
        firstSeen: w.genesis + (seed % 20) * 86_400_000,
        launches,
        badges: address === USER_ADDRESS ? [{ season: 0, label: 'Season 0 participant' }] : [],
      }
    })
  }

  getSeason(address: string | null) {
    return request(() => {
      const w = getWorld()
      const mine = address === USER_ADDRESS
      return {
        season: 1,
        day: w.seasonDay(),
        days: PARAMS.seasonDays,
        history: mine ? [...w.account.history].reverse() : [],
        points: mine ? { counterparties: 412.6, holding: 288.1, creator: 160, curation: 54.2, squad: 0 } : { counterparties: 0, holding: 0, creator: 0, curation: 0, squad: 0 },
        settlement: 'provisional' as const,
      }
    })
  }

  getLeaderboard(category: PointsCategory | 'all', address: string | null) {
    return request(() => {
      const rng = mulberry32(4242)
      const scale = category === 'all' ? 1 : { counterparties: 0.3, holding: 0.25, creator: 0.2, curation: 0.15, squad: 0 }[category]
      const rows: LeaderRow[] = Array.from({ length: 50 }, (_, i) => ({
        rank: i + 1,
        wallet: fakeAddress(rng),
        tier: (rng() < 0.3 ? 2 : 1) as 1 | 2,
        points: Math.round((4200 * Math.exp(-i / 18) + 120) * scale * 10) / 10,
        you: false,
      }))
      if (address === USER_ADDRESS && scale > 0) {
        const mine = Math.round(914.9 * scale * 10) / 10
        const at = rows.findIndex((r) => r.points < mine)
        const index = at === -1 ? rows.length - 1 : at
        rows.splice(index, 0, { rank: index + 1, wallet: USER_ADDRESS, tier: getWorld().getAccount(USER_ADDRESS).tier, points: mine, you: true })
        rows.forEach((r, i) => (r.rank = i + 1))
        rows.length = 50
      }
      return rows
    })
  }

  getGovernance() {
    return request(() => getWorld().governance())
  }

  getStatus() {
    return request(() => getWorld().status(), 80)
  }

  checkTicker(ticker: string) {
    return request(() => {
      const t = ticker.trim().toUpperCase()
      if ((RESERVED_NAMES as readonly string[]).includes(t.toLowerCase())) return 'reserved' as const
      return getWorld().all().some((r) => r.ticker.toUpperCase() === t) ? ('taken' as const) : ('ok' as const)
    }, 300)
  }

  checkName(name: string) {
    return request(() => {
      const clean = sanitizeDisplayText(name).toLowerCase()
      const words = clean.split(/[^a-z0-9]+/).filter(Boolean)
      if (words.some((word) => (RESERVED_NAMES as readonly string[]).includes(word))) return { status: 'reserved' as const, similar: null }
      const first = words[0]
      const similar = first ? getWorld().all().find((r) => sanitizeDisplayText(r.name).toLowerCase().split(/[^a-z0-9]+/)[0] === first) : undefined
      return { status: 'ok' as const, similar: similar ? sanitizeDisplayText(similar.name) : null }
    }, 300)
  }

  checkImage(file: { name: string; size: number; type: string }) {
    return request(() => {
      const name = file.name.toLowerCase()
      if (file.type.includes('svg') || name.endsWith('.svg')) return { ok: false as const, reason: 'svg' as const }
      if (file.size > 5 * 1024 * 1024) return { ok: false as const, reason: 'size' as const }
      if (!/^image\/(png|jpeg|webp|gif)$/.test(file.type)) return { ok: false as const, reason: 'type' as const }
      if (name.includes('face')) return { ok: false as const, reason: 'faces' as const }
      return { ok: true as const }
    }, 900)
  }

  simulate(req: TxRequest, from: string) {
    return request(() => {
      const w = getWorld()
      if (w.controls.outcome === 'reverted') return { ok: false, error: 'reverted' as const }
      const error = w.validate(req, from)
      return error ? { ok: false, error } : { ok: true }
    }, 450)
  }

  acceptTerms(address: string) {
    return request(() => {
      getWorld().apply({ kind: 'acceptTerms' }, address)
    }, 200)
  }

  subscribe(topic: Topic, onDelta: (delta: unknown) => void) {
    return getWorld().subscribe(topic, onDelta)
  }
}
