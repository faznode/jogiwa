# Phase 8 — Differentiation & Ideation

Status: CLOSED · Date: 2026-10-24 · Inputs: Phases 1–7 reports and facts.json files · Outputs: this report, `ideas.csv` (44 scored ideas), `shortlist-specs.md` (12 one-page specs), `facts.json`.

Evidence tags: [ONCHAIN] verified on Robinhood Chain or GIWA Sepolia, [SOURCE] read in verified Pons source, [OBSERVED] seen in the Pons app/HAR, [DOCS] Pons/GIWA documentation, [WEB] third-party web source (search summary unless a URL is given), [INFERRED] reasoned from evidence, [NEW] original design choice.

---

## 1. Mechanic classification — MUST-COPY / IMPROVE / DROP / REPLACE

Every Pons mechanic (Phase 2–4) and every notable competitor mechanic (Phase 6), classified against our goals: a fresh, Korean-first, GIWA-native launchpad where graduation is a community event and not a bot event (Phase 5 §3: median time-to-graduation 250 s, 100% of sampled graduations had the first buy inside the launch tx).

| # | Mechanic | Where seen | Class | Why / what changes |
|---|---|---|---|---|
| M01 | Constant-product curve with a virtual quote reserve (`phantomQuote`), all supply minted to the curve | Pons V2 [SOURCE][ONCHAIN], pump.fun | MUST-COPY | Simple, verified math (02 formula-sheet §3–4, 3/3 live-fork differential tests pass). Keep the same closed form; make `Q0`, `G`, `S` chain-config. |
| M02 | Price continuity at graduation (pool seeded at the curve's final price; 71.43% / 20.41% / 8.16% supply split for `G/Q0 = 2.5`) | Pons V2 [ONCHAIN] (02 §6) | MUST-COPY | Prevents the graduation price gap that early pump.fun suffered; holders cannot be front-run by a mispriced pool. |
| M03 | Fees on the quote leg only (input on buys, output on sells) | Pons V2 [SOURCE] | MUST-COPY | Keeps fee accounting in one asset; extend the same rule to our pool. |
| M04 | One-tx `launchAndBuy` with pinned `expectedEconomics` | Pons V2 [SOURCE][OBSERVED] | MUST-COPY (as "launch + opening order") | Creator UX is excellent; but the creator's own buy becomes a vesting-locked allocation (I11) and clears in the batch window with everyone else (I01). |
| M05 | Permissionless `graduate()` with auto-graduation on the last buy | Pons V2 [SOURCE] | MUST-COPY | Keeper independence; we add a bounty (I28). |
| M06 | Pull-based fee claim for creators | Pons V2 (`claimCreatorFees`) [SOURCE] | IMPROVE | Keep pull, remove the hot `feeSweepOperator` dependency for routine income (04 §3): fees accrue claimable in place, anyone can push. |
| M07 | 70 / 30 creator / protocol fee split | Pons V2 [ONCHAIN] | IMPROVE → 40 / 30 / 30 | Holders become a fee party (I21) because Phase 5 §5 shows 96% of curve inflow is sold back: the product must reward staying, not passing through. Creator still earns more than pump.fun's 0.30% effective share [WEB]. |
| M08 | Snipe tax with time decay (99% in the launch second, halving per `shift`) + exemption list (deployer, creator allowlist) | Pons V2 [SOURCE] (02 §3) | REPLACE | Exemptions are invisible in the UI (03 §6; 06 pain #2) and the tax does not stop bundled graduations (05 §3). Replaced by the opening batch window (I01) and the public Launch Manifest (I04); no exemptions exist at all. |
| M09 | Creator tax 0–10% chosen per launch | Pons V2 [ONCHAIN] | IMPROVE | Keep configurable but cap at 3% and print it on the Fairness Card; the reputation score penalises >1% taxes that coincide with dumps. |
| M10 | Buyback slice of the fee (`buybackQuoteBalance`, max-price-impact 3%) | Pons V2 [SOURCE] | DROP | Adds keeper complexity and a price-manipulation surface for ~0.9% of volume; holder fee share (I21) is a cleaner "give back". |
| M11 | Post-graduation revenue capture via a Uniswap v4 hook with `poolFee = 0` | Pons V2 [SOURCE] | REPLACE | No usable Uniswap on GIWA (07 §3), v4 is BUSL and hooks are an audit burden. Replace with our own permanently-locked CPAMM that charges 1% on the quote leg and routes it 40/30/30. |
| M12 | Graduation threshold = fixed quote amount only (4.2 ETH) | Pons V2, pump.fun, four.meme | REPLACE | Add a people threshold (I03): `distinct attested buyers ≥ N`, with a time fallback to avoid deadlock. |
| M13 | Multi-pair launches (ETH, USDG, tokenised NVDA/SPCX/SPY) | Pons V2 [ONCHAIN] (05 §2) | DROP (for now) | No stablecoin or RWA exists on GIWA Sepolia (07 §3). Keep `pairToken` as a config field for mainnet; testnet quote is the soulbound Season Credit (I36). |
| M14 | Serial-deployer badge (counts launches) | Pons app [OBSERVED] | IMPROVE | Count is the wrong signal: serial deployers do not graduate more often (05 §4). Replace with a quality-based Creator Reputation Score (I13) backed by Dojang (I29). |
| M15 | "Pons Verified" admin allow-list for tokens | Pons app [OBSERVED] | REPLACE | Centralised and opaque. Verified status comes from Dojang attestations + objective on-chain thresholds, published as our own EAS attestations anyone can read. |
| M16 | Wallet screening modal / geo-gating of equity pairs | Pons app [OBSERVED] | MUST-COPY (adapted) | A Korea-adjacent product needs screening and a restricted-jurisdiction policy from day one (10-legal). Geo-gating of stock pairs is moot until pairs exist. |
| M17 | Embedded wallets (Turnkey) + SIWE sessions + Turnstile | Pons app [OBSERVED] | IMPROVE | Keep wallet-agnostic wagmi + an embedded option; add KakaoTalk/Naver social login via the embedded-wallet provider (Korean retail is CEX-centric, 07 §6) — provider decision is open (OQ). |
| M18 | `eth_simulateV1` trade preview + custom-error glossary | Pons app [OBSERVED] (03 §3) | MUST-COPY | Best-in-class UX detail; cheap to copy; verify GIWA op-reth supports `eth_simulateV1` (07 OQ). |
| M19 | Indexer-driven lists with Ably realtime invalidation | Pons app [OBSERVED] (04 §1–2) | IMPROVE | Same shape, but trading must work from chain reads alone and health is split chain-vs-indexer (04 §6; I27). |
| M20 | Hot-EOA keepers for sweeps, buybacks and holder payouts | Pons [ONCHAIN] (04 §3) | REPLACE | Permissionless, bountied keeper functions (I28); our bots are merely first in line. |
| M21 | 2-of-3 Safe owner without timelock | Pons V2 [ONCHAIN] (02 incidents) | REPLACE | Safe + 48 h timelock + in-app pending-change notice (I26). |
| M22 | Trending by volume | Pons app [OBSERVED] | REPLACE | Volume is 96% churn (05 §5) → quality-ranked discovery (I18) with churn labels (I19). |
| M23 | Crowd Launch: 4-hour uniform-price auction with a $10k FDV floor or full refund | Pools.trade [WEB] (06 §1) | IMPROVE | The uniform-price idea is right but 4 h kills memecoin energy; we use a 2–3 minute batch window (I01) and keep a refund path when the people threshold is missed. |
| M24 | Auto-compounding locked liquidity (0.20% of 0.25% LP fee) | Pools.trade [WEB] | IMPROVE | Our pool is locked by construction; 30% of fees go to holders instead of compounding into liquidity nobody can withdraw anyway. |
| M25 | Creator revenue share streamed to an NFT; 0–100% split | Flaunch [WEB] | DROP (as NFT) / IMPROVE (streaming) | Streaming claimability yes (I12); tradeable revenue NFTs invite securities questions in Korea (10-legal). |
| M26 | Creator coins with multi-party fee split (Zora 50/20/4/1/5/20) | Zora [WEB] | IMPROVE | We split to creator / holders / protocol only; referrers earn from the protocol share and only after quality gates (I40). |
| M27 | Platform-token burn engines ($GIWA burn, BONK burn) | GIWA.MARKETS, LetsBONK [WEB] | DROP | No platform token (09-masterplan/08). Burn engines create a token-price dependency and regulatory exposure. |
| M28 | Five launch modes | GIWA.MARKETS [WEB] | IMPROVE | Modes confuse new users; we ship one default (batch-first, humans-first) and expose two optional modes later (I10, P2). |
| M29 | Points for tx count / volume (GIWA quest meta) | GIWA ecosystem [OBSERVED] (07 §5) | REPLACE | Quality-only points (I37) + retroactive cluster slashing (I39). |
| M30 | Comments / chat on token pages | pump.fun [WEB] | DROP (v1) | Moderation cost in Korean + English with no revenue; KakaoTalk/Telegram deep links instead (I24, I34). |
| M31 | Livestreams on token pages | pump.fun [WEB] | DROP (v1) | Legal and moderation exposure; revisit as verified-streamer collabs (I35, P2). |
| M32 | Creator vesting / dev-lock options | four.meme / several [WEB] | IMPROVE → default | Vesting is opt-in elsewhere; here it is the default and unavoidable for the creator allocation (I11). |

| M33 | Pot2Pump: uniform-price raise to a target with full refund on failure; participants become LPs in an ALM-managed concentrated-liquidity vault (50/40/5/5 LP split) | Honeypot Finance [DOCS] (dormant since 2025–26; 09-masterplan/15) | IMPROVE (raise-or-refund → optional Pot mode F41, P2) / DROP (LP vault) | A refund path is a cleaner failure outcome than a 24 h fallback for community pre-commits; the LP vault needs a CL DEX + ALM that GIWA lacks (07 §3), looks like a pooled investment (10-legal Q3), exposes retail to impermanent loss, and makes liquidity withdrawable — contrary to S9. |

Summary: 8 MUST-COPY, 12 IMPROVE, 6 DROP, 7 REPLACE (one mechanic split). Session 3 added M33 (Honeypot Pot2Pump, owner request): IMPROVE for the raise-or-refund phase, DROP for the participant-LP vault — full reasoning in 09-masterplan/15-honeypot-pot2pump-review. The three REPLACEs that define the product: snipe tax → batch window + manifest; quote-only graduation → people threshold; v4 hook → locked CPAMM with holder share.

## 2. User pains and abuse vectors (Phases 2–6)

| ID | Pain / abuse vector | Evidence | Who is hurt |
|---|---|---|---|
| P1 | Bundled launch+buy+graduate in one block/second | 05 §3: 31% of graduations < 60 s, 100% of sampled graduations buy in the launch tx | human buyers (never get in), creators who want a real community |
| P2 | Invisible snipe-tax exemptions | 02 §3 `snipeTaxExempt`, 03 §6 not rendered | traders (asymmetric information) |
| P3 | Fake/churn volume drives trending | 05 §5: median sell-back 96%; volume sorts [OBSERVED] | traders, honest creators |
| P4 | Creator dumps on the curve | 05 §5: 48% of deployers sell on the curve | holders |
| P5 | Graduate-and-forget: no lifecycle after the pool | 02 §7, 06 pain #5 | holders, creators |
| P6 | Keeper-dependent income (sweeps, payouts) | 04 §3 hot EOAs | creators, holders |
| P7 | Admin without timelock | 02 incidents, 04 §4 | everyone |
| P8 | Indexer treated as chain truth (explorer/indexer outage read as halt) | 04 §5 Sep-4 event | traders, operator reputation |
| P9 | No identity layer: serial spam deployers, sybil farming | 05 §4: 25 addresses > 1,000 launches each; 07 §5 quest farming | discovery, incentives budget |
| P10 | English-only or machine-translated UX for a Korean audience | 06 pain #10, 07 §6 | Korean creators/traders |
| P11 | Testnet tokens have no value → no real signal | 07 §7 | the team (cannot learn) |
| P12 | Namespace confusion / trademark around "GIWA" | 06 pain #12, 07 §6 | the brand |
| P13 | Whale dominance of thin curves | 05 §3 single-buyer graduations | small holders |
| P14 | Sandwich / ordering games on 1-s blocks with 200 ms flashblocks | 07 §1 [INFERRED] | traders |
| P15 | Content abuse: impersonation, idol likeness, stock tickers, politics | 06 §4, 10-legal | platform (legal), victims |
| P16 | Hidden-fee drift via admin parameter changes | 02 `setLaunchConfig` powers [SOURCE] | creators mid-launch |

Each shortlisted idea in `shortlist-specs.md` names the pains it closes; the mapping is summarised in §4.

## 3. Idea generation and scoring

44 ideas across 9 axes are in `ideas.csv` (launch 10, creator 7, trader 7, trust 6, community 5, incentives 5, discovery 2, ecosystem 2). Each is scored 1–5 on six criteria exactly as the brief specifies; for build cost and abuse/regulatory risk, **5 = cheap / low risk** so that higher is always better; `total` is the unweighted sum (max 30).

Score distribution: 28 (×3), 27 (×7), 26 (×6), 25 (×6), 24 (×7), 23 (×7), 22 (×2), 21 (×1), 19 (×3). Axis means: launch 24.6, creator 25.1, trader 23.9, trust 23.8, community 23.2, incentives 26.0, discovery 25.0, ecosystem 22.0.

Scoring notes (judgement calls flagged so they can be argued):
- Feasibility on GIWA was scored 5 whenever the idea only needs EAS/Dojang reads, our own contracts, or Blockscout/Nodit data (07 §2–4). Ideas needing Flashblocks ordering guarantees (I05, I22) got 3 because only the dedicated flashblocks RPC exposes 200 ms state and sequencer policy is not documented [DOCS].
- Testnet measurability was scored 5 when the idea produces an on-chain counter we can A/B by season (window lengths, thresholds, caps), 3 when it needs survey or off-chain data.
- Abuse/regulatory risk ≤ 3 for anything that ranks people by exchange balances (I30), involves streamers (I35) or Flashblocks-dependent fairness claims (I05).

## 4. Shortlist (12) and justification

Fifteen ideas scored ≥ 25 and were marked `Y`; three pairs overlap in mechanism, so they are merged, giving 12 specs:

| # | Shortlisted feature | Ideas | Total | Pains closed | Why it makes the cut |
|---|---|---|---|---|---|
| S1 | Opening Batch Window | I01 | 26 | P1, P13, P14 | The single mechanism that turns "first second wins" into "everyone pays the same price". It replaces the snipe tax entirely. |
| S2 | Humans-First Window (Dojang-gated, capped) | I02 | 28 | P1, P9, P13 | The only launchpad feature that is impossible off GIWA: Upbit-attested humans get the first minutes. |
| S3 | People-Threshold Graduation | I03 | 28 | P1, P13 | Makes graduation a community fact (≥ N distinct attested buyers) instead of a capital fact; directly attacks the 250-second median. |
| S4 | Fairness Card (Launch Manifest + pre-trade view) | I04 + I20 | 27 / 26 | P2, P16, P4 | Zero hidden exemptions; every parameter the contract will enforce is hashed on-chain and shown before the first buy. |
| S5 | Creator Vesting by Default | I11 | 28 | P4 | Dev-dump protection that needs no judgement: creator allocation cliffs at graduation and streams for 30 days. |
| S6 | Streaming Pull-Based Fees | I12 | 25 | P6 | Income that never depends on a hot key; anyone can push with a bounty. |
| S7 | Creator Reputation (score + Dojang/UP ID verified badge) | I13 + I29 | 27 / 27 | P9, P4, P3 | A portable, quality-based identity for creators; feeds limits, featured slots and the humans-first tiers. |
| S8 | Quality-Ranked Discovery | I18 | 27 | P3 | Trending by distinct attested buyers and retention, with churn-detected tokens demoted. |
| S9 | Holder-Paid Liquidity (locked CPAMM, 40/30/30) | I21 | 25 | P5, P10-adjacent | Our own pool is mandatory on GIWA (07 §3); routing 30% of pool fees to time-weighted holders is the post-graduation lifecycle. |
| S10 | Timelocked Admin with In-App Notice | I26 | 25 | P7, P16 | Cheap, visible governance hygiene that Pons lacks. |
| S11 | Squads with Treasuries | I31 | 25 | P10, retention | Korean crypto culture is community-first (open chats, galleries); squads make that structure native and measurable. |
| S12 | Season Economy (soulbound credit + quality-only points + retro slashing) | I36 + I37 (+ I39) | 27 / 27 / 26 | P9, P11 | Solves the testnet value problem: scarce, rationed credit is the only curve quote, points reward counterparties and retention, and clusters are slashed after the season. |

Not shortlisted but kept as P1/P2 candidates in the PRD: I08 launch rate limits (26), I19 churn labels (26, folded into S8 as an output), I38 early-holder fee share (26, folded into S9 epochs), I39 retro slashing (merged into S12), I42 "buyer #" social proof (27, pure UX of S3 — included in the S3 spec), I28 permissionless keepers (25, an architecture rule rather than a feature), I07 Sunrise scheduling, I14 Chapters, I16 streaks, I32 battles, I34 Korean-first UX (a product rule, not a feature; it is a P0 requirement in the PRD).

Why 12 and not 8: S1–S5 and S9 are one coherent launch design and cannot be shipped separately without re-opening a pain; S6, S10 are cheap; S7, S8, S11, S12 are what make the testnet measurable. Removing any of S7/S8/S12 would leave us unable to tell humans from farms, which Phase 7 §5 identifies as the central constraint on GIWA.

## 5. Differentiation Thesis

**Thesis.** Pons proved that a launchpad can process 36,000 launches a day, and also proved what that produces: a 1.47% graduation rate, graduations that complete in 250 seconds inside bundled transactions, curves that are 96% sold back within minutes, and a trending page ranked by churn (05 §1–5). GIWA is the first chain where a launchpad can tell a person from a script at the contract level, because Upbit and the GIWA faucet already attest wallets through Dojang (07 §2). We will build the launchpad where graduation is a community event: every launch opens at one fair price for attested humans, graduates only when enough distinct people hold it, locks creator supply by default, and pays holders for staying — in Korean first, measured on a season economy whose quote asset is scarce even on a testnet. We do not compete on launch count; we compete on the number of real people per graduated token, which is the metric Pons' own data says it cannot win.

**Pillar 1 — Who we serve: Korean communities, not bots.** Korean retail is CEX-centric and community-driven (07 §6); Dojang gives us Upbit-grade humanity proofs without PII. Humans-first windows, Korean-first copy and number formats, Kakao/Telegram-native sharing and squads turn communities into the unit of growth. Measured by: attested buyers per graduation, squad retention.

**Pillar 2 — Why we win: fairness you can verify, not fairness you are told.** Batch-cleared opens, a hashed Launch Manifest with zero exemptions, people-threshold graduation, default vesting, timelocked admin and a permanently-locked pool whose fees stream to holders. Each is a contract rule a trader can read on a Fairness Card before buying, not a moderation policy. Measured by: bundled-graduation share < 30% (Pons ~100% of sample), sell-back ratio < 0.8, zero undisclosed parameter changes.

**Pillar 3 — Why GIWA is the right home.** Free gas, 1-second blocks and 200 ms Flashblocks make batch windows and epoch-based holder rewards cheap; EAS + Dojang + UP ID are native identity rails; the ecosystem lacks a canonical DEX, so owning the post-graduation pool is a necessity that becomes a moat; and GIWA's quest-farmed testnet (158M addresses, 07 §5) is exactly the environment where quality-only points and retro slashing demonstrate a defensible measurement model before mainnet. Measured by: points-per-attested-human vs points-per-wallet, mainnet-readiness exit criteria (11-roadmap).

### Candidate names and taglines (placeholders only — trademark search required, see 10-legal)

| Working name | Meaning | Tagline (EN) | Tagline (KO) |
|---|---|---|---|
| **Madang** (마당) | courtyard where a village gathers | "Where tokens meet their people." | "토큰이 사람을 만나는 마당." |
| Ondol (온돌) | the warm floor | "Warm launches. No cold rugs." | "따뜻한 런치, 차가운 러그는 없다." |
| Jangteo (장터) | traditional open market | "The fair market for fair launches." | "공정한 런치를 위한 공정한 장터." |
| Haedoji (해돋이) | sunrise | "Every launch gets a sunrise." | "모든 런치에 해돋이를." |
| Bulkkot (불꽃) | spark / firework | "Light it fair." | "공정하게 불을 붙이다." |

`Madang` is used as the placeholder throughout 09-masterplan. All five avoid the word "GIWA" (06 pain #12: namespace and trademark risk).

## 6. What is still [UNKNOWN] after this phase

- Whether GIWA Sepolia's op-reth exposes `eth_simulateV1` (needed to copy M18) — test in Phase 0 of the roadmap.
- Dojang Verified Address volume: how many Upbit-attested wallets exist on Sepolia today (determines tier-2 window sizing) — query the EAS indexer / Blockscout in Phase 0.
- Whether a 2–3 minute batch window is tolerable to Korean memecoin traders (vs. Pools.trade's 4 h, which is clearly too long) — A/B 90 s / 120 s / 180 s in Season 0 (07-data-analytics experiment plan).
- Embedded-wallet provider with KakaoTalk login support (Turnkey, Privy, Web3Auth, or Korean providers) — open question for the user.
