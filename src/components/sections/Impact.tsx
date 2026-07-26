import { useEffect, useRef } from 'react'
import { useInView, useReducedMotion } from 'framer-motion'
import { impact } from '@/data/site'
import { Counter } from '@/components/ui/Counter'
import { Reveal } from '@/components/ui/Reveal'

export function Impact() {
  return (
    <section id="impact" className="relative py-24 sm:py-28 lg:py-32">
      <div className="shell">
        <Reveal>
          <p className="eyebrow">{impact.eyebrow}</p>
        </Reveal>

        <Reveal delay={0.06}>
          <div className="mt-6 flex flex-wrap items-baseline gap-x-6 gap-y-2">
            <span className="tnum font-display text-[clamp(3.6rem,11vw,9rem)] font-semibold leading-[0.86] text-ink">
              <Counter to={impact.headline} />
            </span>
            <span className="max-w-[16rem] text-[0.98rem] leading-snug text-muted">
              {impact.headlineLabel}
            </span>
          </div>
        </Reveal>

        <PeopleField count={impact.headline} />

        <div className="mt-5 flex items-center gap-3">
          <span className="h-2 w-2 rounded-[1px] bg-coral" />
          <p className="text-sm text-muted">{impact.caption}</p>
        </div>

        <div className="mt-20 grid gap-10 border-t border-line pt-12 sm:grid-cols-3">
          {impact.stats.map((stat, i) => (
            <Reveal key={stat.label} delay={i * 0.08}>
              <p className="tnum font-display text-[2.6rem] font-semibold leading-none">
                <Counter to={stat.value} animate={stat.count} />
              </p>
              <p className="mt-3 text-[0.95rem] text-muted">{stat.label}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

/**
 * One mark per person reached. The field assembles on a diagonal sweep when it
 * enters view, then the loop stops — it is a two-second event, not an ambient
 * animation burning frames for the rest of the session.
 */
function PeopleField({ count }: { count: number }) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const inView = useInView(wrapRef, { once: true, margin: '0px 0px -15% 0px' })
  const reduced = useReducedMotion()

  useEffect(() => {
    const canvas = canvasRef.current
    const wrap = wrapRef.current
    if (!canvas || !wrap) return
    const ctx = canvas.getContext('2d', { alpha: true })
    if (!ctx) return

    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    let xs = new Float32Array(0)
    let ys = new Float32Array(0)
    let thresholds = new Float32Array(0)
    let amps = new Float32Array(0)
    let dotSize = 2
    let width = 0
    let height = 0
    let frame = 0
    let startedAt: number | null = null
    let progress = inView && reduced ? 1 : 0

    function layout() {
      if (!wrap || !canvas || !ctx) return
      width = wrap.clientWidth
      height = wrap.clientHeight
      if (width === 0 || height === 0) return

      canvas.width = Math.round(width * dpr)
      canvas.height = Math.round(height * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

      const cols = Math.max(1, Math.round(Math.sqrt((count * width) / height)))
      const rows = Math.ceil(count / cols)
      const cellW = width / cols
      const cellH = height / rows
      dotSize = Math.max(1.25, Math.min(cellW, cellH) * 0.52)

      xs = new Float32Array(count)
      ys = new Float32Array(count)
      thresholds = new Float32Array(count)
      amps = new Float32Array(count)

      for (let i = 0; i < count; i++) {
        const col = i % cols
        const row = (i / cols) | 0
        xs[i] = col * cellW + (cellW - dotSize) / 2
        ys[i] = row * cellH + (cellH - dotSize) / 2
        // Diagonal sweep, softened by jitter so no rank arrives in lockstep.
        thresholds[i] =
          (col / cols) * 0.52 + (row / Math.max(rows, 1)) * 0.28 + Math.random() * 0.2
        amps[i] = 0.62 + Math.random() * 0.38
      }

      // Resizing the backing store wipes all context state, so the colour has
      // to be reapplied here rather than once at setup.
      ctx.fillStyle = '#FA7268'
    }

    function draw(p: number) {
      if (!ctx) return
      ctx.clearRect(0, 0, width, height)
      for (let i = 0; i < count; i++) {
        const reveal = (p - thresholds[i]) / 0.18
        if (reveal <= 0) continue
        ctx.globalAlpha = amps[i] * (reveal > 1 ? 1 : reveal)
        ctx.fillRect(xs[i], ys[i], dotSize, dotSize)
      }
      ctx.globalAlpha = 1
    }

    layout()

    if (!inView) {
      draw(0)
    } else if (reduced) {
      draw(1)
    } else {
      const tick = (now: number) => {
        startedAt ??= now
        const t = Math.min((now - startedAt) / 2400, 1)
        progress = 1 - Math.pow(1 - t, 3)
        draw(progress)
        if (t < 1) frame = requestAnimationFrame(tick)
      }
      frame = requestAnimationFrame(tick)
    }

    const observer = new ResizeObserver(() => {
      layout()
      draw(progress)
    })
    observer.observe(wrap)

    return () => {
      cancelAnimationFrame(frame)
      observer.disconnect()
    }
  }, [count, inView, reduced])

  return (
    <div
      ref={wrapRef}
      className="mt-12 h-[168px] w-full sm:h-[220px] lg:h-[280px]"
      role="img"
      aria-label={`A field of ${count.toLocaleString('en-IN')} marks, one for each person reached.`}
    >
      <canvas ref={canvasRef} className="h-full w-full" />
    </div>
  )
}
