import { useCallback, useEffect, useState } from 'react'
import { AnimatePresence, motion, useScroll, useMotionValueEvent } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { cn } from '@/lib/cn'
import { nav, org } from '@/data/site'
import { Button } from '@/components/ui/Button'

type Props = { onDonate: () => void }

/** Vertical band the nav pill occupies, used to test what is behind it. */
const NAV_BAND = 88

export function Nav({ onDonate }: Props) {
  const [condensed, setCondensed] = useState(false)
  const [onDark, setOnDark] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const { scrollY } = useScroll()

  /**
   * Sections that paint themselves dark opt in with data-nav-theme, and the bar
   * inverts while one of them passes under it. Straight geometry rather than an
   * IntersectionObserver: the dark sections are lazy-loaded, so an observer has
   * to be torn down and rebuilt as they mount, and it reliably missed the first
   * delivery when it did.
   */
  const syncTheme = useCallback(() => {
    let dark = false
    for (const el of document.querySelectorAll('[data-nav-theme="dark"]')) {
      const rect = el.getBoundingClientRect()
      if (rect.top <= NAV_BAND && rect.bottom >= NAV_BAND) {
        dark = true
        break
      }
    }
    setOnDark(dark)
  }, [])

  useMotionValueEvent(scrollY, 'change', (y) => {
    setCondensed(y > 40)
    syncTheme()
  })

  // Re-check when a lazy section mounts, since that changes what is underneath
  // the bar without the page having scrolled.
  useEffect(() => {
    syncTheme()

    const mutations = new MutationObserver(syncTheme)
    mutations.observe(document.body, { childList: true, subtree: true })
    window.addEventListener('resize', syncTheme)

    return () => {
      mutations.disconnect()
      window.removeEventListener('resize', syncTheme)
    }
  }, [syncTheme])

  useEffect(() => {
    if (!menuOpen) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setMenuOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [menuOpen])

  return (
    <>
      <a
        href="#mission"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-ink focus:px-5 focus:py-2.5 focus:text-sm focus:text-canvas"
      >
        Skip to content
      </a>

      <header className="fixed inset-x-0 top-0 z-50 pt-3 sm:pt-5">
        <div className="shell">
          {/* Plain CSS rather than motion props: Framer writes inline styles
              every frame, and any Tailwind colour transition on the same element
              fights it — the bar would keep snapping back to its light state. */}
          <div
            className={cn(
              'flex items-center justify-between rounded-full border px-4 backdrop-blur-xl sm:px-5',
              'transition-[background-color,border-color,color,padding] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]',
              condensed ? 'py-2' : 'py-3',
              !condensed && 'border-transparent bg-transparent text-ink',
              condensed && !onDark && 'border-ink/10 bg-paper/85 text-ink',
              condensed && onDark && 'border-canvas/15 bg-dusk/75 text-canvas',
            )}
          >
            <a
              href="#top"
              className="flex items-center gap-2.5"
              aria-label={`${org.name} — home`}
            >
              <MarkIcon onDark={onDark} />
              <span className="font-display text-[1.05rem] font-semibold tracking-tight">
                May Foundation
              </span>
            </a>

            <nav className="hidden items-center gap-8 lg:flex" aria-label="Sections">
              {nav.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'group relative text-sm transition-colors',
                    onDark
                      ? 'text-canvas/70 hover:text-canvas'
                      : 'text-muted hover:text-ink',
                  )}
                >
                  {item.label}
                  <span
                    className={cn(
                      'absolute -bottom-1.5 left-0 h-px w-full origin-left scale-x-0 transition-transform duration-300 group-hover:scale-x-100',
                      onDark ? 'bg-coral' : 'bg-coral-deep',
                    )}
                  />
                </a>
              ))}
            </nav>

            <div className="flex items-center gap-2">
              <Button
                onClick={onDonate}
                className="hidden px-6 py-2.5 text-sm sm:inline-flex"
              >
                Donate
              </Button>
              <button
                onClick={() => setMenuOpen((v) => !v)}
                className={cn(
                  'rounded-full p-2.5 transition-colors lg:hidden',
                  onDark ? 'text-canvas hover:bg-white/10' : 'text-ink hover:bg-blush',
                )}
                aria-expanded={menuOpen}
                aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              >
                {menuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-40 bg-canvas/97 backdrop-blur-xl lg:hidden"
          >
            <div className="shell flex h-full flex-col justify-center gap-1">
              {nav.map((item, i) => (
                <motion.a
                  key={item.href}
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 + i * 0.055, duration: 0.5 }}
                  className="border-b border-line py-5 font-display text-3xl font-semibold"
                >
                  {item.label}
                </motion.a>
              ))}
              <motion.div
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.34, duration: 0.5 }}
                className="mt-8 flex flex-wrap gap-3"
              >
                <Button
                  onClick={() => {
                    setMenuOpen(false)
                    onDonate()
                  }}
                >
                  Donate
                </Button>
                <Button variant="outline" href={org.registerUrl} external>
                  Volunteer
                </Button>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

/** The logo mark, redrawn as vector: two hands, one heart. */
function MarkIcon({ className, onDark }: { className?: string; onDark?: boolean }) {
  // Royal blue disappears against the dark block, so the hands go to canvas there.
  const hands = onDark ? 'text-canvas' : 'text-royal'

  return (
    <svg
      viewBox="0 0 40 32"
      className={cn('h-7 w-9 shrink-0', className)}
      aria-hidden
      fill="none"
    >
      <path
        d="M7.5 5.5C2.2 11 2.8 20.4 9.8 26.5"
        stroke="currentColor"
        strokeWidth="3.1"
        strokeLinecap="round"
        className={cn('transition-colors duration-400', hands)}
      />
      <path
        d="M32.5 5.5C37.8 11 37.2 20.4 30.2 26.5"
        stroke="currentColor"
        strokeWidth="3.1"
        strokeLinecap="round"
        className={cn('transition-colors duration-400', hands)}
      />
      <path
        d="M20 25.6c-5.2-3.9-8.4-7-8.4-10.7 0-2.6 2-4.6 4.5-4.6 1.5 0 2.9.7 3.9 1.9 1-1.2 2.4-1.9 3.9-1.9 2.5 0 4.5 2 4.5 4.6 0 3.7-3.2 6.8-8.4 10.7Z"
        fill="currentColor"
        className="text-coral"
      />
    </svg>
  )
}
