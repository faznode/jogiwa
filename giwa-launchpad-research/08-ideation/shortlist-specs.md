# Phase 8 — Shortlist Specs (12 one-pagers)

Each spec: mechanism · contract implications · UX implications · risks · success metric. Parameter values are the proposed testnet defaults; all are chain-config (see 09-masterplan/03-smart-contract-spec.md §7). Evidence citations point at phase reports; everything else is [NEW].

Shared vocabulary: **tier** = identity tier from `IdentityRegistry` (0 = unverified, 1 = Dojang Verified Address by the GIWA faucet attester, 2 = Dojang Verified Address by the Upbit attester or an UP ID holder with tier-1) [DOCS 07 §2]; **SC** = Season Credit, the soulbound testnet quote asset (S12); **attested buyer** = a tier ≥ 1 address that has bought on a curve at least once.

---

## S1 — Opening Batch Window (OBW)

**Mechanism.** A launch does not start trading at block 0. For `obwDuration` (default 120 s, A/B 90/120/180) the curve is in `State.Batch`: anyone eligible (see S2) can `deposit(quote, maxPricePerToken?)` up to a per-wallet cap; deposits are refundable until the window closes. At `T0 + obwDuration` anyone can call `settle()` (bounty paid from protocol share): the aggregate deposit `D` is pushed through the curve as one buy, producing `T = f(D)` tokens at the same average price for everyone; each depositor's claim is `T · d_i / D`. The creator's opening order is just another deposit, except that its tokens go to the vesting vault (S5). If `D = 0` the curve simply opens. The optional `maxPricePerToken` lets a depositor opt out if the clearing price exceeds their limit (their deposit is refunded, not filled), which protects small buyers from a whale inflating the window.

**Contract implications.** New curve states `Batch → Open → Full → Graduated`; `deposits[addr]`, `totalDeposits`, `settled`, claim-based distribution (pull) to keep `settle()` O(1); `claim()` mints no new tokens, it transfers from the curve's pre-computed allocation. Clearing uses the verified Pons buy closed form (02 formula-sheet §3) with `fee = D·f/1e4` taken once. The window end is timestamp-based; with 1-s blocks [07 §1] the last block in the window may still receive deposits — acceptable because they clear at the same price. Settlement must be callable even if the creator disappears (no privileged caller).

**UX implications.** Token page shows a countdown, the live clearing price, "you would receive ≈ X tokens (Y% of the window)", and the per-wallet cap. Deposits show as "in the window" not "bought". After settlement a "Window result" card lists size, participants, clearing price. Social proof: "27 people in this window" (tier-weighted, not addresses).

**Risks.** (1) A whale still takes a large share of the window if caps are loose → caps by tier (S2) and the limit-price opt-out. (2) 120 s of dead time could reduce excitement → the countdown is the excitement; measure. (3) Deposit-and-cancel griefing to fake window size → cancellation closes 15 s before the end; show committed size only. (4) Griefing `settle()` by reverting? `settle()` has no external calls except the fee transfer to the splitter (pull-based) — no revert surface.

**Success metric.** Share of graduations whose first buy is in the launch transaction: Pons sample 100% (05 §3) → target < 5% (by construction ~0). Gini of window allocations < 0.6; ≥ 60% of windows have ≥ 10 tier-≥1 depositors.

---

## S2 — Humans-First Window

**Mechanism.** During the OBW and for `humansFirst` minutes after it (default 10) only tier ≥ 1 addresses may deposit or buy, with per-wallet caps expressed as a share of `G` (tier 1: 2% of `G`, tier 2: 5% of `G`; creator opening order ≤ 3% of supply-equivalent). After the window the curve is open to all, uncapped. Tier is read from `IdentityRegistry.tierOf(addr)`, which anyone can populate by submitting a Dojang attestation UID; the registry verifies `schema ∈ {VerifiedAddress}`, `attester ∈ {Upbit, faucet}`, `recipient == addr`, not revoked, not expired against the EAS contract at `0x4200…0021` [ONCHAIN 07 §2] and caches `(tier, expiry)`.

**Contract implications.** `IdentityRegistry` (new): `register(bytes32 uid)`, `tierOf(address) view`, attester/schema allow-list managed by the timelock (S10); event `TierUpdated`. Curve checks `tierOf(msg.sender) >= 1` in `Batch` and in `Open` while `block.timestamp < openAt + humansFirst`. Caps are tracked per address per curve (`boughtDuringWindow[addr]`). Smart-contract wallets: `recipient` must equal `msg.sender`; account-abstraction wallets register their account address (EntryPoint 0.7 exists on GIWA [ONCHAIN 07 §2]). Mainnet: attester set becomes the mainnet Dojang attesters when published; config-driven.

**UX implications.** First-run flow: "Verify once with Dojang" → deep link to the GIWA faucet/Upbit attestation → one `register` tx (gasless-feel on GIWA). Token page shows "Humans-first: 7:32 left · you are tier 2 · cap 125 SC". Unverified users see the countdown and a verify CTA, never a silent revert.

**Risks.** (1) Attestation farming via the faucet attester (one per wallet, cheap) → tier-1 caps are small and tier-1 wallets carry lower points weight (S12); tier-2 (Upbit) is the real gate. (2) Revoked attestations → registry re-validates on each `register`, and the curve checks `expiry`; revocation can be mirrored by anyone calling `refresh(addr)`. (3) Dojang attester outage → window still works for already-registered addresses; config flag can shorten `humansFirst` to 0 via timelock (emergency: guardian can set it to 0 for new launches only). (4) Privacy: tiers are already public on EAS; we store no PII.

**Success metric.** ≥ 70% of window depositors tier ≥ 1 across the season (expected 100% by construction during the window; the metric is about continued participation after it); distinct attested buyers per graduated token ≥ 60 (Pons median traders per non-graduated curve 3.5, 05 §5).

---

## S3 — People-Threshold Graduation

**Mechanism.** `graduate()` requires `trackedQuote ≥ G` **and** (`attestedBuyers ≥ N` **or** `block.timestamp ≥ fullSince + graceFallback`). Default `N = 25` on testnet, `graceFallback = 24 h`. While `Full` but under the people threshold, **sells stay enabled** (Pons disables sells when full, 02 §4), so a whale who filled the curve alone can only exit by selling into the curve, re-opening supply for others. Graduation remains permissionless and bountied.

**Contract implications.** Curve tracks `attestedBuyers` (increment on first buy per tier ≥ 1 address — one SSTORE per new buyer) and `fullSince`. `readyToGraduate()` becomes the conjunction above. Allocation math at graduation is the verified Pons identity (02 §6): `poolQuote = trackedQuote`, `poolTokens = S·Q0·G/(Q0+G)²`, remainder `S·Q0²/(Q0+G)²` burned (ADR-07: burn vs. chapter vault). Edge: if sells after `Full` drop `trackedQuote` below `G`, state returns to `Open` and `fullSince` resets.

**UX implications.** The token page's primary progress bar has two tracks: "Credit: 2,310 / 2,500 SC" and "People: 19 / 25 attested buyers". Social proof copy: "You would be attested buyer #20 of 25 needed" (I42). After `Full` under-threshold: "Full — waiting for 6 more people (fallback in 23 h 12 m)". Graduation becomes an event with a countdown, not a surprise.

**Risks.** (1) Deadlock when supply is exhausted and nobody sells → time fallback. (2) Sybil wallets to satisfy N → N counts tier ≥ 1 only; tier-1 farming is bounded by faucet attestation cadence; S12 slashing applies to points, not to graduation (graduation must be deterministic). (3) Price risk for the whale during the fallback → intended: bundling is now capital-expensive and visible. (4) Griefing by never reaching N on a legitimately loved token → 24 h fallback bounds the damage; `N` is tuned per season (experiment plan 07-data-analytics).

**Success metric.** Median time-to-graduation ≥ 30 min (Pons 250 s, 05 §3); share of graduations via time-fallback < 20%; distinct attested holders 7 days after graduation ≥ 40.

---

## S4 — Fairness Card (Launch Manifest + pre-trade view)

**Mechanism.** At launch the factory stores `manifestHash = keccak256(abi.encode(Manifest))` and emits the full `Manifest` once: `creatorAllocationBps (≤ 300)`, `creatorTaxBps (≤ 300)`, vesting `{cliff: graduation, duration: 30 d}`, `obwDuration`, `humansFirst`, `N`, `G`, `Q0`, fee split, `metadataCID`, `teamWallets[≤5]` (addresses that are declared as team; they are **not** exempt from anything — the list exists so the UI can label their trades). There are no exemption lists in the contracts (M08 REPLACE). The app renders the same fields from chain data as a "Fairness Card" before the first buy and in a pre-trade sheet on every buy; a divergence between on-chain and rendered values is a monitoring alarm (04 §6).

**Contract implications.** `struct Manifest` in the factory; immutable after launch (no setter); `LaunchManifest` event; per-launch parameters are copied into the curve at creation so later `setLaunchConfig` changes affect only new launches (closes P16). Team wallets have no special code path.

**UX implications.** Card design: a fixed 6-row table (creator share, creator tax, vesting, window, people needed, fees → who) plus "declared team wallets" and a "verified on-chain" checkmark that is literally computed from `manifestHash`. Shown in the create flow as a preview ("this is what buyers will see"), on the token page above the fold, and as a sheet on first buy. Copy in Korean and English.

**Risks.** (1) Information overload → six rows, plain language, numbers formatted in 만/억 where relevant. (2) Creators lie in metadata (not in the manifest) → metadata is marked "creator-provided", manifest fields "enforced by contract". (3) Manifest schema evolution across factory versions → versioned struct + `manifestVersion` field.

**Success metric.** 100% of launches have an on-chain manifest (by construction); pre-trade sheet dismissal-without-reading rate < 50%; support tickets about "hidden fees/exemptions" = 0.

---

## S5 — Creator Vesting by Default

**Mechanism.** The creator's opening order tokens (and any `creatorAllocationBps` minted allocation, ≤ 3% of supply) are delivered to a per-launch `VestingVault`: nothing before graduation (cliff), then linear release over 30 days. The creator cannot sell on the curve from the vault at all. If the token does not graduate within `vestingExpiry` (30 days), the vault releases tokens to the creator (they may then sell on the dead curve like anyone). Creators may buy more on the curve after the humans-first window as a normal wallet — but those trades are labelled "team wallet" on the feed because the creator is in `teamWallets`.

**Contract implications.** Minimal clone (`EIP-1167`) `VestingVault` per launch created by the factory; `release()` permissionless; `beneficiary` immutable; integrates with `HolderRewards` so vesting tokens **do not** earn holder rewards (excluded address). Gas is free on testnet; on mainnet the clone costs ~50k gas.

**UX implications.** Create flow: "Your opening order vests: 0 until graduation, then 30 days" — not optional, explained as a trust feature with a badge shown on the token page ("Creator locked: 2.4% of supply, releases over 30 d after graduation"). Creator dashboard shows vesting progress and `release()` button.

**Risks.** (1) Creators route around it by buying from a second wallet → the humans-first caps limit it, the churn detector flags same-funder clusters (I19), and reputation (S7) penalises detected clusters; we do not claim to eliminate it. (2) Legal reading of "vesting" as investment-contract language → wording "locked" rather than "vested" in user copy; counsel question (10-legal Q7). (3) Dead-token lockup frustration → 30-day expiry release.

**Success metric.** Creator sells on the curve: Pons 48% of deployers (05 §5) → 0% by construction for the opening allocation; detected creator-cluster selling < 10% of launches; 7-day post-graduation price drawdown median improved vs. Pons baseline (to be measured on both).

---

## S6 — Streaming Pull-Based Fees

**Mechanism.** Every fee event credits internal balances in a `FeeSplitter` (`creatorAccrued[token]`, `holdersAccrued[token]`, `protocolAccrued`), split 40/30/30 (M07). Creators claim any time; holders claim per epoch (S9); anyone can call `push(token)` to move accrued holder fees into the `HolderRewards` epoch and receive a small bounty (0.1% of the moved amount). No sweep operator, no scheduled distributor. Fees are always in the quote asset (M03), so no conversions are needed.

**Contract implications.** `FeeSplitter` is a single contract for all launches (keyed by token); `pull` pattern with reentrancy guard; `claimTo(address)` for creators; emergency: none needed — funds can only move to pre-declared parties. The splitter's share table is per-launch (copied at launch, S4) so admin changes cannot touch existing launches.

**UX implications.** Creator dashboard: "Claimable now: 41.2 SC · lifetime 913 SC" with one-click claim; public "Fees → who" row on the Fairness Card; a transparency page per token shows accrued vs. claimed by party. Holder claims surface on the portfolio page.

**Risks.** (1) Dust claims on mainnet costing more gas than they return → thresholds in UI, not in contract. (2) Keeper bounty griefing (calling `push` for 1 wei) → bounty proportional to amount moved, minimum move size. (3) Creator key loss → `claimTo` is only callable by the creator; no admin rescue (documented).

**Success metric.** Days-to-first-creator-claim median; share of accrued holder fees pushed within 24 h ≥ 95% without our bots (measured by disabling them for one week in Season 1).

---

## S7 — Creator Reputation (score + Dojang/UP ID verified badge)

**Mechanism.** Two layers. (a) **Verified badge**: tier ≥ 1 (S2) plus an UP ID name resolved on-chain [DOCS 07 §2]; tier 2 shows "Upbit-verified". (b) **Reputation score 0–100**, computed off-chain daily from on-chain facts only: graduations with ≥ N attested buyers (+), 7/30-day holder retention of their tokens (+), no team-wallet cluster selling before graduation (+), launch-to-dead ratio (−), detected sybil clusters (−, with slashing). Published as an EAS attestation under our schema `MadangCreatorScore(address creator, uint8 score, uint32 season, bytes32 methodHash)` by a `Scorer` key, so other GIWA apps can read it and so the method is auditable (`methodHash` → public spec). The registry caches the latest score; limits and perks read it: launches/day (tier 0: 1, tier 1: 3, score ≥ 60: 10), featured eligibility (score ≥ 50), humans-first cap multiplier.

**Contract implications.** `IdentityRegistry.scoreOf(addr)` reads our attestation (schema + attester allow-listed via timelock); factory enforces launch rate limits by `(tier, score)`; nothing else on-chain. Score revocation = new attestation with lower value.

**UX implications.** Creator profile: badge, score ring, the five sub-scores with plain explanations and "how to improve"; token cards show the creator badge and score chip. New creators start at 20, not 0 ("unproven" rather than "bad"). Scores are shown as bands (New / Building / Trusted / Elite) in UI; raw number on hover.

**Risks.** (1) Opaque score → public method spec + methodHash + a per-creator breakdown. (2) Gaming via self-sybil → inputs are tier-weighted and slashing is retroactive (S12). (3) Defamation-like harm from low scores → scores only derive from on-chain facts, never from reports; banding softens; appeal process documented (10-legal). (4) Scorer key compromise → attestations are revocable by the timelock; UI shows the latest valid attestation only.

**Success metric.** Launches by score ≥ 50 creators graduate ≥ 3× more often than by New creators (if not, the score is not predictive — redesign); share of launches from tier-0 wallets < 20% (Pons: 24.8% of launches from > 20-launch deployers, 05 §4).

---

## S8 — Quality-Ranked Discovery

**Mechanism.** Default feed "Rising" ranks tokens by a score with no volume term: distinct attested buyers in the last 15 min / 1 h (tier-weighted), holder growth, sell-back ratio (penalty when `quoteOut/quoteIn > 0.8` in the window), age decay, creator score. "New", "Graduating soon" (people-threshold distance), "Graduated" and squad feeds complement it. Churn/wash detection (I19) runs in the indexer: sell-back ratio, same-funder clusters (first-funding tx heuristics), same-block buy/sell bursts → labels `Churny`, `Cluster-heavy` shown on cards and demoting rank.

**Contract implications.** None. Indexer-only; the ranking method is published.

**UX implications.** Cards show "31 people · 92% still holding · 4 m old" instead of volume; a "Why is this ranked here?" popover; labels explained in plain Korean/English; a volume sort still exists but is not the default and shows the sell-back ratio next to it.

**Risks.** (1) Lower perceived excitement vs. volume feeds → test retention, not clicks. (2) False-positive cluster labels → conservative thresholds, label shows the reason, appeal route. (3) Gaming people-count by sybils → tier weighting and S12 slashing feed back into ranking.

**Success metric.** Rank-to-graduation precision: ≥ 30% of top-10 "Rising" tokens at any time graduate within 24 h; sell-back ratio of top-10 median < 0.8; 7-day retained holders of top-10 ≥ 2× platform median.

---

## S9 — Holder-Paid Liquidity (locked CPAMM, 40/30/30)

**Mechanism.** At graduation the factory deploys a `MadangPool` (constant product, single pair token/quote) seeded with `poolQuote = trackedQuote` and `poolTokens` at the curve's final price (M02). The pool has **no LP tokens and no withdrawal function**: liquidity is permanent by construction (06 Pools.trade locked-liquidity concept, but without a compounding fee). Trades pay 1% on the quote leg (M03): buy fee on quote in, sell fee on quote out, routed to the `FeeSplitter` 40% creator / 30% holders / 30% protocol. `HolderRewards` runs daily epochs: the token has checkpointed balances (`balanceOfAt`), each epoch's holder share is distributed pro-rata to eligible balances at the epoch's end block (curve, pool, vaults, burner excluded), claimable per epoch; unclaimed rewards older than 180 days roll into the next epoch.

**Contract implications.** `MadangPool` (~150 lines, no hooks, no ticks); `MadangToken` extends ERC-20 with OpenZeppelin `Checkpoints` per account (write on every transfer, free gas on testnet; ~20k gas extra on mainnet); `HolderRewards.finalizeEpoch()` permissionless with bounty; `claim(uint256[] epochs)`. Price oracle: none needed (no lending). Router: a tiny `MadangRouter` for quote-in/quote-out with slippage and deadline; curve and pool share the same `IQuoteMarket` interface so the frontend has one trade path before and after graduation.

**UX implications.** Token page after graduation shows "Permanent liquidity: 2,500 SC + 204M tokens (locked forever, proof ↗)" and "Holders earned 31 SC this week"; portfolio shows claimable rewards per token with one-click multi-claim. The trade widget does not change at graduation.

**Risks.** (1) Epoch-end snapshot farming → round-trip costs 2% in fees vs. a 1-day share of 30% of 1% of volume; unprofitable unless volume/holders is extreme; we additionally snapshot at a block chosen by `prevrandao` inside the last hour of the epoch. (2) Checkpointed ERC-20 compatibility with other DEXes/aggregators → standard ERC-20 surface; checkpoints are internal. (3) No LP incentives means depth only grows with graduations → acceptable: memecoin pools do not need external LPs; depth = `G` by design. (4) Impermanent-loss style complaints do not apply (no LPs).

**Success metric.** 30-day post-graduation holder retention ≥ 40% (Pons: unmeasured, "graduate and forget"); share of graduated tokens with ≥ 1 trade per day after 14 days ≥ 50%; holder claims ≥ 30% of eligible wallets per month.

---

## S10 — Timelocked Admin with In-App Notice

**Mechanism.** All privileged parameters (factory launch config for *new* launches, attester/schema allow-lists, scorer key, fee split for new launches, bounty sizes) live behind a Safe (3-of-5) → `TimelockController` (48 h) path. A separate `Guardian` (2-of-3, pause-only) can pause **new launches** and **new deposits** but can never move funds or alter existing launches; pauses auto-expire after 7 days unless renewed by the timelock. Every queued operation is indexed and shown in-app on a "Pending changes" banner and page with a plain-language diff and the execution time.

**Contract implications.** OpenZeppelin `TimelockController`; `onlyTimelock` on setters; `Pausable` with expiry; no `selfdestruct`, no proxies in core (ADR-02 in 03-smart-contract-spec). Existing curves/pools/vaults are immutable; a new factory version is how we change behaviour (M21 REPLACE).

**UX implications.** "Pending changes" banner (yellow, dismissible, returns on new items), a Governance page listing queued/executed/cancelled operations with Safe tx links; status page shows guardian pauses with reason and expiry.

**Risks.** (1) 48 h is too slow for a real emergency → Guardian pause covers new activity; existing positions are always exitable (sells/curve/pool never pausable). (2) Signer availability in KST/WIB/UTC time zones → documented signer policy (04-security-plan). 

**Success metric.** 100% of parameter changes announced ≥ 48 h before execution (by construction); zero guardian pauses longer than 7 days; signer drill completed once per quarter.

---

## S11 — Squads with Treasuries

**Mechanism.** A squad is an on-chain group (`SquadRegistry`: name, UP ID of the leader, members ≤ 50, open/invite policy) with a treasury address (a Safe or a minimal `SquadVault`). Creators can launch *as a squad*: the creator fee share is split creator/squad per the manifest (e.g., 30/10 of the 40 creator points), paid to the squad vault. Squad leaderboards rank squads by season points (S12) of their members' launches and holdings — quality metrics only. Weekly squad challenges (I32) are campaigns on top, P1.

**Contract implications.** `SquadRegistry` (membership, leader, treasury), manifest field `squadId`, `FeeSplitter` honours the squad split for that launch; `SquadVault` minimal (leader-withdraw or Safe). Membership changes are rate-limited (1 move / 7 days) to stop points laundering between squads.

**UX implications.** Squad pages (members, launches, treasury, badge), squad tag on token cards, "launch as squad" toggle in the create flow, KakaoTalk open-chat and Telegram deep links on the squad page, Korean-first naming rules (Hangul allowed, impersonation banned).

**Risks.** (1) Squads become sybil shells → tier weighting; squad points use attested members only; slashing cascades. (2) Treasury disputes → leader-controlled by default with a clear label; Safe optional. (3) Offensive squad names → moderation policy (10-legal), reserved-name list.

**Success metric.** ≥ 30% of attested active users belong to a squad by the end of Season 1; squad members' 30-day retention ≥ 1.5× non-members; ≥ 25% of graduations are squad launches.

---

## S12 — Season Economy (soulbound credit + quality-only points + retro slashing)

**Mechanism.** On testnet the only curve/pool quote asset is **Season Credit (SC)**: an ERC-20 whose `transfer` is restricted to allow-listed market contracts (curve, pool, splitter, vaults) — it cannot be sent wallet-to-wallet, so it cannot be pooled by farms. Each wallet can `claimDaily()`: tier 1 → 20 SC, tier 2 → 50 SC, tier 0 → 0 (browse-only), with a 7-day missed-claim cap. SC earned by selling tokens is spendable (it circulates), but total supply only grows by rations; unspent SC burns at season end (4-week seasons, 07 §7). Points are computed off-chain from on-chain facts and published per season: distinct counterparties (buying tokens others also bought, tier-weighted), holding time of tokens that stay alive, creator quality (S7 inputs), curation accuracy (watchlisting tokens that later graduate with ≥ N people), squad outcomes — and **zero** for tx count, volume or launches. Scores are provisional for 7 days after a season; detected sybil clusters (same funder, same timing, circular trading) are zeroed with the method published (I39). Final season scores are issued as soulbound season badges (EAS attestations) that carry to mainnet as reputation — explicitly no token promise (I44, 10-legal).

**Contract implications.** `SeasonCredit` (restricted ERC-20, `claimDaily`, `season`, `burnExpired` permissionless), `CreditFaucet` logic inside it (reads `IdentityRegistry`); market contracts hold `MARKET_ROLE` to move SC; curve/pool `quote` is just an ERC-20 address, so mainnet uses WETH/ETH with no code change (config-driven). Points are off-chain; attestations on-chain (EAS schema `MadangSeasonBadge`).

**UX implications.** Home shows "Season 1 · day 12/28 · your credit 37 SC · claim today's 20"; points page with per-category breakdown and the public method; season end "settlement" screen with provisional → final states and an appeal link; leaderboards weighted and tier-labelled.

**Risks.** (1) Credit scarcity frustrates power users → sells return SC, so active traders recycle credit; caps are tuned per season. (2) Accusations of unfair slashing → public method, provisional window, appeals, and we publish aggregate slashing stats. (3) Perception that SC/badges imply a future airdrop → explicit language, no "airdrop" word anywhere, counsel review (10-legal Q3). (4) On mainnet the humans-first and points machinery must survive without SC → only the quote asset changes; points can continue as a loyalty layer with no monetary promise.

**Success metric.** Points-per-attested-human vs points-per-wallet ratio ≥ 0.9 after slashing (i.e., ≤ 10% of points end up with wallets that are not distinct humans); day-7 / day-28 retention of claimants ≥ 35% / 20%; slashed share of provisional points < 15% by Season 2 (declining trend proves the deterrent).
