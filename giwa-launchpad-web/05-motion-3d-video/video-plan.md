# HyperFrames asset plan

HyperFrames 0.8.191 (Apache-2.0), pinned. Source compositions live in `hyperframes/` so every render is reproducible: `cd hyperframes/<name> && npx hyperframes@0.8.191 render --quality delivery --output ../../renders/<name>.mp4` (needs FFmpeg + ffprobe + Chrome on PATH; see the playbook).

| Asset | Status | Resolution | fps | Codec / container | Size budget | Poster | Captions / alt | Source |
|---|---|---|---|---|---|---|---|---|
| **Hero loop** | **rendered** `renders/hero-loop.mp4` | 1280×720 (+1920×1080 variant on demand) | 30 | H.264 MP4 (+VP9 WebM for Chrome/Firefox) | ≤ 1.5 MB, **actual 217 KB** | `renders/hero-loop-poster.png` (t = 5.6 s) | no audio; alt: "Animated diagram: deposits rise during the window, then settle to one price." | `hyperframes/hero-loop` |
| **Share-card video** | **rendered** `renders/share-card.mp4` + still | 1200×630; variants 1080×1080, 1080×1920 | 30 | H.264 MP4 | ≤ 400 KB, **actual 124 KB** | `renders/share-card-still.png` (t = 4.5 s) | text is in the frame; share text carries the same words | `hyperframes/share-card` (variables: name, ticker, before, after) |
| Trailer (30 s) | planned | 1920×1080 | 30 | H.264 high | ≤ 8 MB | key frame of the level | burned-in captions + WebVTT; licensed music only | three storylines to pick from (`references/story.md` process) |
| How-it-works explainer (90 s) `[09 §2]` | planned | 1920×1080 | 30 | H.264 | ≤ 15 MB | title frame | WebVTT captions, transcript on `/learn` | window → people threshold → vesting → Season Credit → risks |
| Social clips (6–15 s) | planned | 1080×1920 and 1080×1080 | 30 | H.264 | ≤ 3 MB | first frame | burned-in captions (sound-off viewing) | one mechanic per clip |

Rules for every asset: no invented metrics (example values are labelled "Example data"), no "airdrop", no price promises, no third-party logos, the testnet line on anything that shows SC.

## Phase-2 idea: per-token graduation clips (evaluated, not built)

**What:** when a token graduates, render a 5 s clip from the share-card composition with that token's name, ticker and final people count; attach it to the token page and share sheet.

**Cost and queue analysis (measured, sandbox: 2 vCPU, software GPU):**
- Render time: 5 s share card rendered in **6.5 s** (≈ 1.3× real time) at 124 KB output.
- One worker ≈ 500 clips/hour; Season 1 target scale (GTM: thousands of verified users, ≥ 100 launches in Season 0, graduation rate ≥ 5% `[09 §1]`) implies tens of graduations per day, so **one worker with concurrency 2 is enough**; the queue is idle most of the time.
- Storage: ~125 KB/clip → 10,000 clips ≈ 1.25 GB on object storage behind the CDN.
- Compute: serverless render (HyperFrames `lambda`/`cloudrun`) or one small always-on container; either is cents per hundred clips.

**Design of the pipeline:** graduation event (indexer) → enqueue `{token, people}` (Redis/NATS, deduped by token) → render worker (`render --batch` with a one-row JSON) → upload → set `clip_url` on the token. If the queue lags > 10 min, the UI keeps the static OG card. Render only **after** moderation status is clean (user content goes into a video); a takedown deletes the clip.

**Risks:** UGC in video (moderation first), cost spikes during graduation bursts (cap concurrency, coalesce), young dependency (pin, keep compositions simple).

**Recommendation:** build after Season 1, once graduation volume and moderation latency are measured. Not needed for launch.
