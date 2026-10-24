// three.js and canvas need sRGB; tokens are OKLCH. Converts a token string like "oklch(86.5% 0.165 95)" to #rrggbb.
export function oklchToHex(token: string): string {
  const m = token.match(/oklch\(\s*([\d.]+)%\s+([\d.]+)\s+([\d.]+)/)
  if (!m) return '#000000'
  const L = Number(m[1]) / 100
  const C = Number(m[2])
  const h = (Number(m[3]) * Math.PI) / 180
  const a = C * Math.cos(h)
  const b = C * Math.sin(h)
  const l = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3
  const mm = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3
  const s = (L - 0.0894841775 * a - 1.291485548 * b) ** 3
  const lin = [4.0767416621 * l - 3.3077115913 * mm + 0.2309699292 * s, -1.2684380046 * l + 2.6097574011 * mm - 0.3413193965 * s, -0.0041960863 * l - 0.7034186147 * mm + 1.707614701 * s]
  return (
    '#' +
    lin
      .map((x) => {
        const c = Math.max(0, Math.min(1, x))
        const v = c <= 0.0031308 ? 12.92 * c : 1.055 * c ** (1 / 2.4) - 0.055
        return Math.round(v * 255)
          .toString(16)
          .padStart(2, '0')
      })
      .join('')
  )
}
