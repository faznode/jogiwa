# Phase 5 — Economics, Growth & On-Chain Behavior: Pons Family

Data: full `eth_getLogs` scan of all three factories on Robinhood Chain (chainId 4663) to block 96,275,278 (2026-10-23) — `raw/traces/events_*.json`, produced by `02-contracts/verification/scan_events_v2.py`; cohort statistics by `cohort_analysis.py` → `cohort-stats.json`, `daily_launches.csv`; stratified random sample of 240 V2 ETH-pair curves (`sample_curve_volume.py` → `raw/traces/curve_sample.json`, `volume-estimate.json`). Fee constants from Phase 2 ([ONCHAIN]). Timestamps interpolated from 500k-block anchors (error ≤ minutes).

## 1. Exact fee model (V2, live) [ONCHAIN]

| Leg | Rate | Split | Notes |
|---|---|---|---|
| Launch | 0.0005 ETH flat (`launchFee`) | 100% protocol | paid in launch tx |
| Curve buy | 1% of quote in (`fee`) + snipe tax (99% decaying to 0 over 3 s, folded into `fee`) + creator tax ≤10% (`tax`) | fee → 30% protocol / 70% creator bucket; tax → 100% creator | partial-fill grossing-up at the cap |
| Curve sell | 1% of quote out + creator tax | same | no snipe tax on sells |
| Post-graduation swap (Uniswap v4 pool, LP fee 0) | 1% hook fee on quote leg | 30% protocol / 70% creator bucket | hook captures everything; LPs earn nothing (LP = locked protocol position) |
| Buyback (optional per launch) | 50% of the creator bucket | swapped to the memecoin, vault-locked 5 years, released 70/30 creator/protocol | docs say "burn", code vests |
| Holder fee sharing (optional, `fees.recipient = holders`) | creator bucket distributed to holders in off-chain-scheduled rounds | — | observed 1,419 rounds on one token |

Per 1 ETH of curve volume (no creator tax, no buyback): protocol 0.003 ETH, creator 0.007 ETH. Per $1M volume: $10,000 total fee → $3,000 protocol / $7,000 creator (+ creator tax at the creator's chosen rate; sample-wide effective creator tax = 0.67% of volume).

## 2. Cohort analysis (all launches, 2026-07-13 → 2026-10-23)

### 2.1 Scale and lifecycle

| Generation | Live window | Launches | Unique creators | Graduations | Peak day |
|---|---|---|---|---|---|
| Gen1 (V3 range order) | Jul 13 → Aug 12 | 1,895 | 508 | n/a (cosmetic) | — |
| Gen2 (V3 range order, docs "v1") | Jul 13 → Aug 12 | 266,221 | 90,862 | n/a | — |
| V2 (bonding curve) | Aug 3 → today | **709,489** | **419,622** | **10,427 (1.47%)** | **36,449 launches (Sep 8)**, 722 graduations (Sep 5) |

Monthly V2 cohorts: Aug 136,528 launches (1.23% graduate), **Sep 512,172 (1.60%)**, Oct-to-date 60,789 (0.89%). Last 14 days: 1,100–2,300 launches/day and 3–34 graduations/day — **−95% launches and −97% graduations from peak**. [ONCHAIN]

### 2.2 Pair assets (V2)

| Pair token | Launches | Graduations | Rate | Threshold | Paired into pools (sum) |
|---|---|---|---|---|---|
| ETH (native) | 431,814 | 5,177 | 1.20% | 4.2 ETH | 21,743 ETH (= 4.2 × 5,177 exactly) |
| USDG (Global Dollar, 6 dec) `0x5fc5…d168` | 71,966 | 1,829 | **2.54%** | 8,090 USDG | 14.8M USDG |
| NVDA stock token `0xd060…9eec` | 62,043 | 518 | 0.83% | 41.6 NVDA | 21,549 NVDA |
| SPCX (SpaceX) stock token `0x4a0e…5eea` | 22,840 | 286 | 1.25% | 72.2 SPCX | 20,649 SPCX |
| SPY stock token `0x117c…4c0c` | 10,281 | 296 | 2.88% | (per-pair economics) | 3,226 SPY |

All 709,489 launches used `launchConfigId 0` (one curve config). Stock-paired launches = 13.4% of V2 launches — a Robinhood-specific moat that does not exist on GIWA.

### 2.3 Time to graduation (10,427 V2 graduations)

p10 **6 s**, p25 37 s, **median 250 s**, p75 26 min, p90 3.7 h, p99 6 days, max 34 days. **31% graduate in under 60 s, 62% under 10 min, 83% under 1 h; only 3.9% take more than a day.** Graduation is overwhelmingly a bundled/bot event, not an organic community outcome. [ONCHAIN]

### 2.4 Creator concentration and repeat creators (V2)

- 88.6% of creators launched exactly once; 25 addresses launched >1,000 tokens each (70,302 launches = 9.9%); creators with >20 launches produced **24.8%** of all launches. Top creator `0x5be0…5519`: 13,791 launches. Multicall3 (`0xca11…ca11`) appears as "deployer" of 5,080 launches — deployer attribution breaks for contract-routed launches.
- Top-10 graduating creators hold 9.3% of graduations; `0x7b44…edf2` graduated 261 of 3,643 launches (7.2% hit-rate vs 1.5% average) — industrialised launch farms.
- Graduation rate by creator type: single-launch creators 1.62% ≥ 101–1,000-launch creators 1.52% > >1,000-launch 1.22% > 6–20-launch 1.04%. Serial deployers do **not** graduate more often; they graduate more in absolute terms by volume.
- 2.9% of launches share a block with another launch (burst launching).

### 2.5 Per-curve behaviour (stratified sample, ETH pairs; n = 180 non-graduated + 60 graduated)

| Metric | Non-graduated | Graduated |
|---|---|---|
| Median gross buy volume | 0.054 ETH | 10.26 ETH |
| Mean gross buy volume (95% CI) | 0.95 ETH (heavy tail, max 35.8) | 11.7 ETH |
| Median unique traders | 3.5 | 38 |
| Zero-buy launches | 14% | 0% |
| ≤5 unique buyers | 67% | 3% |
| Sell-back ratio (quote out / quote in) | 0.96 | 0.55 |
| First buy inside the launch tx (`launchAndBuy`) | 74% | **100%** |
| Deployer address later sells on the curve | 48% | 7% (pre-graduation) |
| Creator tax enabled (tax > 0) | 49% | 67% |
| Median active span | ~4 min | ~12 min |
| p90 active span | ~17 h | ~6 h |

Reading: the median launch is a 3-trader, 4-minute event whose buyers sell 96% back; graduated tokens are 38-trader, 12-minute events seeded by a bundled first buy. **Every graduated token in the sample started with a creator buy in the launch transaction.**

### 2.6 Extrapolated curve economics (ETH pairs only, 81 days) — `volume-estimate.json`

| Quantity | Point estimate | 95% CI |
|---|---|---|
| Curve volume (buy+sell), non-graduated | 794k ETH | 443k – 1.27M |
| Curve volume, graduated | 97k ETH | 81k – 115k |
| **Total ETH-pair curve volume** | **~891k ETH** | — |
| Curve fees (1% + snipe) | 9,579 ETH | 5.7k – 14.6k |
| → protocol (30%) | ~2,874 ETH | |
| → creators (70%) | ~6,705 ETH | |
| Creator taxes (100% creator) | 5,964 ETH | 2.9k – 10.6k |

Excludes USDG/stock pairs (39% of launches), all post-graduation hook fees on 10,427 v4 pools, and launch fees (709,489 × 0.0005 = **355 ETH**, exact). Heavy-tailed: a handful of wash-traded curves (35 ETH gross, 96% sold back) dominate the mean — the KPI to copy is **not** volume but unique traders and net-retained quote.

### 2.7 Fee revenue over time
Protocol curve revenue tracks the launch curve: September carried 72% of launches and ≥78% of graduations; October run-rate is ~5% of the peak. Hook fees on graduated pools (not scanned, OQ-5.2) are the only revenue line that persists after the launch wave.

## 3. Growth mechanics — why it won, where it is vulnerable

**Why it won (≈80% share at peak):**
1. **First mover on a new chain with a captive audience** — launched the day Robinhood Chain's launch wave started (Gen1/Gen2 Jul 13; 266k Gen2 launches in 30 days), before Pools.trade (Aug 5), Lemon, NOXA.
2. **Stock-token and stablecoin pairs** (NVDA/SPCX/SPY/USDG) — 13%+ of launches, 2.5% graduation on USDG — a narrative no other chain could offer.
3. **One-tx launch + opening buy with configurable economics** (creator tax, buyback, holder fee share, snipe-exempt list) — creators choose their revenue model; 7 of the top-50 tokens used the whitelist.
4. **Creator revenue share 70%** of a 1% fee (vs pump.fun's 0.30% of 1.25%).
5. **Fast chain** (100 ms blocks) + simulation + Ably realtime made bot-grade UX available to humans.

**Where it is vulnerable:**
1. **Graduation is a bot product** (median 250 s; 100% of sampled graduations bundled). Humans arrive after the curve is sold; retention collapses when bots leave — which is exactly the −95% trajectory.
2. **Snipe-tax exemptions are creator-controlled and invisible pre-launch** → the $18.43M bundling operation (Phase 2 incidents); the mechanism meant to protect buyers became the insider tool.
3. **No post-graduation lifecycle**: LP fee 0, all value to hook; no incentives for holders after day 1.
4. **Keeper-dependent creator payouts** (sweeps, buybacks, holder rounds) and a 2-of-3 Safe without timelock.
5. **No discovery quality signal** other than the serial-deployer badge; 25 addresses produce 10% of supply of launches.
6. **Chain concentration**: fortunes tied to Robinhood Chain activity, which itself dropped (Sep 4 batcher incident; Oct 23 degraded-performance banner).

## 4. KPI benchmarks ("what good looks like" for a launchpad)

| KPI | Pons observed | Benchmark for us (testnet) |
|---|---|---|
| Graduation rate | 1.47% (0.9% Oct) | 2–4% with **≥ 25 unique buyers** per graduation |
| Median time-to-graduation | 250 s | > 30 min (design target: organic, not bundled) |
| Share of graduations with first buy in launch tx | 100% | < 30% |
| Unique traders per graduated token | 38 | ≥ 60 |
| Zero-buy launches | 14% | < 10% |
| Single-launch creators | 88.6% of creators | track; healthy if repeat creators graduate *more* |
| Launches from >20-launch deployers | 24.8% | < 15% (rate-limit + reputation) |
| Sell-back ratio on curve (non-grad) | 0.96 | < 0.8 |
| Deployer sells on curve | 48% | < 25% with vesting default |
| Protocol take | 0.3% of curve volume | 0.3–0.5% |

## 5. Spreadsheet-ready tables
- `daily_launches.csv` — per-day launches by generation and V2 graduations.
- `fee-model.csv` — fee legs, rates, splits, per-1-ETH and per-$1M worked numbers, competitor columns (Phase 6).
- `cohort-stats.json`, `volume-estimate.json` — all numbers above with raw counts.

## 6. Open questions
- OQ-5.1 USDG/stock-pair volumes and fees (sample not stratified by pair).
- OQ-5.2 post-graduation hook fee revenue (needs v4 `Swap` scan on 10,427 pool ids).
- OQ-5.3 holder retention / top-trader concentration (needs transfer-level data; recommend Dune/Nodit when available).
- OQ-5.4 PONS token value capture (protocol fee recipient `0x31eA…CDB` is a contract — Phase 2 OQ).
