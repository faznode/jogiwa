# 12 — Mainnet Migration Playbook

Trigger: GIWA mainnet announced with a date and a published chain ID/RPC/explorer/predeploys. Design intent from 03-smart-contract-spec §7: migration is a **configuration and verification exercise**, not a code change.

## 1. Preconditions (go/no-go checklist)

| # | Precondition | Evidence required |
|---|---|---|
| 1 | GIWA mainnet live ≥ 2 weeks with stable blocks, flashblocks RPC, Blockscout, bridge | status checks logged daily |
| 2 | Dojang attesters on mainnet (Upbit, faucet-equivalent or other human attester) and schema UIDs published | attestation reads on mainnet fork |
| 3 | Audit + contest complete, no open high/critical; re-audit of any post-contest diffs | reports published |
| 4 | Legal opinions received: Q1–Q4 (KR), Q11 (ID), Q14 restricted list; decision on holder fee share on mainnet (R1) | memo in `_findings-private.md` |
| 5 | Mainnet config JSON reviewed by two engineers; parameter table approved (03 §3.6 mainnet column) | signed config hash |
| 6 | Safe (3-of-5) and Guardian (2-of-3) created on mainnet with hardware signers; drills done | Safe addresses + drill log |
| 7 | Treasury address, bounty funding, keeper wallets funded with small ETH | balances |
| 8 | Immunefi program live for mainnet scope | program URL |
| 9 | Rehearsal on fresh Sepolia deployment with mainnet config passed (§4) | rehearsal report |
| 10 | Comms ready: KO/EN/ID announcement, risk disclosure updates, ToS mainnet addendum | drafts approved |

## 2. What changes at mainnet (and what does not)

| Area | Testnet | Mainnet | Mechanism |
|---|---|---|---|
| Quote asset | `SeasonCredit` (soulbound) | WETH (`0x4200…0006`) or native ETH via router wrap | `LaunchParams.quote`; `SeasonCredit` not referenced |
| `Q0 / G` | 1,000 / 2,500 SC | 1.0 / 2.5 ETH (proposal; start conservative, can raise for future launches via timelock) | config |
| People threshold `N` | 25 | 50 proposed, informed by Season 1–2 results (E2) | config |
| Humans-first attesters | Upbit (tier 2), faucet (tier 1) | mainnet Dojang attesters as published; if none for tier 1, `humansFirst` may apply tier-2 only | `IdentityRegistry` allow-list |
| Rations / credit | daily SC | none | — |
| Points | season points | optional loyalty layer (no value) or paused | scoring job flag |
| Holder fee share | 30% | 30% **or** 0% pending counsel (R1); split table per factory version | factory v1-mainnet params |
| Fees | SC | real ETH; launch fee 0.0005 ETH | config |
| Keepers bounties | SC | ETH (5 bps, caps in ETH) | config |
| Chain params | Sepolia RPC/explorer/EAS | mainnet RPC/explorer/EAS predeploys (same `0x4200…` addresses expected on OP Stack) | `chainConfig` |
| Addresses of core contracts | deterministic | **identical** if deployer + bytecode unchanged (AC-C8) | CreateX salts |

Unchanged: contract code, window/graduation logic, vesting, pool design, timelock policy, UI (locale-aware), indexer schema (chain id column), status model.

## 3. Step-by-step

1. **Freeze**: tag release `v1.0.0-mainnet`; bytecode hash recorded; config JSON `giwa-mainnet.json` finalised and hashed.
2. **Deploy** (deployer hardware key): CreateX singletons in the fixed order (Registry → implementations → Factory → Splitter → Rewards → IdentityRegistry → Timelock/Guardian wiring) via `Deploy.s.sol`; verify predicted addresses match Sepolia.
3. **Configure**: `Configure.s.sol` sets `chainConfig`, attesters/schemas, `LaunchParams`, bounty params; emits `ChainConfigSet(configHash)`; compare with reviewed hash.
4. **Hand over**: transfer Registry/IdentityRegistry/Factory admin to the Timelock; Guardian set; deployer renounces; verify with a script that **no EOA holds any role** (04-security §4 policy).
5. **Verify sources**: Sourcify + Blockscout API v2 for every contract; publish addresses on `/governance` and in the repo.
6. **Indexer**: start a mainnet Ponder instance (separate DB), backfill from genesis of our factory; status page adds a chain selector.
7. **Smoke launch**: team launches one token with the minimum opening order; 10 attested team/alpha wallets join the window; verify settle, claims, trades, Fairness Card; let it graduate via people threshold with real humans (small `G` makes this cheap); confirm pool, fee splits, epoch finalisation, keeper bounties.
8. **Soft launch** (week 1): First 100 creators only; limits by score; monitoring on high alert; daily Fairness Report.
9. **Public**: open launches; parameters unchanged for ≥ 2 weeks; first timelock change (if any) announced with 48 h notice.
10. **Reputation carry-over**: issue `MadangSeasonBadge` attestations on mainnet for Sepolia badge holders (same wallet) from a published snapshot (I44); no monetary value.

## 4. Rehearsal (W23)
Run steps 1–9 against a **fresh** GIWA Sepolia deployment using the mainnet config (quote = WETH on Sepolia, `Q0/G` in ETH scale with Sepolia ETH), including the no-EOA-roles check, failure injections (RPC down mid-deploy, wrong config hash → abort path), and a timed drill of the Guardian pause + timelock change. Produce a rehearsal report with timings and fixes.

## 5. Rollback and contingencies
- Deployment mismatch (addresses or config hash): abort before hand-over; redeploy with corrected salt namespace `madang.v1-rc2` if bytecode changed (addresses would then differ — documented).
- Critical bug discovered post-launch: Guardian pauses new launches/deposits; existing curves still exit; timelock registers a fixed factory v1.1 after audit of the diff; UI pins versions.
- Attester unavailability: humans-first runs tier-2-only or `humansFirst = 0` for new launches via timelock; windows still clear uniformly.
- Legal red flag on holder share: deploy factory v1 with `holdersShareBps = 0` and `creatorShareBps = 55`, `protocol 45`… or any counsel-approved table; keep the 40/30/30 design for jurisdictions where permitted (future).
- GIWA mainnet delayed: continue seasons; keep the mainnet-ready tag; re-run precondition checks monthly.

## 6. Communications
- T-14 d: announcement (KO/EN/ID) with parameters, addresses to be published, what changes (table above), explicit "no token, no airdrop".
- T-1 d: addresses + verification links; risk disclosure refresh; status page mainnet selector live.
- T0: smoke launch public post; First 100 schedule.
- T+7 d: Fairness Report (mainnet #1); any parameter proposals queued with 48 h notice.
