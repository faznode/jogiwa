import type { ReactNode } from 'react'
import { cx } from '../../lib/cx'
import { t } from '../../lib/i18n'
import { Skeleton } from '../ui/Feedback'

/** App-screen page head: fixed scale, display face for the title only (Hallmark app rules). */
export function PageHeader({ title, lead, actions, children }: { title: ReactNode; lead?: ReactNode; actions?: ReactNode; children?: ReactNode }) {
  return (
    <header className="page-head">
      <div className="page-head-text">
        <h1 className="page-title display">{title}</h1>
        {lead ? <p className="page-lead">{lead}</p> : null}
        {children}
      </div>
      {actions ? <div className="page-actions">{actions}</div> : null}
    </header>
  )
}

export function Page({ children, className, narrow }: { children: ReactNode; className?: string; narrow?: boolean }) {
  return <div className={cx('page container', narrow && 'page-narrow', className)}>{children}</div>
}

export function Section({ title, children, className, actions, id }: { title: ReactNode; children: ReactNode; className?: string; actions?: ReactNode; id?: string }) {
  return (
    <section className={cx('section', className)} aria-labelledby={id}>
      <div className="section-head">
        <h2 id={id}>{title}</h2>
        {actions}
      </div>
      {children}
    </section>
  )
}

export function PageFallback() {
  return (
    <div className="page container" role="status" aria-label={t('a11y.loading')}>
      <Skeleton className="skel-title" />
      <Skeleton className="skel-row" />
      <Skeleton className="skel-block" />
    </div>
  )
}

/** Fee split bar: three labelled segments, labels outside the bar (graphic-language data viz). */
export function FeeSplitBar() {
  return (
    <figure className="split">
      <div className="split-bar" aria-hidden="true">
        <span className="split-creator" />
        <span className="split-holders" />
        <span className="split-protocol" />
      </div>
      <figcaption className="split-labels">
        <span>{t('feesPage.creatorPart')}</span>
        <span>{t('feesPage.holdersPart')}</span>
        <span>{t('feesPage.protocolPart')}</span>
      </figcaption>
    </figure>
  )
}
