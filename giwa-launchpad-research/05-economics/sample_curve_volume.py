#!/usr/bin/env python3
"""Stratified random sample of V2 ETH-pair curves: fetch CurveBuy/CurveSell logs per curve and
summarise volume, fees, trader counts, deployer behaviour. Throwaway Phase 5 research tooling.

Writes raw/traces/curve_sample.json (checkpointed) and prints a summary.
Sample: 180 non-graduated + 60 graduated ETH-pair launches, seed 20261024.
"""
import json, os, random, sys, time, urllib.request, statistics

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
TR = os.path.join(ROOT, "raw", "traces")
RPC = "https://rpc.mainnet.chain.robinhood.com"
UA = "curl/8.5 giwa-research"
TOPIC_BUY = "0x" + sys.argv[1] if len(sys.argv) > 1 and not sys.argv[1].startswith("0x") else (sys.argv[1] if len(sys.argv) > 1 else None)
TOPIC_SELL = sys.argv[2] if len(sys.argv) > 2 else None
N_NONGRAD, N_GRAD, SEED = 180, 60, 20261024


def rpc(method, params, timeout=60):
    body = json.dumps({"jsonrpc": "2.0", "id": 1, "method": method, "params": params}).encode()
    req = urllib.request.Request(RPC, data=body, headers={"content-type": "application/json", "user-agent": UA})
    with urllib.request.urlopen(req, timeout=timeout) as r:
        res = json.load(r)
    if "error" in res:
        raise RuntimeError(res["error"])
    return res["result"]


def rpc_retry(method, params):
    last = None
    for i in range(8):
        try:
            return rpc(method, params)
        except Exception as e:
            last = e
            time.sleep(2 + i * 2)
    raise RuntimeError(f"rpc failed: {last}")


def addr(t):
    return "0x" + t[-40:]


def words(data):
    h = data[2:]
    return [int(h[i:i + 64], 16) for i in range(0, len(h), 64)]


launches = json.load(open(os.path.join(TR, "events_v2_launches.json")))
grads = json.load(open(os.path.join(TR, "events_v2_graduations.json")))
latest = launches["to_block"]
grad_tokens = set(addr(r[2]) for r in grads["records"])
eth = [r for r in launches["records"] if words(r[5])[0] == 0]
non = [r for r in eth if addr(r[2]) not in grad_tokens]
gr = [r for r in eth if addr(r[2]) in grad_tokens]
random.seed(SEED)
sample = [("non", r) for r in random.sample(non, N_NONGRAD)] + [("grad", r) for r in random.sample(gr, N_GRAD)]

path = os.path.join(TR, "curve_sample.json")
state = json.load(open(path)) if os.path.exists(path) else {"seed": SEED, "latest": latest, "topics": [TOPIC_BUY, TOPIC_SELL], "curves": {}}
t0 = time.time()
for i, (kind, r) in enumerate(sample):
    b, tx, t_token, t_curve, t_dep, data = r
    curve, token, dep = addr(t_curve), addr(t_token), addr(t_dep)
    if curve in state["curves"]:
        continue
    # RPC allows <=10M-block spans per eth_getLogs; walk 8M-block windows and stop after the
    # first window with no buy or sell activity (curve activity is front-loaded).
    buys, sells = [], []
    cur = b
    while cur <= latest:
        end = min(cur + 8_000_000 - 1, latest)
        wb = rpc_retry("eth_getLogs", [{"address": curve, "topics": [TOPIC_BUY], "fromBlock": hex(cur), "toBlock": hex(end)}])
        ws = rpc_retry("eth_getLogs", [{"address": curve, "topics": [TOPIC_SELL], "fromBlock": hex(cur), "toBlock": hex(end)}])
        buys += wb; sells += ws
        cur = end + 1
        if not wb and not ws:
            break
    bq = [words(l["data"]) for l in buys]
    sq = [words(l["data"]) for l in sells]
    buyers = [addr(l["topics"][1]) for l in buys]
    sellers = [addr(l["topics"][1]) for l in sells]
    first_buy_same_tx = bool(buys) and buys[0]["transactionHash"] == tx
    first_buy_same_block = bool(buys) and int(buys[0]["blockNumber"], 16) == b
    last_block = max([int(l["blockNumber"], 16) for l in buys + sells] + [b])
    state["curves"][curve] = {
        "kind": kind, "token": token, "deployer": dep, "launch_block": b, "launch_tx": tx,
        "n_buys": len(buys), "n_sells": len(sells),
        "unique_buyers": len(set(buyers)), "unique_sellers": len(set(sellers)), "unique_traders": len(set(buyers) | set(sellers)),
        "quote_in": str(sum(w[0] for w in bq)), "quote_out": str(sum(w[1] for w in sq)),
        "buy_fee": str(sum(w[2] for w in bq)), "buy_tax": str(sum(w[3] for w in bq)),
        "sell_fee": str(sum(w[2] for w in sq)), "sell_tax": str(sum(w[3] for w in sq)),
        "deployer_bought": dep in set(buyers), "deployer_sold": dep in set(sellers),
        "deployer_buy_quote": str(sum(words(l["data"])[0] for l in buys if addr(l["topics"][1]) == dep)),
        "first_buy_same_tx_as_launch": first_buy_same_tx, "first_buy_same_block_as_launch": first_buy_same_block,
        "buys_in_launch_block": sum(1 for l in buys if int(l["blockNumber"], 16) == b),
        "active_span_blocks": last_block - b,
    }
    if (i + 1) % 10 == 0:
        json.dump(state, open(path, "w"))
        print(f"{i + 1}/{len(sample)} curves, {time.time() - t0:.0f}s", flush=True)
    time.sleep(0.15)
json.dump(state, open(path, "w"))
print(f"DONE {len(state['curves'])} curves in {time.time() - t0:.0f}s", flush=True)


def summarize(kind):
    cs = [c for c in state["curves"].values() if c["kind"] == kind]
    if not cs:
        return
    E = 10 ** 18
    qi = sorted(int(c["quote_in"]) / E for c in cs)
    qo = sorted(int(c["quote_out"]) / E for c in cs)
    ut = sorted(c["unique_traders"] for c in cs)
    nb = sorted(c["n_buys"] for c in cs)
    med = lambda xs: statistics.median(xs) if xs else None
    print(f"[{kind}] n={len(cs)} median quote_in={med(qi):.4f} ETH mean={statistics.mean(qi):.4f} p90={qi[int(len(qi) * .9) - 1]:.4f} max={qi[-1]:.3f}")
    print(f"[{kind}] zero-buy launches={sum(1 for c in cs if c['n_buys'] == 0)} only-deployer-buyer={sum(1 for c in cs if c['unique_buyers'] == 1 and c['deployer_bought'])} median traders={med(ut)} median buys={med(nb)}")
    print(f"[{kind}] deployer bought={sum(c['deployer_bought'] for c in cs)} deployer sold={sum(c['deployer_sold'] for c in cs)} first buy in launch tx={sum(c['first_buy_same_tx_as_launch'] for c in cs)} first buy same block={sum(c['first_buy_same_block_as_launch'] for c in cs)}")
    print(f"[{kind}] total quote_in={sum(qi):.3f} quote_out={sum(qo):.3f} buy_fee={sum(int(c['buy_fee']) for c in cs) / E:.4f} buy_tax={sum(int(c['buy_tax']) for c in cs) / E:.4f} sell_fee={sum(int(c['sell_fee']) for c in cs) / E:.4f} sell_tax={sum(int(c['sell_tax']) for c in cs) / E:.4f}")
    spans = sorted(c["active_span_blocks"] for c in cs)
    print(f"[{kind}] median active span blocks={med(spans)} p90={spans[int(len(spans) * .9) - 1]}")


summarize("non")
summarize("grad")
