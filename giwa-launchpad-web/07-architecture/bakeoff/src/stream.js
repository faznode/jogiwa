// Shared by all frameworks: same synthetic trade stream, same per-frame batching, same metrics.
const params = new URLSearchParams(location.search);
export const RATE = Number(params.get('rate') || 50);
const KEEP = 60;

let seed = 7;
const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);

export function makeTrade(id) {
  const buy = rnd() > 0.38;
  const amt = 1 + rnd() * 49;
  return { id, side: buy ? 'Buy' : 'Sell', amt: amt.toFixed(2), tokens: Math.round(amt * 24000).toLocaleString('en-US'), wallet: '0x' + Math.floor(rnd() * 0xffffff).toString(16).padStart(6, '0'), t: 'now' };
}

export function computeQuote(amount, price) {
  const a = Number(amount) || 0;
  const fee = a * 0.01;
  const out = (a - fee) / price;
  return { out: Math.round(out).toLocaleString('en-US'), fee: fee.toFixed(2), impact: Math.min(99, (a / 2500) * 100).toFixed(2) + '%' };
}

/** Calls onFlush(snapshot) at most once per animation frame with the latest state. */
export function createStream(onFlush) {
  let id = 0;
  let snapshot = { price: 0.0000412, people: 12, trades: [] };
  let buffer = [];
  let raf = 0;
  const perTick = Math.max(1, Math.round(RATE / 100));
  const timer = setInterval(() => {
    for (let i = 0; i < perTick; i++) buffer.push(makeTrade(++id));
    if (!raf) raf = requestAnimationFrame(flush);
  }, 10);
  function flush() {
    raf = 0;
    if (!buffer.length) return;
    const incoming = buffer.reverse();
    buffer = [];
    let price = snapshot.price;
    for (const t of incoming) price *= t.side === 'Buy' ? 1.00004 : 0.99996;
    snapshot = { price, people: Math.min(25, 12 + Math.floor(id / 500)), trades: incoming.concat(snapshot.trades).slice(0, KEEP) };
    onFlush(snapshot);
  }
  return () => { clearInterval(timer); cancelAnimationFrame(raf); };
}

// Metrics collected by measure.mjs
const m = (window.__metrics = { frames: [], longTasks: 0, events: [] });
let last = performance.now();
function frame(now) { m.frames.push(now - last); last = now; requestAnimationFrame(frame); }
requestAnimationFrame(frame);
new PerformanceObserver(l => { m.longTasks += l.getEntries().length; }).observe({ type: 'longtask', buffered: true });
new PerformanceObserver(l => { for (const e of l.getEntries()) if (e.name === 'keydown' || e.name === 'input' || e.name === 'keypress') m.events.push(e.duration); }).observe({ type: 'event', durationThreshold: 16, buffered: true });
