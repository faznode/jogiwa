// Single ink line, no fill, no glow; the opening window is shaded "Window: one price" (every Bros chart starts flat).
// Crosshair on hover and keyboard (arrow keys). Never animates; redraws at most 4 times a second.
import { memo, useMemo, useState, type KeyboardEvent, type PointerEvent } from 'react'
import { useThrottled } from '../../data/hooks'
import type { PricePoint } from '../../data/types'
import { formatPrice, formatTime } from '../../lib/format'
import { t } from '../../lib/i18n'
import { EmptyState, Badge } from '../ui/Feedback'
import { Tabs } from '../ui/Controls'

type Range = '5m' | '1h' | '1d' | 'all'
const SPAN: Record<Range, number> = { '5m': 300_000, '1h': 3_600_000, '1d': 86_400_000, all: Infinity }
const W = 600
const H = 220

export const PriceChart = memo(function PriceChart({ points, windowStart, windowEnd, name, stale }: { points: PricePoint[]; windowStart: number; windowEnd: number; name: string; stale?: boolean }) {
  const data = useThrottled(points, 250)
  const [range, setRange] = useState<Range>('all')
  const [active, setActive] = useState<number | null>(null)

  const view = useMemo(() => {
    const last = data[data.length - 1]?.ts ?? 0
    let visible = range === 'all' ? data : data.filter((p) => p.ts >= last - SPAN[range])
    if (visible.length < 2 && data.length >= 2) visible = data.slice(-2)
    if (visible.length < 2) return null
    const t0 = visible[0].ts
    const t1 = visible[visible.length - 1].ts || t0 + 1
    let lo = Infinity
    let hi = -Infinity
    for (const p of visible) {
      lo = Math.min(lo, p.price)
      hi = Math.max(hi, p.price)
    }
    const pad = (hi - lo || hi * 0.1) * 0.12
    lo -= pad
    hi += pad
    const x = (ts: number) => ((ts - t0) / Math.max(1, t1 - t0)) * W
    const y = (p: number) => H - ((p - lo) / (hi - lo)) * H
    const line = visible.map((p) => `${x(p.ts).toFixed(1)},${y(p.price).toFixed(1)}`).join(' ')
    const zone = windowEnd > t0 ? { x: Math.max(0, x(windowStart)), w: Math.max(0, x(Math.min(windowEnd, t1)) - Math.max(0, x(windowStart))) } : null
    return { visible, line, zone, x, y, hi, lo }
  }, [data, range, windowStart, windowEnd])

  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    if (!view) return
    const rect = e.currentTarget.getBoundingClientRect()
    const ratio = (e.clientX - rect.left) / rect.width
    const target = view.visible[0].ts + ratio * (view.visible[view.visible.length - 1].ts - view.visible[0].ts)
    let best = 0
    for (let i = 1; i < view.visible.length; i++) if (Math.abs(view.visible[i].ts - target) < Math.abs(view.visible[best].ts - target)) best = i
    setActive(best)
  }

  const onKey = (e: KeyboardEvent) => {
    if (!view) return
    const last = view.visible.length - 1
    const cur = active ?? last
    const next = e.key === 'ArrowLeft' ? Math.max(0, cur - 1) : e.key === 'ArrowRight' ? Math.min(last, cur + 1) : e.key === 'Home' ? 0 : e.key === 'End' ? last : null
    if (next === null) return
    e.preventDefault()
    setActive(next)
  }

  const point = view && active !== null ? view.visible[Math.min(active, view.visible.length - 1)] : null

  return (
    <section className="chart" aria-label={t('chart.label', { name })}>
      <div className="chart-top">
        <Tabs
          label={t('chart.rangeLabel')}
          idBase="chart-range"
          value={range}
          onChange={(v) => {
            setRange(v)
            setActive(null)
          }}
          className="tabs-compact"
          items={[
            { value: '5m', label: t('chart.range5m') },
            { value: '1h', label: t('chart.range1h') },
            { value: '1d', label: t('chart.range1d') },
            { value: 'all', label: t('chart.rangeAll') },
          ]}
        />
        {stale ? <Badge tone="warn">{t('common.delayed')}</Badge> : null}
      </div>
      <div id="chart-range-panel" role="tabpanel" aria-labelledby={`chart-range-tab-${range}`}>
        {!view ? (
          <EmptyState message={t('chart.empty')} />
        ) : (
          <div className="chart-plot" tabIndex={0} role="img" aria-label={`${t('chart.label', { name })}. ${t('chart.keyboard')}`} onPointerMove={onMove} onPointerLeave={() => setActive(null)} onKeyDown={onKey} onBlur={() => setActive(null)}>
            <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" aria-hidden="true">
              {view.zone && view.zone.w > 0 ? <rect className="chart-zone" x={view.zone.x} y={0} width={view.zone.w} height={H} /> : null}
              <line className="chart-grid" x1={0} x2={W} y1={H / 2} y2={H / 2} />
              <polyline className="chart-line" points={view.line} />
              {point ? <line className="chart-cross" x1={view.x(point.ts)} x2={view.x(point.ts)} y1={0} y2={H} /> : null}
            </svg>
            {view.zone && view.zone.w > 24 ? <span className="chart-zone-label">{t('chart.windowZone')}</span> : null}
            <span className="chart-axis chart-axis-hi num">{formatPrice(view.hi)}</span>
            <span className="chart-axis chart-axis-lo num">{formatPrice(Math.max(view.lo, 0))}</span>
            {point ? (
              <span className="chart-tip num" role="status">
                {t('chart.point', { price: formatPrice(point.price), time: formatTime(point.ts) })}
              </span>
            ) : null}
          </div>
        )}
      </div>
    </section>
  )
})
