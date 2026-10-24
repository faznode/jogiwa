# Phase 7 — GIWA Environment Study (GIWA Sepolia, chainId 91342)

Evidence: live RPC probes on 2026-10-24 (`raw/giwa/probe_1.txt`, `dex_candidates.txt`) [ONCHAIN]; official docs corpus `raw/giwa/docs_giwa_llms-full.txt` downloaded from https://docs.giwa.io/llms-full.txt [DOCS]; Blockscout API v2 at https://sepolia-explorer.giwa.io [OBSERVED]; viem 2.57.10 `giwaSepolia` definition [OBSERVED unpkg].

## 1. Chain fact sheet

| Fact | Value | Evidence |
|---|---|---|
| Operator | Dunamu (Upbit) — "Powered by UPbit"; testnet ToS names 두나무 주식회사 as provider and states the testnet is a service independent from Upbit and unrelated to virtual-asset trading | [DOCS] intro, testnet ToS |
| Stack | OP Stack; execution client **op-reth** (RPC reports `reth/v2.3.0`); op-geth sunset; fault proofs via kona-client, currently **permissioned** dispute games | [ONCHAIN] `web3_clientVersion`; [DOCS] Upgrade 19 notice |
| Hard-fork level | Karst / Upgrade 19 applied on testnet 2026-07-06 (Osaka EVM); GasPriceOracle reports Ecotone + Fjord on, Isthmus getters not present on this oracle version | [DOCS]; [ONCHAIN] GPO calls |
| Block time | **1.0 s** (measured over 1,000 blocks) | [ONCHAIN] |
| Block gas limit | 60,000,000 | [ONCHAIN]/[DOCS] |
| **Per-transaction gas cap** | **16,777,216** (Osaka EIP-7825); deposits exempt | [DOCS] Upgrade 19 |
| Contract size | standard EIP-170 24,576 bytes (no override documented) | [DOCS] no mention → assume default |
| Precompiles | standard + `P256VERIFY` (gas raised to 6,900 at Karst); `ecPairing` limited to 300 pairs | [DOCS] Upgrade 19 |
| Fees | EIP-1559 execution fee + L1 security (data) fee; observed baseFee 332 wei, gasPrice ≈ 0.001 gwei, priority 0.001 gwei; L1 fee scalars baseFeeScalar 1,368 / blobBaseFeeScalar 801,949 against Sepolia L1 prices → L1 fee negligible on testnet; paymaster (stablecoin gas) planned | [ONCHAIN]; [DOCS] fees page |
| Flashblocks | preconfirmations ≤ 200 ms via Flashblocks-aware RPC `https://sepolia-rpc-flashblocks.giwa.io` (`pending` tag on `eth_call`, `eth_estimateGas`, `eth_getBalance`, …); rate-limited, "not for production"; self-host via github.com/giwa-io/node | [DOCS] flashblocks page |
| Finality / bridge | L2 soft-confirmed in 1 s; L1 data posting per batcher; withdrawals to Ethereum ≈ 7 days (dispute game) | [DOCS] bridging |
| Public RPC | `https://sepolia-rpc.giwa.io` (rate-limited; docs recommend node providers for production) | [DOCS] |
| Node providers | **Nodit** (nodes + indexed Web3 Data API, free starter), **QuickNode** | [DOCS] node-providers |
| Explorer | Blockscout `https://sepolia-explorer.giwa.io` with working `/api/v2` (stats, search, counters, smart-contracts) and legacy `/api` for verification | [OBSERVED] |
| Faucets | faucet.giwa.io 0.005 ETH / 24 h; Nodit faucet 0.01 ETH / 24 h | [DOCS] |
| Activity | 39.45M blocks, 464M txs, 158M addresses, 2.8M txs/day on the day of capture — quest/bot-driven | [OBSERVED] Blockscout stats |
| Wallet | GIWA Wallet "in development"; MetaMask via explorer add-network button; viem `giwaSepolia` chain (OP Stack config, blockTime 1000, Blockscout URLs, multicall3) in viem ≥ 2.57 → wagmi works out of the box | [DOCS]; [OBSERVED] |
| Oracles | Pyth on GIWA Sepolia `0x2880aB155794e7179c9eE2e38200202908C17B43` | [DOCS] oracles |
| Bridges | native sepolia-bridge.giwa.io, Superbridge | [DOCS] |
| Security | Security Council and Bug Bounty pages exist but are **empty placeholders**; permissioned fault proofs; L1 admin roles (ProxyAdminOwner `0x0B26…CB9E`, SystemConfigOwner `0x3d58…2DB7`, Guardian `0xb033…98A0`) | [DOCS] contracts |
| Testnet terms | resets/reorgs possible without notice; test tokens have no value and cannot be transferred out | [DOCS] testnet ToS |

## 2. Deployed infra inventory (GIWA Sepolia)

| Need | Present? | Address | Evidence |
|---|---|---|---|
| WETH9 | Y (predeploy) | `0x4200000000000000000000000000000000000006` | [ONCHAIN] |
| Multicall3 | Y | `0xcA11bde05977b3631167028862bE2a173976CA11` | [ONCHAIN] |
| Permit2 | Y (28k txs) | `0x000000000022D473030F116dDEE9F6B43aC78BA3` | [ONCHAIN] |
| CREATE2: Arachnid proxy / CreateX / OP Create2Deployer | Y / Y / Y | `0x4e59…956C` / `0xba5E…a5Ed` / `0x13b0…beF2` | [ONCHAIN] |
| Safe 1.4.1 (singleton factory, SafeL2, ProxyFactory, MultiSend) | Y | `0x914d…3d7`, `0xfb1b…1EA`, `0x4e1D…c67`, `0x9987…EDa` | [ONCHAIN]/[DOCS] |
| ERC-4337 EntryPoint v0.6 / v0.7 | Y / Y | `0x5FF1…2789` / `0x0000…a032` | [ONCHAIN] |
| EAS SchemaRegistry / EAS | Y (predeploys) | `0x4200…0020` / `0x4200…0021` | [ONCHAIN]/[DOCS] |
| Dojang (Scroll, Indexer, SchemaBook, AttesterBook, Resolver) | Y | `0xd507…17B9`, `0x9C9B…90ec`, `0x78cB…3AD6`, `0xDA28…28B6`, `0x6920…7F9e` | [DOCS] |
| UP ID / Upbit Web3 Names (`UPNameRegistry`) | Y | `0x091D…9628` | [DOCS] |
| Pyth | Y | `0x2880…7B43` | [DOCS] |
| Stablecoin | **No official stable**; bridged test tokens only (docs example L2 token `0xB11E…4c38`) | — | [DOCS] |
| Canonical Uniswap v2/v3/v4 | **No** — canonical addresses have no code; ~10 community `UniswapV2Factory`/`UniswapV3Factory`/`PoolManager` deployments with **1–6 txs each**; busiest `SwapRouter` 2,667 txs | `raw/giwa/dex_candidates.txt` | [ONCHAIN]/[OBSERVED] |
| Token lists | none | — | [UNKNOWN] |
| Indexers | Nodit Web3 Data API (GIWA Sepolia supported); Ponder/Subsquid/Envio/Goldsky/The Graph: **not mentioned** in docs → self-hosted Ponder/Subsquid against our own RPC is the safe assumption (OQ-7.1) | [DOCS] |

### Build vs reuse decisions

| Component | Decision | Rationale |
|---|---|---|
| Graduation AMM | **Build our own minimal constant-product pool (clean-room), permanently locked, fee-bearing** | no used DEX exists; Uniswap v4 core is BUSL-licensed and canonical v4 is absent; a self-owned pool lets us keep LP fee > 0 and route it to holders (Phase 8 idea) and removes the Pons "hook captures everything" asymmetry; v2-style CPAMM is ~300 lines and fuzzable |
| Later composability | expose a v2-compatible `getReserves/swap` surface + optional migrator to whichever DEX becomes canonical on mainnet | keeps aggregator compatibility |
| WETH / native | native ETH on the curve; WETH predeploy for the pool leg | matches Pons behaviour, avoids approvals |
| Multicall / Permit2 | reuse | present and battle-tested |
| CREATE2 | CreateX (salted, cross-chain deterministic) | same addresses on mainnet |
| Multisig | Safe 1.4.1 via SafeProxyFactory + **our own OpenZeppelin TimelockController** | Pons lesson: no timelock |
| Identity | **Dojang Verified Address (EAS)** + UP ID names | unique to GIWA; see §3 |
| Oracle | Pyth ETH/USD for display | no stables; mainnet pairs may add KRW-stable later |
| Indexer | self-hosted Ponder (primary) + Nodit Data API (secondary/backfill) | docs only guarantee Nodit; resilience requirement from Phase 4 |
| RPC | self-hosted op-reth (Flashblocks-aware) + Nodit/QuickNode fallbacks | public RPC rate-limited |

## 3. Dojang — what it is and how we use it

- **What**: Dunamu's attestation service built on **EAS** (predeployed at `0x4200…0021`). Issues on-chain attestations binding off-chain facts to wallets without PII. Attestation types: **Verified Address** (schema `bool isVerified`, UID `0x072d75e1…6e08`), **Balance Root** (merkle root of all user balances at a snapshot), **Verified Balance** (per-user balance with proof), **Verified Code** (off-chain OTP hash). Attesters: **UPBIT KOREA** (ID `0xd99b42e7…3034`, address `0x09B1…49C6`) and **TESTNET FAUCET** (ID `0xaa92f8c1…d678`, address `0x63CC…6121`). [DOCS]
- **How contracts read it**: call `DojangScroll` (`0xd507…17B9`) with the attester ID + subject address (docs ship a `VerifiedAddressAccessControl` example with `DOJANG_SCROLL` and `ATTESTER_ID` constants); all attestations are indexed on-chain by `DojangIndexer` (`0x9C9B…90ec`) for queries. Front-ends use viem against the same contracts. [DOCS]
- **Testnet reality**: Playground issues Dojang via the **TESTNET FAUCET** attester to anyone (quest step "Dojang 발급 → VerifiedToken 클레임 → UP ID 발급"), so on testnet it proves *process*, not *humanity*. The Upbit Korea attester is the real sybil-resistant signal; whether it is issued on testnet to real Upbit customers is [UNKNOWN] (OQ-7.2).
- **Product uses**: (1) "Verified creator" badge and higher launch limits for Upbit-attested wallets; (2) anti-sybil weighting of testnet points (attested = 1.0, unattested = 0.2); (3) attested-only launch modes ("Dojang-gated fair launch"); (4) Verified Balance could later gate "whale-proof" allocations (balance ≤ X); (5) UP ID names as display identity instead of 0x addresses.

## 4. Ecosystem and audience

- Ecosystem (docs/ecosystem lists, [DOCS] web search 2026-10-24): launchpads **GIWA.MARKETS** and **MemeFab.fun**; DeFi XPayr, XPAD Terminal, JAKDU, Gama; consumer TILE(기와), NARU, HANOK, Kachi.xyz; infra ZKProofport, UMUL, JEBI, ForeDex, BARO, Mergit, Pabal; official GIWA Playground quests (sepolia-playground.giwa.io); Bojagi (ZK private transfers) and UP ID from Dunamu.
- Audience facts [DOCS] web search 2026-10-24: Korean retail is CEX-centric (Upbit listing pumps), on-chain participation is a small minority; communities run on Telegram + influencers, older cohorts on Naver/YouTube; Kimchi premium weakened; **ICOs remain prohibited**; Virtual Asset User Protection Act phase 1 in force; Digital Asset Basic Act (issuance/disclosure/licensing) stalled in the National Assembly as of Apr 2026.
- Channels: KakaoTalk open chats and Telegram for Korean communities, Discord/X for global; bilingual (KO/EN) is table stakes (GIWA.MARKETS already does it).

### Legal / compliance flags (questions for counsel, not advice)
1. Does operating a memecoin launchpad for Korean residents constitute virtual-asset "issuance"/"brokerage" under 특금법 / VAUPA, even on testnet with valueless tokens? Does a points/season program with future-token hints count as an ICO-like offering?
2. Mainnet: would a bonding-curve sale by Korean creators be an unregistered offering? Geo-fencing strategy (Pons uses geo gating for equity pairs).
3. Trademark: "GIWA" is Dunamu's brand; a third party already runs "GIWA.MARKETS" and a "$GIWA" token — we must not imply Dunamu/Upbit endorsement; naming must avoid "GIWA/기와/Upbit" marks.
4. Testnet ToS: tokens have no value and may be reset; our ToS must mirror this and forbid secondary trading of points.
5. Content/IP: memes using celebrities/brands; Korean defamation law is strict (criminal) — moderation policy needed.
6. Data: Korean PIPA if we store KakaoTalk/X handles; Dojang avoids PII on-chain — keep it that way.

## 5. Gap analysis — Robinhood Chain vs GIWA, and what to adapt

| Dimension | Robinhood Chain (Pons context) | GIWA Sepolia | Adaptation |
|---|---|---|---|
| Stack | Arbitrum Orbit, ~100 ms blocks, centralized sequencer, Nitro RPC with `eth_simulateV1` | OP Stack, 1 s blocks + 200 ms Flashblocks preconfs, op-reth | design the snipe window in **flashblock units**, not seconds; use `pending` tag for instant UI |
| Quote assets | ETH, USDG, tokenized stocks | ETH only (no official stable) | ETH-only at launch; stable/KRW-stable pairs are a mainnet option |
| DEX | Uniswap v4 canonical + hooks | none used | own locked pool |
| Identity | wallet screening, geo | **Dojang/EAS, UP ID** | identity-aware launch modes (unique) |
| Value | real money | **testnet, no value** | points/season economy (§6) |
| Audience | US retail via Robinhood brand | Korean + global builders; Upbit halo | KO-first UX, Korean community rituals |
| Tx limits | none notable | 16.78M gas per tx | batch launch+buy stays < 1M gas; avoid giant airdrop loops |
| Fees | real ETH fees | ~free | spam/sybil pressure higher → rate limits, Dojang weights, deposits |
| Admin | Safe 2-of-3, no timelock | Safe 1.4.1 available | Safe + timelock from day 1 |

## 6. Testnet strategy — making valueless trading meaningful

**Problem**: testnet ETH is free; 2.8M txs/day on GIWA are already quest-farmed; anything with a leaderboard gets botted within hours.

**Design — "Seasons" (4-week) with scarce, non-transferable scoring:**
1. **Scarce quote**: launches and trades use a faucet-rationed **season credit** (soulbound ERC-20 minted per wallet per day, weighted by Dojang attestation) *in addition to* test ETH; the curve accepts only season credit. This re-introduces opportunity cost.
2. **Score what we want to learn**, not volume: unique counterparties, holding duration, graduation with ≥ N distinct buyers, curation accuracy (did tokens you bought early graduate?), creator retention (repeat launches with ≥ X holders). No points for raw volume or tx count.
3. **Sybil resistance**: Dojang (Upbit attester > faucet attester), per-wallet credit caps, graph clustering (shared funding sources, same-block behaviour — the exact signals Phase 5 measured on Pons), delayed scoring with retro-slashing of clusters.
4. **Quests with narrative**: weekly meme themes (Korean pop-culture calendar), squad battles (guild-vs-guild graduation races), creator streaks.
5. **Measurement plan**: cohort dashboards per season — D1/D7/D30 retention, bundled-graduation share, sell-back ratio, unique traders per graduation, share of attested wallets, bot-cluster share; A/B of launch modes (classic curve vs time-boxed vs Dojang-gated) by rotating default mode weekly; survey + Telegram feedback.
6. **Exit criteria to mainnet-ready**: ≥ 3 seasons, bundled-graduation share < 30%, ≥ 40% of graduations with ≥ 25 distinct attested buyers, zero critical incidents, audit done.

## 7. Open questions
- OQ-7.1 Which hosted indexers (Ponder Cloud, Envio, Goldsky, Subsquid) actually support chain 91342 — test with a minimal config.
- OQ-7.2 Is the UPBIT KOREA Dojang attester issuing on testnet to real customers, and under what terms may third-party apps read/gate on it?
- OQ-7.3 Mainnet timeline, fee market and whether canonical Uniswap/Aerodrome-style DEX will be deployed at genesis.
- OQ-7.4 Flashblocks ordering guarantees inside a flashblock (FCFS?) — affects snipe-window design; needs sequencer docs or empirical test.
- OQ-7.5 Blockscout verification API quirks (standard-json via `/api?module=contract&action=verifysourcecode`) — test on first deploy.
