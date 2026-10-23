# REA Playbook (Step 0)

Mission: reverse-engineer Pons Family (ponsfamily.com) and plan an original GIWA launchpad.
Research date: 2026-10-24. Sandbox: Amazon Linux 2023 (glibc 2.34), Node 24.16.0, pnpm 12.3.4.

## Pinned toolchain

| Tool | Version | How installed | Status |
| --- | --- | --- | --- |
| REA (`rea-agents`) | **6.7.0** (`npx -y rea-agents@6.7.0`) | `npx -y rea-agents@latest doctor --json` run 2026-10-24 | Works. `node` 24.16.0 OK, host OK, `/usr/bin/ps` + `/usr/bin/prlimit` present (required by EVM + JS tools). Native engines (Hopper/Ghidra/IDA/JADX/Kuna) absent and **not needed** for this mission. |
| Foundry `forge` / `cast` | 1.5.1-stable (b0a9dd9) | direct tarball `foundry_stable_linux_amd64.tar.gz` → `/tmp/rea-tools/` | Works. |
| Foundry `anvil` | 1.5.1 / 1.8.6 | both tarballs | **FAILS**: needs GLIBC 2.35, host has 2.34. Fork simulation therefore uses `forge test --fork-url` (in-process fork, no anvil needed). |
| Sourcify API | v2 (`sourcify.dev/server/v2`) | HTTP | Works for Robinhood Chain (chainId 4663 listed as supported). |
| Blockscout `robinhoodchain.blockscout.com` | API v2 | HTTP | **Blocked for curl by Cloudflare JS challenge** ("Just a moment..."). Not usable headless. Sourcify + raw RPC replace it. |
| Robinhood Chain RPC | `https://rpc.mainnet.chain.robinhood.com` | JSON-RPC | Works; `eth_chainId`=4663; `eth_getLogs` needs bounded ranges (docs warn, confirmed). |
| GIWA Sepolia RPC | `https://sepolia-rpc.giwa.io` | JSON-RPC | Works; `eth_chainId`=0x164ce=91342. Rate-limited per docs. |
| `agent-browser` | 0.33.2 | pre-installed | Real Chromium; runs in a separate browser sandbox (curl/jq unavailable there). Use for CF-protected pages and UX teardown screenshots. |

REA setup note: `npx -y rea-agents setup --yes --dry-run --json` returns `status: planned` with no client registrations (no supported agent client in this VM). REA is used here **as a CLI** (same workflows/evidence contracts as the MCP server). `rea setup` only writes agent MCP registrations; it is unnecessary for CLI use.

## What REA can and cannot do (per docs read: README, AGENTS.md, installation, cli, evm-bytecode, browser-observation, web-network-captures; skimmed mcp-contracts catalog, javascript-application-workflows, javascript-artifact-reconstruction, android-analysis, native-investigation)

Design principles REA enforces (carry into our reports): every result is Evidence with provenance, coverage (`complete_within_window` / `attach_limited` / `truncated`) and explicit **limitations**; observations vs inferences vs unknowns are separated; nothing is uploaded; targets are never executed by static tools.

### Target → REA tool routing table for THIS mission

| Target | REA tool (CLI) | Notes / limits | Fallback used |
| --- | --- | --- | --- |
| EVM runtime bytecode (unverified contracts: Gen1 factory `0x0c37…`, Gen1 locker `0x31ca…`) | `rea inspect-evm-interface <file.hex> hex --json` | Offline EVMole 0.9.3: recovers **selectors, arg types, mutability** (inferences). Does **not** look up names, resolve proxies, read storage, or trace. Needs `prlimit`. 4 MiB input max. EOF containers unsupported. | `cast 4byte <selector>` / `cast 4byte-event` (openchain + 4byte.sourcify.dev) for names; `cast code` to pull bytecode; Sourcify for verified sources; `cast storage` for slots. |
| Verified contracts (Gen2, V2 suite, Uniswap) | not an REA target | Sourcify v2 `?fields=all` gives sources, ABI, metadata, deployment tx, constructor args, proxy resolution. | n/a |
| Transaction behavior / traces | not in REA (no RPC/trace authority) | | `cast run <tx> --rpc-url` (replays with internal trace, no debug_* RPC needed), `cast receipt`, `cast logs`, `forge test --fork-url` for fork tests. |
| Web app JS bundles (ponsfamily.com `_next/static/chunks/*.js`) | `rea analyze-web-bundle http://127.0.0.1:9222 TARGET_ID` (needs live CDP) or `rea analyze-javascript-application <dir>` on exported scripts (`rea export-web-scripts`) | CDP endpoint must be loopback to the REA process. The agent-browser Chromium lives in a different sandbox, so **CDP attach is not possible here**. Static route/endpoint candidates never prove reachability. | Downloaded chunks with curl; grep/regex extraction of ABI fragments, API routes, hosts; `rea analyze-javascript-application` on the downloaded chunk directory for module/import graph. |
| Browser runtime observation (network, WS, console, storage) | `rea inspect-web-page`, `rea observe-web-session` (passive CDP) | Same CDP constraint. Captures values only as shapes (JSON body shapes, WS frame shapes), never values. | agent-browser snapshots + manual HAR-less observation; direct curl of discovered API routes for response schemas. |
| Saved network captures | `rea inspect-web-network-capture <file.har> har --json` → `inspect-analysis-view` with `api-surface` view (groups by method/origin/path template) | Offline, HAR 1.2 only. Credentials redacted structurally. | We produce HAR-like JSON from curl probes if no HAR export is available. |
| Website screenshots | `rea capture-web-screenshot` | CDP constraint | `agent-browser screenshot` |
| Android / native / pcap / firmware | `rea` jadx/ghidra/tshark providers | Not reached in this mission (Pons has no native app we target). | n/a |

### Exact commands used

```bash
# health + version pin
npx -y rea-agents@latest doctor --json
npx -y rea-agents@latest --version        # 6.7.0

# EVM interface recovery for unverified bytecode
/tmp/rea-tools/cast code 0x0c37a24F5D23A486FA692d1500881d698B1F77a4 --rpc-url https://rpc.mainnet.chain.robinhood.com > raw/bytecode/gen1-factory.hex
npx -y rea-agents@6.7.0 inspect-evm-interface raw/bytecode/gen1-factory.hex hex --json > raw/bytecode/gen1-factory.rea.json
/tmp/rea-tools/cast 4byte 0xdeadbeef          # name lookup for each recovered selector

# static JS application reconstruction on downloaded chunks
npx -y rea-agents@6.7.0 analyze-javascript-application /abs/raw/bundles/js --json > raw/bundles/rea-js-app.json

# Foundry fork verification (no anvil)
/tmp/rea-tools/forge test --fork-url https://rpc.mainnet.chain.robinhood.com --fork-block-number <N> -vv
/tmp/rea-tools/cast run <txhash> --rpc-url https://rpc.mainnet.chain.robinhood.com   # trace a real tx
```

## Known limits (discovered during the run)

1. **No CDP attach**: REA browser tools need a loopback CDP endpoint; the VM's Chromium is in a separate sandbox. All browser-side observation therefore comes from agent-browser (snapshots/screenshots) and static bundle analysis. Network capture completeness is `attach_limited` at best.
2. **anvil unusable** (glibc). `forge test --fork-url` covers fork simulation; `cast run` covers tx tracing.
3. **Blockscout behind Cloudflare** for non-browser clients. Sourcify is the verification source of truth; deployment metadata (deployer, block, tx) comes from Sourcify `deployment` and from RPC.
4. **REA EVM tool is interface-only** (no decompiler). For unverified Gen1 contracts we get selectors + mutability only; function names come from 4byte databases (may miss custom names). Storage/behavior stays `[UNKNOWN]` unless cross-checked with tx traces.
5. REA `setup` found no agent client here; `skill:identity` reports `config_drift` (skill not installed) — irrelevant for CLI use.
6. Robinhood public RPC: `eth_getLogs` over wide ranges times out; chunked scans required (documented by Pons too).
