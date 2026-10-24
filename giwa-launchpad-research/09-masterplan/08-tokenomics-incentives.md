# 08 — Tokenomics & Incentives

## 1. Do we need a platform token? (both sides, then a decision)

**For a token**
- Distribution lever: Pons used PONS fee-share/buyback narratives to retain holders (01 recon; 02 §5 v1 docs); pump.fun and LetsBONK use tokens for buy-and-burn engines [WEB 06].
- Governance surface: parameters (`N`, window, splits) could be voted.
- Fundraising and community ownership signals in a Korean market that watches Upbit listings closely (07 §6).

**Against a token (now)**
- Legal exposure: Korea's ICO ban and VAUPA regime; a token issued by the operator of a fee-earning venue is the highest-risk configuration (10-legal Q1–Q3). A fee-share or burn token looks like a security under the Capital Markets Act test; this can end the project before it starts.
- Measurement pollution: on a quest-farmed testnet (07 §5), any hint of an airdrop converts every metric into a farming metric; our season economy only works if points cannot be "cashed".
- Product truth: the value proposition is fairness to people; a token whose price depends on launch volume recreates the incentive we criticise in Pons (M27).
- Engineering and audit cost; a token adds a second economic system to secure.

**Decision (ADR-10):** **No platform token through mainnet launch.** Season badges are soulbound EAS attestations with no monetary promise. Revisit only if all are true: mainnet live ≥ 6 months, counsel opinion in Korea and Indonesia on the specific design, a non-financial governance need that a token solves better than a council, and a design where the token never receives protocol fees.

## 2. Fee model

| Flow | Rate | Split | Notes |
|---|---|---|---|
| Curve trade fee | 1% of quote leg | 40% creator · 30% holders · 30% protocol | Pons 1% at 70/30 (02 §1); pump.fun 1.25% [WEB] |
| Pool trade fee (post-grad, forever) | 1% of quote leg | 40 / 30 / 30 | Pons hook 1% captured 100% by protocol/creator split [SOURCE 02 §7] |
| Creator tax (optional) | 0–3% | 100% creator | capped at 3% (Pons 10%); printed on the Fairness Card |
| Launch fee | 1 SC (testnet) / 0.0005 ETH (mainnet) | protocol | spam deterrent; Pons 0.0005 ETH |
| Keeper bounties | 5 bps of moved amount (caps) | from protocol share | pays third parties to run keepers |
| Season Credit | rationed mint, burned at season end | — | testnet only |

Protocol revenue use (mainnet): ops and infra first; then audits/bounty reserve; then a **Community Grants** pool (creator grants, squad prizes) sized at ≤ 30% of protocol revenue, governed by the Safe with public reporting. Protocol share may be lowered by timelock for future launches if holders/creators need more; it is never raised above 30% without a public comment period.

Illustration (mainnet, hypothetical): if Madang processes 100 ETH/day of curve+pool volume, fees are 1 ETH/day → creators 0.4, holders 0.3, protocol 0.3 ETH/day. Pons' protocol take is 0.3% of curve volume (05 §2.7, §7 benchmark table) and its October run-rate fell to ~5% of the September peak, so a launchpad's fee income is volatile and front-loaded — which is why audits and the bounty reserve are budgeted upfront (11-roadmap), not from revenue.

## 3. Creator incentives
- **Money**: 40% of all fees forever (curve and pool), claimable any time (S6); creator tax up to 3% if the community accepts it (visible).
- **Reputation**: score 0–100 with sub-scores (S7) → launch limits (1/3/10 per day), featured eligibility, humans-first cap multiplier for their own opening order? No — caps stay equal to keep windows fair; perks are discovery and limits, never price.
- **Season grants**: top creators by *retention-weighted graduations* receive SC grants on testnet (spendable only in-app) and, on mainnet, ETH grants from the Community Grants pool with public criteria.
- **Streaks (P1)**: consecutive weeks with a graduated token that keeps ≥ 40 holders at +7 d → fee-share boost +5 points (from protocol share) for the following week; broken by any detected team-cluster dump (I16).
- **Squad launches (P1)**: part of the creator share flows to the squad treasury per manifest (S11).

Creator anti-incentives (what we deliberately do not reward): launch count, raw volume, number of holders without retention, self-trading.

## 4. Testnet points & season design (S12)

### 4.1 Season Credit (SC)
- Soulbound ERC-20; only market contracts can move it; daily `claimDaily` by tier (tier 0: 0; tier 1: 20; tier 2: 50 SC; 7-day accumulation cap).
- Sell proceeds return SC → active traders recycle; holders keep tokens (which is what we want measured).
- Unspent SC from a season burns at season end; season badges record outcomes.
- Why scarcity works: with `G = 2,500 SC` and caps of 50/125 SC, no single wallet can graduate a token; coordination of ≥ 20–50 attested people is required — graduation becomes a social act (S3).

### 4.2 Points (quality-only; per season)
| Category | Formula (per wallet, per season) | Weight | Caps / notes |
|---|---|---|---|
| Counterparties | Σ over tokens bought of `log2(1 + distinct attested co-buyers)` | 30 | tier-weighted co-buyers (tier 2 = 1.0, tier 1 = 0.5) |
| Holding | Σ `held_days × min(position_share, 2%)` over tokens alive at season end or graduated | 25 | zero for tokens dead < 1 h after your buy |
| Creator quality | graduations with ≥ N attested buyers × retention factor (+7 d holders / N) | 20 | capped at 5 launches/season counted |
| Curation | watchlisted/shared tokens that later graduate with ≥ N people (precision-weighted) | 15 | capped per day to deter spray |
| Squad (P1) | squad's retention-weighted graduations shared among active members | 10 | membership ≥ 14 days |
| **Zero** | tx count, volume, launches, referrals without quality gate | 0 | explicit |

Provisional daily; final 7 days after season end; slashing of cluster wallets to zero with published method; appeal window 7 days.

### 4.3 Season calendar
4-week seasons; Season 0 (closed beta) → Season 1 (public) → Season 2 (ID locale, squads). Each season: theme (K-culture calendar, I33), parameter experiment set (07-data §3), recap post with results and slashing stats.

### 4.4 What points buy
Nothing monetary. Season badges (soulbound EAS) → next season's ration tier bump (+10 SC/day for top 10%), profile flair, early access to Sunrise launches (P1), eligibility for creator grants (SC). On mainnet: reputation carry-over (I44), no token, no airdrop — stated in ToS and UI.

## 5. Sybil resistance (layers)
1. **Identity tiers** from Dojang (Upbit attester > faucet attester), tier 0 cannot deposit in windows or claim credit (S2).
2. **Rationing**: credit is the binding constraint, not gas; multiplying wallets multiplies attestation effort (faucet-tier only) and yields capped tier-1 allocations.
3. **Caps**: per-wallet window caps by tier; people threshold counts tier ≥ 1 recipients once.
4. **Detection**: funding-graph clustering (first funding tx / common funders via Blockscout API), timing correlation (same-second actions across wallets), circular trading (A buys, B sells to A repeatedly), identical limit buckets and amounts; confidence-scored.
5. **Retroactive slashing** of points (never of tokens or graduation), public method hash, provisional window, appeals.
6. **Reputation feedback**: creators whose launches are dominated by clusters lose score → lower limits, no featured slots.

## 6. Anti-farming rules (published)
- No points for transactions, volume, launches, or holding dead tokens.
- Points for counterparties count distinct attested humans; wallets in one detected cluster count as one.
- Holding points use `min(position, 2% of supply)` — concentration beyond that earns nothing.
- Curation points require precision (shares/watchlists of tokens that later graduate with ≥ N people), capped daily.
- Referral (P1) credits only after the referee reaches 5 distinct counterparties and 7-day retention (I40).
- Season Credit cannot be transferred; attempts are logged and count toward cluster suspicion.
- Any wallet found operating > 3 attested identities (e.g., via revoked/duplicate attestations) is excluded from the season.
- Changes to rules apply from the next season only and are announced ≥ 7 days before it starts.
