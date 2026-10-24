# 04 — Security Plan

Scope: contracts (03-smart-contract-spec), app/API/indexer/keepers (05-system-architecture), operations. Lessons applied from Pons: hot-key keepers (04 §3), Safe without timelock (02 incidents), indexer mistaken for chain (04 §5), invisible exemptions (03 §6).

## 1. Threat model

### 1.1 STRIDE by component

| Component | Spoofing | Tampering | Repudiation | Info disclosure | DoS | Elevation |
|---|---|---|---|---|---|---|
| **Curve / window** | fake tier via forged attestation → registry verifies against EAS (`attester`, `schema`, `recipient`, revocation) | reorder/param drift → params copied at creation; manifest hash | all actions emit events with caller | none (all public) | griefing `settle` → no external calls except pull accounting; window end timestamp-based | creator exemptions → none exist |
| **IdentityRegistry** | attester key compromise at Upbit/faucet (out of our control) → timelock can de-list attester; tiers have expiry; `refresh` downgrades on revocation | registry allow-list change → timelock + notice | `TierUpdated` events | tiers already public on EAS; no PII | EAS read failure → `register` reverts safely; existing cache keeps working | scorer key → scores gate limits only, revocable |
| **Pool** | — | donation/`sync` manipulation → k only grows; no skim | events | — | none (no admin) | none |
| **FeeSplitter / HolderRewards** | claim as creator → `creatorOf` from factory record | accounting drift → invariant monitors | events | — | dust bounty griefing → min amounts | protocol claim only to Treasury |
| **SeasonCredit** | sybil claims → tiers from Dojang; rations small; season burn | wallet-to-wallet transfer → `isMarket` gate | — | — | `burnExpired` griefing → permissionless by design, idempotent | mint → `claimDaily` only, timelocked rations |
| **Factory / Registry** | malicious factory registration → timelock + 48 h notice; frontend pins verified versions | manifest edit → immutable | `Launched` carries full manifest | — | Guardian over-pausing → 7-day expiry, pause-only | — |
| **Frontend / API** | phishing clones → UP ID + domain pinning in Kakao/Telegram posts; EIP-712 SIWE statement shows domain | XSS via metadata → strict CSP, sanitised markdown, image proxy | signed ToS acceptance | API keys → server-only; RPC keys never shipped to client | bot traffic → Turnstile on writes, rate limits, edge caching | admin UI → none exists; ops via Safe only |
| **Indexer** | — | wrong data shown → chain-vs-indexer health; trade path uses chain reads | — | — | lag/outage (Pons Sep-4) → degrade lists only | — |
| **Keepers** | — | compromised hot key → key has zero privileges (permissionless functions) and minimal funds | — | — | bots down → third-party bounties; multiple regions | — |

### 1.2 MEV, sequencer and Flashblocks

- **Public mempool**: OP Stack sequencers typically do not expose a public mempool; GIWA's documentation is silent on ordering policy [DOCS 07 §1] → treat ordering as **sequencer-decided, priority-fee influenced**. Mitigations: slippage + deadline on all trades; batch window neutralises launch-time ordering (S1); per-block uniform pricing is P2 (I05).
- **Flashblocks (200 ms preconfs)**: a preconfirmed state may differ from the final block if the sequencer reorganises within the block [DOCS] → the UI shows "preconfirmed" and "confirmed" states; keepers act only on confirmed blocks; the indexer processes `latest`, with a 2-block reorg buffer and `pending`-tag quotes clearly labelled.
- **Sequencer downtime / forced inclusion**: users can force-include via L1 (OP Stack) [DOCS]; windows that end during downtime settle late at the same price (timestamp-based); `graceFallback` and vesting are time-based and simply shift. Documented in the status page.
- **Sandwiching**: 1-s blocks and sequencer ordering make classic sandwiches possible for the sequencer or a priority-fee bidder; expected value is bounded by user slippage; default slippage 1% on curve, 2% on pool; "fast" trades may use flashblock quotes.
- **Timestamp games**: window end and fallback use `block.timestamp` (sequencer-controlled within OP Stack drift bounds); the economic effect of a few seconds is nil because the window clears at one price.

### 1.3 Abuse scenarios specific to our design

| Scenario | Effect | Control |
|---|---|---|
| Whale splits across 25 tier-1 faucet wallets to satisfy `N` | fake "community" graduation | tier-1 caps (2% of G) → 25 × 50 SC = 1,250 < G; needs ≥ 50 wallets each with a faucet attestation and daily rations; cluster detection slashes points and lowers creator score; `N` tuned per season |
| Creator deposits via second wallet to bypass vesting | hidden unlocked supply | window caps; same-funder clustering labels team wallets; reputation penalty; disclosed limit of the control |
| Epoch snapshot farming in HolderRewards | extract holder share | 2% round-trip fee vs 1-day share of 0.3% of volume; randomised snapshot block in the last hour |
| Griefing settlement by many 1-wei deposits | gas/UX | min deposit (0.5 SC); deposits require tier ≥ 1 |
| Repeated launches to farm launch bounties/points | spam | no points for launches; launch fee in rationed SC; rate limits (P1) |
| Attestation revoked after registration | stale tier | expiry + `refresh`; windows re-check `tierOf` live (cheap SLOAD) |
| Guardian collusion | pause new launches for 7 days | timelock can replace Guardian; pauses are visible; no fund access |

## 2. Invariants (to be encoded as Foundry invariant tests and live monitors)

Curve
- I-C1 `quoteReserve · tokenReserve` is constant across `buy`/`sell` up to rounding in favour of the curve; never decreases.
- I-C2 `quote.balanceOf(curve) ≥ trackedQuote + feeAccrued + taxAccrued + totalDeposits(pending)`.
- I-C3 `token.balanceOf(curve) == S − sold − claimedWindowTokens` while not graduated.
- I-C4 In `Batch`, `sold == 0` and no `Buy`/`Sell` events; in `Graduated`, no state change except `claimWindow`.
- I-C5 `Σ claimWindow tokens ≤ windowAllocation`; `Σ refunds + filledQuote == totalDeposits(committed)`.
- I-C6 `attestedBuyers` increments at most once per address and only for `tier ≥ 1` recipients.
- I-C7 `graduate` succeeds only if `trackedQuote ≥ G && (attestedBuyers ≥ N || now ≥ fullSince + grace)`.
- I-C8 Pool seed price equals curve price at graduation within 1e-9 relative.

Pool
- I-P1 `k` never decreases; reserves equal balances after every call (no skimmable surplus).
- I-P2 Fee is always in quote and always forwarded in the same tx.

Splitter / rewards
- I-S1 `quote.balanceOf(splitter) == Σ accrued − Σ claimed − Σ pushed`.
- I-S2 Per-token split table never changes after registration.
- I-R1 `Σ claims(epoch) ≤ funded(epoch)`; `eligibleSupply(epoch) == totalSupplyAt − Σ excluded balances`.

Vault
- I-V1 `released ≤ vestedAt(now)`; before graduation `released == 0` unless `now ≥ created + expiry`.

Identity / credit
- I-I1 `tierOf(a) > 0` implies a valid, unrevoked, unexpired attestation from an allowed attester existed at `register/refresh` time.
- I-SC1 No `Transfer(from, to)` of SC where neither party `isMarket` (except mint/burn).
- I-SC2 `claimDaily` mints ≤ `ration[tier] × 7` per call and ≤ `ration × daysElapsed`.

Governance
- I-G1 Every `LaunchParams`/allow-list mutation has a `CallScheduled` ≥ 48 h earlier.
- I-G2 Guardian pause duration ≤ 7 days without a timelock renewal.

## 3. Test plan

| Layer | Tooling | Coverage targets |
|---|---|---|
| Unit | Foundry | every function, every revert reason, every event; 100% line coverage on curve/pool/splitter/rewards/credit |
| Fuzz | Foundry fuzz (≥ 10k runs CI, 1M nightly) | buy/sell amounts, deposit sets, limit buckets, tier mixes, time warps around window end/fallback/epochs; property: formulas vs `CurveMath` reference |
| Invariant | Foundry invariant with handlers (actors: tiers 0/1/2, creator, keeper, attacker) | I-C1…I-G2; run 5k depth × 500 runs nightly |
| Fork | Foundry fork of GIWA Sepolia (RPC `sepolia-rpc.giwa.io`) | real EAS reads with real Dojang UIDs (faucet + Upbit), CreateX deployment, Blockscout verification dry run |
| Differential | Python replay harness (from `02-contracts/verification/`) vs on-chain events | reproduce `tokensOut/quoteOut/fee/tax` to the wei for every trade in test seasons; CI job on a sample of 1,000 trades/day |
| Gas/size | `forge snapshot`, `forge build --sizes` | implementations < 20 KB; regressions flagged |
| Static | Slither, Aderyn, semgrep-solidity; `solc` SMTChecker on `CurveMath` | zero high/medium unresolved |
| Frontend e2e | Playwright against anvil + local indexer | J1–J7 journeys in KO and EN; indexer-off mode (AC-A2); mobile viewport |
| Chaos | scripted: kill indexer, kill RPC primary, stall keepers | status page states and trading availability (AC-O3) |
| Load | k6 on API/RPC proxy | 1,000 rps reads, 50 rps writes at p95 < 300 ms |

## 4. Audit strategy

1. **Internal review** (wk 10–11): two-person line-by-line review with a written checklist (Solcurity, OZ guidelines); invariants mapped to tests.
2. **Audit #1 — boutique firm** (wk 16–19): scope curve, window, pool, splitter, rewards, credit, registry (~1,300 lines). Budget tiers (decision for the user): A) ~$25–40k single firm; B) ~$60–90k two firms sequential. Fix window + re-review of diffs.
3. **Public contest** (wk 20–22): Code4rena / Sherlock / Cantina competition on the fixed codebase; publishes findings — aligned with the transparency positioning.
4. **Pre-mainnet re-audit** of any change after the contest + a formal verification pass on `CurveMath` and `WindowMath` (Certora or Halmos) if budget allows.
5. Publish all reports in-app (Governance page) and in the repo.

## 5. Bug bounty

- Testnet (from Season 1): self-hosted program; rewards in season points and small cash (Critical $2k, High $750, Medium $250, Low swag/points); scope: contracts + app auth/session.
- Mainnet: Immunefi-hosted; Critical up to $50k (or 10% of funds at risk, whichever lower), High $10k, Medium $2.5k, Low $500; safe-harbour language; KYC per Immunefi rules; 90-day disclosure.
- Out of scope: Dojang attesters, GIWA infra, third-party wallets, social engineering.

## 6. Monitoring and alerting

| Monitor | Signal | Threshold / action |
|---|---|---|
| Invariant watcher (off-chain, every block) | I-C1…I-R1 recomputed from state + events | any violation → P1 page + Guardian call |
| Manifest vs render | Fairness Card diff checker | mismatch → P1, banner |
| Keeper SLA | windows unsettled > 60 s after end; graduations not executed > 60 s after ready; epochs unfinalised > 1 h | P2 → scale bots; evaluate bounty |
| Chain health | block lag > 10 s, L1 batch submission age, RPC error rate per provider | banner "chain delayed"; RPC failover |
| Indexer health | head lag > 5 blocks, event backlog | banner "lists delayed, trading available" |
| Anomaly | > 50 launches/h from one funder cluster; window with ≥ 80% deposits from one cluster; SC transfer attempts failing in bulk | P3 review; feed labels |
| Governance | `CallScheduled` on timelock; Guardian pause | in-app banner + Telegram/Slack alert |
| App | Sentry error rate, Web Vitals (LCP/INP), API p95, Turnstile fail rate | SLO alerts |

Tooling: Grafana/Prometheus or Axiom for metrics/logs; Sentry; Better Stack status page; alerts to Telegram + PagerDuty-lite (on-call rota). Public status page separates **chain** / **indexer** / **app** (04 §5 lesson).

## 7. Incident response runbook

Severities: **SEV1** funds at risk or invariant violated; **SEV2** trading unavailable or incorrect data shown; **SEV3** degraded (lists, alerts, keepers slow).

First 15 minutes (SEV1/2): acknowledge in on-call channel → freeze new activity if attack vector is launches/deposits (Guardian) → post status (KO/EN templates) stating what is and is not affected (exits always available) → preserve evidence (block range, txs) → open war-room doc.
Hour 1: root cause hypothesis; if contract-level, prepare factory v(n+1) or parameter change via timelock (48 h) — communicate the timeline; if infra-level, failover (RPC/indexer/region).
Day 1–3: fix, test, deploy; public post-mortem within 72 h with timeline, impact, remediation, and what users should do. Post-mortem template included in `runbooks/`.
Communication rule learned from Pons: never say "chain halted" based on indexer data (04 §5); state the source of each claim.

## 8. Key management

| Key | Custody | Use | Rotation |
|---|---|---|---|
| Deployer | hardware wallet, air-gapped signing | one-time deployment, hands over to timelock | retired after deploy |
| Safe signers (5) | hardware wallets; ≥ 3 time zones (KST/WIB/UTC); named roles | propose/execute timelock ops | annual review; signer drills quarterly |
| Guardian signers (3) | hardware or MPC; must be reachable 24/7 | pause-only | quarterly |
| Scorer | cloud KMS (no exportable key); CI-less, runs in the scoring job | EAS score attestations | monthly; revocation path via timelock |
| Keeper bots | hot wallets with minimal SC/ETH; zero privileges | permissionless functions | monthly |
| App secrets (RPC keys, DB, Blob) | Vercel env + Doppler; server-only | — | quarterly or on staff change |
| SIWE session key | server secret, 7-day sessions | auth | quarterly |

Policies: no shared seed phrases; no keys in repos (gitleaks in CI); a signed "ops charter" listing powers and limits of each role published on the Governance page; 48 h timelock is the minimum, 7 days for attester/schema changes (higher trust impact).

## 9. Application security baseline
- Strict CSP (nonce-based), `X-Content-Type-Options`, `Referrer-Policy`, HSTS, `Permissions-Policy`; `X-Frame-Options: SAMEORIGIN` on authenticated routes.
- All metadata (names, descriptions) sanitised; images re-encoded server-side; links rel-noopener and domain-labelled.
- SIWE (EIP-4361) with domain/chain binding; nonces single-use; sessions httpOnly + SameSite.
- Turnstile on write endpoints (profile, media, alerts) — never on trades (trades are on-chain).
- Rate limits per IP and per wallet on API; Blockscout/Nodit keys proxied server-side.
- Dependency scanning (Renovate + audit), SBOM, pinned Node version.
