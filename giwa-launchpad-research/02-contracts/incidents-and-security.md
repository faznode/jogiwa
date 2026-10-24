# Phase 2 — Incidents, Attack Surface and Security Posture

Evidence legend: [ONCHAIN] · [OBSERVED] (artifact path or "search summary") · [DOCS] · [UNKNOWN].

Caveat on sources: web-search tooling returned article summaries with citations (theblock.co, thedefiant.io, cryptotimes.io, chaincatcher.com, hackerbane.com, kucoin.com, htx.com, coinmarketcap.com, tokenpost.com, bsc.news, gate.com, cvj.ai) but direct URL resolution failed (DuckDuckGo/Bing scraping blocked). Facts below that rest only on those summaries are tagged [OBSERVED: search summary] and the URL recovery is tracked as OQ-6.1.

---

## 1. Incident timeline (reconstructed)

| Date (2026) | Event | Evidence |
|---|---|---|
| Jul 10–11 | NOXA (noxa.fun), the chain's first major launchpad, stops accepting launches (Jul 11) | [OBSERVED: search summary] |
| Jul 13 | NOXA goes dark; Pons Gen1 factory deployed (block 8,600,612) | [ONCHAIN] + summary |
| Jul 13 (+≈11 h) | Gen2 factory + locker deployed (blocks 8,991,102–8,991,118); Gen1 later disabled; docs date the 90/10 → 70/30 fee-split change to block 8,991,118 | [ONCHAIN]; [DOCS] |
| mid-Jul | "Frontend authorization vulnerability" patched; team states it did not affect the V2 launchpad's Multicall3 functionality | [OBSERVED: search summary] |
| mid/late-Jul | V2 launches paused "to address sniping issues", relaunched after patch + audit | [OBSERVED: search summary] |
| Jul–Sep | Bot activity inflates tx counts / issuance metrics (Gen2 scan: 266,221 TokenLaunched events in ~102 days) | [ONCHAIN scan.log] + summary |
| Aug 3 | V2 (curve + V4 hook) deployed, block 26,841,846 | [ONCHAIN] |
| Aug 5 | Uniswap Labs' Pools.trade launches on Robinhood Chain (0 launch fee, 0.25% trade fee, Instant Launch + 4-hour Crowd Launch); captures ~40–54% of new launches soon after | [OBSERVED: search summary] |
| Jul 10 – Sep 21 | Analyst Wazz / The Block: coordinated operation extracts ≥ $18.43M across 53 launches by exempting bundle wallets from the 99% snipe tax and buying >70% of supply in the launch second; proceeds recycled into new launches | [OBSERVED: search summary] |
| Oct 23 | Live app banner: degraded performance due to backend upgrade ahead of a new rollout | [OBSERVED: logs, launchpad page] |

Note on the "infrastructure-provider incident" named in the mission brief: no primary source was found in session 1 searches; the closest match is the Oct-23 "backend upgrade / degraded performance" banner and the mid-July frontend incident. Tracked as OQ-4.1. Do not cite an RPC-provider outage as fact.

---

## 2. Incident mechanisms

### 2.1 Snipe-tax exemption bundling (the $18.43M pattern) — [ONCHAIN mechanism, OBSERVED impact]

Mechanism (all from verified V2 source):
1. `launchToken(params, cfg, pair, address[] snipeTaxExemptions)` lets the creator exempt up to `MAX_SNIPE_TAX_EXEMPTIONS = 32` wallets atomically at launch; the deployer and fee recipient are exempt by default.
2. Non-exempt buyers in the launch second pay 99% (capped at `10000 − fee − tax − 100`), at t+1 s pay 6.18%, at t+2 s 0.19%.
3. Exempt wallets therefore buy at the **untaxed** price during the only window when nobody else can — i.e. the protection *creates* a monopoly window for the insider bundle.
4. Because the curve is constant-product with Q0 = 1.68 ETH, buying 70% of the **sellable** supply costs only ≈ 2.1 ETH gross (net quote needed to move tokenReserve from 1e27 to 1e27 − 0.7·714.3M = 500M is Q0·S/500M − Q0 = 1.68 ETH; plus fees). The bundle then sells into retail demand between t+3 s and graduation.
5. Tokens flagged `whitelisted: true` in the public API (`raw/captures/api_launches_50.json`: 7 of top-50 by market cap used whitelists) — disclosure exists but is passive.

Why it is not a "hack": no invariant was broken; it is a **mechanism-design failure** — a creator-controlled privilege with weak disclosure and no aggregate cap.

Mitigations for our design: (a) no creator-controlled exemptions, or (b) cap aggregate exempt-buy at launch to a small % of sellable supply enforced in the curve, (c) make exemptions and bundle size a first-class, loud UI signal and an indexable event, (d) a fair-launch format (sealed/batch window) where the first N seconds clear at a uniform price so no wallet needs an exemption.

### 2.2 Gen1 → Gen2 same-day redeploy — [ONCHAIN], cause [UNKNOWN]

Facts: identical ABI; bytecode differs slightly; the PONS token (deployed via Gen1) differs from the Gen2-bundled token source; Gen2's token adds `_isPairPool` detection across **all** fee tiers, and max-wallet/max-tx are enforced through `_update`. Hypothesis (unverified): Gen1 snipers bypassed launch-window restrictions by routing through an alternative pool / fee tier or by splitting across wallets, prompting the token-level fix; the fee-split change (10 → 30) shipped in the same redeploy. Resolution path: diff Gen1 bytecode-recovered selectors vs Gen2 token, inspect the first attacked launches around blocks 8.60M–8.99M (OQ-2.1).

### 2.3 Frontend authorization vulnerability — [OBSERVED: search summary]

Only the existence and the Multicall3 clarification are known. Lesson: the frontend talks to a backend with sessions/identities (`/api/session`, `/api/profile/nonce`, `/api/identities`, Turnstile) — authorization bugs there affect social features and sponsorships, not funds. Our plan: keep the backend **non-authoritative for anything financial** and sign every mutating request with SIWE-style nonces.

### 2.4 Bot-inflated issuance — [ONCHAIN]

Gen2 recorded 266,221 launches and V2 > 121,510 in its first third of blocks (scan.log). With a 0.0005 ETH launch fee and ~0.1 s blocks, spam launches are cheap. Lesson: a flat fee is not a sybil cost; consider progressive fees for serial deployers, proof-of-humanity (Dojang on GIWA), or a refundable bond.

---

## 3. Attack surface review of V2 (what we checked in the source)

| Vector | Status in Pons V2 | Evidence |
|---|---|---|
| Graduation front-running / pool pre-creation griefing | Defended: `GraduationGuard` validates pool before seeding; `createGraduatedPool` retryable; owner rescue after 7 days | source: PonsV2GraduationGuard.sol, factory L1193 |
| Donation attack on graduation trigger | Defended: graduation by tokens sold; donated quote stranded | curve `readyToGraduate` L403; `graduate` comment |
| Final-buy griefing (oversized last buy) | Defended: partial fill, refund, ratio slippage | curve L443–57, L500 |
| Sandwiching the curve | Not defended on-chain (no per-block limit); mitigated economically by 1% fee + snipe decay; Orbit 100 ms blocks + centralized sequencer (FCFS) limit classic MEV | design |
| Sniping at launch | Defended for non-exempt wallets; **inverted** for exempt wallets (see 2.1) | L315–323, L713 |
| Reentrancy | `nonReentrant` on factory launch/graduate; curve uses checks-effects-interactions and pull payments via FeeEscrow | source |
| Fee-on-transfer / weird quote tokens | `_receiveQuote` measures received amount; `MIN_PAIR_TOKEN_DECIMALS 6`; pair tokens are owner-approved | factory L74, curve L448 |
| Malicious token metadata (honeypot logic) | Not possible: token is a plain ERC20 deployed by the protocol; metadata is strings only | PonsV2LauncherToken.sol |
| Upgrade / rug by admin | Not possible: no proxy, no withdraw, no pause | inventory |
| Parameter abuse by admin | Possible within caps; instant (no timelock) | §6 of report |
| Keeper failure | Fees accrue safely; sweeps delayed; buyback skipped if impact > 3% | `_sweepFees` |
| Precision / rounding | Fee rounds down to protocol/creator; `getAmountIn` rounds up (+1); graduation math uses FullMath with Q192/Q128 fallback | libraries |
| Gas griefing via auto-graduation | `try/catch` + `AutoGraduationFailed(gasRemaining)`; graduation remains permissionless | L696 |
| Price-impact griefing of buyback | bounded by `maxInternalPriceImpactBps` and `tokensOut ≤ sellable`; folds back otherwise | `_sweepFees` |

---

## 4. Audit and provenance notes

- `PonsV2BondingCurveMath` states it is adapted from `BootstrapPool.sol` of the Code4rena **2025-01 IQ AI** audit — a public, audited reference. [ONCHAIN source header]
- V2 factory/hook/vault verified on Sourcify Aug 4–20, 2026, i.e. 1–17 days after deployment. Gen1 never verified.
- Audit reports for Pons itself: claimed in search summaries ("relaunched after patch and audit"); no auditor name or report URL found → [UNKNOWN] OQ-2.4.
- Robinhood Chain Uniswap V3/V4 contracts deployed by 0x9701fb0a… at blocks 8,930–9,076 (genesis-adjacent) — canonical deployments. [ONCHAIN]

---

## 5. Security requirements derived for the GIWA build (feeds Phase 9 §4)

R1. Graduation-by-supply invariant; donations must not change graduation state.
R2. No creator-controlled fee/tax exemptions that privilege the launch window; any launch-window privilege must be capped on aggregate and emitted on-chain.
R3. All fee recipients paid via pull-escrow; trading paths never push value to arbitrary addresses.
R4. Token = plain ERC20; all logic in market/hook contracts.
R5. Two-phase, permissionless, retryable graduation + pre-seed pool validation + bounded admin rescue.
R6. Owner behind a timelock (≥24 h) with hard-coded caps; emergency path limited to pausing *new launches*, never trading or withdrawals.
R7. Keepers optional for liveness; everything they do must be permissionless-with-slippage after a grace period.
R8. Hash-commit of launch economics in the launch tx.
R9. Progressive anti-spam cost for serial deployers; identity hooks (Dojang) for verified creators.
R10. Docs generated from on-chain parameters so docs can never drift from code.
