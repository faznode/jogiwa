import { useSyncExternalStore } from 'react'

/** Tiny observable store; every UI store below is one of these. */
function createStore<T>(initial: T) {
  let value = initial
  const listeners = new Set<() => void>()
  return {
    get: () => value,
    set(next: T | ((prev: T) => T)) {
      value = typeof next === 'function' ? (next as (prev: T) => T)(value) : next
      listeners.forEach((l) => l())
    },
    subscribe(l: () => void) {
      listeners.add(l)
      return () => listeners.delete(l)
    },
  }
}

// ---------- sheets (one at a time; a modal is the last answer, Hallmark app rule) ----------
export type SheetName = 'connect' | 'network' | 'risk' | 'presign' | 'fairness' | 'settings' | 'account' | 'share' | 'report' | 'mock' | 'testnet'
export interface SheetState {
  name: SheetName
  props: Record<string, unknown>
  resolve: (ok: boolean) => void
}

const sheetStore = createStore<SheetState | null>(null)

export function openSheet(name: SheetName, props: Record<string, unknown> = {}): Promise<boolean> {
  sheetStore.get()?.resolve(false)
  return new Promise((resolve) => sheetStore.set({ name, props, resolve }))
}

export function closeSheet(ok = false) {
  const current = sheetStore.get()
  sheetStore.set(null)
  current?.resolve(ok)
}

export const useSheet = () => useSyncExternalStore(sheetStore.subscribe, sheetStore.get, () => null)

// ---------- toasts ----------
export type ToastKind = 'tx' | 'info' | 'error'
export type ToastPhase = 'pending' | 'preconfirmed' | 'confirmed' | 'failed'
export interface Toast {
  id: number
  kind: ToastKind
  title: string
  body?: string
  phase?: ToastPhase
  href?: string
}

const toastStore = createStore<Toast[]>([])
let toastId = 1
const timers = new Map<number, ReturnType<typeof setTimeout>>()

export function pushToast(toast: Omit<Toast, 'id'>) {
  const id = toastId++
  toastStore.set((list) => [...list.slice(-3), { ...toast, id }])
  scheduleDismiss(id, toast)
  return id
}

export function updateToast(id: number, patch: Partial<Toast>) {
  toastStore.set((list) => list.map((t) => (t.id === id ? { ...t, ...patch } : t)))
  const next = toastStore.get().find((t) => t.id === id)
  if (next) scheduleDismiss(id, next)
}

export function dismissToast(id: number) {
  clearTimeout(timers.get(id))
  timers.delete(id)
  toastStore.set((list) => list.filter((t) => t.id !== id))
}

function scheduleDismiss(id: number, toast: Omit<Toast, 'id'>) {
  clearTimeout(timers.get(id))
  if (toast.kind === 'tx' && (toast.phase === 'pending' || toast.phase === 'preconfirmed')) return
  timers.set(id, setTimeout(() => dismissToast(id), toast.kind === 'error' || toast.phase === 'failed' ? 9000 : 6000))
}

export const useToasts = () => useSyncExternalStore(toastStore.subscribe, toastStore.get, () => [] as Toast[])

// ---------- display settings (UI preference on this device; boot.js reads the same key before paint) ----------
export type ThemeSetting = 'system' | 'light' | 'dark'
export type DirectionSetting = 'auto' | 'global' | 'korean'
export interface DisplaySettings {
  theme: ThemeSetting
  direction: DirectionSetting
}

const STORAGE_KEY = 'bros:display'

function readSettings(): DisplaySettings {
  if (typeof window === 'undefined') return { theme: 'system', direction: 'auto' }
  try {
    const raw = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '{}') as { theme?: string; direction?: string }
    return {
      theme: raw.theme === 'light' || raw.theme === 'dark' ? raw.theme : 'system',
      direction: raw.direction === 'global' || raw.direction === 'korean' ? raw.direction : 'auto',
    }
  } catch {
    return { theme: 'system', direction: 'auto' }
  }
}

const settingsStore = createStore<DisplaySettings>(readSettings())

export function autoDirection(): 'global' | 'korean' {
  const langs = navigator.languages?.length ? navigator.languages : [navigator.language]
  if (langs.some((l) => /^ko\b/i.test(l))) return 'korean'
  try {
    if (Intl.DateTimeFormat().resolvedOptions().timeZone === 'Asia/Seoul') return 'korean'
  } catch {
    /* default below */
  }
  return 'global'
}

export function applySettings(s: DisplaySettings) {
  const root = document.documentElement
  const dark = window.matchMedia('(prefers-color-scheme: dark)').matches
  root.dataset.theme = s.theme === 'system' ? (dark ? 'dark' : 'light') : s.theme
  root.dataset.direction = s.direction === 'auto' ? autoDirection() : s.direction
}

export function setSettings(patch: Partial<DisplaySettings>) {
  const next = { ...settingsStore.get(), ...patch }
  settingsStore.set(next)
  const stored: Record<string, string> = {}
  if (next.theme !== 'system') stored.theme = next.theme
  if (next.direction !== 'auto') stored.direction = next.direction
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stored))
  } catch {
    /* storage blocked: the setting still applies for this visit */
  }
  applySettings(next)
}

export const useSettings = () => useSyncExternalStore(settingsStore.subscribe, settingsStore.get, () => ({ theme: 'system', direction: 'auto' }) as DisplaySettings)

// ---------- per-session flags ----------
export const sessionFlags = {
  fairnessSeen: new Set<string>(),
  celebrated: new Set<string>(),
}

/** The testnet strip can collapse to a chip for this session, never permanently (brief rule 5). */
const stripStore = createStore<boolean>(false)
export const useStripHidden = () => useSyncExternalStore(stripStore.subscribe, stripStore.get, () => false)
export function setStripHidden(hidden: boolean) {
  stripStore.set(hidden)
  try {
    sessionStorage.setItem('bros:strip', hidden ? 'hidden' : 'shown')
  } catch {
    /* storage blocked: applies for this page only */
  }
}
export function restoreStrip() {
  try {
    if (sessionStorage.getItem('bros:strip') === 'hidden') stripStore.set(true)
  } catch {
    /* default: shown */
  }
}
export const getSettings = () => settingsStore.get()
