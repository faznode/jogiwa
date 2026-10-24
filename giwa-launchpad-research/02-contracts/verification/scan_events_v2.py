#!/usr/bin/env python3
"""Chunked, checkpointing eth_getLogs scan of Pons launch/graduation events on Robinhood Chain.

Throwaway verification tooling (Phase 2/5). Successor to scan_events.py, which lost all
data when the agent session died because it only wrote at the end.

Differences vs v1:
  * writes one compact JSON file per event stream, checkpointed every N chunks
  * stores compact records only: [block, txhash, topic1, topic2, topic3, data]
  * samples block timestamps every STEP blocks so block->time interpolation is possible
  * resumable: re-running continues from the last checkpointed block

Outputs (raw/traces/):
  events_gen1_launches.json, events_gen2_launches.json, events_v2_launches.json,
  events_v2_graduations.json, block_timestamps.json
"""
import json, os, sys, time, urllib.request

RPC = "https://rpc.mainnet.chain.robinhood.com"
OUTDIR = sys.argv[1] if len(sys.argv) > 1 else "raw/traces"
UA = "curl/8.5 giwa-research"

GEN1_FACTORY = "0x0c37a24F5D23A486FA692d1500881d698B1F77a4"
GEN2_FACTORY = "0xA5aAb3F0c6EeadF30Ef1D3Eb997108E976351feB"
V2_FACTORY = "0x7eD598BcEf8bd9Edd8C97A195C6d13f40801EC7e"
# keccak("TokenLaunched(address,address,address,address,address,uint256,uint256,uint256,uint256,uint256)") -- Gen1/Gen2
TOPIC_LAUNCH_GEN = "0xdb51ea9ad51ab453a65a4cb7e60c3cb378c9501bb002609f8f97778fb6c4235a"
# keccak("TokenLaunched(address,address,address,address,uint256,uint256)") -- V2
TOPIC_LAUNCH_V2 = "0x8d4aad4953d0ca700d468f3753aa14432d1b35b43ec6409f051fb6aa43a89607"
# keccak("PoolGraduated(address,uint256,uint256,uint256)") -- V2 factory
TOPIC_POOL_GRADUATED = sys.argv[2] if len(sys.argv) > 2 else None

GEN1_DEPLOY = 8_600_612
GEN2_DEPLOY = 8_991_118
V2_DEPLOY = 26_841_846
TS_STEP = 500_000


def rpc(method, params, timeout=60):
    body = json.dumps({"jsonrpc": "2.0", "id": 1, "method": method, "params": params}).encode()
    req = urllib.request.Request(RPC, data=body, headers={"content-type": "application/json", "user-agent": UA})
    with urllib.request.urlopen(req, timeout=timeout) as r:
        res = json.load(r)
    if "error" in res:
        raise RuntimeError(res["error"])
    return res["result"]


def compact(log):
    t = log["topics"]
    return [int(log["blockNumber"], 16), log["transactionHash"], t[1] if len(t) > 1 else None,
            t[2] if len(t) > 2 else None, t[3] if len(t) > 3 else None, log["data"]]


def scan(label, address, topic0, from_block, to_block, start_chunk=2_000_000, checkpoint_every=10):
    path = os.path.join(OUTDIR, f"events_{label}.json")
    state = {"label": label, "address": address, "topic0": topic0, "from_block": from_block,
             "to_block": to_block, "scanned_to": from_block - 1, "complete": False, "records": []}
    if os.path.exists(path):
        try:
            prev = json.load(open(path))
            if prev.get("to_block") == to_block and prev.get("topic0") == topic0:
                state = prev
                print(f"[{label}] resuming from {state['scanned_to']} with {len(state['records'])} records", flush=True)
        except Exception as e:
            print(f"[{label}] could not resume: {e}", flush=True)
    if state["complete"]:
        print(f"[{label}] already complete ({len(state['records'])} records)", flush=True)
        return state
    cur, chunk, n = state["scanned_to"] + 1, start_chunk, 0
    t0 = time.time()
    while cur <= to_block:
        end = min(cur + chunk - 1, to_block)
        try:
            part = rpc("eth_getLogs", [{"address": address, "topics": [topic0], "fromBlock": hex(cur), "toBlock": hex(end)}])
            state["records"].extend(compact(l) for l in part)
            state["scanned_to"] = end
            cur = end + 1
            chunk = min(int(chunk * 1.25), 8_000_000)
            n += 1
            print(f"[{label}] {cur - from_block}/{to_block - from_block} blocks, logs={len(state['records'])}, chunk={chunk}, {time.time() - t0:.0f}s", flush=True)
            if n % checkpoint_every == 0:
                json.dump(state, open(path, "w"))
        except Exception as e:
            msg = str(e)
            chunk = max(chunk // 2, 20_000)
            print(f"[{label}] error {msg[:80]} -> chunk {chunk}", flush=True)
            time.sleep(3 if "429" in msg else 1)
    state["complete"] = True
    json.dump(state, open(path, "w"))
    print(f"[{label}] DONE records={len(state['records'])} in {time.time() - t0:.0f}s", flush=True)
    return state


def sample_timestamps(latest):
    path = os.path.join(OUTDIR, "block_timestamps.json")
    ts = json.load(open(path)) if os.path.exists(path) else {}
    blocks = list(range(GEN1_DEPLOY, latest, TS_STEP)) + [GEN1_DEPLOY, GEN2_DEPLOY, V2_DEPLOY, latest]
    for b in blocks:
        if str(b) in ts:
            continue
        for attempt in range(5):
            try:
                blk = rpc("eth_getBlockByNumber", [hex(b), False])
                ts[str(b)] = int(blk["timestamp"], 16)
                break
            except Exception as e:
                time.sleep(2)
    json.dump(ts, open(path, "w"))
    print(f"[timestamps] sampled {len(ts)} anchors", flush=True)


def main():
    os.makedirs(OUTDIR, exist_ok=True)
    latest = int(rpc("eth_blockNumber", []), 16)
    json.dump({"latest_block": latest, "rpc": RPC, "scanned_at": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())},
              open(os.path.join(OUTDIR, "scan_meta.json"), "w"))
    sample_timestamps(latest)
    scan("gen1_launches", GEN1_FACTORY, TOPIC_LAUNCH_GEN, GEN1_DEPLOY, latest)
    if TOPIC_POOL_GRADUATED:
        scan("v2_graduations", V2_FACTORY, TOPIC_POOL_GRADUATED, V2_DEPLOY, latest)
    scan("v2_launches", V2_FACTORY, TOPIC_LAUNCH_V2, V2_DEPLOY, latest)
    scan("gen2_launches", GEN2_FACTORY, TOPIC_LAUNCH_GEN, GEN2_DEPLOY, latest)


if __name__ == "__main__":
    main()
