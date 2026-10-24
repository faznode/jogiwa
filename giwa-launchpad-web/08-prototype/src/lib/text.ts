// User-generated text is rendered as text only (ADR-S1 §5). Bidi controls are stripped; zero-width characters become U+FFFD so
// a name like "Up\u200Bbit" can never pass as "Upbit".
const BIDI = /[\u202A-\u202E\u2066-\u2069\u200E\u200F\u061C]/g
const ZERO_WIDTH = /[\u200B-\u200D\u2060\uFEFF\u00AD]/g
const HAS_HIDDEN = /[\u202A-\u202E\u2066-\u2069\u200E\u200F\u061C\u200B-\u200D\u2060\uFEFF\u00AD]/

export const sanitizeDisplayText = (s: string) => s.replace(BIDI, '').replace(ZERO_WIDTH, '\uFFFD')
export const hasHiddenCharacters = (s: string) => HAS_HIDDEN.test(s)

export function safeExternalLink(url: string): { href: string; domain: string } | null {
  try {
    const u = new URL(url)
    if (u.protocol !== 'https:' || !u.hostname.includes('.')) return null
    return { href: u.href, domain: u.hostname.replace(/^www\./, '') }
  } catch {
    return null
  }
}

/** Antonio caps step down two sizes for long names, then truncate (graphic-language long-name rule). */
export function nameSize(name: string): 'normal' | 'long' | 'xlong' {
  const n = [...name].length
  return n > 22 ? 'xlong' : n > 14 ? 'long' : 'normal'
}
