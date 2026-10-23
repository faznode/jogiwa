#!/usr/bin/env python3
"""Chunked eth_getLogs scan of Pons launch/graduation events on Robinhood Chain.

Throwaway verification tooling (Phase 2/5). Writes raw/traces/launch-events.json.
Adaptive chunk size: halves on RPC error/timeout, grows slowly on success.
"""
import json, sys, time, urllib.request

RPC = "https://rpc.mainnet.chain.robinhood.com"
OUT = sys.argv[1] if len(sys.argv) > 1 else "raw/traces/launch-events.json"

GEN1_FACTORY = "0x0c37a24F5D23A486FA692d1500881d698B1F77a4"
GEN2_FACTORY = "0xA5aAb3F0c6EeadF30Ef1D3Eb997108E976351feB"
V2_FACTORY = "0x7eD598BcEf8bd9Edd8C97A195C6d13f40801EC7e"
TOPIC_LAUNCH_GEN = "0xdb51ea9ad51ab453a65a4cb7e60c3cb378c9501bb002609f8f97778fb6c4235a"
TOPIC_LAUNCH_V2 = "0x8d4aad4953d0ca700d468f3753aa14432d1b35b43ec6409f051fb6aa43a89607"

def rpc(method, params, timeout=60):
    body = json.dumps({"jsonrpc": "2.0", "id": 1, "method": method, "params": params}).encode()
    req = urllib.request.Request(RPC, data=body, headers={"content-type": "application/json", "user-agent": "curl/8.5 giwa-research"})
    with urllib.request.urlopen(req, timeout=timeout) as r:
        res = json.load(r)
    if "error" in res:
        raise RuntimeError(res["error"])
    return res["result"]

def keccak_topic(sig):
    # computed offline with cast; stored to avoid a dependency here
    return {
        "PoolGraduated(address,uint256,uint256,uint256)": "0x" + "0" * 64,  # placeholder, replaced below
    }.get(sig)

def scan(address, topic0, from_block, to_block, start_chunk=2_000_000, label=""):
    logs, chunk, cur = [], start_chunk, from_block
    t0 = time.time()
    while cur <= to_block:
        end = min(cur + chunk - 1, to_block)
        try:
            part = rpc("eth_getLogs", [{"address": address, "topics": [topic0], "fromBlock": hex(cur), "toBlock": hex(end)}])
            logs.extend(part)
            cur = end + 1
            chunk = min(int(chunk * 1.25), 8_000_000)
            print(f"[{label}] {cur-from_block}/{to_block-from_block} blocks, logs={len(logs)}, chunk={chunk}, {time.time()-t0:.0f}s", flush=True)
        except Exception as e:
            chunk = max(chunk // 2, 20_000)
            print(f"[{label}] error {str(e)[:80]} -> chunk {chunk}", flush=True)
            time.sleep(1)
    return logs

def main():
    latest = int(rpc("eth_blockNumber", []), 16)
    out = {"latest_block": latest, "rpc": RPC, "scanned_at": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())}
    # Gen1 / Gen2 launches (same topic, different addresses)
    out["gen1_launches"] = scan(GEN1_FACTORY, TOPIC_LAUNCH_GEN, 8_600_612, latest, label="gen1")
    out["gen2_launches"] = scan(GEN2_FACTORY, TOPIC_LAUNCH_GEN, 8_991_118, latest, label="gen2")
    out["v2_launches"] = scan(V2_FACTORY, TOPIC_LAUNCH_V2, 26_841_846, latest, label="v2")
    # V2 graduation events: all topics from factory, filtered client-side later (topic list passed separately)
    out["v2_pool_graduated"] = scan(V2_FACTORY, sys.argv[2], 26_841_846, latest, label="v2grad") if len(sys.argv) > 2 else []
    with open(OUT, "w") as f:
        json.dump(out, f)
    for k in ("gen1_launches", "gen2_launches", "v2_launches", "v2_pool_graduated"):
        print(k, len(out[k]))

if __name__ == "__main__":
    main()
