# Phase 6 — Competitive Landscape

Scope: Robinhood Chain peers (Pools.trade incl. Crowd Launch, Lemon.fun, NOXA), category leaders (pump.fun, four.meme, LetsBONK), Base's hook-native generation (Zora, Clanker, Flaunch), and the two launchpads already on our target chain (GIWA.MARKETS, MemeFab.fun). Evidence: Pons rows are [ONCHAIN]/[OBSERVED] from Phases 2–5; competitor rows are [DOCS] from live web searches on 2026-10-24 (summaries captured in `_evidence-index.md` E6-*; result URLs were not returned by the search tool — OQ-6.2 lists them for re-verification) or [OBSERVED] where a site was fetched directly (giwa.markets). Cells marked `?` are [UNKNOWN].

## 1. Snapshot (Oct 2026)

| Platform | Chain | Model | Status / notable |
|---|---|---|---|
| Pons Family V2 | Robinhood Chain | constant-product curve w/ virtual reserve → Uniswap v4 + fee hook | live; 709k launches, −95% from Sep peak |
| Pools.trade | Robinhood Chain | **Instant Launch** (pool immediately) or **Crowd Launch** (4-hour auction, $10k FDV minimum else refund) → Uniswap v4; no platform fee; 0.25% LP fee of which 0.20% auto-compounds into permanently locked liquidity; optional 0.05% creator fee | built by Uniswap Labs; live since 2026-08-05 |
| Lemon.fun | Robinhood Chain | curve → Uniswap V3 / SushiSwap V3; creator-configurable allocations, taxes, caps; LP locked | live |
| NOXA | Robinhood Chain | direct-to-pool: mint + single-sided Uniswap V3 (1% tier) in one tx, LP permanently locked, no graduation; fees 50/50 creator/platform | live |
| pump.fun | Solana | curve → PumpSwap; 1.25% curve fee (0.30% creator / 0.95% protocol) + 0.45% app fee since 2026-10-17; 0.015 SOL migration fee; creator fee on PumpSwap scales with market cap | category leader |
| four.meme | BNB Chain | curve, 1% fee, graduates to PancakeSwap at 18 BNB; no published creator share | BNB leader |
| LetsBONK.fun | Solana | 1.5% fee, Raydium graduation, BONK buy-and-burn, no guaranteed creator rewards | ecosystem-token flywheel |
| Zora | Base | creator/content coins, 1% v4 hook fee split 50% creator / 20% platform referral / 4% trade referral / 1% Doppler / 5% protocol / 20% LP preservation | social-first |
| Clanker | Base | Farcaster-native; full supply single-sided into v4; creator sets LP fee, protocol takes 20% of LP fees | agent/social launches |
| Flaunch | Base | creator chooses 0–100% revenue split streamed in ETH via "Memestream" NFT; Progressive Bid Wall hook = automated community buybacks; launch fee 0.1% of creator-set market cap | buyback-native |
| **GIWA.MARKETS 기와마켓** | GIWA Sepolia (+ $GIWA token on Robinhood Chain) | pump-style curve, graduation when 800M (80%) sold, locked pool; **five launch modes**; EN/KO UI; 70% of protocol fees buy-and-burn $GIWA ("fee engine"); promises 1:1 migration to GIWA mainnet; also hosts "genesis" RWA-style tokens ($SEMI, $HBM) | **direct incumbent on our chain** [OBSERVED https://giwa.markets] |
| MemeFab.fun | GIWA Sepolia | listed in GIWA ecosystem DeFi category; details ? | [DOCS] ecosystem list (OQ-6.3) |

## 2. Feature matrix (Y = yes, P = partial, N = no, ? = unknown)

| # | Feature | Pons V2 | Pools.trade | Lemon | NOXA | pump.fun | four.meme | LetsBONK | Zora | Clanker | Flaunch | GIWA.MARKETS |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | Bonding curve phase | Y | N (instant) / auction (crowd) | Y | N | Y | Y | Y | N | N | P | Y |
| 2 | Virtual-reserve pricing | Y | n/a | ? | n/a | Y | Y | Y | n/a | n/a | ? | ? |
| 3 | Launch + first buy in one tx | Y | ? | ? | Y | Y | Y | Y | Y | Y | Y | ? |
| 4 | Choice of quote asset (stables/stocks) | Y (ETH/USDG/NVDA/SPCX/SPY) | ? | ? | N | N (SOL) | N (BNB) | N | N | P | N | ? |
| 5 | Platform launch fee | 0.0005 ETH | 0 | ? | ? | 0 | 0 | 0 | 0 | 0 | 0.1% of mcap | ? |
| 6 | Trading fee (curve) | 1% | 0.25% LP | ? | 1% tier | 1.25%+0.45% | 1% | 1.5% | 1% | creator-set | creator-set | ? |
| 7 | Creator fee share | 70% | 0.05% opt. | config | 50% | 24% (0.30/1.25) | 0 | 0 | 50% | 80% of LP fee | 0–100% | ? |
| 8 | Creator-set tax on trades | Y (≤10%) | N | Y | N | N | N | N | N | N | N | ? |
| 9 | Holder fee sharing | Y (rounds) | N | ? | N | N | N | N | N | N | N | ? |
| 10 | Automated buyback | Y (50% of creator bucket, 5y lock) | N (fee compounding) | ? | N | protocol-level PUMP buybacks | N | BONK burn | N | N | Y (bid wall) | Y (burn $GIWA) |
| 11 | Snipe/anti-bot tax window | Y (99%→0 in 3 s) | N | ? | N | N | N | N | N | N | N | ? |
| 12 | Creator-controlled snipe exemptions | Y (≤32) | N | ? | N | N | N | N | N | N | N | ? |
| 13 | Time-boxed / auction launch | N | Y (Crowd Launch 4 h) | N | N | N | N | N | N | N | P (fair launch window) | ? (5 modes) |
| 14 | Refund if not funded | N | Y | N | n/a | N | N | N | n/a | n/a | N | ? |
| 15 | Graduation threshold | 4.2 ETH real quote | $10k FDV | ? | none | curve sellout | 18 BNB | sellout | none | none | none | 80% supply |
| 16 | Graduation target | Uni v4 + hook | Uni v4 | Uni/Sushi V3 | Uni V3 | PumpSwap | PancakeSwap | Raydium | Uni v4 | Uni v4 | Uni v4 | own locked pool |
| 17 | LP permanently locked | Y | Y | Y | Y | protocol-owned | Y | Y | Y | Y | Y | Y |
| 18 | Post-graduation fee capture for creator | Y (hook) | P | ? | Y | Y (scaled) | N | N | Y | Y | Y | ? |
| 19 | Permissionless graduation | Y | auto | ? | n/a | auto | auto | auto | n/a | n/a | n/a | ? |
| 20 | Vesting for creator allocation | N | N | config | N | N | N | N | N | Y (vault opt.) | N | ? |
| 21 | Verified creator / identity | P (allow-list, X link) | ? | ? | ? | P (socials) | P | P | Y (Zora profile) | Y (Farcaster) | P | ? |
| 22 | Serial-deployer flag | Y | ? | ? | ? | N | N | N | N | N | N | ? |
| 23 | Wallet screening / geo gating | Y | ? | ? | ? | Y | ? | ? | ? | ? | ? | ? |
| 24 | Comments / chat on token page | N | ? | ? | ? | Y | Y | Y | Y (posts) | via Farcaster | ? | ? |
| 25 | Referral program | P (routes exist) | ? | ? | ? | Y | Y | Y | Y (20%+4%) | N | N | ? |
| 26 | Points / seasons / quests | N | ? | ? | ? | Y (rewards) | Y | Y | N | N | N | ? (testnet) |
| 27 | Embedded wallet / social login | Y (Turnkey) | ? | ? | ? | Y | Y | Y | Y | Y (Farcaster) | ? | ? |
| 28 | Realtime feed + simulation | Y (Ably, eth_simulateV1) | ? | ? | ? | Y | Y | Y | Y | Y | Y | ? |
| 29 | Korean UI | N | N | N | N | P | P | N | N | N | N | **Y** |
| 30 | Platform token value capture | PONS (OQ) | none | ? | ? | PUMP buybacks | ? | BONK | ZORA | none | FLAY | $GIWA burn |
| 31 | Open-source / verified contracts | verified (Sourcify) | Uniswap OSS | ? | ? | partly | ? | ? | OSS | OSS | OSS | ? |
| 32 | Timelocked admin | N | n/a | ? | ? | ? | ? | ? | ? | ? | ? | ? |

## 3. Graduation design comparison

| Design | Who | Pros | Cons (observed) |
|---|---|---|---|
| Quote-threshold curve → DEX pool (4.2 ETH) | Pons, pump.fun, four.meme | simple, auto, price-continuous | bundled in seconds (Pons median 250 s); threshold is a bot target |
| Supply-threshold curve (80% sold) | GIWA.MARKETS | denominated in tokens, not price | same bundling incentive |
| Time-boxed auction with minimum FDV + refund | Pools.trade Crowd Launch | neutralises speed; failed launches refund; fair clearing price | 4 h wait kills impulse; still gameable by late-window whales |
| No graduation (direct single-sided pool) | NOXA, Clanker, Pools Instant | zero migration risk, immediate DEX composability | no "progress bar" game loop; whales buy the whole lower range |
| Direct pool + bid-wall buyback hook | Flaunch | continuous support below price | complexity; buyback liquidity is only as good as fee flow |

## 4. Anti-sniper / anti-rug designs seen

- **Decaying launch tax** (Pons 99%→0 in 3 s; exemptions) — effective against outsiders, weaponised by insiders.
- **Auction clearing** (Pools Crowd Launch) — removes block-position advantage entirely.
- **CAPTCHA-gated / human-only windows, multi-wallet neutralisation, fee-change caps** — reported "fair launch" features across Solana launchpads [DOCS web search 2026-10-24].
- **Permanent LP lock / protocol-owned LP** — universal; solves liquidity rug, not supply rug.
- **Creator vesting** — rare (Clanker optional vault); Pons has none → 48% of sampled non-graduated deployers sold on the curve.
- **Fee-change caps / immutability** — Pons hard-caps (≤10% fee, ≤20% total) but owner can change within caps instantly (no timelock).
- **Serial-deployer labelling** — Pons only.

## 5. Creator-incentive designs

| Lever | Best-in-class example | Pons |
|---|---|---|
| Fee share | Flaunch 0–100% configurable; Zora 50% automatic per swap | 70% of 1% (needs keeper sweep) |
| Streaming payout | Flaunch Memestream NFT (transferable revenue right) | discrete sweeps/rounds |
| Buyback for the community | Flaunch bid wall; Pons 5-year vault | locked, not price-supportive |
| Social distribution | Zora/Clanker via Farcaster graph | X link only |
| Referral | Zora 20% platform + 4% trade referral | hidden `/ref` |
| Identity | Zora profiles, Farcaster FIDs | none → opportunity for **Dojang** |

## 6. Unsolved user pains (mined from Phases 2–5 + public reporting)

1. **Bundling/sniping decides winners in the first second** — 100% of sampled Pons graduations bundled; retail enters after the curve is sold.
2. **Insider exemptions are invisible** before launch (Pons snipe whitelist, $18.43M operation).
3. **Fake volume and sell-back churn** — median non-graduated Pons curve sees 96% of buys sold back; discovery sorts by volume reward it.
4. **Dev dumps** — 48% of non-graduated deployers sold; no vesting anywhere mainstream.
5. **Graduate-and-forget** — no post-graduation incentives for holders; LP fee 0 on Pons pools; "74% of retail lose money" narrative.
6. **Keeper-dependent creator income** (sweeps, rounds) — payouts stall when ops stall.
7. **Opaque admin** — no timelocks; fee params changeable instantly.
8. **Indexer-dependent UX** — explorer/indexer failure read as "chain down" (Sep 4).
9. **No trust/identity layer** — serial deployers only flagged by one platform; no verified-human or verified-exchange-customer signal.
10. **Language/locale** — English-only on Pons; Korean users get translated-later UX; GIWA.MARKETS is the only bilingual one.
11. **Testnet-value problem** (GIWA-specific) — activity is quest-farmed (2.8M txs/day, 158M addresses); nobody has solved meaningful testnet trading.
12. **Trademark/positioning confusion on GIWA** — a third-party "$GIWA" token and "GIWA.MARKETS" brand pre-empt the namespace; users may conflate it with Dunamu (legal register item).

## 7. Open questions
- OQ-6.1 Pons public-footprint URLs (carried from Phase 1).
- OQ-6.2 Source URLs for competitor fee facts (search summaries only); re-verify Pools.trade docs, pump.fun fee page, Zora/Clanker/Flaunch docs before quoting externally.
- OQ-6.3 MemeFab.fun and GIWA.MARKETS fee rates / launch modes (needs browser observation; site is JS-rendered).
- OQ-6.4 Korean-market launchpads beyond GIWA (none found with Korean-first UX other than GIWA.MARKETS).
