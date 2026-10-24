# Progress Log — GIWA Launchpad Research

Mission: reverse-engineer Pons Family (Robinhood Chain) with REA + Foundry, then produce a masterplan for an original meme launchpad on GIWA Sepolia. Research + planning only; no product code.

Date discipline: today is 2026-10-24. All on-chain reads are against Robinhood Chain (chainId 4663) unless stated.

---

## Session history

### Session 1 (2026-10-23, ~27 min, agent disconnected) — see `v0-agent-logs-1`
Completed:
- Step 0: REA 6.7.0 installed + health-checked, Foundry 1.5.1 (forge/cast; anvil unusable on glibc 2.34), `_rea-playbook.md` written.
- Phase 1 (partial): ponsfamily.com + docs.ponsfamily.com snapshotted into `raw/docs-snapshots/`, headers captured, DNS/CDN hints, browser observation of launchpad / token page / create flow (screenshots were in /tmp and are lost; snapshots summarized in logs).
- Phase 2 (investigation complete, report NOT written): all three contract generations identified; verified sources downloaded from Sourcify into `raw/sources/`; ABIs into `raw/abis/`; Gen1 bytecode inspected with REA (`raw/bytecode/`); curve formula reproduced exactly against two real `CurveBuy` txs in Python; Foundry live-fork differential tests pass (`02-contracts/verification/forge/`, 3/3).
- Phase 3 (partial): 49 Next.js chunks downloaded into `raw/bundles/js/`; v2 ABI recovered from chunk `14-4wv1j-s73i.js`; 17 API endpoints probed into `raw/captures/`.
- Phase 5 (partial): chunked `eth_getLogs` scan reached Gen1=1,895 launches (complete), Gen2=266,221 (complete), V2=121,510 at 34% of range — but results were only in the log (`raw/traces/scan.log`); JSON never written.
- Phase 6 (partial): web search summaries on Pools.trade, Lemon.fun, NOXA, The Block / Wazz investigation.

Lost at disconnect: no `_progress.md`, `_evidence-index.md`, `_open-questions.md`, `_findings-private.md`; no phase reports or `facts.json` for any phase.

### Session 2 (2026-10-24, this session) — resume from checkpoint
- [x] Cloned `faznode/jogiwa@eb7d01d` `giwa-launchpad-research/` into workspace (25 MB of raw artifacts preserved).
- [x] Re-installed forge/cast 1.5.1 at `/tmp/rea-tools/`; both RPCs reachable (Robinhood 0x1237, GIWA Sepolia 0x164ce).
- [x] Rewrote scanner as `02-contracts/verification/scan_events_v2.py` (checkpointing, compact records, timestamp anchors). Running in background → `raw/traces/events_*.json`.
- [x] Re-read verified sources to extract exact event signatures, constants, buy/sell/sweep/graduation code paths (quoted in `02-contracts/formula-sheet.md`).
- [x] Resolved remaining live module addresses (fee escrow, executor, guard, deployer, forwarder, sweep operator, Safe signers).
- [x] Phase 2 report, formula sheet, incident analysis, facts.json.
- [x] Phase 1 report + facts.json
- [x] Phase 3 report + `api-spec.yaml` + facts.json
- [x] Phase 4 report + facts.json
- [x] Phase 5: scan complete (gen1 1,895 / gen2 266,221 / v2 709,489 launches / 10,427 graduations); `cohort_analysis.py`, `sample_curve_volume.py` (240-curve stratified sample), report, facts.json, `fee-model.csv`, `daily_launches.csv`, `volume-estimate.json`
- [x] Phase 6 report + facts.json (incl. GIWA.MARKETS incumbent)
- [x] Phase 7 report (live GIWA probes, docs corpus in `raw/giwa/`) + facts.json
- [x] Phase 8 ideation (report, `ideas.csv` 44 scored, `shortlist-specs.md` 12 specs, facts.json) — written after the log capture, committed in `a5b567a`
- [x] Phase 9 masterplan docs 01–12 — same commit
- [ ] Masterplan docs 13–14, `_evidence-index.md`, `_open-questions.md`, `_findings-private.md` — **not written in S2**; `_progress.md` left stale

### Session 3 (2026-10-24, audit + completion) — see `_audit-session-3.md`
- [x] Re-cloned `faznode/jogiwa@a5b567a` into the workspace (34 MB incl. two Git LFS pointers; LFS objects verified present on GitHub).
- [x] Audited Phases 1–8 (coverage, evidence quality, spot-checks of cohort stats, forge outputs, source constants) and masterplan docs 01–12 (consistency matrix, worked examples re-derived). Findings C1–C8, R1–R7 in `_audit-session-3.md`.
- [x] Fixed C1 (split bounds vs `holdersShareBps = 0` fallback → ADR-17), C2 (deposit limit buckets), C4 (Gantt dates), C5 (exec-summary pointers); proposed ADR-16 (TWAB holder rewards instead of a `prevrandao` snapshot).
- [x] Owner request: reviewed Honeypot Finance "2.0"/Pot2Pump → `09-masterplan/15-honeypot-pot2pump-review.md` (captures in `raw/captures/honeypot/`), ADR-15, F41, F38 scope, M33, E9, 06 §8 addendum.
- [x] Wrote `13-decision-log-and-open-questions.md`, `14-appendix.md`, `09-masterplan/facts.json`.
- [x] Wrote `_evidence-index.md` (curated IDs E0–E9, EH) + `_evidence-inventory.generated.md` (598 files with SHA-256), `_open-questions.md` (43 OQs with status/owner), `_findings-private.md` (**keep out of the public repo**).
- [x] Definition of Done satisfied; one decision pending owner approval (ADR-16) and five product decisions listed in 13 §3.

---

## Phase summaries (10 lines each, updated as phases close)

### Step 0 — REA playbook
1. REA `rea-agents@6.7.0` pinned; works on Node 24.16 / Amazon Linux 2023; native engines (Ghidra, jadx, etc.) absent and unneeded.
2. Relevant REA tools: `inspect-evm-interface` (selector/dispatch recovery), `analyze-web-bundle`, `inspect-web-network-capture`, browser observation.
3. REA cannot decompile EVM to source, cannot fork chains, cannot fetch verified source → gap filled with Sourcify v2 API + Foundry `cast`/`forge --fork-url`.
4. `anvil` fails (needs GLIBC 2.35; host has 2.34) → fork tests use `forge test --fork-url`, which does not need anvil.
5. Robinhood public RPC prunes historical state within hours → pinned-block archive forks fail; live-fork differential tests used instead.
6. Robinhood RPC WAF blocks Python-urllib default UA (HTTP 403) → set a custom UA.
7. Robinhood RPC rate-limits (HTTP 429) under parallel load; a single chunked scanner saturates it.
8. Blockscout `robinhoodchain.blockscout.com` is Cloudflare-challenged for non-browser clients; Sourcify is the usable verification source.
9. Bash commands mentioning `agent-browser` are routed to a browser sandbox without curl/jq — keep them separate.
10. Open: REA MCP mode not exercised (CLI used throughout).

### Phase 2 — Smart contracts (CLOSED this session)
1. Three generations exist: Gen1 (2026-07-13, unverified, disabled), Gen2 (2026-07-13 +11h, verified, disabled; the one docs describe), V2 "PonsV2" (2026-08-03, verified, live).
2. Gen1/Gen2 have NO bonding curve: entire 1B supply minted into a one-sided Uniswap V3 range order (1% tier, tick -204200→max), LP NFT locked forever; "graduation" = 4.2 ETH paired principal threshold, cosmetic.
3. V2 = real constant-product bonding curve with virtual quote reserve (phantom 1.68 ETH), graduation at 4.2 ETH real quote, then a Uniswap V4 pool with a custom hook that captures all post-graduation fees (LP fee = 0).
4. Curve math reproduced EXACTLY on two real txs (tokensOut, fee, creator tax, 618 bps snipe tax) and live fork tests pass: [ONCHAIN]-verified.
5. Supply split at graduation: 71.43% sold on curve, 20.41% seeded into V4 pool, 8.16% permanently locked (virtual-reserve remainder). Price continuity exact (12.25x from launch).
6. Fees: 1% curve fee + 1% hook fee on quote leg; 30% protocol / 70% creator; if buyback enabled 50% of creator bucket buys the memecoin and LOCKS it 5 years (docs say "burn" — code says vest).
7. Snipe tax: 99% decaying by halvings over 3 s (`start >> floor(elapsed*14/window)`); creator may exempt up to 32 wallets — the exact mechanism abused in the $18.43M bundling operation reported by The Block.
8. Governance: all owner roles = Gnosis Safe 2-of-3 (v1.4.1) with NO timelock; caps are hard-coded (fees ≤10%, total ≤20%, protocol share ≤50%); non-upgradeable; renounce disabled; 3-day timelock only on CTO fee-recipient override; 7-day graduation rescue.
9. Keeper dependencies: fee sweeps and buybacks require a trusted `feeSweepOperator` EOA; graduation is permissionless + auto-attempted inside the last buy (try/catch).
10. Open: fee escrow / locker / forwarder verification status; Gen1 exact bug; exact article URLs; gas profile (RPC rate-limited during scan).

---

### Phase 3 — Web app (CLOSED)
1. Next.js App Router + RSC on Vercel, React 19, TanStack Query (8 s staleTime), valtio, wagmi/viem + Reown AppKit + Turnkey embedded wallets, SIWE sessions, Turnstile, Ably realtime (`token.created/updated`).
2. 29 same-origin `/api/*` route handlers + `balancesapi.ponsfamily.com`; REST only, no GraphQL/subgraph; spec in `03-webapp/api-spec.yaml`.
3. `eth_simulateV1` tx preview; custom-error glossary endpoint maps Solidity errors to copy; `/api/rpc` proxy hides upstream provider.
4. Create flow = 2 steps, ~12 fields, one tx (`launchAndBuy` with pinned `expectedEconomics`).
5. Discovery = market cap/new/active/graduation sorts + volume-driven trending; no comments, no points, no visible referral mechanics.
6. Trust signals = serial-deployer badge, Pons Verified allow-list, geo gating of equity pairs, wallet screening modal.
7. Open: chart library, Turnkey delegated-signing policy, screening provider, sort enum/cursor, trade-route POST schema.

### Phase 4 — Backend inference (CLOSED)
1. Own log-decoding indexer (ticks keyed `txhash:logIndex` mixing curve + v4 swaps) → relational store → Vercel route handlers; edge-cached public lists.
2. Realtime = indexer → Ably publish → client cache invalidation; REST is source of truth.
3. Hot-EOA keepers: `feeSweepOperator` 0xa1018c…cA83 for sweeps/buybacks; scheduled holder-payout distributor; graduation permissionless + finisher.
4. SPOFs: upstream RPC, indexer lag, hot keepers, Vercel, IPFS gateway, 2-of-3 Safe without timelock.
5. Sep-4 "13-min halt" was actually explorer indexing failure while the batcher was outbid for blob space (~40 min tx-success drop); Oct-23 degraded-performance banner observed.
6. Resilience list: raw-RPC indexer with failover, chain-vs-indexer health split, trading from chain reads alone, idempotent multi-host keepers + permissionless actions, L1 blob-pressure monitoring, health-driven status page, SWR caching.

### Phase 5 — Economics (CLOSED)
1. V2: 709,489 launches / 419,622 creators / 10,427 graduations (1.47%) in 81 days; peak 36,449 launches/day (Sep 8) → ~1,500/day now (−95%); graduations 722/day → ~18/day.
2. Pair assets: ETH 61% of launches (1.20% grad), USDG 10% (2.54%), NVDA/SPCX/SPY 13% combined; pool seeding sum = 4.2 ETH × 5,177 exactly.
3. Time-to-graduation median **250 s**; 31% < 60 s; 83% < 1 h; 100% of sampled graduations had the first buy inside the launch tx → graduation is a bundled bot event.
4. 88.6% of creators launch once; 25 addresses >1,000 launches each (9.9%); >20-launch deployers = 24.8% of launches; serial deployers do not graduate more often.
5. Median non-graduated curve: 0.054 ETH gross, 3.5 traders, 96% sold back, dead in ~4 min; 48% of deployers sell on the curve.
6. Extrapolated ETH-pair curve volume ~891k ETH (heavy-tailed), fees ~9.6k ETH (protocol ~2.9k, creators ~6.7k) + creator taxes ~6k ETH; launch fees 355 ETH exact.
7. Fee model per $1M: $3k protocol / $7k creator (+creator tax, effective 0.67%).
8. Won on: first mover + stock/stable pairs + one-tx configurable creator economics + 70% creator share + fast chain UX. Vulnerable on: bot graduations, invisible exemptions, graduate-and-forget, keeper payouts, weak trust signals, single chain.
9. KPI benchmarks defined (bundled-graduation share < 30%, ≥ 60 traders per graduation, sell-back < 0.8, …).
10. Open: USDG/stock volumes, v4 hook revenue, holder retention, PONS value capture.

### Phase 6 — Competitors (CLOSED)
1. Robinhood peers: Pools.trade (Uniswap Labs; Instant vs **Crowd Launch 4-h auction, $10k FDV or refund**, 0 platform fee, 0.25% LP fee w/ 0.20% auto-compounding locked liquidity), Lemon.fun (curve → V3, configurable), NOXA (direct single-sided V3, 50/50 fees).
2. Leaders: pump.fun 1.25% + 0.45% app fee, 0.30% creator; four.meme 1%, 18 BNB; LetsBONK 1.5%, BONK burn.
3. Base: Zora 1% split 50/20/4/1/5/20; Clanker single-sided v4 with 20% protocol cut; Flaunch 0–100% creator split streamed via NFT + bid-wall buybacks.
4. **GIWA.MARKETS** is already live on GIWA Sepolia (5 launch modes, EN/KO, $GIWA burn engine, own token on Robinhood Chain, 80%-supply graduation) + MemeFab.fun — we are not first.
5. 32-row feature matrix, graduation/anti-sniper/creator-incentive comparisons, 12 unsolved pains (bundling, invisible exemptions, fake volume, dev dumps, graduate-and-forget, keeper income, no timelock, indexer-as-chain, no identity layer, English-only, testnet value, GIWA namespace confusion).
6. Open: source URLs for competitor fee facts (search summaries only), MemeFab/GIWA.MARKETS rates.

### Phase 7 — GIWA env (CLOSED)
1. GIWA Sepolia 91342: OP Stack on op-reth, Karst/Osaka, 1.0 s blocks, 60M gas, **16,777,216 per-tx gas cap**, ~free gas, Flashblocks 200 ms preconfs via dedicated RPC, 7-day withdrawals, permissioned fault proofs.
2. Present: WETH9, Multicall3, Permit2, CreateX/Arachnid/Create2Deployer, Safe 1.4.1, EntryPoint 0.6/0.7, EAS + **Dojang** (Upbit Korea + faucet attesters; Verified Address/Balance/Code schemas), UP ID names, Pyth.
3. Absent: canonical Uniswap (community deployments have 1–6 txs), official stablecoin, token lists → **build our own locked CPAMM**.
4. Tooling: viem `giwaSepolia` (≥2.57), Blockscout API v2, Nodit Data API + QuickNode; hosted indexers unverified.
5. Activity is quest-farmed (464M txs, 158M addresses, 2.8M txs/day) → sybil pressure is the design constraint.
6. Audience/regulatory: CEX-centric Korean retail, ICO ban, VAUPA phase 1, Digital Asset Basic Act stalled; trademark risk around "GIWA".
7. Testnet strategy: 4-week seasons, soulbound rationed season credit as the curve quote, Dojang-weighted scoring of *quality* metrics, cluster slashing, exit criteria.

### Phase 8 — Ideation (CLOSED in S2; M33 added in S3)
1. 33 mechanics classified: 8 MUST-COPY, 12 IMPROVE, 6 DROP, 7 REPLACE (+ M33 Honeypot Pot2Pump: IMPROVE refund phase / DROP LP vault).
2. 16 pains/abuse vectors P1–P16 mapped from Phases 2–6 (bundling, invisible exemptions, churn volume, creator dumps, graduate-and-forget, keeper income, no timelock, indexer-as-chain, no identity, English-only, testnet value, namespace, whale dominance, ordering games, content abuse, hidden-fee drift).
3. 44 ideas scored on 6 criteria (max 30); distribution 19–28; incentives axis strongest (mean 26.0).
4. Shortlist of 12 specs: S1 batch window, S2 humans-first, S3 people threshold, S4 Fairness Card, S5 creator vesting, S6 streaming pull fees, S7 reputation, S8 quality discovery, S9 holder-paid locked liquidity, S10 timelocked admin, S11 squads, S12 season economy.
5. Differentiation Thesis + 3 pillars (Korean communities not bots; verifiable fairness; GIWA as the right home) and 5 placeholder names (Madang default).
6. Four unknowns carried to Phase 0 probes (`eth_simulateV1`, Upbit-attested wallet count, window-length tolerance, Kakao-capable embedded wallet).
7. Judgement calls flagged: Flashblocks-dependent ideas scored 3 on feasibility; balance-ranked and streamer ideas scored ≤ 3 on risk.
8. Not shortlisted but kept as P1/P2: rate limits, churn labels, early-holder bonus, Sunrise, Chapters, streaks, battles.
9. Open: whether a 2–3 minute window is tolerable (E1 experiment).
10. S3 addition: Honeypot's raise-or-refund phase becomes optional Pot mode (F41, P2); LP-army vault rejected (09-masterplan/15).

### Phase 9 — Masterplan (CLOSED in S3)
1. 15 documents (brief required 14; 15 = owner-requested Honeypot review) + `facts.json`; all parameters consistent across docs (consistency matrix in `_audit-session-3.md` §C).
2. Product: Madang — batch-cleared opens for Dojang-attested humans, people-threshold graduation, Fairness Card, default creator vesting, own locked CPAMM with 40/30/30 fees and daily holder epochs, soulbound Season Credit on testnet, 48 h timelock + Guardian, permissionless bountied keepers, chain-first trading.
3. Contract spec: 11 singletons/implementations + per-launch clones; worked examples A–E; parameter table with bounds; 17-row Pons-weakness → mitigation table; CreateX deterministic deployment for Sepolia → mainnet address parity.
4. Security: STRIDE per component, MEV/Flashblocks analysis, 7 design-specific abuse scenarios, 20 invariants, 10-layer test plan, two-stage audit + contest, bounty tiers, monitoring, runbook, key policy.
5. Architecture: Next.js 16 + wagmi/viem, Ponder → Neon, SSE realtime, 2-region keepers, scoring job → EAS attestations, three-indicator health model; cost $140–880/mo testnet.
6. Data: on-chain + client event schema, KPI dashboard with Pons baselines, 9 pre-registered experiments (E1–E9) with power estimates.
7. Tokenomics: no platform token (ADR-10); fee model; creator incentives; season points (quality-only) with anti-farming rules and retro slashing.
8. GTM: Korean-first channels, First-100 creators, partnerships (GIWA core, Dojang/Upbit team first), launch-week plan, 6 growth loops, metrics per phase.
9. Legal: moderation policy v1, 16 counsel questions (KR/ID/general), 18-row risk register; roadmap 26 weeks with lean 1–3 builder variants; migration playbook as a config exercise.
10. Decisions: 17 ADRs (16 accepted, ADR-16 proposed); 5 owner decisions pending (name, wallet provider, counsel, audit tier, Season 0 access).

## Decisions
- D5: Graduation liquidity goes to our own permanently-locked constant-product pool (no used DEX on GIWA; v4 BUSL; keeps LP fee routable to holders).
- D6: Dojang/EAS is the identity primitive (creator badges, launch gating, sybil-weighted points); never store PII.
- D7: Product metrics optimise unique attested traders and retention, never raw volume (Phase 5 showed volume is 96% churn).
- D1: Use Sourcify as the verification source of truth for Robinhood Chain (Blockscout blocked for bots).
- D2: Treat the live protocol as "V2" (code name `PonsV2*`, UI `protocol: "v2"`), and refer to the two older Uniswap-V3-range-order factories as Gen1/Gen2. Docs' "active factory" = Gen2.
- D3: Verification of formulas = Python big-int replay of real tx + live-fork forge test; pinned-block replay archived as documentation because the public RPC is non-archival.
- D4: Scanner stores compact records and checkpoints; cohort analysis uses interpolated timestamps from 500k-block anchors.

- D8 (S3): ADR numbering is canonical in `09-masterplan/13-decision-log-and-open-questions.md`; D1–D7 above map to RD-1…RD-4 and ADR-03/04/14.
- D9 (S3): `_findings-private.md` is excluded from anything public; recommend a `.gitignore` entry before pushing.

## Blockers
- Robinhood RPC 429s while the event scan runs; gas measurements deferred (OQ-2.6) — scan finished in S2, measurement not re-run in S3 to avoid low-value load.
- Pools.trade and docs.pools.trade are JS-rendered; need browser observation (OQ-6.2).
- Owner approval needed for ADR-16 before F10 (HolderRewards) is specified in code (roadmap W4–W5).

## Handover notes for the next session (if any)
- Everything is file-based and resumable: start from `_audit-session-3.md` §E (Definition of Done) and `_open-questions.md`.
- Highest-value follow-ups, in order: (1) W1 probes bundle — `eth_simulateV1`, Dojang attestation counts by attester, flashblocks ordering, exact-timestamp re-measure of time-to-graduation on 200 Pons graduations (R6); (2) primary-URL capture for press/competitor facts (OQ-4.1, 6.1, 6.2); (3) Pons module verification lookups (OQ-2.7) and `snipeTaxSeconds` live read (OQ-2.8).
- Toolchain recipe that worked: Foundry 1.5.1 stable tarball at `/tmp/rea-tools/` (`forge test --fork-url`, no anvil), REA 6.7.0 via `npx -y rea-agents@6.7.0`, Python 3 for scans with a browser User-Agent against `rpc.mainnet.chain.robinhood.com`.
