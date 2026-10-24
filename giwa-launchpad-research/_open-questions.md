# Open Questions — everything tagged [UNKNOWN], with status and resolution path

Numbering: `OQ-<phase>.<n>`; 9.x = session 3 additions. Status: **Open** · **Partial** · **Resolved** · **Deferred** (will be answered by a roadmap milestone). Owner: who should close it (R = researcher/engineer in Phase 0, U = you, C = counsel). Risk-register items with score ≥ 12 (10-legal §4) have named actions in the "Action" column per the review rule.

Totals (2026-10-24, end of session 3): 43 tracked — 1 Resolved, 4 Partial, 32 Open, 6 Deferred.

## Phase 1 — Recon

| ID | Question | Status | Resolution path / action | Owner |
|---|---|---|---|---|
| OQ-1.1 | Pons' exact X and GitHub handles/orgs | **Partial** — X handle `@ponsdotfamily` per EH-4 (honeypotfinance.xyz essay, 2026-09-11); GitHub org still unknown | open the sidebar links in a browser session (`agent-browser`) and record `href`s | R |
| OQ-1.2 | "MiCA Whitepaper" link target (404 at `/whitepaper`) | Open | check docs v2 nav and the X account for a hosted PDF; low value | R |
| OQ-1.3 | `/ref/…` referral mechanics (attribution, payout) | Open | capture a token-page HAR with a `?ref=` param; grep token-page chunks (not downloaded) | R |
| OQ-1.4 | `/api/sponsor/x-resolve?handle=` semantics ("sponsored launch for a personality") | Open | observe the create flow's sponsor step in a browser | R |
| OQ-1.5 | Dune dashboard URL behind the analytics page | Open | network capture of `/analytics` (iframe src) | R |

## Phase 2 — Smart contracts

| ID | Question | Status | Resolution path / action | Owner |
|---|---|---|---|---|
| OQ-2.1 | Root cause of the same-day Gen1 → Gen2 redeploy (bytecode differs slightly; Gen2 token adds `_isPairPool` across all fee tiers and max-wallet/max-tx) | Open | diff `PonsLauncherToken` Gen1 (bytecode-only) vs Gen2 source at the `_update` path; look for a public thread from 2026-07-13 | R |
| OQ-2.2 | Launch Locker address | **Resolved** (S2) — `0x267444D099b10fB5Ed7c3Cc7B7c767AdcA574952` [DOCS v2]; not yet re-read on-chain | `cast code` + Sourcify lookup in Phase 0 | R |
| OQ-2.3 | Pair-token addresses/economics for tokenised stocks (NVDA, SPCX, SPY, TSLA, GME…) | **Partial** — ETH/USDG/TAO/cbBTC economics resolved (`G/Q0 = 2.5` each); stock pairs unresolved | enumerate `PairTokenEconomicsUpdated` events from the V2 factory | R |
| OQ-2.4 | Pons audit reports | **Partial** — v2 docs name three audits in progress (SB Security, Dingbats, Pashov), none published | re-check docs "Audits" section monthly | R |
| OQ-2.5 | Exact conditions of `rescuePoolFees` / `rescueGraduation` (Safe powers) | Open | read the functions' require-paths in E2-2 and record in 02 §6 | R |
| OQ-2.6 | Gas profile per action (launchAndBuy, buy, sell, createGraduatedPool, sweepFees) | Open | `cast receipt` on the referenced txs when the RPC is idle; absolute cost is negligible on Orbit, relevant number for us is OP Stack L1 data fee (07 §1) | R |
| OQ-2.7 | Verification status of FeeEscrow `0xd3AFEB2a…`, LaunchDeployer `0x3711ceA4…`, LaunchForwarder `0xe33E9E47…`, LaunchLocker | Open | Sourcify v2 lookups (4 calls) | R |
| OQ-2.8 | Live `snipeTaxSeconds` (source default 15 s; S1 live read 3 s) and `launchEnabled` to date the docs lag | Open | `cast call <factory> "snipeTaxSeconds()(uint256)"` and `"launchEnabled()(bool)"`; record block | R |

## Phase 3 — Web app

| ID | Question | Status | Resolution path / action | Owner |
|---|---|---|---|---|
| OQ-3.1 | Chart library on the token page | Open | download token-page chunks via a browser HAR (not in the 49 captured chunks) | R |
| OQ-3.2 | Turnkey delegated-signing policy (what the server may sign for embedded users) | Open | inspect `/api/turnkey/delegated-public-key` flow in a HAR; relevant to our embedded-wallet decision (13 §3 #2) | R |
| OQ-3.3 | Wallet-screening provider behind "This wallet can't be used on Pons" | Open | HAR of the screening modal; candidates Chainalysis/TRM/Elliptic | R |
| OQ-3.4 | Exact sort enum and cursor format of `/api/launches` | Open | enumerate `sort=` values from the bundle; pagination tokens in captures | R |
| OQ-3.5 | `POST /api/trade/route` body schema and whether it routes via the v4 Universal Router (report §7 labels this 3.4) | Open | HAR of one buy after graduation | R |

## Phase 4 — Backend / infra

| ID | Question | Status | Resolution path / action | Owner |
|---|---|---|---|---|
| OQ-4.1 | Primary sources for the Sep-4-2026 incident (explorer stalled, batcher outbid for blob space, ~40 min tx-success drop) and the Oct-23 degraded-performance banner | Open | resolve press URLs; find Pons status page; cite in 04 §5 before quoting externally | R |
| OQ-4.2 | RPC provider behind `/api/rpc` | Open | error-body fingerprints from the proxy; `x-` headers | R |
| OQ-4.3 | IPFS pinning provider | Open | gateway hostnames in `artwork` responses | R |
| OQ-4.4 | Keeper cadence for sweeps / buybacks / holder payouts | Open | sample `LaunchSwept` and vault `Locked` event timestamps (bounded scan) | R |
| OQ-4.5 | USD price source for ETH/USDG/stock tokens (`quoteUsd`) | Open | compare values against DeFiLlama/Chainlink at capture time | R |

## Phase 5 — Economics

| ID | Question | Status | Resolution path / action | Owner |
|---|---|---|---|---|
| OQ-5.1 | USDG / stock-pair volumes and fees (sample not stratified by pair) | Open | re-run `sample_curve_volume.py` stratified by `pairToken` | R |
| OQ-5.2 | Post-graduation v4 hook fee revenue | Open | scan v4 `Swap` for the 10,427 pool ids (bounded by time; or Dune) | R |
| OQ-5.3 | Holder retention and top-trader concentration | Open | needs transfer-level data — Dune/Nodit when available | R |
| OQ-5.4 | PONS token value capture (protocol fee recipient `0x31eA5b45…2CDB` is a ≈4.8 KB contract) | Open | decompile/inspect selectors with REA `inspect-evm-interface`; follow its outflows | R |

## Phase 6 — Competitors

| ID | Question | Status | Resolution path / action | Owner |
|---|---|---|---|---|
| OQ-6.1 | Pons public-footprint URLs (The Block / Wazz investigation, incident threads) | Open | re-run searches with a tool that returns URLs; store in `raw/captures/press/` | R |
| OQ-6.2 | Primary URLs for competitor fee facts (Pools.trade docs, pump.fun fee page, Zora/Clanker/Flaunch docs) | **Partial** — Pools.trade Crowd Launch facts re-confirmed 2026-10-24 (EH-5), still without a stored primary URL | fetch and snapshot each docs page into `raw/captures/competitors/` before any external quotation | R |
| OQ-6.3 | MemeFab.fun and GIWA.MARKETS fee rates / launch modes | Open | browser observation (JS-rendered) | R |
| OQ-6.4 | Korean-market launchpads beyond GIWA with Korean-first UX | Open | Korean-language search (네이버/디시) for "밈코인 런치패드" | R |

## Phase 7 — GIWA environment

| ID | Question | Status | Resolution path / action | Owner |
|---|---|---|---|---|
| OQ-7.1 | Which hosted indexers (Ponder Cloud, Envio, Goldsky, Subsquid) support chain 91342 | **Deferred** → roadmap W1 | minimal config test per vendor; self-hosted Ponder is the baseline (05-architecture §3) | R |
| OQ-7.2 | Is `UPBIT_KOREA` issuing Dojang attestations to real customers on testnet, and may third-party apps gate on them? Volume of Verified Address attestations (R2, score 12) | **Deferred** → W1; **action: count attestations by attester via EAS logs in W1; if < 500 Upbit-attested wallets, tier-1 faucet becomes the Season 0 gate and `humansFirst` is shortened** | query `Attested` logs on `0x4200…0021` filtered by schema `0x072d75e1…`; ask the GIWA/Dojang team (09-gtm §4 #2) | R / U |
| OQ-7.3 | GIWA mainnet timeline, fee market, and whether a canonical DEX ships at genesis | Open | monitor docs.giwa.io and GIWA announcements monthly; feeds the graduation-adapter decision (ADR-15, OQ-9.2) | U |
| OQ-7.4 | Flashblocks ordering inside a flashblock (FCFS? priority fee?) | **Deferred** → W1 empirical test | send paired txs via the flashblocks RPC and compare inclusion order; design treats preconfs as UX only (R14) | R |
| OQ-7.5 | Blockscout verification API quirks on GIWA | **Deferred** → W7 first deploy | try standard-json via `/api?module=contract&action=verifysourcecode`, fall back to Sourcify | R |

## Phase 8 — Ideation

| ID | Question | Status | Resolution path / action | Owner |
|---|---|---|---|---|
| OQ-8.1 | Does GIWA's op-reth expose `eth_simulateV1`? (needed to copy M18) | **Deferred** → W1 | one RPC call; fallback `eth_call` + `estimateGas` | R |
| OQ-8.2 | Number of Upbit-attested Dojang wallets on Sepolia today | **Deferred** → W1 (same query as OQ-7.2) | | R |
| OQ-8.3 | Tolerable batch-window length for Korean memecoin traders | Open → experiment E1 (90/120/180 s) in Season 0–1 | | R |
| OQ-8.4 | Embedded-wallet provider with KakaoTalk login (Privy / Turnkey / Web3Auth / Korean provider) | Open — **decision #2 in 13 §3** | confirm Kakao OAuth support with each vendor in W1 | U |

## Session 3 additions

| ID | Question | Status | Resolution path / action | Owner |
|---|---|---|---|---|
| OQ-9.1 | Pot mode (F41) presets: window lengths (1 h / 6 h / 24 h?), minimum participants, refund-claim UX, and whether a creator may choose the mode per launch without confounding experiments | Open (P2) | spec during Season 2 planning; E9 compares modes | R |
| OQ-9.2 | Will a canonical concentrated-liquidity DEX reach GIWA mainnet, making a Uniswap adapter (`IGraduationTarget`) preferable to the own pool? | Open | same monitoring as OQ-7.3; decision at mainnet precondition #1 | U |
| OQ-9.3 | Housekeeping: `raw/traces/events_gen2_launches.json.gz` and `events_v2_launches.json.gz` are Git LFS objects (32 MB / 86 MB). Verified downloadable from GitHub LFS on 2026-10-24. Keep `.gitattributes` and the LFS pointers when re-pushing; re-verify after the push. | Open (procedural) | `git lfs ls-files` in the repo after pushing | U |

## Decisions that are not questions

The five owner decisions (name, embedded-wallet provider, counsel engagement, audit tier, Season 0 access) and the ADR-16 approval are listed in `09-masterplan/13-decision-log-and-open-questions.md` §3, not here.
