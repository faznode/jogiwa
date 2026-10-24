// Lucide (ISC) restyled to the Bros grammar: 1.75 stroke, square caps, mitred joins (CSS), 16/20/24 only.
// Custom glyphs on the same 24 grid for what Lucide can't say: direction, people, window, sign plate (graphic-language.md).
import type { LucideIcon } from 'lucide-react'
import { cx } from '../../lib/cx'

export function Icon({ icon: Glyph, size = 16, label, className }: { icon: LucideIcon; size?: 16 | 20 | 24; label?: string; className?: string }) {
  return <Glyph className={cx('icon', className)} size={size} strokeWidth={1.75} absoluteStrokeWidth aria-hidden={label ? undefined : true} aria-label={label} role={label ? 'img' : undefined} focusable="false" />
}

export function UpGlyph({ size = 10 }: { size?: number }) {
  return (
    <svg className="glyph" width={size} height={size} viewBox="0 0 10 10" aria-hidden="true" focusable="false">
      <path d="M5 1.5 9.5 8.5h-9z" fill="currentColor" />
    </svg>
  )
}

export function DownGlyph({ size = 10 }: { size?: number }) {
  return (
    <svg className="glyph" width={size} height={size} viewBox="0 0 10 10" aria-hidden="true" focusable="false">
      <path d="M5 8.5.5 1.5h9z" fill="currentColor" />
    </svg>
  )
}

/** Two offset heads over two shoulders; deliberately genderless. */
export function PeopleGlyph({ size = 16 }: { size?: 16 | 20 | 24 }) {
  return (
    <svg className="icon" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} aria-hidden="true" focusable="false">
      <circle cx="9" cy="8" r="3.25" />
      <circle cx="16.5" cy="9.5" r="2.5" />
      <path d="M3.5 19.5c.7-3.4 2.8-5.3 5.5-5.3s4.8 1.9 5.5 5.3" />
      <path d="M15.4 14.4c2.5-.2 4.4 1.5 5.1 4.6" />
    </svg>
  )
}

/** A square with a single clock hand: the opening window. */
export function WindowGlyph({ size = 16 }: { size?: 16 | 20 | 24 }) {
  return (
    <svg className="icon" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} aria-hidden="true" focusable="false">
      <rect x="4" y="4" width="16" height="16" />
      <path d="M12 12V7.5M12 12l3.2 2.2" />
    </svg>
  )
}

/** A sign plate: graduated tokens keep their sign. */
export function PlateGlyph({ size = 16 }: { size?: 16 | 20 | 24 }) {
  return (
    <svg className="icon" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} aria-hidden="true" focusable="false">
      <rect x="3" y="7" width="18" height="10" />
      <path d="M7 12h7" />
    </svg>
  )
}
