import type { LimitBucket, Tier } from '../lib/params'

export type Address = string
export type TokenState = 'window' | 'settling' | 'open' | 'full' | 'graduated'
export type Moderation = 'ok' | 'review' | 'hidden'
export type FeedName = 'rising' | 'new' | 'graduating' | 'graduated'
export type WalletLabel = 'you' | 'team' | 'cluster'
export type Health = 'ok' | 'degraded' | 'down'
export type Side = 'buy' | 'sell'

export interface LaunchSummary {
  address: Address
  name: string
  ticker: string
  image: string | null
  creator: Address
  creatorScore: number | null
  state: TokenState
  createdAt: number
  windowEndsAt: number
  people: number
  holders: number
  stillHoldingPct: number
  creditQ: number
  price: number
  changePct: number
  participants: number
  fullSince: number | null
  graduatedAt: number | null
  moderation: Moderation
  flags: ('churn' | 'cluster')[]
  hasImageFlag: boolean
  rank: number
}

export interface Trade {
  id: string
  ts: number
  side: Side
  amountSC: number
  tokens: number
  wallet: Address
  label: WalletLabel | null
  price: number
}

export interface Holder {
  wallet: Address
  tokens: number
  sharePct: number
  label: WalletLabel | null
}

export interface WindowEntry {
  owner: Address
  amount: number
  bucket: LimitBucket
  label: WalletLabel | null
}

export interface WindowInfo {
  entries: WindowEntry[]
  total: number
  participants: number
  estimatePrice: number
  clearing: { price: number; participants: number; tokens: number; refunded: number } | null
}

export interface PricePoint {
  ts: number
  price: number
}

export interface Pool {
  q: number
  t: number
}

export interface LaunchDetail extends LaunchSummary {
  description: string
  links: string[]
  creatorTaxPct: number
  openingOrderPct: number
  teamWallets: Address[]
  manifestHash: string
  manifestOk: boolean
  window: WindowInfo
  trades: Trade[]
  holdersTop: Holder[]
  chart: PricePoint[]
  pool: Pool | null
  rewardsEpochSC: number
  seq: number
  asOfBlock: number
}

/** Batched delta for `token:<address>` (ADR-B1 protocol). */
export interface TokenDelta {
  seqFrom: number
  seqTo: number
  summary: LaunchSummary
  trades: Trade[]
  droppedTrades: number
  chartPoints: PricePoint[]
  window?: WindowInfo
  holdersTop?: Holder[]
  pool?: Pool | null
  rewardsEpochSC?: number
}

export interface FeedDelta {
  changed: LaunchSummary[]
  added: LaunchSummary[]
}

export interface Account {
  address: Address
  attestationTier: Tier
  registered: boolean
  tier: Tier
  sc: number
  eth: number
  claimable: number
  nextClaimAt: number | null
  tosAccepted: boolean
}

export interface Position {
  token: LaunchSummary
  tokens: number
  costSC: number
  valueSC: number
  buyerNumber: number | null
}

export interface Claim {
  id: string
  kind: 'window' | 'rewards' | 'fees'
  token: LaunchSummary
  amount: number
  unit: 'tokens' | 'SC'
  epoch?: number
}

export type SubScore = 'graduations' | 'retention' | 'clean' | 'dead' | 'clusters'

export interface CreatorLaunch {
  token: LaunchSummary
  claimableSC: number
  lifetimeSC: number
  vesting: { total: number; released: number; releasable: number; startedAt: number | null }
}

export interface CreatorDashboard {
  launches: CreatorLaunch[]
  score: number
  subscores: Record<SubScore, number>
  tier: Tier
}

export interface Profile {
  address: Address
  tier: Tier
  score: number | null
  firstSeen: number
  launches: LaunchSummary[]
  badges: { season: number; label: string }[]
}

export type PointsCategory = 'counterparties' | 'holding' | 'creator' | 'curation' | 'squad'

export interface SeasonState {
  season: number
  day: number
  days: number
  history: { day: number; amount: number }[]
  points: Record<PointsCategory, number>
  settlement: 'provisional' | 'review' | 'final'
}

export interface LeaderRow {
  rank: number
  wallet: Address
  tier: Tier
  points: number
  you: boolean
}

export interface TimelockOp {
  id: string
  title: string
  from: string
  to: string
  eta: number
  status: 'pending' | 'executable' | 'executed' | 'cancelled'
}

export interface GuardianPause {
  id: string
  reason: string
  startedAt: number
  endsAt: number
  active: boolean
}

export interface GovernanceState {
  ops: TimelockOp[]
  pauses: GuardianPause[]
  audits: { title: string; url: string }[]
}

export interface HealthState {
  chain: Health
  indexer: Health
  app: Health
  chainHead: number
  indexerHead: number
  lagBlocks: number
  checkedAt: number
  paused: GuardianPause | null
  pendingOp: TimelockOp | null
}

export type TxKind =
  | 'buy'
  | 'sell'
  | 'deposit'
  | 'cancelDeposit'
  | 'claimWindow'
  | 'launch'
  | 'claimFees'
  | 'release'
  | 'graduate'
  | 'register'
  | 'claimCredit'
  | 'claimRewards'
  | 'acceptTerms'

export interface TxRequest {
  kind: TxKind
  token?: Address
  amount?: number
  minOut?: number
  bucket?: LimitBucket
  slippagePct?: number
  launch?: { name: string; ticker: string; description: string; links: string[]; image: string | null; openingOrderPct: number; creatorTaxPct: number }
}

export type TxError = 'userRejected' | 'slippage' | 'reverted' | 'timeout' | 'insufficientBalance' | 'windowCap' | 'windowClosed' | 'paused' | 'wrongNetwork' | 'tierGate'

export interface TxResult {
  hash: string
  token?: Address
  tokens?: number
  amount?: number
  holderNumber?: number | null
}

export interface SimResult {
  ok: boolean
  error?: TxError
}
