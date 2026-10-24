import { useState, type ReactNode } from 'react'
import { cx } from '../../lib/cx'
import { t } from '../../lib/i18n'
import { SLIPPAGE_PRESETS } from '../../lib/params'
import { FieldShell } from './Controls'

/** Accepts digits, one decimal point and K/M/B suffixes ("1.5k" becomes 1500 on blur). */
export function parseAmount(raw: string): number {
  const m = raw.trim().replace(/,/g, '').match(/^(\d*\.?\d*)([kmb])?$/i)
  if (!m || !m[1] || m[1] === '.') return 0
  const mult = { k: 1e3, m: 1e6, b: 1e9 }[(m[2] ?? '').toLowerCase() as 'k' | 'm' | 'b'] ?? 1
  return Number(m[1]) * mult
}

const cleanAmount = (raw: string) => raw.replace(/[^\d.,kKmMbB]/g, '').replace(/(\..*)\./g, '$1')

interface AmountInputProps {
  id: string
  label: ReactNode
  value: string
  onChange: (value: string) => void
  unit: string
  balance?: ReactNode
  error?: string | null
  help?: ReactNode
  chips?: ReactNode
  disabled?: boolean
}

export function AmountInput({ id, label, value, onChange, unit, balance, error, help, chips, disabled }: AmountInputProps) {
  return (
    <FieldShell id={id} label={label} help={help} error={error} aside={balance ? <span className="field-count num">{balance}</span> : undefined}>
      <div className={cx('input amount-input')} data-invalid={error ? '' : undefined}>
        <input
          id={id}
          inputMode="decimal"
          autoComplete="off"
          spellCheck={false}
          placeholder="0"
          value={value}
          disabled={disabled}
          aria-invalid={error ? true : undefined}
          aria-describedby={error || help ? `${id}-msg` : undefined}
          onChange={(e) => onChange(cleanAmount(e.target.value))}
          onBlur={() => {
            if (/[kmb]$/i.test(value)) onChange(String(parseAmount(value)))
          }}
        />
        <span className="input-unit">{unit}</span>
      </div>
      {chips}
    </FieldShell>
  )
}

/** Presets 0.5 / 1 / 2 / custom; warns above 5%, blocks above 50% (components.md). */
export function SlippageControl({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const preset = (SLIPPAGE_PRESETS as readonly number[]).includes(value)
  const [custom, setCustom] = useState(preset ? '' : String(value))
  const customValue = Number(custom)
  const blocked = !preset && customValue > 50
  const high = !blocked && value > 5
  return (
    <fieldset className="slippage">
      <legend>{t('trade.slippage')}</legend>
      <p className="field-help">{t('trade.slippageHelp')}</p>
      <div className="chips">
        {SLIPPAGE_PRESETS.map((p) => (
          <label key={p} className={cx('chip', value === p && preset && 'is-selected')}>
            <input
              type="radio"
              name="slippage"
              className="sr-only"
              checked={value === p && preset}
              onChange={() => {
                setCustom('')
                onChange(p)
              }}
            />
            {`${p}%`}
          </label>
        ))}
        <label className={cx('chip chip-input', !preset && 'is-selected')}>
          <span className="sr-only">{t('trade.slippageCustom')}</span>
          <input
            inputMode="decimal"
            placeholder={t('trade.slippageCustom')}
            value={custom}
            aria-invalid={blocked || undefined}
            onChange={(e) => {
              const v = e.target.value.replace(/[^\d.]/g, '')
              setCustom(v)
              const n = Number(v)
              if (n > 0 && n <= 50) onChange(n)
            }}
          />
          <span aria-hidden="true">%</span>
        </label>
      </div>
      {blocked ? <p className="field-msg field-error">{t('trade.slippageBlocked')}</p> : high ? <p className="field-msg field-warn">{t('trade.slippageHigh')}</p> : null}
    </fieldset>
  )
}
