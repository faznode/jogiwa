/** Deterministic PRNG so mock data is identical on every load (and between prerender and hydration). */
export function mulberry32(seed: number) {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export type Rng = () => number

export const between = (rng: Rng, min: number, max: number) => min + (max - min) * rng()
export const intBetween = (rng: Rng, min: number, max: number) => Math.floor(between(rng, min, max + 1))
export const pick = <T,>(rng: Rng, list: readonly T[]) => list[Math.floor(rng() * list.length)]

const HEX = '0123456789abcdef'
export function hexString(rng: Rng, length: number) {
  let out = ''
  for (let i = 0; i < length; i++) out += HEX[Math.floor(rng() * 16)]
  return out
}
export const fakeAddress = (rng: Rng) => `0x${hexString(rng, 40)}`
export const fakeHash = (rng: Rng) => `0x${hexString(rng, 64)}`
