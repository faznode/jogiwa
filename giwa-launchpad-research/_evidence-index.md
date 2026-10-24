# Evidence Index — ID → source mapping

How to use: every report cites a tag ([ONCHAIN]/[OBSERVED]/[DOCS]/[SOURCE]/[WEB]/[INFERRED]/[NEW]/[UNKNOWN]) and, where an artefact exists, a path. This file assigns stable IDs to those artefacts and sources so a claim can be traced in two hops. Byte sizes and SHA-256 for every file are in `_evidence-inventory.generated.md` (598 files, 33.45 MB). Chains: Robinhood Chain = chainId 4663 (Arbitrum Orbit, ~0.1 s blocks, non-archival public RPC); GIWA Sepolia = chainId 91342 (OP Stack, 1 s blocks).

Session provenance: S1 = 2026-10-23 (agent disconnected after ~27 min; `v0-agent-logs-1`), S2 = 2026-10-24 (~29 min + continuation to commit `a5b567a`; `v0-agent-logs-2`), S3 = 2026-10-24 (this audit/completion pass).

## E0 — Step 0: REA and toolchain

| ID | Source | Tag | Notes |
|---|---|---|---|
| E0-1 | `_rea-playbook.md` | [DOCS]/[OBSERVED] | `rea-agents@6.7.0` pinned; target → tool routing; known limits (no EVM decompiler, no fork, no verified-source fetch) |
| E0-2 | `raw/bytecode/gen1-factory.rea.json`, `gen1-factory.selectors.txt`, `gen1-factory.rea.err` | [OBSERVED] | REA `inspect-evm-interface` on unverified Gen1 factory: 24 selectors, all 4byte-resolve to Gen2 names |
| E0-3 | `raw/bytecode/gen1-locker.rea.json`, `.selectors.txt`, `.err` | [OBSERVED] | same for Gen1 locker |
| E0-4 | `v0-agent-logs-1` steps 7, 15–17 | [OBSERVED] | Foundry 1.5.1 stable tarball works; `anvil` needs GLIBC 2.35 (host 2.34) → fork tests use `forge test --fork-url` |
| E0-5 | `v0-agent-logs-1` steps 12–14 | [OBSERVED] | `rea-agents doctor` output: environment healthy, native engines absent and unneeded |

## E1 — Phase 1: Recon

| ID | Source | Tag | Notes |
|---|---|---|---|
| E1-1 | `raw/docs-snapshots/docs.ponsfamily.com.html`, `.txt`, `.headers.txt` | [DOCS] | v1 docs (direct-to-V3 model, fee table 70/30 since block 8,991,118, legacy 90/10) captured 2026-10-23 |
| E1-2 | `raw/docs-snapshots/docs.ponsfamily.com.v2.txt`, `docs.ponsfamily.com__v_v2.html`, `docs.ponsfamily.com__version_v2.html`, `docs.ponsfamily.com_v2.html`, `docs.ponsfamily.com_v2_.html` | [DOCS] | v2 docs (147 KB): protocol section, safety, deployed addresses (incl. Launch Locker `0x267444D0…`), audits in progress (SB Security, Dingbats, Pashov), fee rates, pending takeover |
| E1-3 | `raw/docs-snapshots/ponsfamily.com.launchpad.html`, `ponsfamily.com.headers.txt` | [OBSERVED] | app shell; headers show Vercel, CSP frame-src for Turnkey, WalletConnect/Reown, Cloudflare Turnstile |
| E1-4 | `raw/docs-snapshots/ponsfamily.com_{analytics,builders,plp,profile,support,whitepaper,legal_privacy,legal_terms,robots.txt,sitemap.xml}.html` + `ponsfamily.com.{analytics,builders,plp,support}.txt` | [OBSERVED] | route inventory; `/whitepaper` 404 (OQ-1.2); robots `/ref/` noindex (OQ-1.3) |
| E1-5 | `v0-agent-logs-1` steps 112–134 (browser observation of launchpad, token page, holder fee-sharing module, create flow, footer) | [OBSERVED] | screenshots were in `/tmp` and are lost; text snapshots summarised in 01 §2–4 and 03 §4 |
| E1-6 | `v0-agent-logs-1` steps 101–110 (search summaries: The Block / Wazz investigation of the $18.43M bundling operation, Sep-4 "halt", Pools.trade rivalry, Lemon.fun, NOXA) | [WEB] | result URLs were not returned by the search tool → OQ-6.1 |
| E1-7 | honeypotfinance.xyz essay "Pons: The Fastest Company Ever to Reach $100M Annualized Revenue" (2026-09-11) | [DOCS] | names Pons X handle `@ponsdotfamily` and founder origin (Berachain/RootsFi); partially resolves OQ-1.1; see EH-4 |
| E1-8 | `01-recon/facts.json` | derived | machine-readable Phase 1 facts |

## E2 — Phase 2: Smart contracts

| ID | Source | Tag | Notes |
|---|---|---|---|
| E2-1 | `raw/sources/0x*.sourcify.json` (15 files) | [ONCHAIN] | Sourcify v2 verification responses for chain 4663 (match type, verifiedAt, compiler) |
| E2-2 | `raw/sources/tree_v3_PonsV2LaunchFactory/contracts/src/v2/` | [SOURCE] | verified V2 tree: `PonsV2LaunchFactory`, `PonsV2BondingCurve`, `PonsV2LauncherToken`, `hooks/PonsV2MemeHook`, `PonsV2BuybackVault`, `PonsV2GraduationExecutor`, `PonsV2GraduationGuard`, `PonsV2LaunchLocker`, `libraries/PonsV2BondingCurveMath`, `libraries/PonsV2GraduationMath`, `interfaces/ILaunchpadV2` (solc 0.8.35) |
| E2-3 | `raw/sources/tree_v3_PonsV2MemeHook/`, `tree_v3_PonsV2BuybackVault/`, `tree_v3_PoolManager/` | [SOURCE] | hook, vault and Uniswap v4 PoolManager trees |
| E2-4 | `raw/sources/tree_PonsLaunchFactory/`, `tree_PonsLaunchLocker/`, `tree_PonsLauncherToken/`, `tree_Proxy_0x0Bd7/` | [SOURCE] | Gen2 factory/locker/token (evmVersion cancun, viaIR) and the WETH9 transparent proxy |
| E2-5 | `raw/abis/0x*.abi.json` (15 files) | [ONCHAIN]/[OBSERVED] | ABIs from Sourcify metadata; V2 ABI also recovered from bundle chunk `14-4wv1j-s73i.js` (E3-1) |
| E2-6 | `raw/bytecode/gen1-factory.hex`, `gen1-locker.hex` | [ONCHAIN] | Gen1 runtime bytecode (48,387 hex chars vs Gen2 48,709) |
| E2-7 | `02-contracts/verification/forge/test/PonsV2CurveReplay.t.sol`, `test-output.txt`, `foundry.toml` | [OBSERVED] | pinned-block replay test — archived as documentation because the public RPC prunes state (RD-3) |
| E2-8 | `02-contracts/verification/forge/test/PonsV2CurveLiveDifferential.t.sol`, `test-output-live.txt` | [ONCHAIN] | **3/3 pass**: `test_liveBuyMatchesFormula`, `test_liveSellMatchesFormula`, `test_graduationAllocationIdentity` (live fork of chain 4663) |
| E2-9 | Python big-int replay of two real `CurveBuy` txs (`v0-agent-logs-1` steps 68–70) | [ONCHAIN] | tokensOut, fee, creator tax and 618 bps snipe tax reproduced exactly |
| E2-10 | live `cast call` reads: `getLaunchConfig(0)`, `curve.phantomQuote()`, hook policy, module addresses, Safe owners/threshold (`v0-agent-logs-1` steps 48–55; `v0-agent-logs-2` steps 31–40) | [ONCHAIN] | values recorded in `02-contracts/facts.json` and 02 report §2, §6 |
| E2-11 | `02-contracts/report.md`, `formula-sheet.md`, `incidents-and-security.md`, `facts.json` | derived | Phase 2 deliverables |
| E2-12 | Gas profile | [UNKNOWN] | deferred (RPC 429 during scan) → OQ-2.6 |

## E3 — Phase 3: Web app

| ID | Source | Tag | Notes |
|---|---|---|---|
| E3-1 | `raw/bundles/js/*.js` (49 Next.js chunks) and the remaining files in `raw/bundles/` (52 total) | [OBSERVED] | stack markers: Next.js App Router/RSC, React 19, TanStack Query (8 s staleTime), valtio, wagmi/viem, Reown AppKit, Turnkey, SIWE, Turnstile, Ably; v2 ABI in `14-4wv1j-s73i.js`; API route strings |
| E3-2 | `raw/captures/api_*.json` + `.json.headers` (17 endpoints probed, 2026-10-23) | [OBSERVED] | response schemas for launches, trending, pinned, sparklines, ticks, deployers, identities, profile, session, human, notifications, tokens/verified, tokens/migrations, trade/route, rpc, glossary/Errors |
| E3-3 | `03-webapp/api-spec.yaml` | derived | OpenAPI 3 description of 29 route handlers + `balancesapi.ponsfamily.com` |
| E3-4 | `v0-agent-logs-2` steps "Analyzed bundle stack markers", "Extracted API routes and schemas" | [OBSERVED] | method used for E3-1/E3-2 |
| E3-5 | `03-webapp/report.md`, `facts.json` | derived | Phase 3 deliverables |

## E4 — Phase 4: Backend / infra inference

| ID | Source | Tag | Notes |
|---|---|---|---|
| E4-1 | response headers in `raw/captures/*.headers` and `raw/docs-snapshots/*.headers.txt` | [OBSERVED] | Vercel edge cache (`age`, `x-vercel-*`), `cache-control` per endpoint, Cloudflare on balances API |
| E4-2 | tick keys `txhash:logIndex` mixing curve and v4 swaps (`api_launches_ticks_*.json`) | [OBSERVED] | evidence for an own log-decoding indexer |
| E4-3 | `feeSweepOperator` EOA `0xa1018c1D…cA83` and Safe `0x263ed295…19Dd` (E2-10) | [ONCHAIN] | hot-key keeper + 2-of-3 Safe without timelock |
| E4-4 | Sep-4-2026 incident and Oct-23 degraded-performance banner (search summaries; banner observed in E1-5) | [WEB]/[OBSERVED] | primary URLs → OQ-4.1 |
| E4-5 | `04-backend-infra/report.md`, `facts.json` | derived | inferred architecture with confidence per component |

## E5 — Phase 5: Economics and on-chain behaviour

| ID | Source | Tag | Notes |
|---|---|---|---|
| E5-1 | `raw/traces/events_gen1_launches.json` (1,895 launches) | [ONCHAIN] | compact records `[block, txhash, token, deployer]` |
| E5-2 | `raw/traces/events_gen2_launches.json.gz` — **Git LFS object** `bc6e432f…1ddb`, 32,460,763 bytes (266,221 launches) | [ONCHAIN] | local copy is the 133-byte LFS pointer; object verified downloadable from GitHub LFS on 2026-10-24 |
| E5-3 | `raw/traces/events_v2_launches.json.gz` — **Git LFS object** `9e9b23d0…5a98`, 85,697,944 bytes (709,489 launches) | [ONCHAIN] | same; pointer locally, object present on GitHub |
| E5-4 | `raw/traces/events_v2_graduations.json` (10,427 `PoolGraduated`), `block_timestamps.json` (500k-block anchors), `scan_meta.json` (latest block 96,275,278 @ 2026-10-23T22:09:59Z), `scan.log`, `scan_v2.log` | [ONCHAIN] | produced by `02-contracts/verification/scan_events_v2.py` |
| E5-5 | `raw/traces/curve_sample.json`, `curve_sample.log` | [ONCHAIN] | 240-curve stratified sample of `CurveBuy`/`CurveSell` (median curve 0.054 ETH, 3.5 traders, 96% sold back) |
| E5-6 | `05-economics/cohort-stats.json`, `cohort_analysis.py`, `daily_launches.csv` | derived | cohorts: graduation rate 1.47%, median time-to-graduation 250 s, creator concentration |
| E5-7 | `05-economics/sample_curve_volume.py`, `volume-estimate.json`, `fee-model.csv` | derived | ETH-pair volume/fee extrapolation (~891k ETH, heavy-tailed) and per-$1M fee model |
| E5-8 | `05-economics/report.md`, `facts.json` | derived | Phase 5 deliverables |

## E6 — Phase 6: Competitors

| ID | Source | Tag | Notes |
|---|---|---|---|
| E6-1 | Pools.trade (Uniswap Labs): Instant Launch vs Crowd Launch (4 h bidding window, $10k FDV or full refund), 0 platform fee, 0.25% LP fee with 0.20% auto-compounding locked liquidity | [WEB] | search summaries S1 + re-confirmed S3 (2026-10-24: "four-hour window… $10,000 FDV… otherwise all bids are refunded"); primary URL → OQ-6.2 |
| E6-2 | Lemon.fun: curve → V3, configurable | [WEB] | S1 summary |
| E6-3 | NOXA: direct single-sided V3, 50/50 fees | [WEB] | S1 summary |
| E6-4 | pump.fun: 1.25% + 0.45% app fee, 0.30% creator share | [WEB] | S2 summary |
| E6-5 | four.meme: 1%, 18 BNB graduation | [WEB] | S2 summary |
| E6-6 | LetsBONK: 1.5%, BONK burn | [WEB] | S2 summary |
| E6-7 | Zora creator coins (1% split 50/20/4/1/5/20), Clanker (single-sided v4, 20% protocol), Flaunch (0–100% creator split streamed via NFT, bid-wall buybacks) | [WEB] | S2 summaries |
| E6-8 | giwa.markets (5 launch modes, EN/KO, $GIWA burn engine, 80%-supply graduation) | [OBSERVED] | fetched directly in S2 |
| E6-9 | MemeFab.fun (listed in GIWA ecosystem DeFi category) | [DOCS] | details unknown → OQ-6.3 |
| E6-10 | `06-competitors/report.md` (32-row feature matrix, 12 unsolved pains, §8 Honeypot addendum), `facts.json` | derived | Phase 6 deliverables |

## E7 — Phase 7: GIWA environment

| ID | Source | Tag | Notes |
|---|---|---|---|
| E7-1 | `raw/giwa/docs_giwa_llms-full.txt` (265,715 bytes) | [DOCS] | docs.giwa.io corpus: chain params, predeploys, Dojang, UP ID, Flashblocks, bridge |
| E7-2 | `raw/giwa/docs_giwa_sitemap.md` | [DOCS] | docs index |
| E7-3 | `raw/giwa/probe_1.txt` | [ONCHAIN] | live RPC probes on chain 91342: chainId `0x164ce`, latest block 39,450,770, base fee 332 wei, code checks at WETH9/Multicall3/Permit2/CreateX/Safe/EntryPoint/EAS/Dojang/UP ID/Pyth |
| E7-4 | `raw/giwa/dex_candidates.txt` | [ONCHAIN] | community Uniswap-style deployments found, each with 1–6 txs → no canonical DEX |
| E7-5 | Dojang attester and schema UIDs (14-appendix §F) | [ONCHAIN]/[DOCS] | `UPBIT_KOREA` `0x09B170CA…49C6`, `TESTNET_FAUCET` `0x63CCe2b5…6121`, `VerifiedAddress` schema `0x072d75e1…6e08` |
| E7-6 | `07-giwa-env/report.md`, `facts.json` | derived | fact sheet, infra inventory, build-vs-reuse, testnet strategy |

## E8 — Phase 8: Ideation

| ID | Source | Tag | Notes |
|---|---|---|---|
| E8-1 | `08-ideation/ideas.csv` | [NEW] | 44 ideas × 6 criteria, totals, shortlist flags, pains addressed |
| E8-2 | `08-ideation/shortlist-specs.md` | [NEW] | 12 one-page specs S1–S12 |
| E8-3 | `08-ideation/report.md` (M01–M33 classification, P1–P16 pains, thesis, names), `facts.json` | derived | |

## E9 — Phase 9: Masterplan

| ID | Source | Notes |
|---|---|---|
| E9-1 … E9-15 | `09-masterplan/01-…` through `15-honeypot-pot2pump-review.md` | see 14-appendix §G for status per document |
| E9-A | `_audit-session-3.md` | audit of phases 1–8 and docs 01–12 with findings and fixes |

## EH — Honeypot Finance review (session 3, owner request)

| ID | Source | Tag | Notes |
|---|---|---|---|
| EH-1 | `raw/captures/honeypot/x-article-1938243521556676824.fxtwitter.json`, `.md` | [DOCS] | X Article "Honeypot Finance 2.0 is Coming" (2025-06-26), full block text; 11 image blocks not captured |
| EH-2 | `raw/captures/honeypot/docs_honeypot_llms-full.txt`, `docs_honeypot_sitemap.md` | [DOCS] | Pot2Pump introduction / how it works / key benefits / ABI (`createPair`, `depositRaisedToken`, `refundRaisedToken`) |
| EH-3 | honeypotfinance.xyz home (fetched 2026-10-24) | [OBSERVED] | editorial + "technology licensing" site; no launch product linked |
| EH-4 | honeypotfinance.xyz `/articles/pons-why-i-backed-ozzy` (2026-09-11, republished 2026-09-30) | [DOCS] | Pot2Pump in past tense; Pons handle and founder background |
| EH-5 | Pools.trade Crowd Launch re-confirmation (search, 2026-10-24) | [WEB] | used for the H2 comparison |

## Known gaps in the evidence base (carried to `_open-questions.md`)

1. Session-1 screenshots are lost; browser observations survive only as log text (E1-5).
2. Competitor fee facts are search summaries without primary URLs (E6-1…E6-7) → OQ-6.1/6.2.
3. Gas profile per Pons action not captured (E2-12) → OQ-2.6.
4. The two largest raw dumps are Git LFS objects; anyone cloning without LFS gets pointers (E5-2/E5-3). Verified present on GitHub LFS on 2026-10-24 → OQ-9.3 is a housekeeping reminder to keep `.gitattributes` when re-pushing.
