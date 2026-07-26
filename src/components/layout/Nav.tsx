import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useScroll, useMotionValueEvent } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { cn } from '@/lib/cn'
import { nav, org } from '@/data/site'
import { Button } from '@/components/ui/Button'

type Props = { onDonate: () => void }

export function Nav({ onDonate }: Props) {
  const [condensed, setCondensed] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const { scrollY } = useScroll()

  useMotionValueEvent(scrollY, 'change', (y) => setCondensed(y > 40))

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
          <motion.div
            animate={{
              backgroundColor: condensed
                ? 'rgba(255,251,250,0.82)'
                : 'rgba(255,251,250,0)',
              borderColor: condensed
                ? 'rgba(22,37,92,0.10)'
                : 'rgba(22,37,92,0)',
              paddingTop: condensed ? 8 : 12,
              paddingBottom: condensed ? 8 : 12,
            }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="flex items-center justify-between rounded-full border px-4 backdrop-blur-xl sm:px-5"
          >
            <a
              href="#top"
              className="flex items-center gap-2.5"
              aria-label={`${org.name} — home`}
            >
              <MarkIcon />
              <span className="font-display text-[1.05rem] font-semibold tracking-tight">
                May Foundation
              </span>
            </a>

            <nav className="hidden items-center gap-8 lg:flex" aria-label="Sections">
              {nav.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="group relative text-sm text-muted transition-colors hover:text-ink"
                >
                  {item.label}
                  <span className="absolute -bottom-1.5 left-0 h-px w-full origin-left scale-x-0 bg-coral-deep transition-transform duration-300 group-hover:scale-x-100" />
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
                className="rounded-full p-2.5 text-ink transition-colors hover:bg-blush lg:hidden"
                aria-expanded={menuOpen}
                aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              >
                {menuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </motion.div>
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
function MarkIcon({ className }: { className?: string }) {
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
        className="text-royal"
      />
      <path
        d="M32.5 5.5C37.8 11 37.2 20.4 30.2 26.5"
        stroke="currentColor"
        strokeWidth="3.1"
        strokeLinecap="round"
        className="text-royal"
      />
      <path
        d="M20 25.6c-5.2-3.9-8.4-7-8.4-10.7 0-2.6 2-4.6 4.5-4.6 1.5 0 2.9.7 3.9 1.9 1-1.2 2.4-1.9 3.9-1.9 2.5 0 4.5 2 4.5 4.6 0 3.7-3.2 6.8-8.4 10.7Z"
        fill="currentColor"
        className="text-coral"
      />
    </svg>
  )
}
