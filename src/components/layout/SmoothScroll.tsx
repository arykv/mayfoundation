import { useEffect } from 'react'
import Lenis from 'lenis'
import { setLenis } from '@/lib/lenis'

/**
 * Momentum scrolling. Skipped entirely when the visitor has asked for reduced
 * motion — hijacking the scroll is exactly what that setting is protecting
 * against.
 */
export function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const lenis = new Lenis({
      duration: 1.05,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      touchMultiplier: 1.6,
    })
    setLenis(lenis)

    // Handy when driving the page from devtools; stripped from production.
    if (import.meta.env.DEV) {
      ;(window as unknown as { lenis?: Lenis }).lenis = lenis
    }

    let frame = 0
    const raf = (time: number) => {
      lenis.raf(time)
      frame = requestAnimationFrame(raf)
    }
    frame = requestAnimationFrame(raf)

    // In-page nav links need to go through Lenis, not the native jump.
    const onClick = (event: MouseEvent) => {
      const anchor = (event.target as HTMLElement).closest?.('a[href^="#"]')
      if (!anchor) return
      const id = anchor.getAttribute('href')
      if (!id || id === '#') return
      const target = document.querySelector(id)
      if (!target) return
      event.preventDefault()
      lenis.scrollTo(target as HTMLElement, { offset: -90 })
    }
    document.addEventListener('click', onClick)

    return () => {
      document.removeEventListener('click', onClick)
      cancelAnimationFrame(frame)
      lenis.destroy()
      setLenis(null)
    }
  }, [])

  return null
}
