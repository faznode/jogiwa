# ADR-S1: Security (front-end, edge, accounts, incident response)

**Status:** proposed. Items marked **[prototype]** are applied and tested in `08-prototype/` (evidence: `09-qa/security.md`). Contract security is out of scope here (masterplan `04-security-plan`).

## 1. Content Security Policy (enforced, no report-only phase for a new site)
```
default-src 'none'; script-src 'self'; style-src 'self'; img-src 'self' data: blob: https://img.<domain>;
font-src 'self'; connect-src 'self' https://api.<domain> wss://stream.<domain>; media-src 'self';
worker-src 'self' blob:; manifest-src 'self'; frame-src 'none'; frame-ancestors 'none';
base-uri 'none'; form-action 'self'; object-src 'none'; upgrade-insecure-requests;
report-to csp; (Reporting-Endpoints: csp="/api/csp")
```
- **No inline scripts anywhere** **[prototype]**. The theme and price-direction boot runs from an external `/boot.js`; Vite emits only external module scripts; the prerendered HTML has no inline JSON.
- **No inline style attributes in prerendered HTML** **[prototype]**: `style-src 'self'` blocks `style=""` in markup. Client-side React style props go through CSSOM and are not affected.
- Trusted Types (`require-trusted-types-for 'script'`) ships in report-only first, then gets enforced once wallet SDKs are verified.
- **Embedded wallet exception** (Q21): if chosen, add that provider's single origin to `frame-src` and `connect-src`, loaded only after the user picks "email or social login", never on page load.

## 2. Subresource Integrity
- `integrity="sha384-…"` + `crossorigin` on the entry script, CSS and modulepreload links in every HTML file, added by the build **[prototype]**.
- Lazy chunks loaded by dynamic `import()` cannot carry SRI from HTML. They are same-origin, content-hashed and immutable, and are covered by the **asset integrity monitor**: a job fetches every deployed asset from the edge every 5 min and compares sha384 with the signed build manifest. Any mismatch pages on-call (runbook §12).

## 3. Zero third-party scripts at runtime
No tag manager, analytics SDK, font CDN, chat widget, or CDN-loaded error SDK. Fonts are self-hosted **[prototype]**. The error SDK is bundled and tunnels through our origin (O1). Bot defence lives at the edge (E1). Allowed exception: the embedded-wallet iframe (above).

## 4. Supply chain
- Exact version pins **[prototype]**; lockfile committed; `pnpm install --frozen-lockfile` in CI.
- New versions wait 3 days (`minimumReleaseAge`); install scripts are blocked except an allow-list (`onlyBuiltDependencies`).
- CI runs `pnpm audit --prod`, OSV-Scanner and `npm audit signatures` (registry signatures and provenance). Renovate does grouped weekly updates.
- Every release gets a CycloneDX SBOM and GitHub artifact attestations (SLSA build provenance). Deploys accept only attested artifacts.

## 5. User-generated content is text
- React escaping only. `dangerouslySetInnerHTML` is banned by lint (`react/no-danger`) **[prototype: zero uses]**.
- `sanitizeDisplayText()` strips bidi controls (U+202A–202E, U+2066–2069) and shows zero-width characters as `�` in details views, so `Up​bit` cannot pass as `Upbit` `[00-global-states edge cases]` **[prototype]**.
- UGC links: `https:` only, the domain shown next to the link, `rel="noopener noreferrer nofollow ugc"` `[10 §1.6]` **[prototype]**.
- Names and tickers render as text in fixed boxes (ellipsis plus the full value in `title`), so hostile lengths cannot break the layout **[prototype; hostile fixtures in mock data]**.

## 6. Images: proxy + moderation hook
All token images come from `img.<domain>`. The proxy only serves derived WebP sizes (64/128/512) produced by the media pipeline `[05 §7]`: magic-byte check, re-encode, metadata stripped, safety classifier, hash block list. Moderation state (`ok`, `review`, `hidden`) travels with the metadata. `review` renders blurred with "Show anyway" **[prototype]**; `hidden` removes the token from feeds `[10 §1]`. The client never hotlinks a user-supplied URL.

## 7. SVG uploads rejected
The media API accepts PNG/JPG/WebP/GIF by magic bytes `[05 §7]`. SVG and any XML are rejected server-side. The create flow rejects `.svg` before upload with a plain reason **[prototype]**.

## 8. Simulate and disclose before signing
Every write goes through `PreSignSummary` before the wallet opens **[prototype]**: amounts, fees, creator tax, slippage and min received, price impact, graduation progress, then a simulation (`eth_simulateV1`, falling back to `eth_call` + `estimateGas`) via the RPC gateway. A failed simulation blocks the button and explains why in plain words `[errors.simulationFailed]`. Contract addresses come from the signed network config (chain ID 91342 + factory), never from URL parameters. SIWE messages are human-readable and cost nothing.

## 9. Frames and headers
`frame-ancestors 'none'` + `X-Frame-Options: DENY`; `Strict-Transport-Security: max-age=63072000; includeSubDomains` (preload once the domain is final); `X-Content-Type-Options: nosniff`; `Referrer-Policy: strict-origin-when-cross-origin`; `Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=(), usb=(), serial=(), bluetooth=()`; `Cross-Origin-Opener-Policy: same-origin` (relax to `same-origin-allow-popups` only if the chosen wallet needs popups); `Cross-Origin-Resource-Policy: same-origin` **[prototype: `public/_headers`, `vercel.json`]**.

## 10. Accounts: DNS, CDN, registrar, code
Hardware security keys (FIDO2) on registrar, DNS, CDN, cloud, GitHub and deploy accounts, with no SMS fallback. Registrar lock + registry lock where the TLD offers it. DNSSEC. CAA records limiting issuance to one CA. Certificate Transparency monitoring for our names. Least-privilege, short-lived API tokens via OIDC from CI. Weekly audit-log review. Alerts on any DNS change. Two named break-glass holders.

## 11. Lookalike domains and phishing
Defensive registrations of the final domain's obvious variants and homoglyphs. Weekly `dnstwist` scan with takedown requests. An "Official links" list in the footer and on `/status`. Submissions to wallet phishing lists. Fixed copy: "We will never message you first or ask for your recovery phrase." Reserved names (GIWA, Dojang, Upbit, Bros, BROS) blocked at create `[10 §1.7]`, Q6.

## 12. Minimal-privacy analytics
First-party `/api/e` endpoint for the masterplan events `[07 §1.2]`. No cookies, no IP storage (edge hashes IPs for rate limits only `[05 §6]`), no wallet address in analytics payloads (random per-session ID; Q23). GPC and DNT respected. **[prototype: `track()` logs to the console only]**

## 13. Secrets
None in the front-end bundle (CI greps the build for key patterns). RPC keys live in the RPC gateway, keeper keys in a KMS with minimal balances `[05 §8]`, all other secrets in a managed vault with quarterly rotation and rotation on staff change. `gitleaks` runs pre-commit and in CI.

## 14. Incident runbook: front-end compromise
1. **Detect:** asset-integrity mismatch, CSP report spike, DNS/registrar change alert, CT log for an unknown cert, user reports.
2. **Contain (≤ 15 min):** roll the CDN back to the last attested deployment (immutable deploys make this one action); turn on the maintenance banner; lock DNS and registrar; revoke CI and deploy tokens; purge CDN caches.
3. **Warn:** status page plus official channels: "Do not sign transactions on Bros until we post an all-clear." Since Bros is non-custodial `[10 §3]`, link a revoke-approvals guide for mainnet assets.
4. **Eradicate:** rotate every credential; rebuild from a clean runner; diff deployed assets against the signed manifest; review dependency changes since the last good release.
5. **Recover:** redeploy an attested build; watch integrity and CSP reports for 24 h.
6. **Learn:** public post-mortem within 72 h, tracked fixes.
