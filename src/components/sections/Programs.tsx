import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import { programs } from '@/data/site'
import { Photo } from '@/components/ui/Photo'
import { Reveal } from '@/components/ui/Reveal'

/**
 * Four parallel programmes — deliberately not numbered, because they do not
 * happen in sequence. Opening one closes the others, so the section is only
 * ever as tall as it needs to be.
 */
export function Programs() {
  const [open, setOpen] = useState(0)

  return (
    <section id="work" className="relative bg-paper py-24 sm:py-28 lg:py-36">
      <div className="shell">
        <Reveal>
          <p className="eyebrow">What we run</p>
          <h2 className="mt-5 max-w-[24ch] text-[length:var(--text-title)] font-semibold leading-[1.1]">
            Four programmes, chosen because families asked for them.
          </h2>
        </Reveal>

        <div className="mt-14 grid gap-10 lg:grid-cols-[1fr_0.85fr] lg:gap-16">
          <div className="border-t border-line">
            {programs.map((program, i) => {
              const active = open === i
              return (
                <Reveal key={program.name} delay={i * 0.05}>
                  <button
                    onClick={() => setOpen(i)}
                    aria-expanded={active}
                    className="group w-full border-b border-line py-7 text-left"
                  >
                    <div className="flex items-start justify-between gap-6">
                      <h3
                        className={`font-display text-[1.4rem] font-semibold leading-tight transition-colors duration-300 sm:text-[1.6rem] ${
                          active ? 'text-coral-deep' : 'text-ink group-hover:text-royal'
                        }`}
                      >
                        {program.name}
                      </h3>
                      <ArrowUpRight
                        size={20}
                        className={`mt-1 shrink-0 transition-all duration-300 ${
                          active
                            ? 'rotate-45 text-coral-deep'
                            : 'text-muted group-hover:translate-x-0.5 group-hover:-translate-y-0.5'
                        }`}
                      />
                    </div>

                    <p className="mt-2.5 max-w-[46ch] text-[0.97rem] leading-[1.65] text-muted">
                      {program.summary}
                    </p>

                    <motion.div
                      initial={false}
                      animate={{ height: active ? 'auto' : 0, opacity: active ? 1 : 0 }}
                      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden"
                    >
                      <p className="max-w-[46ch] pt-4 text-[0.97rem] leading-[1.65] text-ink/75">
                        {program.detail}
                      </p>
                      {/* The photo belongs beside the list on desktop, inline on mobile. */}
                      <div className="pt-5 lg:hidden">
                        <Photo
                          name={program.photo}
                          alt={program.name}
                          sizes="90vw"
                          className="rounded-2xl"
                        />
                      </div>
                    </motion.div>
                  </button>
                </Reveal>
              )
            })}
          </div>

          <div className="relative hidden lg:block">
            <div className="sticky top-28">
              {programs.map((program, i) => (
                <motion.div
                  key={program.photo}
                  initial={false}
                  animate={{
                    opacity: open === i ? 1 : 0,
                    scale: open === i ? 1 : 1.03,
                  }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  className={i === 0 ? 'relative' : 'absolute inset-0'}
                  aria-hidden={open !== i}
                >
                  <Photo
                    name={program.photo}
                    alt={program.name}
                    sizes="(min-width: 1024px) 40vw, 90vw"
                    className="rounded-[1.5rem] shadow-[0_24px_60px_-30px_rgba(13,23,56,0.5)]"
                  />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
