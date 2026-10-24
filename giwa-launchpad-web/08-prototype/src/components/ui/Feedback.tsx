import { useEffect, useId, useState, type ReactNode } from 'react'
import { AlertTriangle, Check, CircleAlert, X } from 'lucide-react'
import { RequestError } from '../../data/DataSource'
import { cx } from '../../lib/cx'
import { requestErrorMessage } from '../../lib/errors'
import { formatPct, formatSignedPct, shortAddress } from '../../lib/format'
import { t, type StringKey } from '../../lib/i18n'
import { dismissToast, useToasts } from '../../state/stores'
import { Button } from './Button'
import { DownGlyph, Icon, UpGlyph } from './Icon'

/** Jargon term with a plain-language definition on hover, focus or tap `[06-copy/glossary.md]`. */
export type GlossaryKey = 'window' | 'humansFirst' | 'verified' | 'curve' | 'people' | 'graduation' | 'fairness' | 'tax' | 'fee' | 'slippage' | 'impact' | 'credit' | 'rewards' | 'vesting' | 'keeper' | 'clearing' | 'team'

export function Term({ k, children }: { k: GlossaryKey; children: ReactNode }) {
  const [open, setOpen] = useState(false)
  const id = useId()
  return (
    <span className="term" onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
      <button
        type="button"
        className="term-btn"
        aria-describedby={id}
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        onKeyDown={(e) => {
          if (e.key === 'Escape') setOpen(false)
        }}
      >
        {children}
      </button>
      <span role="tooltip" id={id} className="term-tip" hidden={!open}>
        {t(`glossary.${k}` as StringKey)}
      </span>
    </span>
  )
}

/** Direction is never colour alone: sign, glyph and screen-reader words travel together. */
export function Change({ pct, className }: { pct: number; className?: string }) {
  const dir = pct > 0.05 ? 'up' : pct < -0.05 ? 'down' : 'flat'
  return (
    <span className={cx('change', `change-${dir}`, className)}>
      {dir === 'up' ? <UpGlyph /> : dir === 'down' ? <DownGlyph /> : null}
      <span aria-hidden="true">{formatSignedPct(pct)}</span>
      <span className="sr-only">{dir === 'flat' ? t('a11y.flat') : t(dir === 'up' ? 'a11y.up' : 'a11y.down', { value: `${formatPct(pct)}` })}</span>
    </span>
  )
}

export function Identicon({ address, size = 24 }: { address: string; size?: number }) {
  const hex = address.replace(/^0x/, '').padEnd(15, '0')
  const cells = Array.from({ length: 15 }, (_, i) => parseInt(hex[i], 16) % 2 === 0)
  return (
    <svg className="identicon" width={size} height={size} viewBox="0 0 5 5" aria-hidden="true" focusable="false" shapeRendering="crispEdges">
      <rect width="5" height="5" className="identicon-bg" />
      {cells.map((on, i) => {
        if (!on) return null
        const x = i % 3
        const y = Math.floor(i / 3)
        return (
          <g key={i}>
            <rect x={x} y={y} width="1" height="1" />
            {x < 2 ? <rect x={4 - x} y={y} width="1" height="1" /> : null}
          </g>
        )
      })}
    </svg>
  )
}

export function Address({ address, label }: { address: string; label?: ReactNode }) {
  return (
    <span className="address">
      <Identicon address={address} size={18} />
      <span className="num">{shortAddress(address)}</span>
      {label}
    </span>
  )
}

export function Badge({ tone = 'quiet', children }: { tone?: 'you' | 'team' | 'cluster' | 'quiet' | 'warn'; children: ReactNode }) {
  return <span className={cx('badge', `badge-${tone}`)}>{children}</span>
}

export function Skeleton({ className }: { className?: string }) {
  return <span className={cx('skel', className)} aria-hidden="true" />
}

export function LoadingBlock({ rows = 3, label }: { rows?: number; label?: string }) {
  return (
    <div className="loading-block" role="status" aria-label={label ?? t('a11y.loading')}>
      {Array.from({ length: rows }, (_, i) => (
        <Skeleton key={i} className="skel-row" />
      ))}
    </div>
  )
}

/** Unlit plate + one sentence + one action. */
export function EmptyState({ message, action }: { message: ReactNode; action?: ReactNode }) {
  return (
    <div className="state-plate state-empty">
      <p>{message}</p>
      {action}
    </div>
  )
}

/** What broke and what to do. Rate limits count down and never retry by themselves. */
export function ErrorState({ error, onRetry }: { error: unknown; onRetry?: () => void }) {
  const limited = error instanceof RequestError && error.code === 'rateLimited'
  const [left, setLeft] = useState(limited ? (error as RequestError).retryAfterSec : 0)
  useEffect(() => {
    if (!limited || left <= 0) return
    const id = setTimeout(() => setLeft((s) => s - 1), 1000)
    return () => clearTimeout(id)
  }, [limited, left])
  return (
    <div className="state-plate state-error" role="alert">
      <p>
        <Icon icon={CircleAlert} />
        <span>{requestErrorMessage(error, left)}</span>
      </p>
      {onRetry ? (
        <Button variant="secondary" size="sm" onClick={onRetry} disabled={limited && left > 0}>
          {t('common.retry')}
        </Button>
      ) : null}
    </div>
  )
}

export function Notice({ tone = 'info', children }: { tone?: 'info' | 'warn' | 'danger'; children: ReactNode }) {
  return (
    <div className={cx('notice', `notice-${tone}`)}>
      <Icon icon={tone === 'info' ? CircleAlert : AlertTriangle} />
      <div>{children}</div>
    </div>
  )
}

export function Toaster() {
  const toasts = useToasts()
  return (
    <div className="toaster" aria-live="polite" aria-relevant="additions text">
      <ol role="list">
        {toasts.map((toast) => {
          const failed = toast.phase === 'failed' || toast.kind === 'error'
          return (
            <li key={toast.id} className={cx('toast', failed && 'toast-failed', toast.phase === 'confirmed' && 'toast-ok')} role={failed ? 'alert' : undefined}>
              <span className="toast-icon">{toast.phase === 'pending' || toast.phase === 'preconfirmed' ? <span className="spinner" aria-hidden="true" /> : failed ? <Icon icon={AlertTriangle} /> : <Icon icon={Check} />}</span>
              <div className="toast-text">
                <p className="toast-title">{toast.title}</p>
                {toast.body ? <p className="toast-body">{toast.body}</p> : null}
                {toast.href ? (
                  <a className="toast-link" href={toast.href} target="_blank" rel="noopener noreferrer">
                    {t('tx.viewTx')}
                    <span className="sr-only">({t('a11y.newTab')})</span>
                  </a>
                ) : null}
              </div>
              <button type="button" className="icon-btn toast-close" aria-label={t('a11y.close')} onClick={() => dismissToast(toast.id)}>
                <Icon icon={X} />
              </button>
            </li>
          )
        })}
      </ol>
    </div>
  )
}
