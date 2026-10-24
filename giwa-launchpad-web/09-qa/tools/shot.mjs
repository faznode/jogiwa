// Evidence screenshots for 02-direction and 09-qa.
// Usage: node shot.mjs <url|file> <out.png> [width] [height] [--full] [--filter=grayscale|blur] [--dark] [--reduced] [--wait=ms] [--scale=1]
// Needs puppeteer-core + Chrome. Defaults point at the sandbox tools dir; override with BROS_TOOLS and CHROME_PATH.
import { createRequire } from 'node:module';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const TOOLS = process.env.BROS_TOOLS || '/vercel/share/bros-tools';
const require = createRequire(`${TOOLS}/package.json`);
const puppeteer = require('puppeteer-core');
const CHROME = process.env.CHROME_PATH || `${TOOLS}/browsers/chrome-headless-shell/linux-156.0.8078.47/chrome-headless-shell-linux64/chrome-headless-shell`;

const args = process.argv.slice(2);
const flags = Object.fromEntries(args.filter(a => a.startsWith('--')).map(a => { const [k, v] = a.slice(2).split('='); return [k, v ?? true]; }));
const [target, out, w = '1280', h = '800'] = args.filter(a => !a.startsWith('--'));
const url = /^(https?|data|file):/.test(target) ? target : pathToFileURL(resolve(target)).href;

const browser = await puppeteer.launch({ executablePath: CHROME, headless: true, args: ['--no-sandbox', '--disable-gpu', '--font-render-hinting=none', '--disable-dev-shm-usage'] });
const page = await browser.newPage();
await page.setViewport({ width: +w, height: +h, deviceScaleFactor: +(flags.scale || 1) });
const media = [];
if (flags.dark) media.push({ name: 'prefers-color-scheme', value: 'dark' });
if (flags.reduced) media.push({ name: 'prefers-reduced-motion', value: 'reduce' });
if (media.length) await page.emulateMediaFeatures(media);
const errors = [];
page.on('pageerror', e => errors.push(String(e)));
page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
await page.goto(url, { waitUntil: 'networkidle0', timeout: 90000 });
await new Promise(r => setTimeout(r, +(flags.wait || 600)));
if (flags.filter === 'grayscale') await page.addStyleTag({ content: 'html{filter:grayscale(1)!important}' });
if (flags.filter === 'blur') await page.addStyleTag({ content: 'html{filter:blur(6px)!important}' });
if (flags.filter) await new Promise(r => setTimeout(r, 250));
await page.screenshot({ path: out, fullPage: !!flags.full });
const metrics = await page.evaluate(() => ({ scrollW: document.documentElement.scrollWidth, clientW: document.documentElement.clientWidth, title: document.title }));
console.log(JSON.stringify({ out, ...metrics, errors: errors.slice(0, 5) }));
await browser.close();
