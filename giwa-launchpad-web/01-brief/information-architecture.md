# Information architecture

Base: masterplan sitemap `[06 §1]`. Changes are tagged **[DECISION]** with rationale.

## 1. Sitemap

```
/                         Landing (marketing, prerendered; signature 3D moment)          [DECISION: split from feed]
/discover                 Feeds: Rising, New, Graduating soon, Graduated + search + season strip   [06 §2.1 "Home"]
/t/[token]                Token page: state Window | Open | Full | Graduated                       [06 §2.2]
   /t/[token]/fairness    Fairness Card full view + manifest proof                                 [06 §1]
   /t/[token]/holders     Holders, team-wallet labels, cluster flags                               [06 §1]
/create                   Create flow (3 steps, one transaction)                                   [06 §2.3]
/verify                   Dojang verification + Season Credit claim (onboarding)                   [06 §2.4]
/portfolio                Positions, claims, P&L basics                                            [06 §2.5]
/creator                  Creator dashboard: fees, vesting, reputation                             [06 §2.6]
/u/[address]              Public profile: badge, score band, launches, season badges               [06 §1]
/season                   Season status, credit, points breakdown, method, settlement              [06 §2.7]
/leaderboard              Leaderboards, tier-labelled                                              [DECISION: own route]
/governance               Pending/executed timelock ops, Guardian pauses, audits                   [06 §2.8]
/status                   Chain, indexer, app health                                               [06 §2.8, F23]
/learn                    How it works hub; articles: window, graduation, Season Credit, risks     [06 §1, 09 §2]
/fees                     Fees and risks, one page                                                 [DECISION: brief requirement]
/legal/[doc]              terms, privacy, risk, restricted, takedown, law-enforcement              [10 §3, F24]
/restricted               Shown when the jurisdiction gate blocks access                           [F24, AC-A6]
/maintenance              Planned or emergency maintenance                                         [DECISION]
(404)                     Not found                                                                [DECISION]
/_design                  Dev-only component and state gallery                                     [brief Phase 8]
/squads, /squads/[id]     P1, not in prototype (link hidden)                                       [06 §1, F25]
```

**[DECISION] Landing split from the feed.** The masterplan's `/` is the feed. On a testnet launch most first visits are newcomers (GTM audience order `[09 §0]`) who need the three mechanics explained before a feed makes sense, and the brief asks for a landing with a signature moment. Returning visitors are sent from `/` to `/discover` by a "Discover" primary nav item that is always one click away; we do **not** auto-redirect (keeps landing prerenderable and avoids surprising back-button behaviour). Masterplan owner to confirm.

**[DECISION] `/leaderboard` own route.** The masterplan nests leaderboards in `/season`. A separate route gives a shareable URL; `/season` links to it.

**[DECISION] `/fees` page.** The brief requires a fees & risks transparency page; content is pulled from `[08 §2]` and `[10 §3]`, so nothing new is claimed.

## 2. Navigation

- **Desktop top bar:** wordmark (to `/`), Discover, Create, Season, Learn; right side: network chip (GIWA Sepolia), Season Credit balance (when connected), wallet button. Portfolio and Creator live in the wallet menu. [DECISION: Hallmark gate 42 says the "AI nav" must be decided and named; ours is named in the stamp and justified by the trading category's earned familiarity.]
- **Mobile bottom nav (5):** Discover, Create, Portfolio, Season, Me `[06 §2.1, with Home → Discover]`.
- **Testnet banner:** fixed above the top bar on every page, cannot be dismissed permanently (collapses to a chip after first acknowledgement per session) `[brief rule 5]`.
- **Footer:** Learn, Fees and risks, Status, Governance, Legal set, network facts (chain ID, explorer link), "Mock data" note in the prototype.

## 3. Page inventory with priority

| Page | Priority | Masterplan features | Prototype |
|---|---|---|---|
| Landing | P0 (brief) | thesis `[01]` | yes |
| Discover | P0 | F14, F11 strip | yes |
| Token page (4 states) | P0 | F02, F03, F05, F06, F08, F09, F10, F15 | yes |
| Fairness full / Holders | P0 | F06, F15 | yes |
| Create | P0 | F16, F06, F07 | yes |
| Verify | P0 | F04, F11, F17 | yes |
| Portfolio | P0 | F19, F10 | yes |
| Creator dashboard | P0 | F20, F21, F07, F09 | yes |
| Profile | P0 | F21, F22 | yes |
| Season | P0 | F11, F22 | yes |
| Leaderboard | P0 (inside F22) | F22 | yes |
| Governance | P0 | F12 | yes |
| Status | P0 | F23 | yes |
| Learn hub + articles | P0 | GTM `[09 §2]` | yes (hub + 4 articles) |
| Fees and risks | P0 (brief) | `[08 §2, 10 §3]` | yes |
| Legal (6 docs) | P0 | F24 | yes (placeholder bodies, see open questions) |
| Restricted, Maintenance, 404 | P0 | F24 | yes |
| Squads | P1 | F25 | no (spec only) |
