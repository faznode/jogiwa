// Bojagi quilt (from concept 3): data, not decoration. Patches sized by amount; "you" in yellow with an ink outline,
// team wallets hatched, everyone else in four ink strengths. Seams are paper. A table carries the same data for screen readers.
import { memo, useMemo } from 'react'
import { cx } from '../../lib/cx'

export interface QuiltItem {
  id: string
  value: number
  kind: 'you' | 'team' | 'cluster' | 'normal'
}

interface Patch extends QuiltItem {
  x: number
  y: number
  w: number
  h: number
  strength: number
}

function split(items: QuiltItem[], x: number, y: number, w: number, h: number, out: Omit<Patch, 'strength'>[]) {
  if (!items.length) return
  if (items.length === 1) {
    out.push({ ...items[0], x, y, w, h })
    return
  }
  const total = items.reduce((s, i) => s + i.value, 0)
  let acc = 0
  let cut = 0
  while (cut < items.length - 1 && acc + items[cut].value <= total / 2) acc += items[cut++].value
  if (cut === 0) {
    acc = items[0].value
    cut = 1
  }
  const r = acc / total
  if (w >= h) {
    split(items.slice(0, cut), x, y, w * r, h, out)
    split(items.slice(cut), x + w * r, y, w * (1 - r), h, out)
  } else {
    split(items.slice(0, cut), x, y, w, h * r, out)
    split(items.slice(cut), x, y + h * r, w, h * (1 - r), out)
  }
}

export const Quilt = memo(function Quilt({ items, label, max = 64 }: { items: QuiltItem[]; label: string; max?: number }) {
  const patches = useMemo(() => {
    const sorted = [...items].filter((i) => i.value > 0).sort((a, b) => b.value - a.value)
    const head = sorted.slice(0, max)
    const rest = sorted.slice(max).reduce((s, i) => s + i.value, 0)
    if (rest > 0) head.push({ id: 'rest', value: rest, kind: 'normal' })
    const out: Omit<Patch, 'strength'>[] = []
    split(head, 0, 0, 100, 56, out)
    return out.map((p, i) => ({ ...p, strength: Math.min(3, Math.floor((i / Math.max(1, out.length)) * 4)) }))
  }, [items, max])

  return (
    <svg className="quilt" viewBox="0 0 100 56" preserveAspectRatio="none" role="img" aria-label={label}>
      <defs>
        <pattern id="quilt-hatch" width="2" height="2" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <rect width="2" height="2" className="quilt-hatch-bg" />
          <line x1="0" y1="0" x2="0" y2="2" className="quilt-hatch-line" />
        </pattern>
      </defs>
      {patches.map((p) => (
        <rect key={p.id} x={p.x} y={p.y} width={p.w} height={p.h} className={cx('quilt-patch', `quilt-${p.kind}`, `quilt-s${p.strength}`)} fill={p.kind === 'team' ? 'url(#quilt-hatch)' : undefined} />
      ))}
    </svg>
  )
})
