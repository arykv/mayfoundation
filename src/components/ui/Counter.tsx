import { useEffect, useRef, useState } from 'react'
import { useInView, useReducedMotion } from 'framer-motion'

type Props = {
  to: number
  duration?: number
  className?: string
  /** When false the value is printed as-is (years, for instance). */
  animate?: boolean
}

const format = new Intl.NumberFormat('en-IN')

export function Counter({ to, duration = 1900, className, animate = true }: Props) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '0px 0px -20% 0px' })
  const reduced = useReducedMotion()
  const [value, setValue] = useState(animate && !reduced ? 0 : to)

  useEffect(() => {
    if (!inView || !animate || reduced) return

    let frame = 0
    let start: number | null = null

    const tick = (now: number) => {
      start ??= now
      const t = Math.min((now - start) / duration, 1)
      // Ease-out-expo: fast commitment, gentle landing.
      const eased = t === 1 ? 1 : 1 - Math.pow(2, -10 * t)
      setValue(Math.round(to * eased))
      if (t < 1) frame = requestAnimationFrame(tick)
    }

    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [inView, to, duration, animate, reduced])

  return (
    <span ref={ref} className={className}>
      {animate ? format.format(value) : to}
    </span>
  )
}
