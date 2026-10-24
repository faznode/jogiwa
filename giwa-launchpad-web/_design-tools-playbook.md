# Design tools playbook (Step 0)

Installed 2026-10-24 into `giwa-launchpad-web/.agents/skills/` with `npx skills add` (lockfile: `skills-lock.json`, content hashes pinned). Evidence tooling lives in `09-qa/tools/`. Heavy binaries (Chrome 156, FFmpeg 7.0.2, puppeteer-core 24) live outside the repo in `/vercel/share/bros-tools` (override with `BROS_TOOLS`, `CHROME_PATH`).

## 1. Which tool for which job

| Job | Tool | Why this one | Output we keep |
|---|---|---|---|
| UX rules, a11y, touch, forms, nav, stack guidelines (Next.js, React, three.js) | **ui-ux-pro-max** | 119 UX guidelines + per-stack rules; wins on UX/a11y conflicts | rule citations in specs and `09-qa/uiux-checklist.md` |
| Palette/font/style *candidates* | ui-ux-pro-max `--design-system` | quick baseline to argue against | recorded and rejected (see §4) |
| Aesthetic direction, slop floor, gates, stamp, audit | **Hallmark v2.0.0** | 65-gate floor against machine-made pages; wins on aesthetics | stamp in CSS, `.hallmark/log.json`, `09-qa/hallmark-audit.md` |
| Lint the build | Hallmark `sloplint.mjs` (static + `--render`) | reads `.html/.css/.tsx` incl. Tailwind class strings | lint logs in `09-qa/` |
| Pre-rendered video: hero loop, share-card video, explainer, social clips | **HyperFrames 0.8.191** (Apache-2.0) | deterministic HTML-to-MP4; not a runtime UI library | compositions in `05-motion-3d-video/hyperframes/`, renders in `05-motion-3d-video/renders/` |
| Runtime 3D, signature moment only | **three.js + @react-three/fiber + drei** (MIT) | landing + celebrations only, lazy chunk | `components/landing/three/*` |
| Runtime UI motion | CSS transitions/keyframes first; no GSAP needed at runtime | fewest bytes; `transform`/`opacity` only | `03-design-system/motion.md` |
| Screenshots, grayscale/squint tests | `09-qa/tools/shot.mjs` (puppeteer-core) | reproducible evidence | `09-qa/screens/` |

**Precedence when tools disagree:** UX, accessibility, stack guidelines → ui-ux-pro-max. Aesthetics and slop gates → Hallmark. Product facts (features, fees, rules, labels) → the masterplan (`giwa-launchpad-research/09-masterplan/`) beats both. The user's brief beats the masterplan only where it says so explicitly (English-only content, brand name **Bros**).

## 2. Workflow order (per page)

1. **ui-ux-pro-max**: `--design-system` once for the product, then one `--domain ux` query per risky interaction (amount input, countdown live region, modal focus), then `--stack nextjs` / `--stack threejs`.
2. **Hallmark direction**: custom route (`references/direction.md`), because the brief asks us to research and invent concepts rather than take a dealt theme. Floor + gates + stamp + log still bind.
3. **Build** in the chosen stack. Marketing pages follow page rules; trading screens follow Hallmark's *App screens* branch (`flow.md` § App screens, `--scope app`).
4. **Audit**: `sloplint` (static, then `--render`/`--url`) + ui-ux-pro-max pre-delivery checklist (`references/pro-rules.md`, `quick-reference.md`).
5. **Fix**, re-run once, record results in `09-qa/`.

## 3. Exact commands

```bash
SK=giwa-launchpad-web/.agents/skills

# ui-ux-pro-max (always absolute paths; python3)
python3 $SK/ui-ux-pro-max/scripts/search.py "crypto token launchpad trading community fair" --design-system -p "Bros" --variance 7 --motion 4 --density 8 -f markdown
python3 $SK/ui-ux-pro-max/scripts/search.py "countdown live region screen reader" --domain ux
python3 $SK/ui-ux-pro-max/scripts/search.py "virtualize list rerender" --stack react
python3 $SK/ui-ux-pro-max/scripts/search.py "dispose renderer pixel ratio" --stack threejs

# Hallmark
node $SK/hallmark/scripts/theme.mjs check --face "<Face Name>"     # refuses faces a catalog theme already uses
node $SK/hallmark/scripts/theme.mjs check --hue <0-360>            # accent hue vs catalog
node $SK/hallmark/scripts/theme.mjs scaffold --custom               # writes tokens.css + base.css + stamp skeleton
node $SK/hallmark/scripts/theme.mjs log --entry '<json>'            # appends to .hallmark/log.json
HALLMARK_PUPPETEER=/vercel/share/bros-tools/node_modules/puppeteer-core \
node $SK/hallmark/scripts/sloplint.mjs <files> --genre modern-minimal --scope app --render
node $SK/hallmark/scripts/sloplint.mjs app components --url http://localhost:3000/ --genre modern-minimal

# HyperFrames (pin the CLI)
npx hyperframes@0.8.191 init 05-motion-3d-video/hyperframes/hero-loop
npx hyperframes@0.8.191 lint && npx hyperframes@0.8.191 check --json
npx hyperframes@0.8.191 snapshot --at 1,3,5
npx hyperframes@0.8.191 render --quality delivery --output ../renders/hero-loop.mp4
# needs FFmpeg + Chrome on PATH: export PATH=/vercel/share/bros-tools/node_modules/ffmpeg-static:$PATH

# Screenshots and anti-slop tests
node giwa-launchpad-web/09-qa/tools/shot.mjs <url|file> out.png 1280 800 [--full] [--filter=grayscale|blur] [--dark] [--reduced]
```

## 4. What each tool taught us (modes, outputs, limits)

### Hallmark v2.0.0 (MIT, by Together AI)
- **Flow:** pre-flight → ask once (material, audience, use, tone) → shape → direction (dealt theme or custom) → load → Picks block → build (hero first) → sweep. Project memory: `.hallmark/log.json` rotates shapes/themes so consecutive builds do not converge.
- **Genres:** editorial, modern-minimal, atmospheric, playful. 48 catalog themes (`references/themes/index.json`).
- **Floor (never waivable):** tokens for every colour/font; no `transition: all`; no single italic word in a roman head; `overflow-x: clip` on html/body; `minmax(0,1fr)` tracks; instant `:focus-visible`; reduced-motion fallbacks; no invented metrics; **no eyebrows and no tracked-caps labels** (table heads included); no middle-dot meta strings, glued arrows or decorative status dots; no purple-blue gradients, card-in-card, emoji icons or drawn browser chrome; hero headline + sentence + action visible at 1280×800; ~80 words per screen; capped container; CSS stamp on line 1.
- **Copy gate 19:** bans buzzwords (seamless, unlock, supercharge, next-generation...), em/en dashes in page copy, and stock second actions (*Learn more*, *Get started*).
- **Exports:** `tokens.css` is the source of truth; `design.md` (System, Tokens, Controls, Motion, Exports) locks the system; Tailwind v4 mapping maps roles onto `@theme`.
- **Known limits**
  - The brief's `study <screenshot|URL>` verb does **not exist** in v2.0.0 (verbs: `redesign`, `audit`). Substitute: capture references with `shot.mjs`, extract DNA by hand in Hallmark's vocabulary (macrostructure, type pairing, colour anchor) and record divergence (`02-direction/references.md`).
  - Output is standalone HTML+CSS; we port tokens and rules into Next.js + Tailwind v4 (`app/globals.css` `@theme`).
  - Render tier needs puppeteer-core + Chrome; set `HALLMARK_PUPPETEER`.
  - The "ask once" step is skipped: the brief already answers material (masterplan, no photos, no metrics), audience (personas), use (verify, launch, trade) and tone.
  - The library photo stand-ins are not used: people photos would add casting risk to a brand that must stay inclusive; the product itself is the picture.

### ui-ux-pro-max (MIT)
- **Data:** 79 styles, 192 palettes, 74 font pairings, 119 UX rules, 25 chart types, 22 stacks. Search: `scripts/search.py "<2-5 terms>" --domain <d>` or `--stack <s>` or `--design-system` (+ dials `--variance --motion --density`, `--persist --output-dir`).
- **Priority order:** a11y → touch → performance → style → layout → type/colour → animation → forms → navigation → charts.
- **Result for Bros:** pattern "Trust & Authority + Conversion", style "Minimalism & Swiss", density 8 (8–32px scale), stagger-list motion, anti-patterns "unclear fees" and "AI purple/pink gradients". **Rejected parts:** palette (gold + purple on navy) and fonts (Orbitron + Exo 2) are the "neon cyberpunk crypto" default the charter bans. Kept: density dial, checklist, "no `back.out` easing on dense tables", transparent-pricing pattern.
- **Known limits:** recommendations are category-generic; its "crypto" mood maps straight to the clichés we are avoiding, so aesthetics defer to Hallmark.

### HyperFrames 0.8.191 (Apache-2.0, HeyGen)
- **Model:** HTML compositions rendered frame-by-frame from a paused GSAP timeline; deterministic. Root `index.html` + `compositions/*.html` scenes; assets in `assets/`.
- **Contract:** every timed element `class="clip" data-start data-duration`; one paused timeline registered on `window.__timelines[id]`; no `Date.now()`, unseeded random, network, timers or infinite repeats; transforms not `left/top`; fonts via `@font-face` from `assets/fonts/`.
- **CLI:** `init`, `lint`, `check --json` (lint + runtime + layout + contrast), `snapshot`, `preview`, `render --quality draft|looks|delivery`, `render --batch rows.json` (per-token clips later), `cloud render`.
- **Known limits:** young project (pin the version); needs Node ≥ 22, FFmpeg and Chrome (installed in the sandbox: static FFmpeg 7.0.2, Chrome 156); Linux renders use software GPU (slow path). The desktop "Studio" app is not available here, so review is by `snapshot` PNGs.

### three.js / react-three-fiber / drei (MIT)
- Runtime 3D for one signature moment on the landing and celebration overlays; never on trade pages. Lazy `next/dynamic` chunk, `frameloop="demand"`, DPR cap 1.5, pause offscreen, device-tier gate, poster fallback (`05-motion-3d-video/3d-spec.md`).
