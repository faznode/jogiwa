// Protocol and network parameters, copied from giwa-launchpad-research/09-masterplan/facts.json (testnet set).
// Config-driven so the mainnet proposal (quote WETH, N = 50, launch fee 0.0005 ETH) swaps in without a redesign.

export const NETWORK = {
  chainId: 91342,
  name: 'GIWA Sepolia',
  testnet: true,
  quoteSymbol: 'SC',
  gasSymbol: 'ETH',
  explorer: 'https://sepolia-explorer.giwa.io',
  faucet: 'https://faucet.giwa.io',
  faucetDaily: '0.005 ETH',
  /** [PLACEHOLDER: needs masterplan decision] our RPC gateway URL (Q25). */
  rpcUrl: null as string | null,
} as const

export const PARAMS = {
  supply: 1_000_000_000,
  q0: 1000,
  creditGoal: 2500,
  feePct: 1,
  split: { creator: 40, holders: 30, protocol: 30 },
  windowSec: 120,
  humansFirstSec: 600,
  capByTier: [0, 50, 125] as const,
  peopleNeeded: 25,
  fallbackSec: 86_400,
  creatorAllocMaxPct: 3,
  creatorTaxMaxPct: 3,
  vestingDays: 30,
  vestingExpiryDays: 30,
  launchFee: 1,
  rationByTier: [0, 20, 50] as const,
  claimCapDays: 7,
  keeperBountyBps: 5,
  timelockHours: 48,
  pauseExpiryDays: 7,
  seasonDays: 28,
  poolSharePct: 20.41,
  burnedSharePct: 8.16,
} as const

/** Window limit buckets as multiples of the opening price; null = no limit `[03 §3.2]`. */
export const LIMIT_BUCKETS = [null, 1.1, 1.25, 1.5, 2, 3, 5, 10] as const
export type LimitBucket = (typeof LIMIT_BUCKETS)[number]

export const SLIPPAGE_PRESETS = [0.5, 1, 2] as const
export const RESERVED_NAMES = ['giwa', 'dojang', 'upbit', 'bros'] as const
export const MAX_NAME = 32
export const MAX_TICKER = 10
export const MAX_DESCRIPTION = 280
export const MAX_IMAGE_BYTES = 5 * 1024 * 1024

export type Tier = 0 | 1 | 2
