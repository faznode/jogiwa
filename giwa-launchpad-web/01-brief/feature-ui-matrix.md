# Feature → UI surface matrix

Every P0 and P1 feature from `[MASTERPLAN 02 §4]` mapped to screen, component, state and analytics event. Events are the masterplan's client events `[07 §1.2]`; events marked **(new)** are proposed additions and logged in `_open-questions.md`. Contract-only features (F01, F08, F12, F13) still get a UI surface because users must be able to *see* them.

| ID | Feature | Pri | Screen(s) | Component(s) | States | Analytics event |
|---|---|---|---|---|---|---|
| F01 | Constant-product curve, config `S, Q0, G, f` | P0 | Token, Learn | `PriceChart`, `QuoteBreakdown`, Learn article "How the curve works" | open, full | `trade_submitted{side,state,slippage}` |
| F02 | Opening window 120 s (pro-rata, caps, limit, pull claims) | P0 | Token (Window), Portfolio | `WindowPanel`, `CountdownRing`, `WindowDepositForm`, `LimitBucketPicker`, `ClaimList` | window open, settling, settled, claimable, refunded | `window_viewed`, `deposit_submitted{bucket}` |
| F03 | Humans-first window (tier gate + caps, OBW + 10 min) | P0 | Token, Verify | `TierGate` notice, `CapMeter` | gated (tier 0), allowed, humans-first ended | `verify_started{tier}` from gate CTA |
| F04 | IdentityRegistry reading Dojang EAS | P0 | Verify, Profile, wallet menu | `VerifyStepper`, `TierBadge` | not verified, attestation found, registering, verified t1/t2, failed | `verify_started/completed{tier}` |
| F05 | People-threshold graduation (G and N=25, 24 h fallback) | P0 | Token, Discover cards | `TwoTrackRing` (credit + people), `StateChip`, fallback timer | open, full-waiting, ready, graduated | `share_clicked{channel}` ("share to reach 25") |
| F06 | Launch manifest + Fairness Card | P0 | Token, Fairness page, Create step 2, pre-trade sheet | `FairnessCard` (compact/full), `ManifestProof`, `PreTradeSheet` | verified, mismatch warning (AC-A1), loading | `fairness_sheet_shown/expanded/dismissed{dwell_ms}` |
| F07 | Creator vesting vault (cliff at grad, 30 d linear, 30 d expiry) | P0 | Creator, Token (Fairness row 1), Create step 2 | `VestingBar`, release button | locked, vesting, releasable, expired | `vesting_released` **(new)** |
| F08 | Locked CPAMM pool at graduation, no LP | P0 | Token (Graduated) | `PermanentLiquidityProof`, `GraduationEventCard` | graduated | `page_view{route}` |
| F09 | FeeSplitter 40/30/30, pull claims, bountied push | P0 | Fees page, Creator, Token (QuoteBreakdown) | `FeeSplitBar`, `ClaimList` | claimable, claiming, claimed | `fees_claimed` **(new)** |
| F10 | HolderRewards daily epochs | P0 | Portfolio, Token (Graduated) | `RewardsRow`, multi-claim | accruing, claimable, claimed | `rewards_claimed` **(new)** |
| F11 | Season Credit (soulbound, daily ration by tier) | P0 | Season strip (Discover), Verify, Season | `SeasonStrip`, `CreditClaimButton` | tier 0 (no ration), claimable, claimed today, cap reached | `credit_claimed` |
| F12 | Timelock 48 h + Guardian pause + in-app pending changes | P0 | Governance, global banner | `TimelockOpCard`, `Banner(pending-change)` | pending, executable, executed, cancelled; pause active | `page_view{route:/governance}` |
| F13 | Permissionless keepers + bounties | P0 | Token (Full: graduate button), Status, Learn | `GraduateButton` with bounty, `HealthIndicator` | ready, executing, done | `graduate_clicked` **(new)** |
| F14 | Quality-ranked feeds + churn labels | P0 | Discover | `FeedTabs`, `TokenCard`, `ChurnLabel` | loading, empty, error, delayed (indexer lag) | `page_view{route}`, `feed_tab_changed` **(new)** |
| F15 | Token page: dual-track progress, window state, trade widget, holders, Fairness Card, team-wallet labels | P0 | Token | `TokenHeader`, `TwoTrackRing`, `TradePanel`, `TradesFeed`, `HoldersTable`, `WalletLabel` | Window/Open/Full/Graduated × loading/error/stale | `trade_submitted`, `trade_preconfirmed_ms`, `trade_confirmed_ms`, `simulation_failed{error}` |
| F16 | Create flow (3 steps, one tx), image safety, bilingual fields | P0 | Create | `CreateStepper`, `ImageDrop` + safety result, `FairnessCard` preview | step 1–3, image rejected, tx pending/failed, success | `create_step{n}`, `create_completed` |
| F17 | Wallet: wagmi + embedded wallet + SIWE | P0 | global | `WalletButton`, `ConnectSheet`, `NetworkSwitch`, `AddNetworkHint` | disconnected, connecting, wrong network, connected, signing | `wallet_connected{kind}` |
| F18 | Korean-first i18n (KO default) | P0 | global | `strings/en.json`, `LocaleSwitch` (hidden until KO ships) | EN only now | `page_view{locale}` — **conflict with brief (EN only), see open questions** |
| F19 | Portfolio: positions, claims, P&L basics | P0 | Portfolio | `PositionsTable`, `ClaimList`, `PnlSummary` | empty, loading, full | `page_view` |
| F20 | Creator dashboard: claims, vesting, reputation | P0 | Creator | `FeeClaims`, `VestingBar`, `ScoreRing`, `SubScoreRow` | no launches, full | `fees_claimed` **(new)** |
| F21 | Reputation score v1 (EAS) | P0 | Creator, Profile, Token header | `ScoreBand`, `CreatorBadge` | unscored, scored | none |
| F22 | Points v1 + provisional/final + public method | P0 | Season, Leaderboard, Profile | `SeasonPointsBreakdown`, `Leaderboard`, `SettlementState` | provisional, in review, final | `page_view` |
| F23 | Status: chain vs indexer health | P0 | Status, global `StaleBanner` | `HealthIndicator` ×3 | ok, degraded, down, indexer lagging (trading available, lists delayed) | `error_shown{glossary_key}` |
| F24 | Jurisdiction gate, screening, ToS/risk acceptance, takedown pages | P0 | Restricted, Legal, first-trade `RiskAcceptance` | `RiskAcceptanceSheet`, `LegalDoc` | not accepted, signing, accepted, blocked | `tos_accepted` **(new)** |
| F25 | Squads | P1 | (spec) Squads, Create step 1 | `SquadTag`, `SquadPage` | spec only | `squad_joined` **(new)** |
| F26 | Retroactive cluster slashing + appeals | P1 | Season (settlement), Profile | `SlashingStats`, `AppealLink` | spec only | none |
| F27 | Watchlists + Telegram/Kakao alerts | P1 | Token, Discover | `WatchButton`, `AlertSheet` | spec only | `alert_subscribed` |
| F28 | Launch rate limits by tier/score | P1 | Create, Creator | `LaunchLimitNote` | shown as copy in Creator | none |
| F29 | Early-holder bonus epoch | P1 | Token (Graduated) | `EarlyHolderNote` | spec only | none |
| F30 | Sunrise scheduled launches | P1 | Discover, Token (scheduled) | `ScheduledChip` | spec only | `alert_subscribed` |
| F31 | Squad battles | P1 | (spec) | — | spec only | none |
| F32 | Bahasa Indonesia locale | P1 | global | `LocaleSwitch` | deferred | `page_view{locale}` |

**Orphan check.** Every P0 screen in the IA hosts at least one feature above. Screens without a masterplan feature: Landing (thesis `[01 §2]`), Fees page (content from `[08 §2, 10 §3]`), Learn (GTM `[09 §2]`), Maintenance/404 (operational). No feature is unmapped.
