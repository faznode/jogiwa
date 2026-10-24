// All UI copy lives in strings/en.json, keyed `area.item` for future KO/ID locales `[F18, F32]`. Components never hard-code copy.
import en from '../strings/en.json'

type Leaves<T, P extends string = ''> = {
  [K in keyof T & string]: T[K] extends string ? `${P}${K}` : T[K] extends readonly unknown[] ? never : Leaves<T[K], `${P}${K}.`>
}[keyof T & string]

type Lists<T, P extends string = ''> = {
  [K in keyof T & string]: T[K] extends readonly string[] ? `${P}${K}` : T[K] extends string ? never : Lists<T[K], `${P}${K}.`>
}[keyof T & string]

export type StringKey = Leaves<typeof en>
export type ListKey = Lists<typeof en>
export type Vars = Record<string, string | number>

const table = en as unknown as Record<string, unknown>
const lookup = (key: string) => key.split('.').reduce<unknown>((node, part) => (node as Record<string, unknown> | undefined)?.[part], table)
const fill = (s: string, vars?: Vars) => (vars ? s.replace(/\{(\w+)\}/g, (m, k: string) => (k in vars ? String(vars[k]) : m)) : s)

export function t(key: StringKey, vars?: Vars): string {
  const value = lookup(key)
  return typeof value === 'string' ? fill(value, vars) : key
}

export function tList(key: ListKey): string[] {
  const value = lookup(key)
  return Array.isArray(value) ? (value as string[]) : []
}

/** Dynamic keys (e.g. tabs from data). Typed loosely on purpose; falls back to the key so gaps are visible in QA. */
export function tDynamic(key: string, vars?: Vars): string {
  const value = lookup(key)
  return typeof value === 'string' ? fill(value, vars) : key
}

export const LOCALE = 'en'
