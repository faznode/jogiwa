// Native <dialog>: focus trap and inert background from the platform, Esc closes, focus returns to the trigger.
// Bottom sheet under 48rem, centred sheet above (components.md Modal/Sheet). Exit runs a short animation, then closes.
import { useEffect, useId, useImperativeHandle, useRef, useState, type ReactNode, type Ref } from 'react'
import { X } from 'lucide-react'
import { cx } from '../../lib/cx'
import { t } from '../../lib/i18n'
import { IconButton } from './Button'

export interface SheetHandle {
  close: (ok?: boolean) => void
}

interface SheetProps {
  title: ReactNode
  description?: ReactNode
  children: ReactNode
  footer?: ReactNode
  onClose: (ok: boolean) => void
  size?: 'sm' | 'md' | 'lg'
  className?: string
  sheetRef?: Ref<SheetHandle>
}

export function Sheet({ title, description, children, footer, onClose, size = 'md', className, sheetRef }: SheetProps) {
  const ref = useRef<HTMLDialogElement>(null)
  const [closing, setClosing] = useState<{ ok: boolean } | null>(null)
  const titleId = useId()
  const descId = useId()

  useEffect(() => {
    const dialog = ref.current
    if (dialog && !dialog.open) dialog.showModal()
  }, [])

  useImperativeHandle(sheetRef, () => ({ close: (ok = false) => setClosing({ ok }) }), [])

  return (
    <dialog
      ref={ref}
      className={cx('sheet', `sheet-${size}`, className)}
      data-closing={closing ? '' : undefined}
      aria-labelledby={titleId}
      aria-describedby={description ? descId : undefined}
      onCancel={(e) => {
        e.preventDefault()
        setClosing({ ok: false })
      }}
      onClick={(e) => {
        if (e.target === ref.current) setClosing({ ok: false })
      }}
      onAnimationEnd={(e) => {
        if (closing && e.target === ref.current) {
          ref.current?.close()
          onClose(closing.ok)
        }
      }}
    >
      <div className="sheet-inner">
        <header className="sheet-head">
          <h2 id={titleId}>{title}</h2>
          <IconButton label={t('a11y.close')} icon={X} onClick={() => setClosing({ ok: false })} />
        </header>
        {description ? (
          <p id={descId} className="sheet-desc">
            {description}
          </p>
        ) : null}
        <div className="sheet-body">{children}</div>
        {footer ? <footer className="sheet-foot">{footer}</footer> : null}
      </div>
    </dialog>
  )
}
