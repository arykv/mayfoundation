import { useEffect, useRef, useState } from 'react'
import { useInView } from 'framer-motion'
import { Instagram } from 'lucide-react'
import { org, team } from '@/data/site'
import { Reveal } from '@/components/ui/Reveal'

declare global {
  interface Window {
    instgrm?: { Embeds: { process: () => void } }
  }
}

const EMBED_SRC = 'https://www.instagram.com/embed.js'

/**
 * Instagram's embed script is heavy and blocks nothing useful above the fold,
 * so it is only fetched once this section is actually approaching the viewport.
 */
export function Team() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '0px 0px 20% 0px' })
  const [ready, setReady] = useState(false)

  useEffect(() => {
    if (!inView) return

    if (window.instgrm) {
      window.instgrm.Embeds.process()
      setReady(true)
      return
    }

    const existing = document.querySelector<HTMLScriptElement>(
      `script[src="${EMBED_SRC}"]`,
    )
    const script = existing ?? document.createElement('script')
    const onLoad = () => {
      window.instgrm?.Embeds.process()
      setReady(true)
    }
    script.addEventListener('load', onLoad)

    if (!existing) {
      script.src = EMBED_SRC
      script.async = true
      document.body.appendChild(script)
    }

    return () => script.removeEventListener('load', onLoad)
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
                {/* Reserve the embed's space up front so nothing below jumps. */}
                <div className="relative min-h-[520px] [&_iframe]:!m-0 [&_iframe]:!w-full [&_iframe]:!min-w-0 [&_iframe]:!rounded-none [&_iframe]:!border-0 [&_iframe]:!shadow-none">
                  {!ready && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-sm text-muted">Loading from Instagram…</span>
                    </div>
                  )}
                  {inView && (
                    <blockquote
                      className="instagram-media"
                      data-instgrm-permalink={permalink}
                      data-instgrm-version="14"
                      style={{ margin: 0, width: '100%', minWidth: 0 }}
                    />
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
