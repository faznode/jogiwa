# 07 — Data & Analytics

Purpose: prove on testnet, with numbers, that Madang produces real people per graduated token and not Pons-style churn (05 §1–5), and tune the parameters that matter (window length, `N`, humans-first, rations) through controlled experiments.

## 1. Event schema

### 1.1 On-chain events (indexed by Ponder)

| Contract | Event | Key fields | Derived metrics |
|---|---|---|---|
| Factory | `Launched` | token, curve, vault, creator, manifestHash, manifest{creatorTaxBps, openingOrder, teamWallets, metadataCID, squadId}, params{...} | launches/day by tier/score, manifest distributions, experiment arm (from params) |
| Factory | `Graduated` | token, pool, poolQuote, poolTokens, burned, caller, bounty | time-to-graduation, caller type (our bot vs third party) |
| Curve | `Deposited` / `DepositCancelled` | account, amount, limit bucket, total | window participation, cap utilisation, cancellation rate |
| Curve | `Settled` | deposits, filled, refunded, tokensAllocated, clearingPriceX96, participants, caller | window size, clearing multiple vs opening price, Gini of allocations (from claims) |
| Curve | `WindowClaimed` | account, tokens, refund | claim latency |
| Curve | `Buy` / `Sell` | account, to, quoteIn/tokensIn, fee, tax, out, priceAfterX96, firstAttested | volume, sell-back ratio, distinct attested buyers, team-wallet trades |
| Curve | `StateChanged` | from, to, at | time in each state; Full-waiting durations; fallback graduations |
| Pool | `Swap` | sender, to, buy, amountIn, amountOut, fee, priceAfterX96 | post-grad volume, daily active traders |
| FeeSplitter | `Accrued`, `CreatorClaimed`, `HoldersPushed`, `ProtocolClaimed` | token, amount, caller, bounty | fee flows, time-to-first-claim, bounty economics |
| HolderRewards | `EpochFinalized`, `Claimed` | token, epoch, snapshotBlock, eligibleSupply, funded; account, amount | holder reward distribution, claim rate |
| VestingVault | `Released` | token, beneficiary, amount | creator unlock behaviour post-release |
| IdentityRegistry | `TierUpdated` | account, tier, expiry, uid, attester | verified users by attester, expiries |
| SeasonCredit | `Claimed`, `Burned` | account, amount, season | ration usage, hoarding, burn at season end |
| Timelock / Guardian | `CallScheduled/Executed/Cancelled`, `Paused/Unpaused` | op id, target, data, eta | governance transparency |

### 1.2 Client/analytics events (first-party, no third-party trackers; consent banner)
`page_view{route, locale}`, `wallet_connected{kind}`, `verify_started/completed{tier}`, `credit_claimed`, `window_viewed`, `deposit_submitted{bucket}`, `fairness_sheet_shown/expanded/dismissed{dwell_ms}`, `trade_submitted{side, state, slippage}`, `trade_preconfirmed_ms`, `trade_confirmed_ms`, `simulation_failed{error}`, `share_clicked{channel}`, `create_step{n}`, `create_completed`, `alert_subscribed`, `error_shown{glossary_key}`. Identity: hashed wallet + session id; IP hashed with daily salt; retention 90 days.

### 1.3 Scoring job outputs
`scores(creator, season, score, sub_scores jsonb, method_version)`, `season_points(wallet, season, category, provisional, final, slashed_reason)`, `clusters(cluster_id, wallets[], method, confidence)`, `labels(token|wallet, label, reason, since)`.

## 2. KPI dashboard spec

**North star**: distinct attested humans per graduated token (median and p25), with its complement: share of graduations via time-fallback.

| Area | KPI | Definition | Target (Season 1) | Pons baseline (05) |
|---|---|---|---|---|
| Acquisition | verified users (tier 1 / tier 2) | distinct `TierUpdated` tier ≥ 1 | 3,000 / 800 | — |
| Activation | verified → first deposit or buy within 24 h | % | ≥ 50% | — |
| Launch quality | launches/day; % by tier-0 wallets; % with opening order | from `Launched` | 100–300; < 20%; ≥ 60% | 36k→1.5k/day; serial-deployer share 24.8% |
| Window | participants/window (median); clearing multiple; cancellation rate | `Settled` | ≥ 8; 1.1–2.0×; < 15% | n/a |
| Fairness | bundled graduations (first buy in launch tx) | by construction ~0 | < 5% | 100% of sample |
| Graduation | graduation rate; median time-to-graduation; fallback share | `Graduated`/`Launched`; `StateChanged` | 5–10%; ≥ 30 min; < 20% | 1.47%; 250 s; n/a |
| People | attested buyers per graduated token (median); holders at +7 d | `firstAttested`, balances | ≥ 60; ≥ 40 | 3.5 traders per median curve |
| Churn | sell-back ratio (median per curve); curve lifetime | `Sell.out/Buy.in` within 1 h | < 0.8; ≥ 2 h | 0.96; ~4 min |
| Creator | creators selling during curve (cluster-detected); creators with ≥ 2 graduated tokens | labels | < 10%; ≥ 50 | 48% sell |
| Holders | 30-day retention post-graduation; reward claim rate | balances; `Claimed` | ≥ 40%; ≥ 30% | unmeasured |
| Season economy | points-per-human / points-per-wallet; slashed share; D7/D28 claimant retention | scoring outputs; `Claimed` | ≥ 0.9; < 15%; ≥ 35% / 20% | n/a |
| Ops | keeper SLA (third-party share of settles/graduations); indexer lag p95; app error rate | events caller; health | ≥ 50% third-party; < 3 s; < 0.5% | hot-key keepers; Sep-4 incident |
| Trust | pending changes announced ≥ 48 h; support tickets re hidden fees | governance tables; support | 100%; 0 | no timelock |

Dashboards: (1) Executive (north star + guardrails, weekly), (2) Launch funnel, (3) Window & graduation, (4) Creator & holder economics, (5) Season & sybil, (6) Ops/health. Built in Grafana or Metabase on a Neon read replica; public subset on `/season` and `/status` (transparency).

## 3. Experiment plan (testnet)

Unit of randomisation: **launch** (parameters are copied at creation, so each launch is a clean arm; creators cannot choose in v1 — PRD non-goal). Assignment: deterministic hash of `(token address, experiment id)` → arm, recorded in `params` on-chain (auditable). Analysis on the indexer; pre-registered metrics; season-length runs.

| # | Experiment | Arms | Primary metric | Guardrail | Season |
|---|---|---|---|---|---|
| E1 | Window length | 90 / 120 / 180 s | participants per window; graduation rate | creator drop-off in create flow | 0–1 |
| E2 | People threshold `N` | 15 / 25 / 40 | fallback share; attested buyers per graduation | graduation rate not < 3% | 1 |
| E3 | Humans-first duration | 5 / 10 / 20 min | share of tier-0 buys in first hour; sell-back ratio | activation of tier-0 users (conversion to verify) | 1 |
| E4 | Tier-2 cap | 5% / 8% of G | window Gini; clearing multiple | whale share of allocations | 1–2 |
| E5 | Rations | 20/50 vs 30/75 SC | D7 retention; graduation rate | credit hoarding (unspent at burn) | 2 (per-season, not per-launch) |
| E6 | Ranking variant | quality score v1 vs v2 (more retention weight) | rank-to-graduation precision; 7-day retained holders of top-10 | time on feed | 1–2 (user-level randomisation) |
| E7 | Fairness sheet format | 6-row table vs narrative | dwell; post-trade regret proxy (sell within 10 min) | trade conversion | 1 |
| E8 | Bounty size | 5 / 10 bps | third-party keeper share | protocol fee leakage | 1 |

Power: with ~150 launches/day and 3 arms, a 28-day season gives ~1,400 launches per arm — enough to detect a 2-percentage-point difference in graduation rate (from 6%) at 80% power, and much smaller differences in window participation. Users-level tests (E6) need ~2,000 active users per arm for a 10% relative lift in retention; feasible in Season 1 if acquisition targets are met, otherwise extend one season.

Rules: one primary metric per experiment; stop early only for guardrail breaches; publish results in the season recap (transparency positioning); never run two experiments that change the same parameter simultaneously.

## 4. Data quality and verification
- Differential check: nightly replay of all trades through the Phase 2 Python formulas vs indexed values (04-security §3).
- Reconciliation: Σ indexed fees == splitter balances + claims; Σ holder balances == totalSupply − excluded.
- Backfills from Blockscout API v2 and Nodit (07 §4) when Ponder gaps are detected; gap alarms.
- Privacy: no PII; analytics opt-out honoured; data retention policy published (10-legal).
