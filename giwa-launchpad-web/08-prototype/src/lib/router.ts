// Router adapter (ADR-F1): the app imports routing from here only, so swapping wouter for another router is one file.
import { useCallback } from 'react'
import { useLocation, useSearch } from 'wouter'

export { Link, Route, Router, Switch, useLocation, useParams, useRoute, useSearch } from 'wouter'

/** Reads and writes one query parameter; filters and tabs live in the URL (Hallmark app-screen rule). */
export function useSearchParam(name: string): [string | null, (value: string | null) => void] {
  const search = useSearch()
  const [location, setLocation] = useLocation()
  const value = new URLSearchParams(search).get(name)
  const set = useCallback(
    (next: string | null) => {
      const params = new URLSearchParams(window.location.search)
      if (next === null || next === '') params.delete(name)
      else params.set(name, next)
      const qs = params.toString()
      setLocation(qs ? `${location}?${qs}` : location, { replace: true })
    },
    [name, location, setLocation],
  )
  return [value, set]
}
