import { useEffect, useRef, useState } from 'react'
import { useInView } from 'framer-motion'
import { Instagram } from 'lucide-react'
import { org, team } from '@/data/site'
import { Reveal } from '@/components/ui/Reveal'
import { cn } from '@/lib/cn'

declare global {
  interface Window {
    instgrm?: { Embeds: { process: () => void } }
  }
}

const EMBED_SRC = 'https://www.instagram.com/embed.js'

/** How long to wait for Instagram before showing plain links instead. */
const GIVE_UP_AFTER = 5000

type EmbedState = 'pending' | 'ready' | 'unavailable'

/**
 * Instagram's embed script is heavy and blocks nothing useful above the fold,
 * so it is only fetched once this section is actually approaching the viewport.
 *
 * The script is also blocked outright by plenty of content blockers and privacy
 * browsers. Rather than leaving three permanent "Loading…" boxes, we watch for
 * the iframes Instagram swaps in and fall back to ordinary links if they never
 * arrive.
 */
export function Team() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '0px 0px 20% 0px' })
  const [state, setState] = useState<EmbedState>('pending')

  useEffect(() => {
    if (!inView) return

    if (!document.querySelector(`script[src="${EMBED_SRC}"]`)) {
      const script = document.createElement('script')
      script.src = EMBED_SRC
      script.async = true
      document.body.appendChild(script)
    }

    const startedAt = performance.now()

    // Instagram replaces each blockquote with an iframe once it has rendered,
    // which is the only reliable signal that the embed actually worked.
    const rendered = () =>
      (ref.current?.querySelectorAll('iframe.instagram-media').length ?? 0) > 0

    const id = window.setInterval(() => {
      // Safe to call repeatedly — already-processed blockquotes are skipped.
      window.instgrm?.Embeds.process()

      if (rendered()) {
        setState('ready')
        window.clearInterval(id)
      } else if (performance.now() - startedAt > GIVE_UP_AFTER) {
        setState('unavailable')
        window.clearInterval(id)
      }
    }, 300)

    return () => window.clearInterval(id)
  }, [inView])

  return (
    <section id="team" className="relative bg-paper py-24 sm:py-28 lg:py-36">
      <div className="shell">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="eyebrow">{team.eyebrow}</p>
              <h2 className="mt-5 text-[length:var(--text-title)] font-semibold leading-[1.1]">
                {team.title}
              </h2>
              <p className="mt-4 max-w-[38ch] text-[0.97rem] leading-[1.7] text-muted">
                {team.body}
              </p>
            </div>
            <a
              href={org.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-ink"
            >
              <Instagram size={16} />
              {org.instagramHandle}
              <span className="h-px w-6 bg-line-strong transition-all duration-300 group-hover:w-10 group-hover:bg-ink" />
            </a>
          </div>
        </Reveal>

        <div ref={ref} className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {team.posts.map((permalink, i) => (
            <Reveal key={permalink} delay={i * 0.08}>
              <div className="overflow-hidden rounded-[1.5rem] border border-line bg-canvas">
                {/* Reserve the embed's space up front so nothing below jumps.
                    The link cards are shorter, and every card switches together,
                    so the row stays even either way. */}
                <div
                  className={cn(
                    'relative [&_iframe]:!m-0 [&_iframe]:!w-full [&_iframe]:!min-w-0 [&_iframe]:!rounded-none [&_iframe]:!border-0 [&_iframe]:!shadow-none',
                    state === 'unavailable' ? 'min-h-[340px]' : 'min-h-[520px]',
                  )}
                >
                  {state === 'unavailable' ? (
                    <PostLink permalink={permalink} index={i} />
                  ) : (
                    <>
                      {state === 'pending' && (
                        <div
                          className="absolute inset-0 animate-pulse bg-blush/60"
                          aria-hidden
                        />
                      )}
                      {inView && (
                        <blockquote
                          className="instagram-media"
                          data-instgrm-permalink={permalink}
                          data-instgrm-version="14"
                          style={{ margin: 0, width: '100%', minWidth: 0 }}
                        />
                      )}
                    </>
                  )}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

/**
 * Shown in place of an embed Instagram would not give us. It is a real card
 * rather than an error, so a blocked script costs the visitor a click instead
 * of looking like a broken page.
 */
function PostLink({ permalink, index }: { permalink: string; index: number }) {
  return (
    <a
      href={permalink}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex h-full min-h-[340px] flex-col justify-between gap-10 bg-blush/50 p-8 transition-colors hover:bg-blush"
    >
      <Instagram size={22} className="text-coral-deep" aria-hidden />

      <div>
        <p className="eyebrow">Founder {index + 1}</p>
        <p className="mt-4 font-display text-[1.6rem] font-semibold leading-tight">
          An introduction, on Instagram.
        </p>
        <span className="mt-6 inline-flex items-center gap-2 text-sm text-muted transition-colors group-hover:text-ink">
          Open the post
          <span className="h-px w-6 bg-line-strong transition-all duration-300 group-hover:w-10 group-hover:bg-ink" />
        </span>
      </div>
    </a>
  )
}
