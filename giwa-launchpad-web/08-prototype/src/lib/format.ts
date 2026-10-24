// Number and time formatting rules from 04-page-specs/00-global-states-and-edge-cases.md (huge, tiny, negative numbers).
export const MINUS = '\u2212'

const nf = (options: Intl.NumberFormatOptions) => new Intl.NumberFormat('en-US', options)
const INT = nf({ maximumFractionDigits: 0 })
const TWO = nf({ minimumFractionDigits: 2, maximumFractionDigits: 2 })
const ONE = nf({ minimumFractionDigits: 1, maximumFractionDigits: 1 })

const signed = (s: string) => s.replace('-', MINUS)

export const formatInt = (n: number) => signed(INT.format(Math.round(n)))

/** Season Credit: always 2 decimals, or whole numbers when `trim` and the value is whole. */
export function formatSC(n: number, opts: { trim?: boolean; unit?: boolean } = {}) {
  const whole = Math.abs(n - Math.round(n)) < 0.005
  const body = signed(opts.trim && whole ? INT.format(Math.round(n)) : TWO.format(n))
  return opts.unit === false ? body : `${body} SC`
}

/** Token amounts: K/M/B with one decimal from 10,000 up. */
export function formatTokens(n: number) {
  const a = Math.abs(n)
  if (a >= 1e9) return signed(ONE.format(n / 1e9)) + 'B'
  if (a >= 1e6) return signed(ONE.format(n / 1e6)) + 'M'
  if (a >= 1e4) return signed(ONE.format(n / 1e3)) + 'K'
  return formatInt(n)
}

export const formatTokensExact = (n: number) => formatInt(n)

/** Prices: significant digits, never scientific notation. */
export function formatPrice(p: number) {
  if (!Number.isFinite(p) || p <= 0) return '0'
  if (p < 1e-10) return '< 0.0000000001'
  const decimals = Math.min(12, Math.max(2, -Math.floor(Math.log10(p)) + 3))
  return p.toFixed(decimals)
}

export const formatPct = (n: number, digits = 1) => `${Math.abs(n).toFixed(digits)}%`

export function formatSignedPct(n: number, digits = 1) {
  const v = Number(n.toFixed(digits))
  const sign = v > 0 ? '+' : v < 0 ? MINUS : ''
  return `${sign}${Math.abs(v).toFixed(digits)}%`
}

export function formatCountdown(ms: number) {
  const s = Math.max(0, Math.ceil(ms / 1000))
  return `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`
}

export function formatDuration(ms: number) {
  const s = Math.max(0, Math.round(ms / 1000))
  const d = Math.floor(s / 86400)
  const h = Math.floor((s % 86400) / 3600)
  const m = Math.floor((s % 3600) / 60)
  if (d) return `${d} d ${h} h`
  if (h) return `${h} h ${m} min`
  if (m) return `${m} min`
  return `${s} s`
}

export function formatAge(ms: number) {
  const s = Math.max(0, ms / 1000)
  if (s < 60) return `${Math.floor(s)}s`
  if (s < 3600) return `${Math.floor(s / 60)}m`
  if (s < 86400) return `${Math.floor(s / 3600)}h`
  return `${Math.floor(s / 86400)}d`
}

export const shortAddress = (a: string) => `${a.slice(0, 6)}\u2026${a.slice(-4)}`
export const shortHash = (h: string) => `${h.slice(0, 6)}\u2026${h.slice(-4)}`

export const formatTime = (ts: number) =>
  new Date(ts).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })

export const formatDateTime = (ts: number) =>
  new Date(ts).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false })
