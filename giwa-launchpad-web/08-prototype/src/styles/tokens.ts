// Mirror of tokens.css for code that needs values in JS (canvas, three.js, OG images, charts).
// tokens.css is the source of truth; keep names identical.

export const color = {
  light: {
    paper: 'oklch(94.6% 0.005 250)',
    paper2: 'oklch(98.3% 0.003 250)',
    paper3: 'oklch(90.6% 0.006 250)',
    ink: 'oklch(19% 0.012 262)',
    ink2: 'oklch(34% 0.012 262)',
    muted: 'oklch(46% 0.01 262)',
    rule: 'oklch(19% 0.012 262 / 0.14)',
    ruleStrong: 'oklch(19% 0.012 262 / 0.85)',
    sign: 'oklch(86.5% 0.165 95)',
    onSign: 'oklch(19% 0.012 262)',
    plate: 'oklch(19% 0.012 262)',
    onPlate: 'oklch(86.5% 0.165 95)',
    action: 'oklch(19% 0.012 262)',
    onAction: 'oklch(98.3% 0.003 250)',
    focus: 'oklch(19% 0.012 262)',
    red: 'oklch(52% 0.2 27)',
    blue: 'oklch(47% 0.15 262)',
    green: 'oklch(50% 0.13 152)',
    onDirection: 'oklch(98.3% 0.003 250)',
  },
  dark: {
    paper: 'oklch(17% 0.012 262)',
    paper2: 'oklch(21.5% 0.013 262)',
    paper3: 'oklch(26.5% 0.014 262)',
    ink: 'oklch(95.5% 0.005 250)',
    ink2: 'oklch(83% 0.007 250)',
    muted: 'oklch(70% 0.009 250)',
    rule: 'oklch(95.5% 0.005 250 / 0.14)',
    ruleStrong: 'oklch(95.5% 0.005 250 / 0.8)',
    sign: 'oklch(86.5% 0.165 95)',
    onSign: 'oklch(19% 0.012 262)',
    plate: 'oklch(11% 0.01 262)',
    onPlate: 'oklch(86.5% 0.165 95)',
    action: 'oklch(95.5% 0.005 250)',
    onAction: 'oklch(19% 0.012 262)',
    focus: 'oklch(86.5% 0.165 95)',
    red: 'oklch(69% 0.17 27)',
    blue: 'oklch(72% 0.12 255)',
    green: 'oklch(74% 0.15 152)',
    onDirection: 'oklch(17% 0.012 262)',
  },
} as const

export type ThemeName = keyof typeof color
export type Direction = 'global' | 'korean'

/** up/down roles per convention. Global: green up, red down. Korean: red up, blue down. */
export const direction: Record<Direction, { up: 'green' | 'red'; down: 'red' | 'blue' }> = {
  global: { up: 'green', down: 'red' },
  korean: { up: 'red', down: 'blue' },
}

export const font = {
  display: '"Antonio", "Antonio Fallback", ui-sans-serif, sans-serif',
  body: '"Archivo", "Archivo Fallback", ui-sans-serif, system-ui, sans-serif',
  figureWidth: '70%',
} as const

export const text = {
  '2xs': '0.75rem', xs: '0.8125rem', sm: '0.875rem', md: '1rem', lg: '1.125rem', xl: '1.375rem',
  '2xl': '1.75rem', '3xl': '2.25rem', '4xl': '3rem',
  section: 'clamp(2.25rem, 3vw + 1rem, 4rem)',
  displayS: 'clamp(2.5rem, 3.6vw + 1rem, 4.5rem)',
  display: 'clamp(3.25rem, 6vw + 0.5rem, 7rem)',
} as const

export const space = {
  '3xs': 2, '2xs': 4, xs: 8, sm: 12, md: 16, lg: 24, xl: 40, '2xl': 64, '3xl': 96, '4xl': 144,
} as const

export const radius = { plate: 2, control: 6, sheet: 10, pill: 999 } as const

export const density = {
  comfortable: { controlH: 40, controlHLg: 48, rowH: 44 },
  compact: { controlH: 32, controlHLg: 40, rowH: 36 },
} as const

export const motion = {
  ease: { out: [0.16, 1, 0.3, 1], in: [0.7, 0, 0.84, 0], inOut: [0.65, 0, 0.35, 1] },
  duration: { micro: 120, short: 200, long: 420 },
} as const

export const breakpoints = { sm: 640, md: 768, lg: 1024, xl: 1280, '2xl': 1536 } as const
export const layout = { container: 1440, gutter: { base: 16, md: 24, lg: 64 } } as const
