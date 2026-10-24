# 06 — Frontend / UX Specification

Korean-first, mobile-first, one trade path before and after graduation, and every fairness rule visible where the decision is made. Pons UX details worth keeping: simulation preview, custom-error glossary, one-tx launch (03 §3, M18, M04).

## 1. Sitemap

```
/                      Home: season strip, feeds (Rising · New · Graduating soon · Graduated), search
/t/[token]             Token page (Batch / Open / Full / Graduated states)
/t/[token]/fairness    Fairness Card full view + manifest proof
/t/[token]/holders     Holders, team-wallet labels, cluster flags
/create                Create flow (3 steps)
/verify                Dojang verification + Season Credit claim
/portfolio             Positions, claims (window, holder rewards), P&L
/creator               Creator dashboard (fees, vesting, reputation breakdown)
/u/[address|upid]      Public profile: badge, score band, launches, season badges
/squads, /squads/[id]  (P1) Squad directory and pages
/season                Season status, points breakdown, method, leaderboards, settlement
/governance            Pending/executed timelock ops, Guardian pauses, audits
/status                Chain · indexer · app health
/learn                 Guides (KO/EN): why a launch has a window, how graduation works, risks
/legal/*               Terms, privacy, risk disclosure, restricted jurisdictions, takedown, law-enforcement
```

## 2. Key screens and flows

### 2.1 Home
- Season strip: "시즌 1 · 12/28일 · 내 크레딧 37 SC · 오늘의 20 SC 받기" with one-tap claim (S12).
- Feed tabs; default **Rising** (quality-ranked, S8). Card anatomy: image · name/ticker · creator badge+score band · **people count** (attested) · "still holding %" · age · state chip (Window 01:12 / Open / Full 19/25 / Graduated) · churn/cluster label if any. No volume on the default card.
- Search by name/ticker/address/UP ID.
- Mobile: single column, cards as rows; sticky bottom nav (Home · Create · Portfolio · Season · Me).

### 2.2 Token page — state machine
Common header: image, name, ticker, creator (badge, score band, UP ID), share (Kakao, Telegram, X, copy), report.

| State | Hero | Primary action | Secondary |
|---|---|---|---|
| **Batch** | Countdown ring + "clearing price ≈" + participants (tier-weighted count) + your cap | Deposit (amount, optional limit bucket) · Cancel | Fairness Card (compact 6-row), "what is a window?" |
| **Open** | Dual-track **Madang ring** (credit %, people k/N) + price + "you would be attested buyer #k" | Buy / Sell widget | Trades feed (team-wallet labels), holders, Fairness Card |
| **Full (waiting)** | Ring full on credit, people k/N, fallback timer | Sell available; "Share to reach 25 people" | Graduate button when ready (bounty shown) |
| **Graduated** | Pool stats: permanent liquidity proof, holder rewards this epoch | Buy / Sell (same widget) | Claim rewards, holders, Fairness Card (historic) |

Trade widget: amount in SC (or ETH on mainnet) with quick chips (10/25/50/max), output estimate from chain `quoteBuy/quoteSell`, fee + tax breakdown line, slippage/deadline in a sheet, simulation preview before signing (`eth_simulateV1` or `eth_call`), custom-error glossary mapping reverts to plain KO/EN messages (M18). Preconfirmed vs confirmed state after submit (Flashblocks).

Pre-trade Fairness sheet (first buy of each token, S4): six rows — creator share & lock, creator tax, window result, people needed, fees → who, declared team wallets — plus "verified on-chain ✓ (manifest hash)".

### 2.3 Create flow (J2)
1. **Identity & media**: name, ticker, image (safety check inline with reasons), description KO/EN (auto-translate suggestion, editable), links, optional squad (P1).
2. **Fairness**: opening order amount (slider to 3% supply with live "tokens you'd lock"), creator tax 0–3% (default 0; warning copy above 1%), read-only defaults for window/humans-first/N with "why" tooltips; live Fairness Card preview "this is what buyers will see".
3. **Review & launch**: cost line (launch fee + opening order), ToS/risk checkbox (signed once), one tx. Success: token page in Batch state + share sheet with pre-rendered OG card (KO/EN).

### 2.4 Verify (J1)
Detect existing Dojang attestation(s) for the wallet (via EAS indexer / Blockscout logs) → one-tap `register`. Otherwise two paths with step lists and deep links: faucet attestation (tier 1) or Upbit attestation (tier 2) [DOCS 07 §2]. Then "claim today's credit". Progress stepper; expected time shown.

### 2.5 Portfolio / Claims
Positions (pre/post-grad), unclaimed window allocations, holder rewards per token/epoch with multi-claim, realised/unrealised P&L (basic), "buyer #k" badges.

### 2.6 Creator dashboard
Claimable fees per token, lifetime; vesting progress with release button; reputation ring with five sub-scores and "how to improve"; launch limits by tier/score.

### 2.7 Season
Day counter, credit balance and claim history, points by category (counterparties, holding, creator quality, curation, squad) with the public method link, leaderboards (tier-labelled), settlement states (provisional → review → final) with appeal link and published slashing stats.

### 2.8 Governance & Status
Pending timelock operations as plain-language diffs with execution time; executed/cancelled history; Guardian pauses with reason/expiry; audit reports. Status: three indicators with definitions.

## 3. Component list (shadcn/ui base + custom)
`SeasonStrip`, `FeedTabs`, `TokenCard`, `StateChip`, `CountdownRing`, `MadangRing` (dual-track progress), `TradeWidget`, `AmountInput` (만/억 aware), `QuoteBreakdown`, `SlippageSheet`, `SimulationPreview`, `ErrorGlossary`, `FairnessCard` (compact/full), `ManifestProof`, `WindowDepositForm`, `LimitBucketPicker`, `ParticipantsMeter`, `TradesFeed` (with `WalletLabel`: team / cluster / you), `HoldersTable`, `ClaimList`, `VestingBar`, `ScoreRing`, `SubScoreRow`, `CreatorBadge`, `UPIDName`, `SquadTag`, `SeasonPointsBreakdown`, `Leaderboard`, `TimelockOpCard`, `HealthIndicator`, `ShareSheet` (Kakao/Telegram/X), `ReportDialog`, `LocaleSwitch`, `WalletButton`, `VerifyStepper`, `EmptyState`, `Banner` (pending change / health).

## 4. Design-system direction

One signature element: the **Madang ring** — a dual-track progress ring (outer: credit toward `G`; inner: people toward `N`) that is the product's visual identity on cards, token pages and share images. Everything else stays quiet.

- Palette (5 tokens): primary **celadon** (청자, muted blue-green, `oklch(0.62 0.07 190)`) for actions and the credit track; **persimmon** accent (`oklch(0.70 0.17 45)`) only for time-critical states (window countdown, fallback timer) and the people track; neutrals: paper (`oklch(0.985 0.004 95)`), ink (`oklch(0.22 0.01 260)`), mist (`oklch(0.92 0.006 95)`). Dark mode inverts paper/ink with the same accents. Success/danger derive from celadon/persimmon shifts, never a third hue.
- Typography: **Pretendard Variable** for Korean and Latin (one family covers both scripts; tabular figures enabled for all numbers) + **Geist Mono** for addresses, hashes and amounts in tables. Body 15–16 px, line-height 1.5; headings tight.
- Numbers: KO uses 만/억 grouping (`1.2만 SC`, `2.3억 토큰`), EN uses K/M/B; percentages one decimal; prices in scientific-free form (`0.0000123 SC`) with a "×" FDV helper.
- Motion: one orchestrated moment per state change (window settle, graduation) — ring completes, participants count up; respect `prefers-reduced-motion`.
- Iconography: Lucide, 16/20/24 px; no emojis as icons; state chips combine icon + text (colour-blind safe).
- Avoids: gradient backgrounds, decorative stats, left-border accent cards, numbered markers on non-sequences.

## 5. Korean/English i18n plan (+ Bahasa Indonesia P1)
- `next-intl` with ICU messages; locale from `Accept-Language` (`ko*` → KO default), persisted switch; URLs locale-less (cookie) to keep share links clean.
- Terminology sheet (KO/EN) reviewed by a native Korean crypto writer: 런치 (launch), 오프닝 윈도우 (opening window), 사람 수 조건 (people threshold), 졸업 (graduation — matches community usage), 공정성 카드 (Fairness Card), 시즌 크레딧 (Season Credit), 스쿼드 (squad).
- Dates/times: KST hint on window countdowns for KO users; relative times everywhere.
- Content: `/learn` articles written natively in KO first, then EN; Kakao/Telegram share text templates per locale.
- ID locale (F32): Season 2; glossary extension, Indonesian number formatting (`rb/jt/M`).

## 6. Mobile-first
- Breakpoints: design at 360 px first; token page actions in a bottom sheet; trade widget sticky above the nav; cards tappable with 44 px targets.
- Wallet UX: embedded wallet for first-run (social login), WalletConnect for external; "preconfirmed" toast within ~300 ms, "confirmed" within ~1–2 s (Flashblocks/1-s blocks).
- Offline/degraded: cached feeds with "delayed" banner; trade path checks chain health before enabling.

## 7. Accessibility
WCAG 2.1 AA: contrast ≥ 4.5:1 for text (celadon on paper is adjusted for buttons with ink text), focus-visible rings, full keyboard operation of trade/claim flows, ARIA live regions for countdowns (polite, throttled to 10 s), `aria-describedby` on fee breakdowns, reduced motion, screen-reader text for rings ("credit 82%, people 19 of 25"), form errors inline + summary, language attributes per locale, no colour-only state.

## 8. Performance budgets
| Metric | Budget | How |
|---|---|---|
| LCP (home, token) | ≤ 2.0 s (4G, mid Android) | RSC first paint, image CDN sizes, font subsetting (Pretendard KO subset ~300 KB → dynamic subset) |
| INP | ≤ 200 ms | small client islands, no heavy charts on first paint, web workers for P&L |
| CLS | ≤ 0.05 | fixed card/ring dimensions, skeletons |
| Initial JS | ≤ 250 KB gz | wagmi lazy-loaded on interaction; charts code-split |
| API p95 | ≤ 300 ms | edge cache + materialised rankings |
| Realtime | ≤ 1 s after block | SSE + NOTIFY |
| Quote latency | ≤ 150 ms | multicall to nearest RPC; flashblocks RPC optional |

Measured with `agent-browser vitals` in CI on a throttled profile, plus Vercel Speed Insights in production.
