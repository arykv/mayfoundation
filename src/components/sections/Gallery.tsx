import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { gallery } from '@/data/site'
import { Photo } from '@/components/ui/Photo'
import { Reveal } from '@/components/ui/Reveal'
import { Lightbox } from '@/components/ui/Lightbox'

/**
 * On a wide screen the rail is driven by vertical scroll, so moving down the
 * page walks you along the year. Below that — and whenever reduced motion is
 * requested — it is an ordinary swipeable rail, which is what a phone wants
 * anyway.
 */
/**
 * How far the page scrolls per pixel the rail travels. Below 1 the rail
 * outruns the scroll, which keeps twenty photographs from costing seven
 * screens of height.
 */
const SCROLL_RATIO = 0.5

export function Gallery() {
  const [active, setActive] = useState<number | null>(null)
  const [pinned, setPinned] = useState(false)
  const [distance, setDistance] = useState(0)

  const pinRef = useRef<HTMLDivElement>(null)
  const railRef = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()

  useEffect(() => {
    const query = window.matchMedia('(min-width: 1024px)')
    const sync = () => setPinned(query.matches && !reduced)
    sync()
    query.addEventListener('change', sync)
    return () => query.removeEventListener('change', sync)
  }, [reduced])

  useLayoutEffect(() => {
    if (!pinned) {
      setDistance(0)
      return
    }
    const measure = () => {
      const rail = railRef.current
      if (!rail) return
      setDistance(Math.max(0, rail.scrollWidth - window.innerWidth + 120))
    }
    measure()

    const observer = new ResizeObserver(measure)
    if (railRef.current) observer.observe(railRef.current)
    window.addEventListener('resize', measure)
    return () => {
      observer.disconnect()
      window.removeEventListener('resize', measure)
    }
  }, [pinned])

  const { scrollYProgress } = useScroll({
    target: pinRef,
    offset: ['start start', 'end end'],
  })
  const x = useTransform(scrollYProgress, [0, 1], [0, -distance])

  const tiles = gallery.map((name, i) => (
    <button
      key={name}
      onClick={() => setActive(i)}
      className="group relative h-full shrink-0 overflow-hidden rounded-[1.25rem] focus-visible:outline-offset-4"
      aria-label={`Open photograph ${i + 1} of ${gallery.length}`}
    >
      <Photo
        name={name}
        alt={`May Foundation in the field, photograph ${i + 1}`}
        sizes="(min-width: 1024px) 34vw, 72vw"
        className="h-full w-auto rounded-[1.25rem]"
        imgClassName="transition-transform duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.05]"
      />
      <span className="pointer-events-none absolute inset-0 rounded-[1.25rem] bg-dusk/0 transition-colors duration-500 group-hover:bg-dusk/12" />
    </button>
  ))

  return (
    <section id="field" className="relative py-24 sm:py-28 lg:pt-36">
      <div className="shell">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="eyebrow">Field notes</p>
              <h2 className="mt-5 max-w-[20ch] text-[length:var(--text-title)] font-semibold leading-[1.1]">
                What the work actually looks like.
              </h2>
            </div>
            <p className="max-w-[26ch] text-sm text-muted">
              {gallery.length} photographs from sessions, camps and drives. Tap any of
              them.
            </p>
          </div>
        </Reveal>
      </div>

      {pinned ? (
        <div
          ref={pinRef}
          style={{ height: `calc(100vh + ${Math.round(distance * SCROLL_RATIO)}px)` }}
          className="relative mt-14"
        >
          <div className="sticky top-0 flex h-screen items-center overflow-hidden">
            <motion.div
              ref={railRef}
              style={{ x }}
              className="flex h-[58vh] max-h-[560px] gap-5 pl-10 will-change-transform"
            >
              {tiles}
              <div className="w-10 shrink-0" aria-hidden />
            </motion.div>
          </div>
        </div>
      ) : (
        <div className="hide-scrollbar mt-12 flex h-[44vh] max-h-[420px] snap-x snap-mandatory gap-4 overflow-x-auto px-6 sm:px-10">
          {gallery.map((name, i) => (
            <div key={name} className="h-full shrink-0 snap-start">
              {tiles[i]}
            </div>
          ))}
          <div className="w-2 shrink-0" aria-hidden />
        </div>
      )}

      <Lightbox
        items={gallery}
        index={active}
        onClose={() => setActive(null)}
        onNavigate={setActive}
      />
    </section>
  )
}
