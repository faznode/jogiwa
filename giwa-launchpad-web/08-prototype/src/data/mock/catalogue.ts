// MOCK DATA. Invented launches for the prototype only; never shown as real activity (brief rule 1).
// Names are friendly everyday objects and animals: no public figures, brands, exchanges or idols `[10 §1]`.
import type { TokenState } from '../types'

export interface SeedLaunch {
  name: string
  ticker: string
  image: string | null
  description: string
  state: TokenState
  credit: number
  people: number
  ageMin: number
  windowLeftSec?: number
  fullForMin?: number
  creatorIsUser?: boolean
  userHolds?: boolean
  taxPct?: number
  openingPct?: number
  teamWallets?: number
  moderation?: 'ok' | 'review' | 'hidden'
  flags?: ('churn' | 'cluster')[]
  manifestOk?: boolean
}

const img = (slug: string) => `/mock/tokens/${slug}.webp`

export const FEATURED: SeedLaunch[] = [
  { name: 'Rain Frog', ticker: 'RAIN', image: img('rain-frog'), description: 'A frog that only comes out when it rains. Launched for the first wet week of the season.', state: 'window', credit: 0, people: 0, ageMin: 0.6, windowLeftSec: 84, openingPct: 2, teamWallets: 1 },
  { name: 'Night Bus', ticker: 'NBUS', image: img('night-bus'), description: 'For everyone who has fallen asleep on the last bus home and woken up somewhere new.', state: 'open', credit: 2050, people: 19, ageMin: 190, creatorIsUser: true, userHolds: true, openingPct: 3, teamWallets: 2 },
  { name: 'Paper Crane', ticker: 'CRANE', image: img('paper-crane'), description: 'Fold one, pass it on. A slow, patient meme about making things by hand.', state: 'full', credit: 2500, people: 25, ageMin: 420, fullForMin: 6, userHolds: true, openingPct: 1 },
  { name: 'Sock Club', ticker: 'SOCK', image: img('sock-club'), description: 'Odd socks only. Graduated with a crowd that keeps showing up.', state: 'graduated', credit: 2500, people: 212, ageMin: 5200, creatorIsUser: true, userHolds: true, openingPct: 2, teamWallets: 1 },
  { name: 'Late Cat', ticker: 'LATE', image: img('late-cat'), description: 'Always five minutes late, never sorry. A meme for night owls.', state: 'open', credit: 450, people: 7, ageMin: 48, taxPct: 1.5 },
  { name: 'Moth Lamp', ticker: 'MOTH', image: img('moth-lamp'), description: 'Drawn to the light. Waiting for the last few people before it graduates.', state: 'full', credit: 2500, people: 21, ageMin: 610, fullForMin: 52, userHolds: true },
  { name: 'Tiny Whale', ticker: 'TWHL', image: img('tiny-whale'), description: 'Small fish energy in a big ocean. Graduated last week.', state: 'graduated', credit: 2500, people: 96, ageMin: 9800, openingPct: 1 },
  { name: 'Toast Dog', ticker: 'TOAST', image: img('toast-dog'), description: 'A dog who loves breakfast more than anything. Its window just opened.', state: 'window', credit: 0, people: 0, ageMin: 0.2, windowLeftSec: 108 },
]

const NAMES = [
  'Umbrella Pals', 'Quiet Kettle', 'Fern Crew', 'Lunch Box', 'Window Seat', 'Spare Key', 'Snow Pea', 'Bike Bell', 'Cloud Bread',
  'Pebble Post', 'Late Train', 'Orange Peel', 'Rooftop Radio', 'Tea Leaf', 'Lost Mitten', 'Puddle Jump', 'Corner Shop',
  'Paper Lantern', 'Sleepy Fox', 'Bus Stop Band', 'Night Owl', 'Small Talk', 'Marble Run', 'Little Ferry', 'Noodle Cart',
]

export const EXTRA_NAMES = NAMES

/** Hostile and edge-case fixtures (04-page-specs edge cases; ADR-S1 §5). */
export const EDGE_CASES: SeedLaunch[] = [
  { name: 'The Extremely Patient Snail Society Of Late Afternoon', ticker: 'SNAIL', image: null, description: 'A very long name to test how signs shrink and truncate.', state: 'open', credit: 980, people: 12, ageMin: 260 },
  { name: 'Bro\u200Bs Official', ticker: 'BR0S', image: null, description: 'Lookalike name with a hidden zero-width character. The UI shows it as a replacement mark.', state: 'open', credit: 310, people: 4, ageMin: 35, flags: ['cluster'] },
  { name: 'Safe\u202Eesrever Token', ticker: 'SAFE', image: null, description: 'Contains a right-to-left override, which is stripped before display.', state: 'open', credit: 120, people: 2, ageMin: 22, flags: ['churn'] },
  { name: 'Under Review', ticker: 'REVW', image: img('toast-dog'), description: 'Image flagged by the safety check and blurred until a person reviews it.', state: 'open', credit: 640, people: 9, ageMin: 75, moderation: 'review' },
  { name: 'Taken Down Example', ticker: 'GONE', image: null, description: 'Hidden from feeds and search. Reachable by link with a warning; trading still works from the chain.', state: 'open', credit: 200, people: 3, ageMin: 140, moderation: 'hidden' },
  { name: 'Mismatch Demo', ticker: 'MSMT', image: null, description: 'Its Fairness Card does not match the on-chain manifest, so the page warns before any trade.', state: 'open', credit: 760, people: 10, ageMin: 95, manifestOk: false },
]

export const GENERIC_LINES = [
  'A small meme for people who like {thing}.',
  'Made by a group chat that could not stop talking about {thing}.',
  'Everyday {thing}, now with a sign of its own.',
]
export const THINGS = ['quiet mornings', 'long walks', 'snacks after midnight', 'bus routes', 'houseplants', 'rainy days', 'warm soup', 'old radios']
