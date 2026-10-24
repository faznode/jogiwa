// Lazy chunk: three + @react-three/fiber, landing only (never in the app shell, never on /t/*).
// 64 instanced columns (one deposit each) rise to uneven heights while the demo window runs, then settle to one height:
// one clearing price for everyone. Procedural geometry, 2 draw calls, demand frameloop, DPR ≤ 1.5, paused offscreen.
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useEffect, useMemo, useRef } from 'react'
import { Color, InstancedMesh, Object3D } from 'three'
import { oklchToHex } from '../../lib/color'
import { mulberry32 } from '../../lib/prng'
import { color } from '../../styles/tokens'

const N = 8
const COUNT = N * N
const YOU = 27
const RISE = 5.2
const HOLD = 1.1
const SETTLE = 1.3
const REST = 4

const easeOut = (x: number) => 1 - (1 - x) ** 3
const easeInOut = (x: number) => (x < 0.5 ? 4 * x * x * x : 1 - (-2 * x + 2) ** 3 / 2)

function Columns({ running, theme }: { running: boolean; theme: 'light' | 'dark' }) {
  const mesh = useRef<InstancedMesh>(null)
  const invalidate = useThree((s) => s.invalidate)
  const start = useRef(performance.now())
  const pointer = useThree((s) => s.pointer)
  const camera = useThree((s) => s.camera)
  const dummy = useMemo(() => new Object3D(), [])
  const heights = useMemo(() => {
    const rng = mulberry32(91342)
    return Array.from({ length: COUNT }, () => 0.35 + rng() ** 1.6 * 2.6)
  }, [])
  const level = useMemo(() => heights.reduce((s, h) => s + h, 0) / COUNT, [heights])

  useEffect(() => {
    const m = mesh.current
    if (!m) return
    const palette = color[theme]
    const ink = new Color(oklchToHex(palette.ink))
    const ink2 = new Color(oklchToHex(palette.ink2))
    const sign = new Color(oklchToHex(palette.sign))
    for (let i = 0; i < COUNT; i++) m.setColorAt(i, i === YOU ? sign : i % 3 === 0 ? ink2 : ink)
    if (m.instanceColor) m.instanceColor.needsUpdate = true
    invalidate()
  }, [theme, invalidate])

  useEffect(() => {
    if (running) invalidate()
  }, [running, invalidate])

  useFrame(() => {
    const m = mesh.current
    if (!m) return
    const cycle = RISE + HOLD + SETTLE + REST
    const t = ((performance.now() - start.current) / 1000) % cycle
    for (let i = 0; i < COUNT; i++) {
      const x = (i % N) - (N - 1) / 2
      const z = Math.floor(i / N) - (N - 1) / 2
      const delay = ((i * 37) % COUNT) / COUNT
      const rise = easeOut(Math.min(1, Math.max(0, (t - delay * 2.4) / (RISE - 2.4))))
      const settle = easeInOut(Math.min(1, Math.max(0, (t - RISE - HOLD) / SETTLE)))
      const h = Math.max(0.02, heights[i] * rise * (1 - settle) + level * settle)
      dummy.position.set(x * 1.08, h / 2, z * 1.08)
      dummy.scale.set(0.9, h, 0.9)
      dummy.updateMatrix()
      m.setMatrixAt(i, dummy.matrix)
    }
    m.instanceMatrix.needsUpdate = true
    camera.position.x = 9 + pointer.x * 0.9
    camera.position.y = 8.5 + pointer.y * 0.6
    camera.lookAt(0, 0.9, 0)
    if (running && !document.hidden) invalidate()
  })

  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, COUNT]}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial roughness={0.85} metalness={0} />
    </instancedMesh>
  )
}

export default function LevelScene({ running }: { running: boolean }) {
  const theme = (document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light') as 'light' | 'dark'
  const ground = oklchToHex(color[theme].paper3)
  return (
    <Canvas className="level-layer" frameloop="demand" dpr={[1, 1.5]} camera={{ position: [9, 8.5, 9], fov: 32 }} gl={{ antialias: true, powerPreference: 'low-power' }} aria-hidden="true">
      <color attach="background" args={[oklchToHex(color[theme].paper)]} />
      <ambientLight intensity={theme === 'dark' ? 0.7 : 1.1} />
      <directionalLight position={[6, 12, 4]} intensity={theme === 'dark' ? 1.4 : 1.8} />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <planeGeometry args={[14, 14]} />
        <meshStandardMaterial color={ground} roughness={1} />
      </mesh>
      <Columns running={running} theme={theme} />
    </Canvas>
  )
}
