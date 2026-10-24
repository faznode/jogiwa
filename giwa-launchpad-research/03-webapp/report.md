# Phase 3 — Web App Reverse Engineering: ponsfamily.com

Status: CLOSED (with two [UNKNOWN] items). Evidence legend: [OBSERVED] (`raw/bundles/`, `raw/captures/`, session-1 browser snapshots) · [DOCS] · [UNKNOWN].

Method: REA browser observation (session 1, `agent-browser` snapshots of /launchpad, token page, /launchpad/create step 1+2), static analysis of 49 Next.js chunks referenced by `/launchpad` and `/launchpad/create` (`raw/bundles/chunk_urls.txt`, 4.5 MB), REA `analyze-web-bundle` was not usable (needs a CDP-attached browser in the same sandbox; see `_rea-playbook.md` Known limits), so bundle work was done with grep/python on the downloaded chunks. API probing limited to GET endpoints exercised by normal browsing.

Limitation: the token-page chunk set was **not** downloaded (only the two pages above), so the chart library and trade-panel internals are inferred from observation only.

---

## 1. Stack identification

| Layer | Finding | Evidence |
|---|---|---|
| Framework | Next.js App Router, React Server Components (`__next_f` flight payload), Turbopack production chunks (`turbopack-1byz1flvc-bu1.js`), deployed on Vercel (`dpl_GEnxfSpjSd3XoUUAoNoLS3HM5X3S`) | [OBSERVED] `page_launchpad.html`, bundles |
| React | 19.x (error URLs `https://react.dev/errors/…`) | [OBSERVED] |
| Routing | Next.js file routes (`x-matched-path: /launchpad`), `next-router` markers | [OBSERVED] headers, bundles |
| Server state | TanStack Query (`new QueryClient({defaultOptions:{queries:{staleTime: 8e3, …`) → 8-second staleness for market data; SWR-style refetch on focus | [OBSERVED] chunk 801801 region |
| Client state | valtio (1 chunk) for local reactive state; React context for geo (`countryCode`, `equityPairsRestricted`) | [OBSERVED] |
| Wallet layer | wagmi + viem; Reown AppKit (WalletConnect v2) with Coinbase Wallet SDK connector; Turnkey embedded wallets (iframe `auth.turnkey.com`, export flow, `/api/turnkey/delegated-public-key`) | [OBSERVED] bundle + CSP |
| Auth | SIWE: `/api/profile/nonce` → signed message → `/api/session` (`{wallet, available}`); 22 chunks reference `nonce` | [OBSERVED] |
| Human check | Cloudflare Turnstile → `/api/human` | [OBSERVED] |
| Realtime | Ably JS SDK (5 chunks), events `token.created`, `token.updated` | [OBSERVED] |
| Styling / UI | Tailwind-style utility classes + custom `app-*` class names (`app-creator-serial`), Radix primitive(s) (1 chunk), icon component `i.f` with `icon`, `size` props; light/dark theme toggle | [OBSERVED] |
| Charts | TradingView-style chart with timeframes + indicators observed on token page; library [UNKNOWN] (token chunk not captured) OQ-3.1 | [OBSERVED] screenshot (lost) + snapshot |
| i18n | English only; `Intl.NumberFormat` for numbers; no next-intl/lingui markers | [OBSERVED] |
| PWA | service worker present (push notifications); `manifest-src 'self'` in docs CSP | [OBSERVED] |
| Analytics | Vercel Analytics; no Sentry/PostHog/Mixpanel markers; wallet errors posted to `/api/client-errors/wallet` | [OBSERVED] |
| Build hygiene | No source maps served (none referenced); minified with mangled module ids; addresses mostly not hardcoded — app reads contract addresses from API/factory (only Gen2 peripheral addresses appear once each) | [OBSERVED] |

Chain config in bundle: `4663` appears 12×, `chain.robinhood` 2×; Multicall3 canonical `0xcA11bde05977b3631167028862bE2a173976CA11` present; `eth_simulateV1` present (tx preview/simulation before signing); `estimateGas` 8 chunks; Permit2 not referenced by the launchpad/create chunks (approvals are plain ERC-20 `approve` per docs).

---

## 2. Wallet / chain layer behaviors

- **Connection**: Reown AppKit modal (WalletConnect, injected, Coinbase) OR Turnkey embedded wallet ("Sign in" in sidebar). Turnkey delegated public key endpoint suggests server-assisted session/delegated signing for embedded users (exact policy [UNKNOWN] OQ-3.2).
- **RPC**: app-side viem transport appears to use `/api/rpc` (same-origin proxy) in addition to the public RPC; this hides the upstream provider and lets Vercel rate-limit per user. [OBSERVED route; provider UNKNOWN OQ-4.2]
- **Reads**: Multicall3 batching for token/curve state; TanStack Query with 8 s staleTime; Ably pushes invalidations on `token.updated`.
- **Simulation**: `eth_simulateV1` used to preview trades/launches (only possible on nodes that support it — Nitro nodes do). Error texts are mapped through a glossary endpoint `/api/glossary/Errors` (44 KB) which maps custom errors (e.g. `SlippageExceeded`, `CurveGraduated`, `LaunchEconomicsMismatch`, `PairTokenNotApproved`, `NativeValueMismatch`, `LaunchFeeNotPaid`, `CreatorTaxTooHigh`, `NotWhitelisted`, `TimelockNotElapsed/Expired`) to human copy. [OBSERVED `raw/captures/api_glossary_Errors.json`, DOCS v2 §Errors]
- **Approvals**: ERC-20 `approve` to the curve for custom-pair launches; native ETH path uses `msg.value == quoteIn` (`NativeValueMismatch`).
- **Nonce/queue**: not observed (single-tx flows).
- **Geo/compliance gating**: server-provided `countryCode` → `equityPairsRestricted` context → equity pairs filtered out of "Any pair" filter and trade panel disabled with "restricted in your region"; separate wallet-screening modal "This wallet can't be used on Pons — Pons screens wallets for…" (provider [UNKNOWN] OQ-3.3).

---

## 3. Data layer — endpoints consumed by the frontend

Full OpenAPI-style spec: `api-spec.yaml`. Summary (all same-origin `/api/*` Next.js route handlers unless noted):

| Endpoint | Method | Purpose | Cache (observed) |
|---|---|---|---|
| `/api/launches?sort=&limit=&…` | GET | paginated launch list; item schema below | `public`, edge MISS/HIT |
| `/api/launches/trending` | GET | trending set: `{launch, volumeUsd, trades, traders, change, image}` | `public` |
| `/api/launches/pinned?addresses=` | GET | pinned launches (empty) | `public` |
| `/api/launches/sparklines?tokens=` | GET | sparkline series per token | `public` |
| `/api/launches/ticks?token=&interval=&limit=` | GET | `{block, at, ticks[] (curve trades: id txhash:logIndex, curve, trader, block, logIndex, at, fee, tax, side, quote, tokens), swaps[] (v4 pool: id, pool(id), amount0, amount1, block, logIndex, at)}` | `public, max-age=0, must-revalidate` |
| `/api/deployers?addresses=` | GET | deployer stats (serial-deployer badge) | — |
| `/api/identities?addresses=` / `?q=` | GET | username/displayName/avatar/banner/joinedAt per address; search | `public` |
| `/api/profile/{address}?view=card|positions` | GET | profile + launches + stats + positions; `quoteUsd` map for all quote tokens | — |
| `/api/profile/nonce`, `/api/session`, `/api/profile/identity`, `/api/profile/username`, `/api/profile/assign`, `/api/profile/verified` | GET/POST | SIWE auth, identity edits, username availability (`?username=&for=`), verification | `no-store` |
| `/api/human` | POST | Turnstile verification | — |
| `/api/legal/acceptance[?wallet=]` | GET/POST | ToS acceptance per wallet | — |
| `/api/notifications?wallet=` | GET | notifications ("Pass the wallet address.") | — |
| `/api/push/subscription` | POST | Web Push subscription | — |
| `/api/tokens/verified` | GET | `{tokens: [addresses]}` incl. PONS, WETH, address(0) | `public` |
| `/api/tokens/migrations` | GET | `{tokens: [6 addresses]}` migrated/migrating | `public` |
| `/api/trade/route` | GET/POST | trade routing/quotes (returned empty on bare GET) | — |
| `/api/rpc` | POST | JSON-RPC proxy | `no-store` |
| `/api/artwork?src=`, `/api/ipfs/image` | GET | image proxy/resizer for `ipfs://` artwork | CDN |
| `/api/sponsor/x-resolve?handle=` | GET | resolve X handle (sponsored launch) | — |
| `/api/x/callback` | GET | X OAuth callback | — |
| `/api/turnkey/delegated-public-key` | GET | Turnkey delegated key | — |
| `/api/client-errors/wallet` | POST | client error telemetry | — |
| `/api/glossary/Errors` | GET | error copy map | `public` |
| `/api/WagmiProvider` | — | artifact of RSC chunk naming (not a real API) | — |
| `https://balancesapi.ponsfamily.com/` | GET | separate balances service (returns `{"error":"not found"}` at root) | Cloudflare DYNAMIC |

Launch item schema (`/api/launches`) [OBSERVED `raw/captures/api_launches_limit_2.json`]:
`address, name, symbol, protocol ("v1"|"v2"), stage ("curve"|"graduated"|…), artwork (ipfs://), description, deployer, whitelisted (count), createdAt, lastTradeAt, quote {address, assetClass, decimals, isNative, symbol}, progress, raisedQuote, thresholdQuote, priceQuote, marketCapQuote, volumeQuote, priceUsd, marketCapUsd, raisedUsd, volumeUsd, tradeCount, creatorTaxBps, buybackEnabled, buybackLockedPct, fees {creatorRecipient, distributedQuote, distributedTokens, distributor, lastPayoutAt, payouts, recipient ("creator"|"holders")}, socials {discord, farcaster, telegram, twitter, website}, explorerAddress, factory, curve, pool, poolId, launchedBlock, deployedBlock, decimals, totalSupply, graduatedAt, quoteUsd, circulatingSupply`.

Top-50-by-market-cap distribution (2026-10-23) [OBSERVED `api_launches_50.json`]: mix of `v1` and `v2` protocols, ETH and stock/stable quotes; **7/50 used a snipe-tax whitelist**; one token shows holder-fee-sharing with 1,419 payout rounds distributing 2,490 NVDA.

WebSocket/SSE: none observed; realtime is Ably (WebSocket to Ably's edge). Polling: TanStack 8 s staleTime + refetch on focus. Indexer/GraphQL: none exposed; REST only.

---

## 4. Feature internals

- **Create-token flow**: Step 1 Identity — image upload (→ IPFS CID, surfaced as `logo`/`artwork`), name, ticker, description, socials (twitter/telegram/discord/website/farcaster), live preview card. Step 2 Economics — quote asset select (approved list, geo-filtered), creator fee recipient, creator tax (≤10%), buyback toggle, snipe-tax exemption wallets (≤32), opening buy amount; submit = one tx via launchForwarder (`launchAndBuy`) with `expectedEconomics` hash pinned from `previewLaunchEconomics`. Validation visible: trimmed socials, address checks; `LaunchEconomicsMismatch` re-read prompt. [OBSERVED bundle `creatorFeeRecipient:e.creatorFeeRecipient,creatorT…`]
- **Token page**: chart (timeframes/indicators), trade panel (buy/sell tabs, slippage, quote asset), stats (holders, trades, supply, community earnings), graduation progress + time-to-graduate, fee module (creator or holder sharing with rounds), holders list, trades feed (from `/api/launches/ticks`), socials, badges, geo block for equity pairs.
- **Discovery**: sort tabs (market cap / new / active / graduation), pair filter, search (tokens + people via `/api/identities?q=`), trending carousel (volume/trades/traders/change), pinned (empty), sparklines. No "king of the hill" mechanic observed; trending is volume-driven.
- **Profiles**: username claim with availability check, display name, avatar/banner, description, X link, stats (launched/live/graduated/marketCap), positions view with per-quote USD.
- **Rewards/referral**: `/ref/` routes exist (noindex); mechanics not visible in captured chunks → [UNKNOWN] OQ-1.3. No points/season system observed.
- **Notifications**: wallet-scoped list + Web Push.
- **Anti-bot/abuse**: Turnstile on sensitive actions; wallet screening; geo-gating; legal acceptance gate.
- **Moderation**: takedown + law-enforcement pages; "Pons Verified" allowlist; no in-app report button observed.
- **Feature flags**: not observed (no LaunchDarkly/Statsig/Vercel flags markers).
- **Mobile/PWA**: responsive sidebar collapses; service worker for push.

---

## 5. UX teardown

| Action | Clicks/steps | Notes |
|---|---|---|
| Browse → trade | 2 pages + wallet modal + 1 tx (+1 approve for ERC-20 quotes) | fast; slippage default visible |
| Create | 2 steps + 1 tx | very low friction; image upload to IPFS inline |
| Claim fees | profile/token page → 1 tx per quote asset | pull model requires user action; automation exists for unclaimed v1 fees |
| CTO | off-chain form → admin → 3-day timelock | slow by design |

Loading/empty/error states: skeleton cards; "Coming soon" PLP; degraded-performance banner for backend upgrades; errors mapped via glossary. Trust signals: badges, whitelist tooltip, locked-liquidity copy, candid risk disclosures. Copy/tone: plain, lowercase brand, no hype. Gamification: badges only; no points/streaks. Weak spots: whitelist disclosure under-weighted; two docs versions; no in-app reporting; analytics outsourced to Dune embed; English only.

---

## 6. Component inventory (observed/inferred)

Sidebar (logo, nav: Create a token / Launches / PLP / Analytics, theme, sign-in), SearchCombobox (tokens + people), TrendingCarousel, LaunchCard (artwork, name/symbol, badges: SerialDeployer, Verified, Community, WhitelistUsed, progress bar, mcap/volume), FilterTabs + PairSelect, TokenHeader, PriceChart, TradePanel (Buy/Sell, amount, slippage, quote selector, geo-block state), StatsGrid, GraduationProgress, FeeModule (Creator | HolderFeeSharing rounds), HoldersList, TradesFeed, SocialsRow, CreateWizard (IdentityStep, EconomicsStep, PreviewCard), ProfileHeader, PositionsTable, NotificationsList, LegalAcceptanceDialog, RestrictedModal, TurnstileGate, Footer (Launchpad / Resources / Legal columns).

---

## 7. Open items
- OQ-3.1 chart library (download token-page chunks via browser HAR).
- OQ-3.2 Turnkey delegated-key policy (what can the server sign?).
- OQ-3.3 wallet-screening provider.
- OQ-3.4 `/api/trade/route` request schema (POST body) and whether it routes through the V4 pool via Universal Router.
