# 09 — Go-To-Market

Positioning line (KO first): **"졸업은 봇이 아니라 사람이 시킵니다."** — "People graduate tokens, not bots." Audience order: Korean communities → Indonesian/English GIWA explorers → builders.

## 1. Testnet phases

| Phase | Weeks (11-roadmap) | Who | Goal | Exit metric |
|---|---|---|---|---|
| **Alpha (private)** | 4–7 | 15–30 hand-picked creators + team | validate J1–J5 end-to-end, window UX, Korean copy | 20 launches, 5 graduations with ≥ 15 attested buyers, SUS ≥ 70 |
| **Closed beta — Season 0** | 8–11 | 300–500 attested users via invite codes (Kakao open chats, GIWA community, 2 Indonesian communities) | run E1/E7 experiments, keeper SLA, status page | ≥ 100 launches, graduation rate ≥ 5%, D7 retention ≥ 35%, zero SEV1 |
| **Public — Season 1** | 12–15 | open; KO campaign | scale verified users, squads soft-launch | 3,000 tier-1 / 800 tier-2 users; north star ≥ 60 attested buyers per graduation |
| **Public — Season 2** | 16–19 | + ID locale, squads, battles | retention and community structure | 30% in squads; points-per-human ≥ 0.9; third-party keepers ≥ 50% |
| **Audit / contest window** | 16–22 | security community | public contest doubles as builder marketing | contest complete; fixes shipped |
| **Mainnet-ready** | 23–26 | — | playbook rehearsed (12-migration) | go/no-go |

## 2. Community strategy

Korean-first channels (07 §6):
- **KakaoTalk open chat** (main, Korean): announcements, window alerts, "graduation bells"; moderators from alpha creators; rules posted; no price talk channel separation.
- **Telegram** (KO + EN + ID rooms): bot posts windows opening, graduations, season settlements (I24 as P1 — manual at first).
- **X (KR account + EN account)**: weekly "Fairness Report" (bundled share, sell-back ratio, slashing stats) — our transparency numbers are the content.
- **DC Inside / Korean crypto communities**: participate honestly as builders, share data posts; no shilling.
- **Discord** (builders only): keeper-kit, indexer schema, EAS schema docs, bounty program.
- Indonesian: Telegram + X threads in ID from Season 2; local community partners (campus blockchain clubs).

Community rules we publish: no paid shills without disclosure; no "airdrop" talk (ToS); moderators cannot launch featured tokens.

## 3. Creator onboarding
- **"첫 100인" (First 100) program**: 100 Korean community creators onboarded by hand across Alpha/Season 0: verification concierge (Dojang steps on a call), launch rehearsal on a staging chain, Kakao share templates, OG card generator.
- Creator kit: one-pager "why your launch has a sunrise", Fairness Card explainer, vesting explainer, fee calculator (40% share), a schedule tool for KST prime time (20:00–23:00 KST) — scheduled launches (I07) arrive in Season 1.
- Creator council (10 people) meets bi-weekly; feedback → parameter experiments.
- Creator grants in SC for Season 1–2 (08-tokenomics §3); mainnet grants from the Community Grants pool.

## 4. Partnerships (priority order)
1. **GIWA core team** — ecosystem listing, RPC/flashblocks support, Dojang schema guidance, co-marketing of "humans-first" as a showcase of Dojang (07 §2 shows Dojang needs consumer apps).
2. **Dojang / Upbit attestation team** — attester allow-list confirmation, volume of Verified Address attestations, roadmap for Verified Balance (I30, P2).
3. **Infra credits** — Nodit, QuickNode (RPC, webhooks), Pinata; Vercel/Neon startup credits.
4. **Quest platforms** — only *quality* quests ("verify + join one window + hold 3 days"), never "make 10 txs"; GIWA's own quest hub first (07 §5).
5. **Korean KOLs/streamers** — with disclosure, as Season 1 "collab launches" only after moderation policy is live (I35, P2); until then, as community explainers.
6. **University blockchain societies** (KR, ID) — squads with treasuries fit their structure (S11).
7. **Security community** — contest platform; publish results.

## 5. Content plan
- Weekly: Fairness Report (data), window highlight reel (graduations with people counts), creator spotlight (KO/EN).
- Season start/end: rules post, recap with experiment results and slashing stats (07-data §3 rule).
- Evergreen `/learn`: how the window works (with a 90-second animation of the Madang ring), people threshold, vesting, Season Credit, how reputation is computed, risks.
- Research-backed posts: "What 709k launches on Robinhood Chain taught us" (05 findings, anonymised), "Why we have no token".
- Formats: Kakao-friendly images, X threads, short vertical videos for Korean platforms.

## 6. Launch-week plan (Season 1 public launch)

| Day | Action |
|---|---|
| D-7 | Rules + parameters published; KOL explainers; status page public; bounty program live |
| D-3 | Verification drive: "get your Dojang badge" guides; credit claim opens D-1 |
| D-1 | First 100 creators schedule launches for 20:00–23:00 KST slots; Telegram/Kakao bots live |
| **D0 (Tue, 20:00 KST)** | 10 curated community launches at 10-minute intervals (not simultaneous — keeps windows full); live "graduation bells" in Kakao; team on-call |
| D1 | Fairness Report #1 (window stats, clearing multiples, people counts); creator AMA (KO) |
| D2–D3 | Squad soft-launch invites; first weekly challenge announced |
| D4 | ID/EN community session; keeper-kit release for builders |
| D5–D6 | Weekend: themed launches (season theme); mid-week recap |
| D7 | Week-1 recap with experiment arms' early reads; parameter tweaks announced for Season 2 only |

## 7. Growth loops
1. **Graduation loop**: a graduation needs ≥ N people → creators recruit → recruits verify → verified people join other windows (people threshold is itself a growth mechanic).
2. **Fairness proof loop**: Fairness Reports and public method pages are shareable evidence; traders burned elsewhere share them.
3. **Squad loop** (P1): squads need members for leaderboards → invites → Kakao chats form around squads.
4. **Creator reputation loop**: score cards are shareable; high-score creators attract windows faster.
5. **Season loop**: badges and ration bumps carry to the next season; recap content re-activates.
6. **Builder loop**: public EAS schemas (scores, badges) let other GIWA apps consume our reputation → distribution for us.

## 8. Metrics per phase (summary; full in 07-data §2)

| Phase | Users (tier ≥ 1) | Launches/day | Grad rate | Attested buyers / grad | D7 retention | Ops |
|---|---|---|---|---|---|---|
| Alpha | 30 | 3–5 | — | ≥ 15 | — | no SEV1 |
| Season 0 | 300–500 | 10–30 | ≥ 5% | ≥ 30 | ≥ 35% | keepers SLA met |
| Season 1 | 3,000 | 100–300 | 5–10% | ≥ 60 | ≥ 35% | third-party keepers ≥ 30% |
| Season 2 | 6,000 | 150–400 | 5–10% | ≥ 60 | ≥ 40% | third-party keepers ≥ 50% |
| Mainnet month 1 | — | TBD | ≥ 5% | ≥ 50 | ≥ 35% | zero undisclosed changes |

Budget notes: community/content can be run by one bilingual (KO/EN) community lead plus a part-time Indonesian moderator; paid acquisition is not planned — quest and KOL spend only with quality gates.
