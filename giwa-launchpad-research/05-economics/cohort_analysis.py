#!/usr/bin/env python3
"""Phase 5 cohort analysis over the Phase 2/5 event scan (raw/traces/events_*.json).

Throwaway research tooling. Reads compact records [block, txhash, topic1, topic2, topic3, data]
and writes 05-economics/cohort-stats.json plus a few CSV tables for the report.

Timestamps are interpolated linearly between the 500k-block anchors in raw/traces/block_timestamps.json
(worst-case error is a few minutes; irrelevant for daily buckets, noted for time-to-graduation).
"""
import json, os, sys, csv, bisect, statistics, collections, datetime as dt

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
TR = os.path.join(ROOT, "raw", "traces")
OUT = os.path.join(ROOT, "05-economics")
ETH = 10**18

ts_anchor = json.load(open(os.path.join(TR, "block_timestamps.json")))
A_BLOCKS = sorted(int(k) for k in ts_anchor)
A_TS = [ts_anchor[str(b)] for b in A_BLOCKS]


def block_ts(b):
    i = bisect.bisect_left(A_BLOCKS, b)
    if i == 0:
        return A_TS[0]
    if i >= len(A_BLOCKS):
        return A_TS[-1]
    b0, b1 = A_BLOCKS[i - 1], A_BLOCKS[i]
    t0, t1 = A_TS[i - 1], A_TS[i]
    return t0 + (t1 - t0) * (b - b0) / (b1 - b0)


def day(b):
    return dt.datetime.utcfromtimestamp(block_ts(b)).strftime("%Y-%m-%d")


def addr(topic):
    return "0x" + topic[-40:] if topic else None


def words(data):
    h = data[2:]
    return [int(h[i:i + 64], 16) for i in range(0, len(h), 64)]


def load(name):
    d = json.load(open(os.path.join(TR, f"events_{name}.json")))
    return d["records"], d


def pct(xs, p):
    if not xs:
        return None
    xs = sorted(xs)
    k = (len(xs) - 1) * p
    f, c = int(k), min(int(k) + 1, len(xs) - 1)
    return xs[f] + (xs[c] - xs[f]) * (k - f)


def creator_stats(creators):
    c = collections.Counter(creators)
    n = sum(c.values())
    top = c.most_common(10)
    buckets = collections.Counter()
    for _, k in c.items():
        buckets["1" if k == 1 else "2-5" if k <= 5 else "6-20" if k <= 20 else "21-100" if k <= 100 else "101-1000" if k <= 1000 else ">1000"] += 1
    launches_by_bucket = collections.Counter()
    for _, k in c.items():
        launches_by_bucket["1" if k == 1 else "2-5" if k <= 5 else "6-20" if k <= 20 else "21-100" if k <= 100 else "101-1000" if k <= 1000 else ">1000"] += k
    serial = sum(k for k in c.values() if k > 20)
    return {
        "unique_creators": len(c),
        "launches": n,
        "top10_share": round(sum(k for _, k in top) / n, 4) if n else None,
        "top1_share": round(top[0][1] / n, 4) if top else None,
        "top10": [{"address": a, "launches": k} for a, k in top],
        "creators_by_launch_count_bucket": dict(buckets),
        "launches_by_creator_bucket": dict(launches_by_bucket),
        "share_of_launches_from_creators_with_more_than_20": round(serial / n, 4) if n else None,
        "single_launch_creators_share_of_creators": round(buckets["1"] / len(c), 4) if c else None,
    }


def daily(blocks):
    c = collections.Counter(day(b) for b in blocks)
    return dict(sorted(c.items()))


out = {"generated_at": dt.datetime.utcnow().strftime("%Y-%m-%dT%H:%M:%SZ"), "method": __doc__.strip(), "generations": {}}

# ---------------- Gen1 / Gen2 ----------------
for gen in ["gen1_launches", "gen2_launches"]:
    recs, meta = load(gen)
    blocks = [r[0] for r in recs]
    # topic1 = token, topic2 = creator, topic3 = pair token (per Gen ILaunchpad event; verified by cardinality below)
    t3 = collections.Counter(addr(r[4]) for r in recs)
    creators = [addr(r[3]) for r in recs]
    g = {
        "factory": meta["address"], "launches": len(recs),
        "first_block": min(blocks), "last_block": max(blocks),
        "first_day": day(min(blocks)), "last_day": day(max(blocks)),
        "topic3_cardinality": len(t3), "topic3_top": [{"address": a, "n": n} for a, n in t3.most_common(3)],
        "creator_stats": creator_stats(creators),
        "daily_launches": daily(blocks),
    }
    out["generations"][gen.split("_")[0]] = g

# ---------------- V2 ----------------
recs, meta = load("v2_launches")
grads, gmeta = load("v2_graduations")
launch_by_token = {}
blocks = []
pair_c = collections.Counter(); cfg_c = collections.Counter(); thr_c = collections.Counter()
creators = []
for r in recs:
    b, tx, t_token, t_curve, t_dep, data = r
    w = words(data)
    pair = "0x" + hex(w[0])[2:].rjust(40, "0") if len(w) > 0 else None
    token = addr(t_token)
    launch_by_token[token] = (b, addr(t_dep), pair, w[1] if len(w) > 1 else None, w[2] if len(w) > 2 else None)
    blocks.append(b); creators.append(addr(t_dep)); pair_c[pair] += 1
    if len(w) > 1: cfg_c[w[1]] += 1
    if len(w) > 2: thr_c[(pair, w[2])] += 1

tt_grad = []; grad_blocks = []; grad_by_pair = collections.Counter(); eth_into_pools = collections.Counter(); tokens_to_pool = []
grad_creators = []; grad_month = collections.Counter(); launch_month = collections.Counter()
unmatched = 0
for r in grads:
    b, tx, t_token, _, _, data = r
    w = words(data)
    token = addr(t_token)
    grad_blocks.append(b)
    L = launch_by_token.get(token)
    if not L:
        unmatched += 1; continue
    lb, dep, pair, cfg, thr = L
    tt_grad.append(block_ts(b) - block_ts(lb))
    grad_by_pair[pair] += 1
    eth_into_pools[pair] += w[2]
    tokens_to_pool.append(w[1])
    grad_creators.append(dep)
    grad_month[day(lb)[:7]] += 1
for b in blocks:
    launch_month[day(b)[:7]] += 1

cs = creator_stats(creators)
gcs = collections.Counter(grad_creators)
# graduation rate by creator bucket
launch_count = collections.Counter(creators)
rate_by_bucket = collections.defaultdict(lambda: [0, 0])
for token, (lb, dep, pair, cfg, thr) in launch_by_token.items():
    k = launch_count[dep]
    bk = "1" if k == 1 else "2-5" if k <= 5 else "6-20" if k <= 20 else "21-100" if k <= 100 else "101-1000" if k <= 1000 else ">1000"
    rate_by_bucket[bk][0] += 1
grad_tokens = set(addr(r[2]) for r in grads)
for token in grad_tokens:
    L = launch_by_token.get(token)
    if not L: continue
    k = launch_count[L[1]]
    bk = "1" if k == 1 else "2-5" if k <= 5 else "6-20" if k <= 20 else "21-100" if k <= 100 else "101-1000" if k <= 1000 else ">1000"
    rate_by_bucket[bk][1] += 1

same_block = sum(1 for b, n in collections.Counter(blocks).items() if n > 1 for _ in range(n))
v2 = {
    "factory": meta["address"], "launches": len(recs), "graduations": len(grads), "graduations_unmatched_to_launch": unmatched,
    "graduation_rate": round(len(grads) / len(recs), 5),
    "first_block": min(blocks), "last_block": max(blocks), "first_day": day(min(blocks)), "last_day": day(max(blocks)),
    "scan_latest_block": meta["to_block"],
    "pair_token_distribution": [{"pairToken": p, "launches": n, "graduations": grad_by_pair.get(p, 0), "pairTokenAmount_into_pools_sum": str(eth_into_pools.get(p, 0))} for p, n in pair_c.most_common(12)],
    "launch_config_distribution": {str(k): v for k, v in cfg_c.most_common(10)},
    "graduation_threshold_distribution": [{"pairToken": p, "threshold_raw": str(t), "launches": n} for (p, t), n in thr_c.most_common(10)],
    "time_to_graduation_seconds": {"n": len(tt_grad), "p10": pct(tt_grad, .1), "p25": pct(tt_grad, .25), "median": pct(tt_grad, .5), "p75": pct(tt_grad, .75), "p90": pct(tt_grad, .9), "p99": pct(tt_grad, .99), "max": max(tt_grad) if tt_grad else None,
                                   "share_under_60s": round(sum(1 for x in tt_grad if x < 60) / len(tt_grad), 4) if tt_grad else None,
                                   "share_under_10min": round(sum(1 for x in tt_grad if x < 600) / len(tt_grad), 4) if tt_grad else None,
                                   "share_under_1h": round(sum(1 for x in tt_grad if x < 3600) / len(tt_grad), 4) if tt_grad else None,
                                   "share_over_1d": round(sum(1 for x in tt_grad if x > 86400) / len(tt_grad), 4) if tt_grad else None},
    "tokens_to_pool_median_raw": str(int(statistics.median(tokens_to_pool))) if tokens_to_pool else None,
    "creator_stats": cs,
    "graduating_creators": {"unique": len(gcs), "top10": [{"address": a, "graduations": n, "launches": launch_count[a]} for a, n in gcs.most_common(10)],
                            "top10_share_of_graduations": round(sum(n for _, n in gcs.most_common(10)) / len(grads), 4) if grads else None},
    "graduation_rate_by_creator_bucket": {k: {"launches": v[0], "graduations": v[1], "rate": round(v[1] / v[0], 5) if v[0] else None} for k, v in sorted(rate_by_bucket.items())},
    "monthly": {m: {"launches": launch_month[m], "graduations_of_that_cohort": grad_month.get(m, 0), "rate": round(grad_month.get(m, 0) / launch_month[m], 5)} for m in sorted(launch_month)},
    "share_of_launches_sharing_a_block_with_another_launch": round(same_block / len(blocks), 4),
    "daily_launches": daily(blocks),
    "daily_graduations": daily(grad_blocks),
}
out["generations"]["v2"] = v2

# combined daily table
days = sorted(set(out["generations"]["gen1"]["daily_launches"]) | set(out["generations"]["gen2"]["daily_launches"]) | set(v2["daily_launches"]) | set(v2["daily_graduations"]))
with open(os.path.join(OUT, "daily_launches.csv"), "w", newline="") as f:
    wri = csv.writer(f); wri.writerow(["day", "gen1_launches", "gen2_launches", "v2_launches", "v2_graduations"])
    for d in days:
        wri.writerow([d, out["generations"]["gen1"]["daily_launches"].get(d, 0), out["generations"]["gen2"]["daily_launches"].get(d, 0), v2["daily_launches"].get(d, 0), v2["daily_graduations"].get(d, 0)])

json.dump(out, open(os.path.join(OUT, "cohort-stats.json"), "w"), indent=1)
# human summary
g1, g2 = out["generations"]["gen1"], out["generations"]["gen2"]
print("gen1", g1["launches"], g1["first_day"], g1["last_day"], "creators", g1["creator_stats"]["unique_creators"], "topic3card", g1["topic3_cardinality"])
print("gen2", g2["launches"], g2["first_day"], g2["last_day"], "creators", g2["creator_stats"]["unique_creators"], "top10share", g2["creator_stats"]["top10_share"], "topic3card", g2["topic3_cardinality"], g2["topic3_top"][:2])
print("v2", v2["launches"], v2["graduations"], "rate", v2["graduation_rate"], v2["first_day"], v2["last_day"])
print("v2 pairs", v2["pair_token_distribution"][:5])
print("v2 cfg", v2["launch_config_distribution"])
print("v2 thresholds", v2["graduation_threshold_distribution"][:4])
print("v2 ttg", v2["time_to_graduation_seconds"])
print("v2 creators", {k: v for k, v in cs.items() if k != "top10"})
print("v2 top10 creators", cs["top10"][:5])
print("v2 grad creators", v2["graduating_creators"])
print("v2 rate by bucket", v2["graduation_rate_by_creator_bucket"])
print("v2 monthly", v2["monthly"])
print("v2 same-block share", v2["share_of_launches_sharing_a_block_with_another_launch"])
peak = max(v2["daily_launches"].items(), key=lambda x: x[1]); print("v2 peak day", peak)
peakg = max(v2["daily_graduations"].items(), key=lambda x: x[1]); print("v2 peak grad day", peakg)
last14 = sorted(v2["daily_launches"].items())[-14:]; print("v2 last14", last14)
last14g = sorted(v2["daily_graduations"].items())[-14:]; print("v2 last14 grads", last14g)
