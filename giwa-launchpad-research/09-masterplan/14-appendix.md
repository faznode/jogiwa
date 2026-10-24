# 14 — Appendix

A. Evidence index pointer · B. Glossary (EN / KO / ID) · C. Pons contract reference · D. Pons endpoint reference · E. Pons parameter card · F. GIWA Sepolia reference · G. Document map

## A. Evidence index

- Curated ID → source mapping: `_evidence-index.md` (E0 playbook, E1 recon, E2 contracts, E3 web app, E4 backend, E5 economics, E6 competitors, E7 GIWA, E8 ideation, EH Honeypot).
- Machine-generated inventory of every artefact with byte size and SHA-256: `_evidence-inventory.generated.md` (598 files, 33.45 MB, excluding Foundry build output).
- Tag legend used in all reports: **[ONCHAIN]** verified from chain data (chain, address, block/tx given) · **[OBSERVED]** seen in browser/network/bundle (capture path given) · **[DOCS]** official docs/blog (URL given) · **[SOURCE]** read in verified Solidity source · **[WEB]** third-party web source or search summary · **[INFERRED]** reasoned from evidence · **[NEW]** original design choice · **[UNKNOWN]** unresolved → `_open-questions.md`.
- Verification artefacts: `02-contracts/verification/forge/test-output-live.txt` (3/3 live-fork differential tests pass: buy, sell, graduation-allocation identity), `02-contracts/verification/scan_events_v2.py` + `raw/traces/scan_meta.json` (full-population event scan, latest block 96,275,278 on 2026-10-23T22:09:59Z).

## B. Glossary

| Term (EN) | KO | ID | Meaning in this plan |
|---|---|---|---|
| Launch | 런치 | peluncuran | Creating a token + curve + vault in one transaction (F16) |
| Opening Batch Window (OBW) | 오프닝 윈도우 | jendela pembukaan | 120 s period where all deposits clear at one uniform price, pro-rata, with tier caps (S1) |
| Clearing price | 체결가 | harga kliring | The single price at which the window settles |
| Humans-first window | 사람 우선 구간 | jendela manusia-dulu | OBW + first 10 min where only tier ≥ 1 wallets may buy, capped (S2) |
| Tier 0 / 1 / 2 | 등급 0/1/2 | tingkat 0/1/2 | No attestation / GIWA-faucet-attested / Upbit-attested wallet (ADR-04) |
| Dojang | 도장 | Dojang | GIWA's EAS-based attestation layer (Upbit Korea, testnet faucet attesters) |
| Attested buyer | 인증 구매자 | pembeli teratestasi | A tier ≥ 1 recipient counted once per curve toward `N` |
| People threshold `N` | 사람 수 조건 | ambang jumlah orang | Minimum distinct attested buyers for graduation (default 25) |
| Graduation | 졸업 | graduasi | Curve → permanently locked pool when `trackedQuote ≥ G` and (`N` met or 24 h fallback) |
| `Q0` / `G` / `S` | 가상 준비금 / 졸업 기준 / 총공급 | cadangan virtual / ambang graduasi / total pasokan | Virtual quote reserve / real-quote graduation threshold / fixed supply (1e9) |
| Fairness Card | 공정성 카드 | Kartu Keadilan | UI rendering of the on-chain Launch Manifest (S4) |
| Launch Manifest | 런치 매니페스트 | manifes peluncuran | Creator-chosen immutable parameters hashed and emitted at launch |
| Creator vesting | 크리에이터 베스팅 | vesting kreator | Creator allocation cliffs at graduation, streams 30 d, expires 30 d if never graduated (S5) |
| Holder rewards / epochs | 홀더 보상 / 에포크 | imbalan pemegang / epok | Daily distribution of the 30% holder fee share (S9; ADR-16 proposes TWAB) |
| Season Credit (SC) | 시즌 크레딧 | Kredit Musim | Soulbound testnet quote asset, rationed daily by tier, burned at season end (S12) |
| Season / badge | 시즌 / 배지 | musim / lencana | 4-week cycle; soulbound EAS badge with no monetary value |
| Squad | 스쿼드 | squad | Community group with a treasury and shared leaderboard (S11, P1) |
| Pot mode | 모금 모드 | mode pot | Optional raise-to-target-or-refund launch mode (F41, P2, ADR-15) |
| Keeper / bounty | 키퍼 / 바운티 | keeper / bounti | Anyone who calls a permissionless maintenance function and is paid 5 bps (ADR-11) |
| Timelock / Guardian | 타임락 / 가디언 | timelock / penjaga | 48 h delayed admin / pause-only emergency role (ADR-09) |
| Sell-back ratio | 되팔기 비율 | rasio jual-balik | Quote sold out of a curve ÷ quote bought in, within 1 h (Pons median 0.96) |
| Bundled graduation | 번들 졸업 | graduasi bundel | Graduation whose first buy is inside the launch tx (Pons: 100% of sample) |
| Flashblocks | 플래시블록 | Flashblocks | GIWA 200 ms preconfirmations via a dedicated RPC; UX-only in our design |
| Clean-room | 클린룸 | clean-room | We copy behaviour and math into specs, never code (ADR-01) |

## C. Pons Family contract reference (Robinhood Chain, chainId 4663)

All verification via Sourcify v2 (RD-1). Full spec sheets in `02-contracts/report.md` §2–4; ABIs in `raw/abis/`; sources in `raw/sources/tree_*`.

### C.1 V2 — live protocol (deployed 2026-08-03, block 26,841,846, deployer EOA `0xFdDE5a1E3cDF791Da71E49F817D70C7ceD72CC36`)

| Role | Contract | Address | Verified |
|---|---|---|---|
| Factory, launch config, fee policy, graduation orchestrator | `PonsV2LaunchFactory` | `0x7eD598BcEf8bd9Edd8C97A195C6d13f40801EC7e` | Sourcify exact match, solc 0.8.35 |
| Per-launch bonding curve (clone) | `PonsV2BondingCurve` | per launch (e.g. replay target `0xb9c425ff…`, formula-sheet §3) | source in factory tree |
| Per-launch token (clone) | `PonsV2LauncherToken` | per launch | source in factory tree |
| Uniswap v4 hook capturing post-graduation fees (`poolFee = 0`) | `PonsV2MemeHook` | `0xE5e702641Ea86F4ae6cC3cDaeD2B886f976Be044` | Sourcify match, 0.8.35 |
| Creator-funded buyback vault (5-year lock) | `PonsV2BuybackVault` | `0x42df2a798f82289E177311362e8f5ccC45c1219c` | Sourcify match, 0.8.35 |
| Pull-payment fee escrow | `FeeEscrow` | `0xd3AFEB2a57f70eF218Aa82451c51B2fb0416Ac9e` | [UNKNOWN] OQ-2.7 |
| Graduation executor (dust handling) | `PonsV2GraduationExecutor` | `0xC7819B64A1dAECD7eC19856d026cb14EfBd89046` | source bundled in factory tree |
| Graduation guard | `PonsV2GraduationGuard` | `0xf5695117b99B6f6401e67d4195BD653628176C6C` | source bundled |
| Launch deployer (CREATE2 helper) | `PonsV2LaunchDeployer` | `0x3711ceA4feaDE896C913C68F01Eda97Cb06D1A42` | [UNKNOWN] OQ-2.7 |
| Launch forwarder | `PonsV2LaunchForwarder` | `0xe33E9E479dF8802cb0866d5d05258bEc4cF62948` | [UNKNOWN] OQ-2.7 |
| Launch locker (docs v2 "Deployed addresses") | `PonsV2LaunchLocker` | `0x267444D099b10fB5Ed7c3Cc7B7c767AdcA574952` | [DOCS]; not re-read on-chain |
| Fee sweep / buyback keeper (hot EOA) | `feeSweepOperator` | `0xa1018c1D9655292A2dE0F7dEa9a0F848EaA8cA83` | EOA |
| Owner | Gnosis Safe 1.4.1, 2-of-3, **no timelock** | `0x263ed295dAFaE1d9AAdD6E56c4B6F9f38eE019Dd` (owners `0x1320a2b0…`, `0x3825E7b3…`, `0xfA31fE75…`) | [ONCHAIN] |
| Protocol fee recipient (contract, ≈4.8 KB) | — | `0x31eA5b453A6Cd60F36203830DE046ff32DeC2CDB` | [UNKNOWN] OQ-5.4 |
| Uniswap v4 PoolManager | `PoolManager` | `0x8366a39CC670B4001A1121B8F6A443A643e40951` | Sourcify (tree_v3_PoolManager) |
| Uniswap v4 PositionManager | `PositionManager` | `0x58daec3116aae6D93017bAAea7749052E8a04fA7` | [ONCHAIN] |
| Permit2 | — | `0x000000000022D473030F116dDEE9F6B43aC78BA3` | canonical |

V2 pair tokens (`phantomQuote` / `graduationThreshold`): ETH `1.68 / 4.2`; USDG `0x5fc5360D0400a0Fd4f2af552ADD042D716F1d168` `3,236 / 8,090`; TAO `0xf3081494B87e8D5fb7960f066E931D1D0e6E3d67` `14.999 / 37.4975`; cbBTC `0xCEC185eB182c47d1bA1EFc84e6959e18cd620Be4` `0.052739 / 0.13184752`; WETH proxy `0x0Bd7D308f8E1639FAb988df18A8011f41EAcAD73` not approved as a pair. Ratio `G/Q0 = 2.5` in every case [ONCHAIN 02 formula-sheet §2]. Tokenised-stock pairs (NVDA, SPCX, SPY…) exist in the UI; addresses unresolved (OQ-2.3).

### C.2 Gen1 / Gen2 — legacy direct-to-Uniswap-V3 factories (2026-07-13; disabled)

| Role | Gen1 (unverified, bytecode via REA) | Gen2 (verified; the one v1 docs describe) |
|---|---|---|
| Factory | `0x0c37a24F5D23A486FA692d1500881d698B1F77a4` | `0xA5aAb3F0c6EeadF30Ef1D3Eb997108E976351feB` |
| Locker (LP NFT lock + fee split) | `0x31ca5E101941A93A7DD6d0497928700625CF54B5` | `0x736D76699C26D0d966744cAe304C000d471f7F35` |
| Deployer EOA | — | `0xda4bCee76B29EFEc9697Fcf663601c2042043968` |
| Token implementation | `PonsLauncherToken` (PONS itself: `0x39dBED3a2bd333467115dE45665cC57F813C4571`, launched block 8,963,150 by `0xB9F5f4Ea…`; pool `0x10CC6BD38112cAc182db90B6a71d8Bb5939526bA`) | `PonsLauncherToken` (adds `_isPairPool` detection across fee tiers, max-wallet/max-tx) |

Shared Uniswap V3 infrastructure used by Gen1/Gen2: `UniswapV3Factory 0x1f7d7550B1b028f7571E69A784071F0205FD2EfA`, `NonfungiblePositionManager 0x73991a25C818Bf1f1128dEAaB1492D45638DE0D3`, `SwapRouter 0xCaf681a66D020601342297493863E78C959E5cb2`, `Quoter 0x33e885eD0Ec9bF04EcfB19341582aADCb4c8A9E7`, WETH9 behind `TransparentUpgradeableProxy 0x0Bd7D308…` (impl `0xC6B81b429797E0f555440b70cD99e032D7AE947e`).

## D. Pons endpoint reference (studied in Phase 3)

Spec: `03-webapp/api-spec.yaml` (OpenAPI 3; 29 same-origin route handlers + `balancesapi.ponsfamily.com`). Captures: `raw/captures/api_*.json(.headers)`.

| Group | Endpoints |
|---|---|
| Discovery | `GET /api/launches` (sort/cursor), `/api/launches/trending`, `/api/launches/pinned`, `/api/launches/sparklines`, `/api/launches/ticks` (1h interval candles keyed `txhash:logIndex`) |
| Identity / profile | `/api/deployers`, `/api/identities`, `/api/profile/{address}`, `/api/profile/nonce`, `POST /api/session` (SIWE), `/api/profile/identity`, `/api/profile/username`, `/api/profile/assign`, `/api/profile/verified`, `/api/human` (Turnstile) |
| Compliance | `POST /api/legal/acceptance`, geo `countryCode` → `equityPairsRestricted`, wallet-screening modal (provider OQ-3.3) |
| Realtime / notifications | `/api/notifications`, `/api/push/subscription`; Ably channels `token.created/updated` |
| Tokens | `/api/tokens/verified` (admin allow-list), `/api/tokens/migrations` |
| Trading | `POST /api/trade/route` (schema OQ-3.5), `POST /api/rpc` (JSON-RPC proxy; upstream OQ-4.2), `eth_simulateV1` previews, `/api/glossary/Errors` (custom-error → copy) |
| Media | `/api/artwork?src=` (resizer), `/api/ipfs/image` |
| Social | `/api/sponsor/x-resolve?handle=` (OQ-1.4), `/api/x/callback` |
| Wallet | `/api/turnkey/delegated-public-key` (policy OQ-3.2), `/api/client-errors/wallet` |
| Balances | `balancesapi.ponsfamily.com` (separate service behind Cloudflare) |

## E. Pons V2 parameter card (what we measured against)

| Parameter | Value | Tag |
|---|---|---|
| Supply `S` | 1,000,000,000 × 1e18, all minted to the curve | [SOURCE] |
| Virtual reserve `Q0` (ETH pair) | 1.68 ETH | [ONCHAIN] |
| Graduation threshold `G` | 4.2 ETH real quote (`G/Q0 = 2.5` for all pairs) | [ONCHAIN] |
| Supply split at graduation | 71.43% sold / 20.41% pool / 8.16% locked remainder; price ×12.25 from launch; continuity exact | [ONCHAIN] (live-fork test) |
| Curve fee | 1% of quote leg; 30% protocol / 70% creator | [ONCHAIN] |
| Creator tax | 0–10% per launch, 100% to creator | [ONCHAIN] |
| Buyback | optional; 50% of creator bucket buys the launch token and locks 5 years (docs say "burn") | [SOURCE] |
| Snipe tax | start 99%, halving decay; `snipeTaxSeconds` source default 15, live value read 3 (OQ-2.8); ≤ 32 exemptions per launch | [SOURCE]/[ONCHAIN] |
| Post-graduation | Uniswap v4 pool, LP fee 0, hook fee 1% same split | [SOURCE] |
| Launch fee | 0.0005 ETH | [ONCHAIN] |
| Caps hard-coded | fees ≤ 10%, total ≤ 20%, protocol share ≤ 50% | [SOURCE] |
| Governance | Safe 2-of-3, no timelock; 3-day timelock only on CTO fee-recipient override; 7-day graduation rescue | [ONCHAIN]/[SOURCE] |
| Population (2026-07-13 → 10-23) | 709,489 V2 launches / 419,622 creators / 10,427 graduations (1.47%); Gen2 266,221; Gen1 1,895 | [ONCHAIN] scan |

## F. GIWA Sepolia reference (chainId 91342)

Probed 2026-10-24 (07-giwa-env §1–2, `raw/giwa/`). OP Stack on op-reth v2.3.0, Karst/Osaka EVM, 1.0 s blocks, 60M block gas, **16,777,216 per-tx gas cap**, 24,576-byte contract limit, base fee ≈ 332 wei. RPC `https://sepolia-rpc.giwa.io` (rate-limited); Flashblocks `https://sepolia-rpc-flashblocks.giwa.io` (200 ms preconfs; `pending` on `eth_call/estimateGas/getBalance`); explorer Blockscout `https://sepolia-explorer.giwa.io`; providers Nodit, QuickNode.

| Component | Address |
|---|---|
| WETH9 | `0x4200000000000000000000000000000000000006` |
| Multicall3 | `0xcA11bde05977b3631167028862bE2a173976CA11` |
| Permit2 | `0x000000000022D473030F116dDEE9F6B43aC78BA3` |
| CreateX | `0xba5Ed099633D3B313e4D5F7bdc1305d3c28ba5Ed` |
| Arachnid CREATE2 deployer | `0x4e59b44847b379578588920cA78FbF26c0B4956C` |
| OP Create2Deployer | `0x13b0D85CcB8bf860b6b79AF3029fCA081AE9beF2` |
| Safe 1.4.1 (singleton factory / Safe / SafeL2 / proxy factory / MultiSend / MultiSendCallOnly) | `0x914d7Fec…643d7` / `0x69f4D178…2938` / `0xfb1bffC9…91EA` / `0x4e1DCf7A…ec67` / `0x998739BF…9EDa` / `0xA1dabEF3…102B` |
| ERC-4337 EntryPoint v0.6 / v0.7 | `0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789` / `0x0000000071727De22E5E9d8BAf0edAc6f37da032` |
| EAS SchemaRegistry / EAS | `0x4200000000000000000000000000000000000020` / `0x4200000000000000000000000000000000000021` |
| Dojang Scroll / Indexer / SchemaBook / AttesterBook / VerifiedAddressResolver | `0xd5077b67…17B9` / `0x9C9Bf298…90ec` / `0x78cBb341…3AD6` / `0xDA282E89…28B6` / `0x692009FE…7F9e` |
| Dojang attester UPBIT_KOREA | `0x09B170CA2A006081042992bCE7379B85a02149C6` (id `0xd99b42e7…3034`) |
| Dojang attester TESTNET_FAUCET | `0x63CCe2b569A7bC35895ee24306c1512fefc06121` (id `0xaa92f8c1…d678`) |
| Dojang schema `VerifiedAddress` | `0x072d75e18b2be4f89a13a7147240477481c4b526d5795802acba59046b426e08` |
| Dojang schema `BalanceRoot` / `VerifiedBalance` | `0x369faa9c…db52` / `0x77bf88ca…ab5e9` |
| UP ID name registry | `0x091D00004f21eb2Fc30964A8a4995692d9b49628` |
| Pyth | `0x2880aB155794e7179c9eE2e38200202908C17B43` |
| L1 Sepolia: OptimismPortal / L1StandardBridge / SystemConfig / DisputeGameFactory | `0x956962C3…C78A` / `0x77b2ffc0…A7E7` / `0x8352825b…C984` / `0x37347caB…54F6` |
| L1 Sepolia: batcher / batch inbox / proposer / challenger | `0x1cAaaA58…6cd7` / `0x00Ef2e3B…F544` / `0x032D5bd4…097c` / `0x4160344a…eBFF` |

Absent on GIWA Sepolia (build-vs-reuse, 07 §2–3): canonical Uniswap v2/v3/v4 (only community deployments with 1–6 txs), official stablecoin, token lists, oracles beyond Pyth → own locked CPAMM (ADR-03) behind `IGraduationTarget` (ADR-15).

## G. Document map

| # | File | Status |
|---|---|---|
| 01 | `01-executive-summary.md` (EN + ID) | complete |
| 02 | `02-prd.md` | complete; F41 + F38 note added S3 |
| 03 | `03-smart-contract-spec.md` | complete; S3 edits: deposit limit bucket, `IGraduationTarget`, split bounds (ADR-17), TWAB note (ADR-16 proposed) |
| 04 | `04-security-plan.md` | complete |
| 05 | `05-system-architecture.md` | complete |
| 06 | `06-frontend-ux-spec.md` | complete |
| 07 | `07-data-analytics.md` | complete; E9 added S3 |
| 08 | `08-tokenomics-incentives.md` | complete |
| 09 | `09-go-to-market.md` | complete |
| 10 | `10-legal-compliance-risk.md` | complete |
| 11 | `11-roadmap.md` | complete; Gantt date nit fixed S3 |
| 12 | `12-mainnet-migration-playbook.md` | complete |
| 13 | `13-decision-log-and-open-questions.md` | written S3 |
| 14 | `14-appendix.md` (this file) | written S3 |
| 15 | `15-honeypot-pot2pump-review.md` | written S3 (owner request) |
| — | `_audit-session-3.md` | audit of phases 1–8 and docs 01–12 |
