import type { ButtonHTMLAttributes, MouseEvent, ReactNode } from 'react'
import { ArrowUpRight, type LucideIcon } from 'lucide-react'
import { cx } from '../../lib/cx'
import { t } from '../../lib/i18n'
import { Link } from '../../lib/router'
import { safeExternalLink } from '../../lib/text'
import { Icon } from './Icon'

export type ButtonVariant = 'primary' | 'secondary' | 'quiet' | 'buy' | 'sell' | 'danger' | 'sign'
type Size = 'sm' | 'md' | 'lg'

const classes = (variant: ButtonVariant, size: Size, block?: boolean, className?: string) =>
  cx('btn', `btn-${variant}`, size !== 'md' && `btn-${size}`, block && 'btn-block', className)

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: Size
  block?: boolean
  loading?: boolean
  icon?: LucideIcon
  iconEnd?: LucideIcon
}

/** All eight states: default, hover, focus-visible, active, disabled, loading (label stays, aria-busy), error and success via props. */
export function Button({ variant = 'primary', size = 'md', block, loading, icon, iconEnd, className, children, type = 'button', onClick, ...rest }: ButtonProps) {
  const handle = (e: MouseEvent<HTMLButtonElement>) => {
    if (loading) {
      e.preventDefault()
      return
    }
    onClick?.(e)
  }
  return (
    <button type={type} className={classes(variant, size, block, className)} aria-busy={loading || undefined} onClick={handle} {...rest}>
      {loading ? <span className="spinner" aria-hidden="true" /> : icon ? <Icon icon={icon} /> : null}
      <span className="btn-label">{children}</span>
      {iconEnd && !loading ? <Icon icon={iconEnd} /> : null}
    </button>
  )
}

export function LinkButton({ href, variant = 'primary', size = 'md', block, className, children, icon }: { href: string; variant?: ButtonVariant; size?: Size; block?: boolean; className?: string; children: ReactNode; icon?: LucideIcon }) {
  return (
    <Link href={href} className={classes(variant, size, block, className)}>
      {icon ? <Icon icon={icon} /> : null}
      <span className="btn-label">{children}</span>
    </Link>
  )
}

export function IconButton({ label, icon, size = 20, className, ...rest }: { label: string; icon: LucideIcon; size?: 16 | 20 | 24 } & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button type="button" className={cx('icon-btn', className)} aria-label={label} title={label} {...rest}>
      <Icon icon={icon} size={size} />
    </button>
  )
}

/** External links always show their domain `[10 §1.6]` and never pass a referrer or opener. */
export function ExternalLink({ href, children, domain = true, className }: { href: string; children: ReactNode; domain?: boolean; className?: string }) {
  const safe = safeExternalLink(href)
  if (!safe) return <span className={className}>{children}</span>
  return (
    <a href={safe.href} target="_blank" rel="noopener noreferrer nofollow ugc" className={cx('ext-link', className)}>
      <span>{children}</span>
      {domain ? <span className="ext-domain">{safe.domain}</span> : null}
      <Icon icon={ArrowUpRight} />
      <span className="sr-only">({t('a11y.newTab')})</span>
    </a>
  )
}
