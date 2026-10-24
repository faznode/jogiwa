# 15 — Honeypot Finance "2.0" / Pot2Pump Review

Requested by the owner (session 3): review https://x.com/honeypotfinance/article/1938243521556676824 and decide whether anything in it belongs in the Madang feature set, with reasons either way. Date of review: 2026-10-24.

**Verdict in one line: include selectively — adopt two ideas (one as a P0 architecture rule, one as an optional P2 launch mode), fold one into an existing P2 feature, reject three mechanics on evidence, and do not pursue Honeypot as a partner or licensor.** Recorded as ADR-15 (13-decision-log §1).

---

## 1. What was reviewed and how (evidence)

| ID | Source | Tag | Capture |
|---|---|---|---|
| EH-1 | X Article "Honeypot Finance 2.0 is Coming" (article id 1937819607739351040, published 2025-06-26, 151k views / 182 likes / 34 replies at capture) | [DOCS] | `raw/captures/honeypot/x-article-1938243521556676824.fxtwitter.json` (full JSON) and `.md` (text render; 11 image blocks could not be captured — the "what the bonding curve breaks" list and the Pot2Pump diagrams are images) |
| EH-2 | docs.honeypotfinance.xyz full corpus (GitBook `llms-full.txt`, 105,975 bytes; Pot2Pump "Introduction / How it works / Key benefits / ABI") | [DOCS] | `raw/captures/honeypot/docs_honeypot_llms-full.txt`, `docs_honeypot_sitemap.md` |
| EH-3 | honeypotfinance.xyz home page as of 2026-10-24 | [OBSERVED] | fetched live; site is now an editorial/"technology licensing" site ("Discuss licensing contact@…"), no product UI linked except legacy NFT staking + leaderboard |
| EH-4 | "Pons: The Fastest Company Ever to Reach $100M Annualized Revenue — in Just Two Months" by Wilson (Honeypot founder), first published 2026-09-11, republished on honeypotfinance.xyz 2026-09-30 | [DOCS] | fetched live (`/articles/pons-why-i-backed-ozzy`) |
| EH-5 | Pools.trade Crowd Launch facts (4-hour bidding window, $10k FDV or full refund) | [WEB] search summary re-confirmed 2026-10-24 | 06-competitors §1 (OQ-6.2 still asks for the primary URL) |

Clean-room note: nothing below copies Honeypot code or text; mechanisms are described from their public docs and re-derived against our own Phase 2–7 evidence.

## 2. What the article and docs actually propose

The article is a strategy memo, not a spec. Its concrete content, with the docs filling in the mechanism:

| # | Mechanic / claim | What it is (from EH-1/EH-2) |
|---|---|---|
| H1 | **"The Bonding Curve Trap"** | Thesis: pump.fun-style curves are "extractive by design — speed over belief, insiders over participants, churn over culture"; the specific failure list is an image we could not capture. |
| H2 | **Pot2Pump — Pot phase** | Users deposit a whitelisted asset toward a fixed raise target (**$20,000** on Berachain) within a set period. Everyone enters at the same price; no trading during the pot. If the target is missed, `refundRaisedToken()` returns deposits in full. |
| H3 | **Pot2Pump — Pump phase** | On success, liquidity is deployed to a concentrated-liquidity DEX (Algebra Integral on Honeypot DEX) inside an ALM-managed vault ("POGE vault", Aquabera). LP ownership: **50% pot participants / 40% locked (InterPoL, yield retained) / 5% deployer / 5% platform**. Participants' ERC-721 positions become ERC-20 vault shares; no platform fee is charged to deployers ("5% LP incentive" instead). |
| H4 | **"Volatility is revenue"** | Early participants become LPs ("LP army", Meteora-inspired) and earn pool fees; a single Berachain anecdote of ">32,000% APR" is cited. |
| H5 | **Modular DEX routing** | On new chains, graduate either to the leading local DEX or to a universal DEX such as Uniswap, "tailored through v4 hooks". |
| H6 | **Cheese Benance** | An "up-only" token factory backed by any asset, with most fees returned to the most active borrowers, pitched as a cold-start catalyst for new L1s. |
| H7 | **Drip Drive** | "Swap Liquidity Engine" that rewards on-chain activity at the transaction level; slogan `TRUE APY = ON-CHAIN ACTIVITY / TVL`. |
| H8 | **AI Agent Launchpad** | Free AI meme-image generation (Alphakek API) and a prompt enhancer inside the create flow. |
| H9 | **Meme Terminal** | "Bloomberg terminal for memecoins": GMGN-style analytics, liquidity flows, mint-to-snipe dashboards. |
| H10 | **Destination** | First expansion chain: Monad; cross-chain, "culturally tuned" modules. |

## 3. The status of Honeypot Finance today (this changes the question)

- The article is **16 months old** (June 2025). The Pot2Pump docs were last updated "11 months ago" and still describe Berachain assets ($WBERA/$HPOT/$HONEY/$HENLO) and Berachain-only dependencies (InterPoL, BGT emissions, Aquabera). [EH-2]
- On 2026-10-24 the company's website presents itself as an **AI/Web3 editorial and technology-licensing business** ("Honeypot's next chapter: make innovation travel — bringing technology licensing, AI-native discovery, and our community into one business"; footer "Discuss licensing"). No Pot2Pump launch UI is linked. [EH-3]
- In September 2026 the founder writes about Pot2Pump **in the past tense** ("We were building Pot2Pump and exploring a different approach to meme launches, yet we often felt overlooked") and celebrates Pons — whose founder (Ozzy, @MEADGod) he had backed earlier via RootsFi — as the breakthrough his own approach did not get. [EH-4]
- Side-finding for Phase 1: EH-4 names Pons' X handle as **@ponsdotfamily** and its founder's origin (Berachain / RootsFi), which partially resolves OQ-1.1.

Implication: there is **no live, maintained Pot2Pump deployment** to benchmark, integrate with, or route users to, and the firm's stated business is licensing its ideas. What is on the table is the ideas themselves, evaluated on merit.

## 4. Claim-by-claim evaluation against our evidence

| # | Honeypot mechanic | What our research says | Verdict |
|---|---|---|---|
| H1 | Curves are extractive; graduation is captured by insiders | **Confirmed independently and quantified**: 100% of sampled Pons graduations had the first buy inside the launch tx, median time-to-graduation 250 s, 96% of median-curve inflow sold back, 1.47% graduation rate (05 §1–5). | Agree. Already the premise of the Differentiation Thesis (08 §5). |
| H2 | Uniform-price raise with a target and full refund | Converges with Pools.trade Crowd Launch (4 h, $10k FDV or refund, 06 §1) and with our **Opening Batch Window** (120 s uniform clearing, S1) + **People-Threshold Graduation** (S3). The one element we lack is the *refund path when a launch never reaches its threshold*: in v1 a `Full` curve falls back to time-based graduation after 24 h and sells stay open (03 §3.4). A refund-based mode is a cleaner outcome for community pre-commits (squads, Sunrise launches) and produces zero dead curves — at the cost of the instant-trade energy that drives memecoin participation (R5). | **Adopt as an optional launch mode, P2** → F41 "Pot mode" (`모금 모드`): fixed raise window (e.g. 1–24 h, creator-chosen from presets), uniform price, graduate iff `G` and `N` are met at close, otherwise full refund via pull claims. Default mode stays batch-first/instant. Measurable: compare attested buyers per graduation and 7-day retention between modes (E9 added to 07-data §3). |
| H3 | Participants become LPs in an ALM vault; 50/40/5/5 LP split | (a) GIWA Sepolia has **no concentrated-liquidity DEX and no ALM** (07 §3); we would have to build a CL AMM plus a vault manager — roughly an order of magnitude more contract surface than the ~150-line locked CPAMM in 03 §2.6, and a new audit class. (b) Pooled, third-party-managed vault shares are closer to a collective investment scheme than anything else in our design; counsel question Q3 already flags the far milder **holder fee share** as a securities risk (10-legal R1, score 15). (c) Impermanent loss turns a memecoin position into a derivative that CEX-centric Korean retail does not expect (07 §6) — a holder wants token exposure, not LP exposure. (d) Participant-held LP shares are *withdrawable* liquidity; our product promise is permanently locked liquidity (S9). (e) The economic goal — "pay the people who stay" — is already met by routing 30% of pool fees to time-weighted holders (S9, ADR-13), with none of the above costs. | **Reject** the mechanism; the thesis is already adopted via S9. Revisit only if a canonical CL DEX ships on GIWA mainnet (OQ-7.3) *and* counsel clears vault-share distribution. |
| H3′ | "40% locked LP without losing yields" | Identical in effect to our permanently-locked pool whose fees stream to holders/creator (S9). | Already adopted (convergent validation). |
| H4 | "Volatility is revenue"; 32,000% APR anecdote | One Berachain anecdote vs. our full-population scan: fee income is front-loaded and collapses with the launch wave (Pons protocol revenue in October ≈ 5% of the September peak, 05 §3); LP yield only exists for the ~1.5% of tokens that graduate and keep volume. | Reject as a design premise; keep as copy inspiration at most ("the people who stay get paid"). |
| H5 | Pluggable graduation target (local DEX vs. Uniswap v4 hook) | Our ADR-03 chooses an own pool *because* GIWA has no DEX today; the mainnet picture may differ (OQ-7.3). The spec already says a new factory version is how behaviour changes (ADR-02), but it does not name a seam for the graduation destination. | **Adopt as a P0 architecture rule**: define `IGraduationTarget { initialize(token, quote, tokenAmount, quoteAmount, splitter, split) }`; `MadangPool` is adapter v1; a future Uniswap v4/v3 adapter can be registered through a new factory version. Cost ≈ one interface and one indirection; benefit = optionality at mainnet with no change to the window/curve code (03 §2.6 note added). |
| H6 | Cheese Benance ("up-only" asset-backed tokens, fees to most active borrowers) | Reflexive-price token factory with lending semantics — out of scope (02-prd §5 non-goals: no lending/leverage), highest regulatory exposure in a Korea-adjacent market (10-legal Q1–Q4), and contrary to the "no financial promises" positioning. | **Reject**. |
| H7 | Drip Drive: rewards proportional to on-chain activity / TVL | This is a per-transaction subsidy. Phase 5 shows volume is 96% churn; Phase 7 shows GIWA's testnet is already quest-farmed (158M addresses). Rewarding activity per transaction is the exact incentive our season economy is designed to refuse (ADR-14: zero points for tx count/volume; 08-tokenomics §4.2). | **Reject** — it would convert every metric into a farming metric and invalidate the testnet experiments (07-data §3). |
| H8 | AI meme-image generation + prompt enhancer in the create flow | Cheap, and it has a **moderation benefit**: generated images pass through our own safety pipeline by construction and avoid uploaded idol/brand likenesses (10-legal §1 items 1–2). Already planned as F38 "Creator studio AI kit" (P2). | **Fold in**: F38 scope now includes optional AI image generation with the safety classifier applied before pinning. Not a differentiator; stays P2. |
| H9 | Meme Terminal (pro analytics) | Our token page + quality-ranked discovery + Fairness Card cover the trust-critical slice (S4, S8). A "pro" terminal view serves snipers more than the Korean community persona (02-prd §2), and the sniper is our explicit non-persona. | Keep as a P2 trader-tools candidate (I23 portfolio/P&L first); no change. |
| H10 | Monad-first, cross-chain | Not applicable; GIWA-only is a stated non-goal boundary (02-prd §5). | No action. |

## 5. Partnership, licensing or integration?

- **Integration**: nothing to integrate — no Pot2Pump deployment on GIWA, no maintained SDK, Berachain-specific dependencies (InterPoL, Aquabera, BGT) that do not exist on GIWA (07 §2–3).
- **Licensing**: Honeypot now markets technology licensing. Our Rules of Engagement require original contracts written from our own spec (clean-room); a licence would add IP entanglement for mechanisms we have either already designed independently (uniform-price open, locked liquidity) or rejected (LP vault). **Not recommended.**
- **Distribution**: Honeypot's media arm writes about launchpads (it published the Pons essay) and has a Chinese-speaking audience ("蜜罐金融"). A story about "the launchpad where people, not bots, graduate tokens" is on-thesis for them. Low-cost GTM item: add to 09-gtm §4 as a tier-7 media contact once Season 1 data exists. No dependency.

## 6. Changes made to the plan in this review

| Where | Change |
|---|---|
| 13-decision-log | ADR-15 (this verdict), status Accepted |
| 02-prd §4 | F41 "Pot mode (raise-to-target or refund)" — P2, contracts: yes, source: H2 + M23 |
| 02-prd §4 | F38 scope note: AI image generation routed through the safety pipeline (H8) |
| 03-smart-contract-spec §2.6 | `IGraduationTarget` adapter seam; `MadangPool` is adapter v1 (H5) |
| 08-ideation §1 | M33 row: Pot2Pump raise-or-refund + LP-army, classified IMPROVE (refund mode) / DROP (LP vault) |
| 07-data-analytics §3 | E9: launch mode (batch-first vs. Pot mode) — attested buyers per graduation, 7-day retention, creator drop-off |
| 06-competitors | Addendum: Honeypot Pot2Pump row (status: dormant/pivoted), for the feature matrix |
| _open-questions | OQ-9.1 Pot-mode preset lengths and refund-claim UX; OQ-9.2 whether a canonical CL DEX reaches GIWA mainnet (ties to OQ-7.3) |

## 7. Ringkasan (Bahasa Indonesia)

Artikel Honeypot Finance (Juni 2025) mengusulkan Pot2Pump: fase "pot" dengan harga seragam menuju target dana ($20k) dan refund penuh bila gagal, lalu fase "pump" di mana peserta menjadi LP di vault likuiditas terkonsentrasi yang dikelola ALM (50% peserta / 40% terkunci / 5% deployer / 5% platform), ditambah Drip Drive (imbalan per transaksi), Cheese Benance (token "up-only"), generator meme AI, dan "Meme Terminal". Per Oktober 2026 Honeypot telah berpindah menjadi bisnis media/lisensi teknologi dan pendirinya menulis Pot2Pump dalam bentuk lampau; tidak ada produk aktif yang bisa diintegrasikan.

Keputusan: **masukkan sebagian.** Kami mengadopsi (1) antarmuka adapter graduasi (`IGraduationTarget`) sebagai aturan arsitektur P0 agar pool kami sendiri bisa diganti adapter Uniswap di mainnet tanpa menyentuh kurva, dan (2) "Pot mode" opsional (P2): jendela penggalangan harga seragam yang graduasi hanya jika `G` dan `N` tercapai, selain itu refund penuh. Generator gambar AI dilebur ke F38. Kami **menolak** vault LP/LP-army (tidak ada DEX likuiditas terkonsentrasi di GIWA, risiko dianggap skema investasi kolektif, impermanent loss bagi ritel, dan likuiditas peserta bisa ditarik — bertentangan dengan janji likuiditas terkunci permanen), Drip Drive (subsidi per transaksi yang bertentangan dengan ADR-14 dan akan merusak eksperimen testnet), dan Cheese Benance (di luar cakupan dan berisiko regulasi tinggi). Tidak ada kemitraan atau lisensi; paling jauh, media Honeypot bisa menjadi kanal distribusi setelah data Musim 1 tersedia.
