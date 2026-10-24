import { createContext, useContext, useEffect, useState, useSyncExternalStore } from 'react'
import { t } from './i18n'

// One shared clock for every countdown, so 40 cards tick on one timer.
let now = Date.now()
const clockListeners = new Set<() => void>()
let clockTimer: ReturnType<typeof setInterval> | null = null
function subscribeClock(cb: () => void) {
  clockListeners.add(cb)
  if (!clockTimer) {
    clockTimer = setInterval(() => {
      now = Date.now()
      clockListeners.forEach((l) => l())
    }, 1000)
  }
  return () => {
    clockListeners.delete(cb)
    if (!clockListeners.size && clockTimer) {
      clearInterval(clockTimer)
      clockTimer = null
    }
  }
}
export const useNow = () => useSyncExternalStore(subscribeClock, () => now, () => 0)

export function useMediaQuery(query: string, serverValue = false) {
  return useSyncExternalStore(
    (cb) => {
      const mq = window.matchMedia(query)
      mq.addEventListener('change', cb)
      return () => mq.removeEventListener('change', cb)
    },
    () => window.matchMedia(query).matches,
    () => serverValue,
  )
}

export const useReducedMotion = () => useMediaQuery('(prefers-reduced-motion: reduce)')

/** True after hydration; keeps client-only values out of the prerendered HTML. */
export function useHydrated() {
  const [hydrated, setHydrated] = useState(false)
  useEffect(() => setHydrated(true), [])
  return hydrated
}

/** Page metadata: sets document.title on the client and records it during prerender. */
export const MetaContext = createContext<{ title?: string } | null>(null)
export function usePageTitle(title: string) {
  const meta = useContext(MetaContext)
  if (meta) meta.title = title
  useEffect(() => {
    document.title = title ? t('meta.titleTemplate', { page: title }) : t('meta.defaultTitle')
  }, [title])
}
