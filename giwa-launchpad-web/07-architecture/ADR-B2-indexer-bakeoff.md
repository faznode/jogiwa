# ADR-B2: Indexer bake-off plan, Ponder (TypeScript) vs Rust (alloy)

**Status:** proposed (spike plan). The masterplan picked Ponder `[05 §3]`; the brief asks for a bake-off because GIWA tooling is thin (no first-class Goldsky or Subsquid support; Ponder works on any EVM RPC `[05 §3, 07 §4]`).

## Fixed contract (whichever arm wins)
The indexer is swappable because its outputs are fixed:
1. **Postgres tables** from `[05 §3]` (`launches`, `manifests`, `curve_states`, `window_deposits`, `trades`, `holders`, `graduations`, `fee_accruals`, `epochs`, `claims`, `identities`, `timelock_ops`, `guardian_pauses`...).
2. **NATS subjects** `chain.<token>` carrying deltas with a monotonically increasing `seq` per token, and `chain.head` with `{block, hash, ts}`.
3. **Health** `GET /health` → `{headBlock, chainHead, lagBlocks, lastEventTs}` read by the status page `[F23]`.
4. Reorg rule: 2-block buffer for derived tables; raw events stored at `latest` and marked final after the safe head `[05 §3]`.

## Arms
- **A. Ponder** (TypeScript, Postgres): built-in reorg handling, factory pattern for child contracts, SQL/GraphQL out of the box. Publishing to NATS needs a small plugin or a table-tail worker.
- **B. Rust**: alloy `eth_getLogs` range batching + `newHeads` subscription, an explicit block-hash chain for reorgs, sqlx writes, NATS publish in the same transaction boundary (outbox table).

## Spike setup (one week, two engineers)
- Contracts from `03-smart-contract-spec` deployed to GIWA Sepolia, plus a local OP-stack devnet (anvil with OP config) for reorg tests.
- Load generator: 100 trades/s for 30 min across 20 tokens (10× the expected Season 1 peak per hot token), 300 launches in 10 min, window settles and graduations interleaved.
- Fault injection: forced 3-block reorg (`anvil_reorg`), RPC 429 storms (proxy injects 30% failures), provider switch mid-run, process kill during backfill.

## Criteria (weighted)
| Criterion | Weight | Pass bar |
|---|---|---|
| Head lag p95 at 100 trades/s | 25 | < 3 s (KPI `[07 §2]`) |
| Reorg correctness | 20 | zero divergence from chain after the reorg test |
| RPC efficiency under rate limits | 15 | completes under 30% injected 429s without manual action; calls per block reported |
| Backfill throughput | 10 | factory genesis to head in < 30 min at Season 1 volume |
| Crash recovery | 10 | resumes from checkpoint, no duplicates, < 2 min |
| Change velocity | 10 | time to add one event + table + delta subject |
| Operations | 5 | deploy, migration, replay story |
| Cost at load | 5 | CPU/RAM on a 2 vCPU instance |

**Decision rule** `[DECISION]`: choose **Ponder** unless the Rust arm beats it on head-lag p95 by more than 2× under load, or Ponder fails the reorg or rate-limit tests. Ponder is less code to own, and the gateway (B1) consumes the fixed contract either way.

## Risks
- Ponder major-version churn: pin the version, run its test suite in CI.
- Rust arm hand-rolls reorg logic, the top source of indexer bugs: property-based tests against a chain simulator are mandatory if it wins.
- GIWA RPC quirks (Flashblocks `pending` vs `latest`) affect both arms equally: index `latest`, never `pending`.
