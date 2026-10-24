// Snapshot + batched-delta client (ADR-B1): SWR fetches snapshots; live deltas land in external stores that notify once per
// flush, and components subscribe to just what they render (ADR-F1 rendering rules).
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, useSyncExternalStore, type ReactNode } from 'react'
import useSWR, { SWRConfig } from 'swr'
import type { DataSource } from './DataSource'
import { MockDataSource } from './mock/MockDataSource'
import type { Account, FeedDelta, FeedName, HealthState, LaunchDetail, LaunchSummary, PricePoint, TokenDelta } from './types'

const DataSourceContext = createContext<DataSource | null>(null)

export function DataProvider({ children }: { children: ReactNode }) {
  const [ds] = useState<DataSource>(() => new MockDataSource())
  return (
    <DataSourceContext value={ds}>
      <SWRConfig value={{ revalidateOnFocus: false, shouldRetryOnError: false, dedupingInterval: 1500, keepPreviousData: true }}>{children}</SWRConfig>
    </DataSourceContext>
  )
}

export function useDataSource() {
  const ds = useContext(DataSourceContext)
  if (!ds) throw new Error('DataProvider missing')
  return ds
}

type Listener = () => void
const noop = () => () => {}

// ---------- live token store ----------
class LiveToken {
  private listeners = new Set<Listener>()
  private stop: (() => void) | null = null
  constructor(
    public detail: LaunchDetail,
    private ds: DataSource,
  ) {}
  subscribe = (l: Listener) => {
    this.listeners.add(l)
    if (!this.stop) this.stop = this.ds.subscribe(`token:${this.detail.address}`, (d) => this.apply(d as TokenDelta))
    return () => {
      this.listeners.delete(l)
      if (!this.listeners.size && this.stop) {
        this.stop()
        this.stop = null
      }
    }
  }
  get = () => this.detail
  replace(next: LaunchDetail) {
    if (next.seq > this.detail.seq) {
      this.detail = next
      this.listeners.forEach((l) => l())
    }
  }
  private apply(d: TokenDelta) {
    if (d.seqTo <= this.detail.seq) return
    const known = new Set(this.detail.trades.slice(0, 60).map((t) => t.id))
    const fresh = d.trades.filter((t) => !known.has(t.id))
    this.detail = {
      ...this.detail,
      ...d.summary,
      trades: fresh.length ? [...fresh, ...this.detail.trades].slice(0, 500) : this.detail.trades,
      chart: d.chartPoints.length ? mergeChart(this.detail.chart, d.chartPoints) : this.detail.chart,
      window: d.window ?? this.detail.window,
      holdersTop: d.holdersTop ?? this.detail.holdersTop,
      pool: d.pool !== undefined ? d.pool : this.detail.pool,
      rewardsEpochSC: d.rewardsEpochSC ?? this.detail.rewardsEpochSC,
      seq: d.seqTo,
    }
    this.listeners.forEach((l) => l())
  }
}

function mergeChart(chart: PricePoint[], points: PricePoint[]) {
  const out = chart.slice()
  for (const p of points) {
    const last = out[out.length - 1]
    if (last && p.ts - last.ts < 1000) out[out.length - 1] = p
    else if (!last || p.ts > last.ts) out.push(p)
  }
  return out.length > 2400 ? out.slice(-2400) : out
}

const tokenStores = new Map<string, LiveToken>()

export function useLaunch(idOrTicker: string) {
  const ds = useDataSource()
  const { data, error, isLoading, mutate } = useSWR(['launch', idOrTicker], () => ds.getLaunch(idOrTicker))
  const store = useMemo(() => {
    if (!data) return null
    let s = tokenStores.get(data.address)
    if (!s) tokenStores.set(data.address, (s = new LiveToken(data, ds)))
    else s.replace(data)
    return s
  }, [data, ds])
  const detail = useSyncExternalStore(store ? store.subscribe : noop, store ? store.get : () => null, () => null)
  return { detail, missing: data === null, error, isLoading, retry: () => mutate() }
}

// ---------- live summaries for cards ----------
class SummaryStore {
  map = new Map<string, LaunchSummary>()
  private listeners = new Map<string, Set<Listener>>()
  private addedListeners = new Set<Listener>()
  private stop: (() => void) | null = null
  addedCount = 0
  constructor(private ds: DataSource) {}
  private ensure() {
    if (this.stop) return
    this.stop = this.ds.subscribe('feed', (d) => {
      const delta = d as FeedDelta
      for (const s of delta.changed) {
        this.map.set(s.address, s)
        this.listeners.get(s.address)?.forEach((l) => l())
      }
      if (delta.added.length) {
        this.addedCount += delta.added.length
        this.addedListeners.forEach((l) => l())
      }
    })
  }
  subscribe(address: string, l: Listener) {
    this.ensure()
    let set = this.listeners.get(address)
    if (!set) this.listeners.set(address, (set = new Set()))
    set.add(l)
    return () => set!.delete(l)
  }
  onAdded(l: Listener) {
    this.ensure()
    this.addedListeners.add(l)
    return () => this.addedListeners.delete(l)
  }
}

let summaries: SummaryStore | null = null
const summaryStore = (ds: DataSource) => (summaries ??= new SummaryStore(ds))

export function useLiveSummary(initial: LaunchSummary): LaunchSummary {
  const ds = useDataSource()
  const store = summaryStore(ds)
  const address = initial.address
  const subscribe = useCallback((l: Listener) => store.subscribe(address, l), [store, address])
  const latest = useSyncExternalStore(subscribe, () => store.map.get(address), () => undefined)
  return latest && latest.address === address ? latest : initial
}

export function useFeed(feed: FeedName, query: string) {
  const ds = useDataSource()
  const swr = useSWR(['launches', feed, query], () => ds.listLaunches(feed, query))
  const store = summaryStore(ds)
  const subscribeAdded = useCallback((l: Listener) => store.onAdded(l), [store])
  const added = useSyncExternalStore(subscribeAdded, () => store.addedCount, () => 0)
  const lastAdded = useRef(added)
  useEffect(() => {
    if (added !== lastAdded.current) {
      lastAdded.current = added
      if (feed === 'new' || feed === 'rising') swr.mutate()
    }
  }, [added, feed, swr])
  return swr
}

// ---------- topic stores (status, account) ----------
const topicCache = new Map<string, unknown>()

function useTopic<T>(topic: string | null): T | null {
  const ds = useDataSource()
  const subscribe = useCallback(
    (l: Listener) => {
      if (!topic) return () => {}
      return ds.subscribe(topic as never, (v) => {
        topicCache.set(topic, v)
        l()
      })
    },
    [ds, topic],
  )
  const getSnapshot = useCallback(() => (topic ? ((topicCache.get(topic) as T | undefined) ?? null) : null), [topic])
  return useSyncExternalStore(subscribe, getSnapshot, () => null)
}

export function usePortfolio(address: string | null) {
  const ds = useDataSource()
  return useSWR(address ? ['portfolio', address] : null, () => ds.getPortfolio(address as string))
}

export const useStatus = () => useTopic<HealthState>('status')
export const useAccount = (address: string | null) => useTopic<Account>(address ? `account:${address}` : null)

/** Throttles a fast-changing value (chart redraw ≤ 4 per second, ADR-F1 rule 5). */
export function useThrottled<T>(value: T, ms = 250): T {
  const [shown, setShown] = useState(value)
  const last = useRef(0)
  useEffect(() => {
    const wait = Math.max(0, last.current + ms - Date.now())
    const id = setTimeout(() => {
      last.current = Date.now()
      setShown(value)
    }, wait)
    return () => clearTimeout(id)
  }, [value, ms])
  return shown
}
