import { useId, useRef, type InputHTMLAttributes, type KeyboardEvent, type ReactNode, type TextareaHTMLAttributes } from 'react'
import { AlertCircle, Check } from 'lucide-react'
import { cx } from '../../lib/cx'
import { Icon } from './Icon'

interface FieldShellProps {
  id: string
  label: ReactNode
  help?: ReactNode
  error?: string | null
  success?: string | null
  count?: { value: number; max: number }
  children: ReactNode
  aside?: ReactNode
}

export function FieldShell({ id, label, help, error, success, count, children, aside }: FieldShellProps) {
  return (
    <div className="field">
      <div className="field-top">
        <label htmlFor={id}>{label}</label>
        {aside ?? (count ? <span className={cx('field-count num', count.value > count.max && 'is-over')}>{`${count.value}/${count.max}`}</span> : null)}
      </div>
      {children}
      {error ? (
        <p id={`${id}-msg`} className="field-msg field-error">
          <Icon icon={AlertCircle} />
          <span>{error}</span>
        </p>
      ) : success ? (
        <p id={`${id}-msg`} className="field-msg field-success">
          <Icon icon={Check} />
          <span>{success}</span>
        </p>
      ) : help ? (
        <p id={`${id}-msg`} className="field-msg field-help">
          {help}
        </p>
      ) : null}
    </div>
  )
}

type TextFieldProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value'> & {
  id: string
  label: ReactNode
  value: string
  onChange: (value: string) => void
  help?: ReactNode
  error?: string | null
  success?: string | null
  max?: number
  suffix?: ReactNode
}

export function TextField({ id, label, value, onChange, help, error, success, max, suffix, className, ...input }: TextFieldProps) {
  const hasMsg = Boolean(error || success || help)
  return (
    <FieldShell id={id} label={label} help={help} error={error} success={success} count={max ? { value: [...value].length, max } : undefined}>
      <div className={cx('input', className)} data-invalid={error ? '' : undefined}>
        <input
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          aria-invalid={error ? true : undefined}
          aria-describedby={hasMsg ? `${id}-msg` : undefined}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && (e.nativeEvent.isComposing || e.keyCode === 229)) e.preventDefault()
          }}
          {...input}
        />
        {suffix}
      </div>
    </FieldShell>
  )
}

type TextAreaProps = Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'onChange' | 'value'> & {
  id: string
  label: ReactNode
  value: string
  onChange: (value: string) => void
  help?: ReactNode
  error?: string | null
  max?: number
}

export function TextArea({ id, label, value, onChange, help, error, max, ...rest }: TextAreaProps) {
  return (
    <FieldShell id={id} label={label} help={help} error={error} count={max ? { value: [...value].length, max } : undefined}>
      <div className="input input-area" data-invalid={error ? '' : undefined}>
        <textarea id={id} value={value} onChange={(e) => onChange(e.target.value)} aria-invalid={error ? true : undefined} aria-describedby={help || error ? `${id}-msg` : undefined} rows={4} {...rest} />
      </div>
    </FieldShell>
  )
}

export function Checkbox({ checked, onChange, children, id }: { checked: boolean; onChange: (v: boolean) => void; children: ReactNode; id?: string }) {
  const auto = useId()
  const cid = id ?? auto
  return (
    <label className="check" htmlFor={cid}>
      <input id={cid} type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} />
      <span className="check-box" aria-hidden="true">
        <Icon icon={Check} />
      </span>
      <span>{children}</span>
    </label>
  )
}

export interface Option<T extends string> {
  value: T
  label: ReactNode
  hint?: ReactNode
}

/** Radio group semantics for one-of-many settings (theme, price colours, report reason). */
export function RadioGroup<T extends string>({ label, value, onChange, options, name, layout = 'stack' }: { label: ReactNode; value: T; onChange: (v: T) => void; options: Option<T>[]; name: string; layout?: 'stack' | 'row' }) {
  const id = useId()
  return (
    <fieldset className={cx('radio-group', `radio-${layout}`)}>
      <legend id={id}>{label}</legend>
      {options.map((o) => (
        <label key={o.value} className={cx('radio', value === o.value && 'is-selected')}>
          <input type="radio" name={name} value={o.value} checked={value === o.value} onChange={() => onChange(o.value)} />
          <span className="radio-dot" aria-hidden="true" />
          <span className="radio-text">
            <span>{o.label}</span>
            {o.hint ? <span className="radio-hint">{o.hint}</span> : null}
          </span>
        </label>
      ))}
    </fieldset>
  )
}

/** Toggle buttons for quick amounts (10/25/50/Max). */
export function Chips<T extends string>({ label, options, value, onChange }: { label: string; options: { value: T; label: string }[]; value: T | null; onChange: (v: T) => void }) {
  return (
    <div className="chips" role="group" aria-label={label}>
      {options.map((o) => (
        <button key={o.value} type="button" className="chip" aria-pressed={value === o.value} onClick={() => onChange(o.value)}>
          {o.label}
        </button>
      ))}
    </div>
  )
}

export interface TabItem<T extends string> {
  value: T
  label: ReactNode
  extra?: ReactNode
}

/** WAI-ARIA tabs with roving focus. `tone` colours the selected Buy/Sell tab by price direction. */
export function Tabs<T extends string>({ label, items, value, onChange, idBase, tone, className }: { label: string; items: TabItem<T>[]; value: T; onChange: (v: T) => void; idBase: string; tone?: boolean; className?: string }) {
  const refs = useRef<(HTMLButtonElement | null)[]>([])
  const onKey = (e: KeyboardEvent, index: number) => {
    const last = items.length - 1
    const next = e.key === 'ArrowRight' ? (index === last ? 0 : index + 1) : e.key === 'ArrowLeft' ? (index === 0 ? last : index - 1) : e.key === 'Home' ? 0 : e.key === 'End' ? last : -1
    if (next < 0) return
    e.preventDefault()
    onChange(items[next].value)
    refs.current[next]?.focus()
  }
  return (
    <div role="tablist" aria-label={label} className={cx('tabs', tone && 'tabs-tone', className)}>
      {items.map((item, i) => {
        const selected = item.value === value
        return (
          <button
            key={item.value}
            ref={(el) => {
              refs.current[i] = el
            }}
            role="tab"
            type="button"
            id={`${idBase}-tab-${item.value}`}
            aria-selected={selected}
            aria-controls={`${idBase}-panel`}
            tabIndex={selected ? 0 : -1}
            className={cx('tab', tone && `tab-${item.value}`)}
            onClick={() => onChange(item.value)}
            onKeyDown={(e) => onKey(e, i)}
          >
            <span>{item.label}</span>
            {item.extra}
          </button>
        )
      })}
    </div>
  )
}

export function TabPanel({ idBase, value, children, className, focusable }: { idBase: string; value: string; children: ReactNode; className?: string; focusable?: boolean }) {
  return (
    <div role="tabpanel" id={`${idBase}-panel`} aria-labelledby={`${idBase}-tab-${value}`} className={className} tabIndex={focusable ? 0 : undefined}>
      {children}
    </div>
  )
}
