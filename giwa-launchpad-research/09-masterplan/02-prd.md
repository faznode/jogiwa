# 02 — Product Requirements Document (PRD)

Traceability: each requirement cites the finding it answers (`05 §3` = 05-economics/report.md §3, `S1` = 08-ideation/shortlist-specs.md S1) or is marked [NEW] with rationale.

## 1. Vision

A launchpad on GIWA where launching a token means gathering people, not beating bots: fair-priced opens for attested humans, graduation only when enough distinct people hold the token, creators locked in by default, holders paid for staying, and every rule readable before the first buy. Korean-first, mobile-first, measurable on testnet.

North-star metric: **distinct attested humans per graduated token** (Pons baseline: 3.5 traders per median curve and bundled single-tx graduations, 05 §3–5). Guardrail metrics: sell-back ratio, 7/30-day holder retention, bundled-graduation share, points-per-human vs points-per-wallet.

## 2. Personas

| Persona | Who | Needs | Evidence |
|---|---|---|---|
| **Soo-jin, community creator** (KR, 20s–30s) | Runs a KakaoTalk open chat / DC Inside gallery; wants a token for her community | A launch her members can actually get into; proof she cannot dump; simple fees; Korean UI; share cards for Kakao | 07 §6 community-first culture; P1, P4, P10 |
| **Min-ho, attested trader** (KR, Upbit user) | Trades on Upbit, tried on-chain memes, got sniped | Fair opens, a one-glance risk read, rewards for holding, Kakao/Telegram alerts | 05 §3, P1–P3; S2, S4, S9 |
| **Dewi, explorer** (ID/EN, crypto-native) | Follows GIWA quests, wants real signal and status | Clear season rules, English UI, points that mean something, no farm competition | 07 §5; S12 |
| **Jae, squad leader** | Organises 20–50 people around launches | Squad pages, treasury, leaderboards by quality, invite flow | S11 |
| **Operator (us)** | 1–5 people | Permissionless keepers, timelocked admin, health split, measurable experiments | 04 §3–6, S6, S10 |
| **Compliance reviewer** | counsel / future partner | Content policy, restricted jurisdictions, no PII, transparent incentives | 10-legal |

Non-persona: high-frequency snipers and launch farms — the product is designed to be unattractive to them.

## 3. Core journeys

### J1 — First visit → verified human (≤ 3 minutes)
Open app (KO by default from `Accept-Language`) → connect wallet (embedded social wallet or external) → "Verify once with Dojang": if the wallet already holds a Dojang Verified Address attestation, one `register(uid)` tx; otherwise deep-link to the GIWA faucet (tier 1) or Upbit attestation (tier 2) with step-by-step guidance → claim today's Season Credit. Exit: tier ≥ 1, credit > 0, home feed.

### J2 — Create a launch (≤ 2 minutes, one transaction)
Step 1 identity & media (name, ticker, image with safety check, bilingual description, links, optional squad). Step 2 fairness settings with live Fairness Card preview: opening order size (≤ 3% supply), creator tax 0–3%, defaults shown for window/humans-first/N (not editable in v1). Step 3 review → one `launch(manifest, openingOrder)` tx. Exit: token page in `Batch` state with countdown; share sheet (Kakao, Telegram, X, copy).

### J3 — Join an opening window → claim
Token page shows countdown, clearing price estimate, cap by tier, participants count. Deposit (with optional limit price) → after settle, claim (or auto-claim when the user next trades). Exit: holder with a position and "buyer #k of N" status.

### J4 — Trade on the curve / pool
Single trade widget pre- and post-graduation (`IQuoteMarket`); quotes from chain reads; simulation preview; slippage/deadline; Korean number formats. Exit: filled trade with a receipt and holder-reward eligibility note.

### J5 — Graduation
Progress ring with two tracks (credit, people). At `Full` under threshold: waiting state with fallback timer. `graduate()` by anyone (bounty). Event card + Kakao share. Exit: pool live, same widget, "permanent liquidity" proof.

### J6 — Creator earnings
Dashboard: claimable fees, vesting progress, reputation sub-scores, token health. Claim; release vesting. Exit: funds in wallet, score explanation.

### J7 — Season settlement
Season end → provisional points with breakdown → 7-day review (cluster slashing published) → final badges (EAS soulbound). Exit: badge on profile, next season's ration tier.

## 4. Feature list with priorities

P0 = required for public testnet Season 1; P1 = Season 2; P2 = mainnet or later. "Contracts" column indicates on-chain work.

| ID | Feature | Pri | Contracts | Source |
|---|---|---|---|---|
| F01 | Constant-product curve with virtual reserve; config-driven `S, Q0, G, f` | P0 | yes | M01, 02 §3 |
| F02 | Opening Batch Window (120 s default; pro-rata, caps, optional limit price, pull claims) | P0 | yes | S1 |
| F03 | Humans-First Window (tier gate + caps for OBW + 10 min) | P0 | yes | S2 |
| F04 | IdentityRegistry reading Dojang EAS attestations (Upbit, faucet attesters) | P0 | yes | S2, 07 §2 |
| F05 | People-Threshold Graduation (`G` and `N=25`, 24 h fallback; sells stay open when full) | P0 | yes | S3 |
| F06 | Launch Manifest on-chain + Fairness Card UI (pre-launch preview, token page, pre-trade sheet) | P0 | yes | S4 |
| F07 | Creator vesting vault (cliff at graduation, 30-day linear, 30-day expiry) | P0 | yes | S5 |
| F08 | Locked CPAMM pool seeded at graduation with price continuity; no LP tokens | P0 | yes | S9, M02 |
| F09 | FeeSplitter 40/30/30 with pull claims and bountied push | P0 | yes | S6, M07 |
| F10 | HolderRewards daily epochs on checkpointed token balances | P0 | yes | S9 |
| F11 | Season Credit (soulbound quote asset, daily rations by tier, season burn) | P0 | yes | S12 |
| F12 | Timelock (48 h) + Guardian pause (new activity only, 7-day expiry) + in-app pending-changes | P0 | yes | S10 |
| F13 | Permissionless keepers with bounties (settle, graduate, finalizeEpoch, push) + our redundant bots | P0 | yes | I28, 04 §6 |
| F14 | Quality-ranked discovery feeds (Rising, New, Graduating soon, Graduated) + churn labels | P0 | no | S8 |
| F15 | Token page: dual-track progress, window state, trade widget, holders, Fairness Card, team-wallet labels | P0 | no | J3–J5 |
| F16 | Create flow (3 steps, one tx), image safety check, bilingual fields | P0 | no | J2 |
| F17 | Wallet: wagmi + embedded wallet (social login; Kakao if provider supports) + SIWE sessions | P0 | no | M17 |
| F18 | Korean-first i18n (KO default, EN), 만/억 formats, KST, Kakao/Telegram share | P0 | no | I34, 07 §6 |
| F19 | Portfolio: positions, claims (window, holder rewards), P&L basics | P0 | no | I23 |
| F20 | Creator dashboard: claims, vesting, reputation breakdown | P0 | no | S6, S7 |
| F21 | Reputation score v1 (off-chain scorer → EAS attestation; limits by tier/score) | P0 | partial | S7 |
| F22 | Points v1 (quality-only) + provisional/final settlement + public method page | P0 | no | S12 |
| F23 | Status page: chain health vs indexer health; trading from chain reads when indexer lags | P0 | no | 04 §5–6, I27 |
| F24 | Restricted-jurisdiction gate, wallet screening, ToS/risk acceptance, takedown & law-enforcement pages | P0 | no | M16, 10-legal |
| F25 | Squads: registry, treasury, launch-as-squad split, squad pages, leaderboards | P1 | yes | S11 |
| F26 | Retroactive cluster slashing with published method and appeals | P1 | no | I39 |
| F27 | Watchlists + Telegram/Kakao alerts (graduation, window open, vesting release) | P1 | no | I24 |
| F28 | Launch rate limits by tier/score (1 / 3 / 10 per day) | P1 | yes | I08 |
| F29 | Early-holder bonus epoch (first 100 attested buyers of a graduated token) | P1 | yes | I38 |
| F30 | "Sunrise" scheduled launches with pre-registration | P1 | yes | I07 |
| F31 | Squad battles / weekly challenges | P1 | no | I32 |
| F32 | Bahasa Indonesia locale | P1 | no | [NEW] team/market fit |
| F33 | Chapters (post-graduation milestones unlocking perks) | P2 | yes | I14 |
| F34 | Multiple launch modes (classic / batch-first / Dojang-only / squad) | P2 | yes | I10 |
| F35 | Per-block uniform pricing on the curve (Flashblocks-aware) | P2 | yes | I05 |
| F36 | Verified-balance whale tiers (Dojang Verified Balance) | P2 | yes | I30 |
| F37 | Additional pair tokens (stablecoin) once present on GIWA | P2 | config | M13 |
| F38 | Creator studio AI kit (translation, image checks, share cards) | P2 | no | I15 |
| F39 | Verified streamer collab launches | P2 | no | I35 |
| F40 | Mainnet migration pass (badges carried) | P2 | partial | I44, 12-migration |

## 5. Non-goals (v1)

- No platform token, no airdrop language (08-tokenomics).
- No comments/chat or livestreams on token pages (M30, M31) — moderation cost; deep links instead.
- No custodial features, no fiat on-ramp, no KYC data storage (identity comes from Dojang attestations only).
- No lending, perps, or leverage on launched tokens.
- No multi-chain; GIWA only (mainnet migration is a config exercise, 12-migration).
- No tokenised stocks or RWA pairs (none exist on GIWA; regulatory exposure).
- No creator-editable window/threshold parameters in v1 (defaults are the experiment; per-launch choice would confound measurement, 07-data-analytics).

## 6. Acceptance criteria (P0)

Contracts
- AC-C1: For any sequence of buys/sells, the curve's `(Q0 + trackedQuote) · tokenReserve` never decreases, and replaying the sequence off-chain with the Phase 2 formulas reproduces on-chain `tokensOut/quoteOut` to the wei (differential test harness from `02-contracts/verification/` adapted).
- AC-C2: No address can buy or deposit during `Batch` or humans-first time with `tierOf < 1`; caps hold per address per launch; a tier-2 wallet cannot exceed 5% of `G` in the window.
- AC-C3: `settle()` succeeds from any caller after the window; all depositors can claim exactly `T · d_i / D` (sum of claims ≤ T, dust ≤ depositors count wei); refunds equal deposits for limit-price opt-outs.
- AC-C4: `graduate()` reverts when `attestedBuyers < N` and `now < fullSince + 24 h`; succeeds otherwise; after graduation the pool price equals the curve's final price within 1e-9 relative error; burned remainder equals `S·Q0²/(Q0+G)²` ± 1 wei.
- AC-C5: Creator vault releases 0 before graduation, `amount·(t−t_grad)/30d` after, full after 30 days; `release()` by anyone sends to the beneficiary only.
- AC-C6: Fee split per launch is immutable after launch; timelock changes affect only subsequent launches; the Guardian cannot pause sells, claims, `graduate`, `settle` or `release`.
- AC-C7: Season Credit cannot be transferred between two non-market addresses (reverts), daily claim obeys tier rations and the 7-day cap, and `burnExpired` is permissionless after season end.
- AC-C8: Every curve/pool/vault is deployed via CREATE2 with addresses predictable from `(factoryVersion, token salt)`; the same deploy script yields identical core addresses on a fresh chain given the same deployer and config hash.

App
- AC-A1: Fairness Card values are rendered from chain data and match the emitted manifest; a mismatch triggers a visible warning and an alert (monitoring).
- AC-A2: Token page functions (quotes, buy/sell, claim) with the indexer disabled; only lists/feeds degrade, with a banner.
- AC-A3: Korean is the default for `ko*` locales; all P0 strings exist in KO and EN; numbers ≥ 10,000 use 만/억 in KO; times shown in the user's zone with KST hint for windows.
- AC-A4: LCP ≤ 2.0 s and INP ≤ 200 ms on a mid-range Android over 4G for home and token pages (06-frontend §8 budgets); first JS payload ≤ 250 KB gz.
- AC-A5: A new user completes J1 in ≤ 3 minutes in moderated tests (5 of 6 Korean-speaking testers).
- AC-A6: Restricted jurisdictions are blocked at the app layer with a clear page; ToS acceptance is recorded by wallet signature before the first trade.

Operations
- AC-O1: Keepers: with our bots switched off for 24 h, ≥ 95% of windows settle and ≥ 95% of eligible graduations execute via third-party callers (bounties sufficient) — measured in Season 1.
- AC-O2: Every timelocked change appears in-app ≥ 48 h before execution.
- AC-O3: Status page distinguishes chain lag from indexer lag; the Sep-4-style scenario (indexer down, chain up) shows "trading available, lists delayed".
- AC-O4: Season settlement publishes method hash, slashing stats and an appeal window before badges are issued.
