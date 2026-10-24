// The seam between UI and data (brief Phase 8). The mock implements it today; the Rust API + realtime gateway (ADR-B1)
// implement the same contract: snapshots by request, batched deltas by topic.
import type {
  Account,
  Address,
  CreatorDashboard,
  FeedName,
  GovernanceState,
  HealthState,
  Holder,
  LaunchDetail,
  LaunchSummary,
  LeaderRow,
  PointsCategory,
  Position,
  Claim,
  Profile,
  SeasonState,
  SimResult,
  TxRequest,
} from './types'

/** Topics: `token:<address>` → TokenDelta, `feed` → FeedDelta, `status` → HealthState, `account:<address>` → Account. */
export type Topic = `token:${string}` | 'feed' | 'status' | `account:${string}`

export interface DataSource {
  readonly kind: 'mock' | 'api'
  listLaunches(feed: FeedName, query?: string): Promise<LaunchSummary[]>
  listOpenWindows(): Promise<LaunchSummary[]>
  getLaunch(idOrTicker: string): Promise<LaunchDetail | null>
  getHolders(address: Address): Promise<Holder[]>
  getAccount(address: Address): Promise<Account>
  getPortfolio(address: Address): Promise<{ positions: Position[]; claims: Claim[] }>
  getCreator(address: Address): Promise<CreatorDashboard>
  getProfile(address: Address): Promise<Profile>
  getSeason(address: Address | null): Promise<SeasonState>
  getLeaderboard(category: PointsCategory | 'all', address: Address | null): Promise<LeaderRow[]>
  getGovernance(): Promise<GovernanceState>
  getStatus(): Promise<HealthState>
  checkTicker(ticker: string): Promise<'ok' | 'taken' | 'reserved'>
  checkName(name: string): Promise<{ status: 'ok' | 'reserved'; similar: string | null }>
  checkImage(file: { name: string; size: number; type: string }): Promise<{ ok: true } | { ok: false; reason: 'svg' | 'size' | 'type' | 'faces' }>
  simulate(request: TxRequest, from: Address): Promise<SimResult>
  /** Stores the hash of the signed risk acceptance `[F24, AC-A6]` (production: POST /api/legal/acceptance). */
  acceptTerms(address: Address): Promise<void>
  subscribe(topic: Topic, onDelta: (delta: unknown) => void): () => void
}

export class RequestError extends Error {
  constructor(
    public code: 'rateLimited' | 'unknown',
    public retryAfterSec = 0,
  ) {
    super(code)
  }
}
