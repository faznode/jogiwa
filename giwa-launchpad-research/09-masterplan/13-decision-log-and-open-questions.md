# 13 — Decision Log (ADRs) and Open Questions for the Owner

Every plan decision traces to a finding (report §) or is marked [NEW] with rationale, as the brief requires. ADR numbers already cited elsewhere (ADR-02 upgradeability, ADR-07 burn remainder, ADR-10 no token) are preserved. Research-process decisions D1–D7 from `_progress.md` are mapped to RD-1…RD-7 here. Status values: **Accepted** (in the plan), **Proposed** (session 3 audit finding awaiting your approval), **Deferred** (decide at a named milestone).

## 1. Architecture / product decision records

| ADR | Title | Status | Decided | Traces to |
|---|---|---|---|---|
| ADR-01 | Clean-room: Pons V2 is a behavioural reference, never a code source | Accepted | S1 | Rules of Engagement 3; 02 §8 |
| ADR-02 | Immutable core + versioned factory (no proxies) | Accepted | S2 | 03 §5; 02 §8 (Pons shipped 3 generations without proxies) |
| ADR-03 | Graduate into our own permanently-locked CPAMM | Accepted | S2 (D5) | 07 §3 (no canonical DEX on GIWA); 02 §7 (v4 hook complexity, BUSL) |
| ADR-04 | Dojang/EAS attestations are the identity primitive; tiers 0/1/2 | Accepted | S2 (D6) | 07 §2–3; 05 §4 (serial deployers); 07 §5 (sybil pressure) |
| ADR-05 | Opening Batch Window replaces the snipe tax; no exemptions exist | Accepted | S2 | 05 §3 (100% bundled graduations); 02 §3 + 02 incidents §2.1 (exemption abuse); S1 |
| ADR-06 | People-threshold graduation (`N` attested buyers) with a 24 h time fallback | Accepted | S2 | 05 §3 (single-buyer graduations); S3 |
| ADR-07 | Burn the virtual-reserve remainder at graduation (not a "chapter vault") | Accepted | S2 | 02 §6 identity `S·Q0²/(Q0+G)²`; simplicity + no admin-held supply |
| ADR-08 | Testnet quote asset is a soulbound, rationed Season Credit | Accepted | S2 | 07 §6–7 (testnet value problem); S12 |
| ADR-09 | Safe 3-of-5 → 48 h TimelockController; Guardian 2-of-3 pause-only with 7-day expiry; no EOA roles | Accepted | S2 | 02 §6 (2-of-3 Safe, no timelock); 04 §3 (hot keepers); S10 |
| ADR-10 | No platform token through mainnet launch | Accepted | S2 | 08-tokenomics §1; 10-legal Q1–Q4; 06 M27 |
| ADR-11 | Every keeper function is permissionless and bountied; our bots are merely first | Accepted | S2 | 04 §3–6; I28 |
| ADR-12 | Chain is the source of truth for trading; the indexer serves lists only; health split chain/indexer/app | Accepted | S2 | 04 §5 (Sep-4 incident); AC-A2, AC-O3 |
| ADR-13 | Fee 1% on the quote leg, split 40 creator / 30 holders / 30 protocol, pull-claimed; holder share paid by daily epochs | Accepted | S2 | 05 §1, §5 (96% sell-back); M07; S6, S9 |
| ADR-14 | Metrics and points reward quality only (attested counterparties, retention); never tx count, volume, launches | Accepted | S2 (D7) | 05 §5; 07 §5; 08-tokenomics §4 |
| ADR-15 | Honeypot/Pot2Pump: adopt `IGraduationTarget` adapter (P0 rule) and optional Pot mode (P2); fold AI image generation into F38; reject LP-army vault, Drip Drive, Cheese Benance; no partnership/licence | Accepted | S3 | 15-honeypot-pot2pump-review §4–5 |
| ADR-16 | HolderRewards epoch snapshot: replace the `prevrandao`-derived snapshot block with a time-weighted average balance (TWAB) over the epoch | **Proposed** | S3 audit | see §1.16 |
| ADR-17 | Fee-split bounds allow `holdersShareBps = 0` for a counsel-driven mainnet configuration | Accepted (consistency fix) | S3 audit | 12 §5 vs 03 §3.6 conflict |

### 1.1 ADR-01 — Clean-room
Context: Pons' V2 source is verified and public (Sourcify), which makes copying tempting. Decision: extract behaviour, math and UX into specs (02 formula-sheet, 03 spec); write our contracts from the spec; the only Pons-derived code is the throwaway Python/Forge replay harness used for differential tests. Alternatives: fork Pons V2 (fast, but BUSL-adjacent v4 dependencies, a snipe-tax design we reject, and reputational risk in a market that reads GitHub). Consequences: our audit covers 100% of our code; the differential harness remains the bridge to Pons' verified math.

### 1.2 ADR-02 — Immutable core + versioned factory
See 03-smart-contract-spec §5 (full text). Consequence worth repeating: bug fixes cannot patch live launches; the Guardian can only stop *new* activity; the frontend is registry-driven across factory versions.

### 1.3 ADR-03 — Own locked CPAMM
Context: no canonical Uniswap on GIWA Sepolia (community deployments with 1–6 txs, 07 §3); v4 hooks are an audit burden and BUSL-licensed (02 §7). Decision: a ~150-line constant-product pool with no `mint/burn/skim`, fee on the quote leg routed to the splitter; seeded once at graduation with price continuity (02 §6 identity). Alternatives: deploy our own Uniswap v2 fork (more code, LP tokens we would have to burn anyway); wait for a DEX (blocks the roadmap). Consequence: we own post-graduation liquidity forever, which is both the moat and the obligation (status, monitoring). Session 3 addition (ADR-15): the pool sits behind `IGraduationTarget` so a DEX adapter can replace it at mainnet via a new factory version.

### 1.4 ADR-04 — Dojang/EAS identity
Context: Upbit Korea and the GIWA faucet attest wallets through EAS (`0x4200…0021`; schema `VerifiedAddress`; attesters listed in 14-appendix §F) [ONCHAIN 07 §2]. Decision: `IdentityRegistry` verifies attestation UID, schema, attester, recipient, revocation and expiry on-chain; tier 2 = Upbit, tier 1 = faucet, tier 0 = none; tiers gate windows, caps, rations and the people count. No PII is ever stored. Alternatives: our own KYC (illegal-adjacent and expensive), proof-of-personhood vendors (none on GIWA), nothing (Phase 7 §5 shows the testnet is farmed). Consequence: dependency on attester availability (R2) mitigated by configurable tiers and the faucet tier.

### 1.5 ADR-05 — Batch window, no exemptions
Context: Pons' snipe tax (99% decaying) with up to 32 creator exemptions did not stop bundling — it *enabled* it (02 incidents §2.1; 05 §3). Decision: 120 s (A/B 90/180) window in which all deposits clear at one price, pro-rata with tier caps; the creator's opening order clears with everyone and vests; the Launch Manifest is hashed on-chain and rendered as the Fairness Card. Alternatives: Pools.trade-style 4 h auction (too long for memecoin energy, 06 §1), per-block uniform pricing only (P2, I05). Consequence: first-second ordering has no value; measurement E1 tunes the length.

### 1.6 ADR-06 — People threshold with fallback
Context: graduation on Pons is a capital fact reached by one actor in 250 s (05 §3). Decision: `readyToGraduate = trackedQuote ≥ G ∧ (attestedBuyers ≥ N ∨ now ≥ fullSince + 24 h)`; sells stay open in `Full` (unlike Pons, 02 §4) so nobody is trapped behind a whale. Alternatives: hard requirement without fallback (deadlock risk), or no people condition (Pons). Consequence: `N` is the key experiment (E2); whale-split attacks are bounded by caps and detected by clustering (04-security §1.3).

### 1.7 ADR-07 — Burn the remainder
Context: after graduation `S·Q0²/(Q0+G)²` of supply (8.16% at `G/Q0 = 2.5`) is neither sold nor needed by the pool (02 §6, Pons locks it in the curve forever). Decision: burn it. Alternative considered: a "chapter vault" releasing it on post-graduation milestones (I14). Rejected for v1 because admin-held or rule-held supply is a trust and securities question (10-legal Q3) and complicates the Fairness Card. Consequence: fixed supply after graduation is exactly `S − burned`; Chapters (F33, P2) must be funded from fees, not supply.

### 1.8 ADR-08 — Season Credit
Context: testnet ETH is free and the chain is quest-farmed (07 §5–7). Decision: the only curve/pool quote on testnet is a soulbound ERC-20 minted by daily tier rations (0/20/50 SC), transferable only to/from market contracts, burned at season end. Alternatives: testnet ETH (no scarcity → no signal), off-chain points as quote (not measurable on-chain). Consequence: graduation requires coordination of 20–50 attested people by construction; mainnet simply does not reference the contract.

### 1.9 ADR-09 — Governance hygiene
Context: Pons' owner is a 2-of-3 Safe with no timelock and a hot `feeSweepOperator` EOA (02 §6, 04 §3). Decision: 3-of-5 Safe proposes to a 48 h timelock (7 days for attester/schema changes); Guardian 2-of-3 can only pause new launches/deposits for ≤ 7 days; nothing pauses exits; every scheduled change is shown in-app. Alternatives: DAO voting (no token, ADR-10), plain multisig (what Pons has). Consequence: parameter changes take ≥ 2 days — acceptable because per-launch params are copied at creation.

### 1.10 ADR-10 — No platform token
Full argument in 08-tokenomics §1. Revisit conditions: mainnet ≥ 6 months, counsel opinions (KR, ID), a non-financial governance need, a design where the token never receives fees.

### 1.11 ADR-11 — Permissionless, bountied keepers
Context: Pons' sweeps, buybacks and holder payouts depend on hot keys (04 §3). Decision: `settle`, `graduate`, `claimWindow(for)`, `release`, `pushHolders`, `finalizeEpoch`, `refresh`, `burnExpired` are callable by anyone; bounties (5 bps of the moved amount, capped) come from the protocol share; a `keeper-kit` is published. Consequence: AC-O1 (bots off for 24 h → ≥ 95% SLA via third parties) becomes testable in Season 1.

### 1.12 ADR-12 — Chain-first trading
Context: during the Sep-4 Robinhood incident the explorer/indexer stalled while the chain produced blocks; press and users read it as a halt (04 §5). Decision: the trade widget needs only `quoteBuy/quoteSell/reserves/state` reads via multicall; lists/feeds come from the indexer and degrade with a banner; the status page shows chain, indexer and app separately. Consequence: AC-A2, AC-O3; two indexer instances are a resilience nicety, not a trading dependency.

### 1.13 ADR-13 — 40/30/30 with holder epochs
Context: Pons pays 70/30 creator/protocol and nothing to holders; 96% of curve inflow is sold back (05 §5). Decision: holders become a fee party (30%) via daily epochs on checkpointed balances; creator keeps 40% (still above pump.fun's effective 0.30% of volume, 06 §2) plus an optional ≤ 3% creator tax; protocol 30% funds ops, audits, bounties and grants. Alternatives: Pools.trade-style auto-compounding into liquidity nobody can withdraw (M24) — less legible. Consequence: counsel Q3 on the holder share (R1); ADR-17 keeps the 0% configuration possible.

### 1.14 ADR-14 — Quality-only metrics
Context: Pons' trending is volume-ranked and its volume is churn (05 §5); GIWA quests reward tx counts (07 §5). Decision: north star = distinct attested humans per graduated token; points categories = counterparties, holding, creator quality, curation, squad; zero for tx count, volume, launches; retroactive cluster slashing with a published method. Consequence: every experiment in 07-data §3 is defined on these metrics; Drip-Drive-style activity rewards are excluded (ADR-15).

### 1.15 ADR-15 — Honeypot/Pot2Pump
Full analysis in 15-honeypot-pot2pump-review. Summary: adopt the graduation-adapter seam (P0 rule) and an optional raise-or-refund "Pot mode" (P2, F41); fold AI image generation into F38; reject the LP-army/ALM vault (no CL DEX on GIWA, fund-like profile, IL for retail, withdrawable liquidity), Drip Drive (per-tx subsidy contradicts ADR-14) and Cheese Benance (out of scope, regulatory); no partnership or licence (company pivoted; clean-room).

### 1.16 ADR-16 — TWAB instead of a random snapshot (Proposed)
Context: 03 §2.8 picks the epoch snapshot block as `epochEnd − (prevrandao % 3600 / blockTime)`. On OP Stack L2s `block.prevrandao` carries the **L1 RANDAO of the current L1 origin**, which is constant across many L2 blocks and knowable minutes ahead — so the "random" snapshot within the last hour is predictable, and the 2% round-trip fee defence in 04-security §1.3 is the only thing stopping snapshot farming. Decision (proposed): since `MadangToken` already checkpoints balances, compute each account's **time-weighted average balance over the whole epoch** (cumulative balance-seconds from checkpoints, as in ERC-20 "snapshot/TWAB" patterns) and pay `funded_e · twab_user / twab_eligible`. Alternatives: commit-reveal randomness (extra keeper step), VRF (none on GIWA), keep as is (accept predictability). Consequences: snapshot farming becomes economically pointless (a one-hour hold earns 1/24 of a day's share); gas +O(checkpoints) at claim time, acceptable on GIWA; invariant I-R1 is restated for TWAB. Requires your approval because it changes F10's contract shape before W4.

### 1.17 ADR-17 — Holder-share bound (consistency fix)
Context: 03 §3.6 bounded the split at `creator ≥ 30, holders ≥ 20`, but 12 §5 and 10-legal R1 plan a mainnet factory with `holdersShareBps = 0` if counsel requires it. Decision: bounds become `creator ∈ [30, 70]`, `holders ∈ {0} ∪ [20, 40]`, `protocol = remainder ≤ 45`; the 0 case must be accompanied by a published counsel memo reference in the factory's deployment config (`chainConfig` hash). 03 §3.6 has been edited accordingly.

## 2. Research-process decisions (from `_progress.md`)

| RD | Decision | Why |
|---|---|---|
| RD-1 | Sourcify is the verification source of truth for Robinhood Chain | Blockscout is Cloudflare-challenged for non-browser clients |
| RD-2 | The live protocol is "V2" (`PonsV2*`); the two Uniswap-V3 range-order factories are Gen1/Gen2; docs' "active factory" = Gen2 | 02 §2 |
| RD-3 | Formula verification = Python big-int replay of real txs + live-fork forge test; pinned-block replay archived | public RPC is non-archival |
| RD-4 | Scanner stores compact records with checkpoints; timestamps interpolated from 500k-block anchors | 429 rate limits; 709k launches |
| RD-5 | = ADR-03 | |
| RD-6 | = ADR-04 | |
| RD-7 | = ADR-14 | |

## 3. The five decisions you must make now

Each has a recommended default so work can continue if you simply say "defaults".

| # | Decision | Options | Recommended default | What it changes |
|---|---|---|---|---|
| 1 | **Product name** | Madang / Ondol / Jangteo / Haedoji / Bulkkot (08 §5) or your own | **Madang** pending trademark clearance (Q8); keep "GIWA" out of the name | repo, EAS schema names (`MadangCreatorScore`), domain, all copy |
| 2 | **Embedded-wallet provider** (first-run social login) | Privy / Turnkey / Web3Auth / a Korean provider; criterion = **KakaoTalk (and Naver) login** + GIWA chain support + exportable keys | Privy if Kakao OAuth is confirmed in Phase 0 W1; otherwise Web3Auth custom-auth with Kakao | J1 funnel, F17, 05-architecture §2; decision needed by W2 |
| 3 | **Legal counsel engagement** (Korea; Indonesia if the entity/team sits there) | engage now for Q1–Q4, Q8, Q11 (budget), or defer to pre-Season-1 | **Engage now**, scoped to Q1–Q4 + Q8 (KR) and Q11 (ID); holder-share opinion (Q3) before mainnet | R1 (score 15), mainnet precondition #4, name clearance |
| 4 | **Audit budget tier** | A) ~$25–40k single boutique + public contest; B) ~$60–90k two firms sequential + contest | **A** for a 1–3 builder team, **B** if treasury allows; both include the contest | 04-security §4, roadmap W16–W22; book by W8 |
| 5 | **Season 0 access** | invite-only (300–500 via Kakao open chats + GIWA community) vs. open | **Invite-only** — cleaner E1/E7 reads and a controlled keeper/SLA test | 09-gtm §1, 11-roadmap W8–W11 |

Also awaiting your word (not blocking): approve **ADR-16** (TWAB) so F10 is specified before W4.

## 4. Deferred decisions (decide at the named milestone)

| Decision | When | Inputs |
|---|---|---|
| Final `N`, window length, humans-first duration, tier caps | end of Season 1 | E1–E4 results (07-data §3) |
| Holder share on mainnet (30% vs 0%) | mainnet precondition #4 | counsel Q3; ADR-17 |
| Mainnet `Q0/G` (1.0/2.5 ETH proposal) | W23 rehearsal | Season volumes, ETH price, GIWA fee market (OQ-7.3) |
| Graduation adapter at mainnet (own pool vs DEX adapter) | mainnet precondition #1 | OQ-7.3 / OQ-9.2 (canonical DEX on GIWA mainnet) |
| Pot mode presets (F41) | Season 2 planning | OQ-9.1 |
| Bahasa Indonesia locale timing | after Q11 | 10-legal R17 |
| Squads scope (treasury custody model) | W14 | S11 spec, counsel Q9 (prize/gambling framing) |

## 5. Open questions

The complete, numbered list (OQ-1.x … OQ-9.x) with status and resolution path lives in `_open-questions.md`. Counts at the end of session 3: 43 tracked — 1 resolved (OQ-2.2 locker address), 4 partial (OQ-1.1 Pons X handle via the Honeypot essay, OQ-2.3 pair-token economics for ETH/USDG/TAO/cbBTC, OQ-2.4 three audits named but unpublished, OQ-6.2 Pools.trade facts re-confirmed), 6 deferred to named roadmap milestones (W1 probes, W7 deploy), 32 open; 3 added in session 3 (OQ-9.1 Pot-mode presets, OQ-9.2 canonical DEX on GIWA mainnet, OQ-9.3 LFS housekeeping). Items with a risk score ≥ 12 in 10-legal §4 carry a named action in `_open-questions.md` (OQ-7.2 for R2) or in the register itself.
