// Signature moment "Level" (05-motion-3d-video/3d-spec.md). The poster is always in the HTML first (LCP-safe); after idle,
// a device-tier check upgrades it: reduced motion / Save-Data / weak devices keep the poster, mid tier gets the pre-rendered
// HyperFrames loop, capable devices get the lazy WebGL chunk. Failure at any step leaves a finished page.
import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import { t } from '../../lib/i18n'

const LevelScene = lazy(() => import('./LevelScene'))

type Tier = 'poster' | 'video' | 'webgl'

function deviceTier(): Tier {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return 'poster'
  const nav = navigator as Navigator & { deviceMemory?: number; connection?: { saveData?: boolean } }
  if (nav.connection?.saveData) return 'poster'
  const memory = nav.deviceMemory ?? 8
  if (memory <= 2 || (navigator.hardwareConcurrency ?? 8) <= 2) return 'poster'
  const gl = document.createElement('canvas').getContext('webgl2')
  if (!gl) return 'poster'
  return memory <= 4 ? 'video' : 'webgl'
}

export function LevelStage() {
  const [tier, setTier] = useState<Tier>('poster')
  const [visible, setVisible] = useState(true)
  const box = useRef<HTMLDivElement>(null)
  const video = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const idle = window.requestIdleCallback ?? ((cb: () => void) => window.setTimeout(cb, 600))
    const id = idle(() => setTier(deviceTier()))
    const el = box.current
    const io = el ? new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: 0.1 }) : null
    if (el && io) io.observe(el)
    return () => {
      io?.disconnect()
      if (window.cancelIdleCallback && typeof id === 'number') window.cancelIdleCallback(id)
    }
  }, [])

  useEffect(() => {
    const v = video.current
    if (!v) return
    if (visible) v.play().catch(() => undefined)
    else v.pause()
  }, [visible, tier])

  return (
    <figure className="level" aria-labelledby="level-caption">
      <div className="level-media" ref={box} aria-hidden="true">
        <img className="level-poster" src="/media/level-poster.webp" srcSet="/media/level-poster-640.webp 640w, /media/level-poster.webp 1280w" sizes="(min-width: 60rem) 46vw, 100vw" width={1280} height={720} alt="" fetchPriority="high" decoding="async" />
        {tier === 'video' ? <video ref={video} className="level-layer" src="/media/level-loop.mp4" muted loop playsInline preload="none" poster="/media/level-poster.webp" /> : null}
        {tier === 'webgl' ? (
          <Suspense fallback={null}>
            <LevelScene running={visible} />
          </Suspense>
        ) : null}
        <span className="level-plate">{t('landing.levelPlate')}</span>
      </div>
      <figcaption id="level-caption" className="level-caption">
        {t('landing.levelCaption')}
      </figcaption>
    </figure>
  )
}
