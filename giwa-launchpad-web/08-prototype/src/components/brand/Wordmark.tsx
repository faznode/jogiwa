// The Bros wordmark on its plate (03-design-system/brand.md), drawn from the generated paths so it follows the theme:
// plate = --color-plate, letters = --color-on-plate. Never redrawn by hand, never recoloured outside tokens.
import { MARK, WORDMARK } from './brand-paths'

export function Wordmark({ height = 32, title = 'Bros' }: { height?: number; title?: string }) {
  const [, , w, h] = WORDMARK.vb.split(' ').map(Number)
  return (
    <svg className="wordmark" viewBox={WORDMARK.vb} height={height} width={(height * w) / h} role="img" aria-label={title}>
      <rect width={w} height={h} rx={WORDMARK.rx} className="wordmark-plate" />
      <g className="wordmark-letters" fillRule="evenodd">
        {WORDMARK.paths.map((p, i) => (
          <path key={i} d={p.d} transform={p.t || undefined} />
        ))}
      </g>
    </svg>
  )
}

export function Mark({ size = 32 }: { size?: number }) {
  const [, , w, h] = MARK.vb.split(' ').map(Number)
  return (
    <svg className="wordmark" viewBox={MARK.vb} width={size} height={size} aria-hidden="true" focusable="false">
      <rect width={w} height={h} rx={MARK.rx} className="wordmark-plate" />
      <g className="wordmark-letters" fillRule="evenodd">
        {MARK.paths.map((p, i) => (
          <path key={i} d={p.d} transform={p.t || undefined} />
        ))}
      </g>
    </svg>
  )
}
