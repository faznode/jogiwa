# Naming due diligence: "Bros" (non-blocking)

This is research notes, not legal advice. Searches run 2026-10-24 from the sandbox; anything marked *manual* needs a human with accounts or paid databases.

## 1. Crypto collisions

| Finding | Where | Risk |
|---|---|---|
| **Crypto Bros (BROS)**, Ethereum meme token from 2023 (Brad Sherman reference), 69T supply, ~US$16K cap, Uniswap V2 | CoinGecko/CMC-style trackers via search | low–medium: ticker confusion; we are a platform, not a token, and must **never** issue a $BROS |
| **Bros (BROS)**, Solana pump.fun token, ~US$3.4K cap | search results | low; same ticker |
| **SatoshiBro**, AI meme launchpad on Solana | search results | low–medium: adjacent category name |
| Projects already building on GIWA: memefab, Cheoma, GIWAA, KIMP; GIWA.MARKETS and a $GIWA token `[07 §81]` | search + masterplan | memefab looks like a direct competitor (meme launchpad); verify (open question) |

Implications: the ticker **BROS** must go on the reserved list for launches on our own platform (impersonation of the platform), next to "GIWA", "Dojang", "Upbit" `[10 §1.7]`. Never create a platform token (also ADR-10 `[08 §1]`).

## 2. Trademark notes (manual searches needed)

| Register | Classes to search | Notes |
|---|---|---|
| **KIPRIS** (Korea) | 9 (software), 36 (financial services, crypto exchange services), 42 (SaaS/platform) | "BROS" and Hangul transliteration "브로스"; check figurative marks too |
| **USPTO** (TESS replacement: Trademark Center search) | 9, 36, 42 | "BROS" word marks are common in apparel (25) and entertainment (41); check 36/42 |
| **EUIPO** (eSearch plus) | 9, 36, 42 | same |

Known famous marks to steer clear of in **trade dress**, not just words: *Super Mario Bros.* (Nintendo; red/white outlined lettering, arcade palette), *Warner Bros.* (WB shield), *Bros* (UK band, music). A plain word "Bros" in class 36/42 may be registrable, but a **descriptive/common-word** problem is likely: "bros" is generic slang, which weakens enforceability (we may be able to use it, but not stop others).

**Questions for counsel**
1. Is "Bros" registrable in KR/US/EU in classes 9, 36, 42 for a non-custodial launchpad, and what is the likely distinctiveness objection?
2. Does a stylised wordmark + compact mark improve protection enough to justify filing figurative marks only?
3. Any conflict with Nintendo/Warner famous-mark dilution if the logo stays clear of their trade dress?
4. Is descriptive use of "GIWA" (e.g. "Network: GIWA Sepolia") acceptable without a licence? (masterplan Q8 `[10 §2]`)
5. Can the UI name "Dojang" and "Upbit" when describing verification tiers? (masterplan Q5)

## 3. Domains (RDAP signal only; not a purchase check)

| Domain | RDAP | Read |
|---|---|---|
| bros.xyz, bros.app, bros.wtf, bros.lol, bros.club | 200 | registered |
| bros.fun, bros.trade, bros.markets | 404 | likely unregistered; expect **premium** pricing for a 4-letter name |
| bros.gg, bros.so | 404 | ccTLD may lack RDAP: *manual* |
| bros.com, bros.io, bros.kr, getbros.xyz, brosfun.xyz, bros.meme, launchbros.xyz | 429 | rate-limited: *manual* |

Recommendation: shortlist `bros.fun` (category-native TLD) and one defensive `.xyz`/`.app` alternative such as `getbros.xyz`; also register common typos and the lookalike set listed in `07-architecture/adr-security.md` (phishing defence).

## 4. Handles (manual)

X, Telegram, Discord vanity URL, KakaoTalk Open Chat, app stores: not checkable without accounts. Priority order by GTM audience `[09 §0]`: KakaoTalk Open Chat name, X, Telegram, Discord.

## 5. Risk memo (summary)

- **Collision risk: low–medium.** Two micro-cap BROS tokens and a Solana "SatoshiBro" launchpad exist; none is a GIWA project. Main harm is user confusion and impersonation scams using our name, which we mitigate with the reserved-ticker list, a verified-links page and lookalike-domain monitoring.
- **Trademark risk: medium.** Common slang weakens distinctiveness; famous "Bros." marks make trade dress discipline essential (our mark avoids their colours, shapes and lettering).
- **Brand-safety risk: medium.** The word reads male-coded to some audiences. The design answers with structure (pairs, groups, people counts) and neutral copy; we recommend a quick perception test with 6–8 mixed-gender users in KR and ID before Season 1.
- **Decision needed:** confirm "Bros" after counsel answers Q1–Q3 above; until then, keep the wordmark in a single SVG file so a rename is one swap.
