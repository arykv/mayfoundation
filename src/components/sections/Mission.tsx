import { useRef } from 'react'
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import type { MotionValue } from 'framer-motion'
import { mission } from '@/data/site'
import { Reveal, RevealGroup, revealChild } from '@/components/ui/Reveal'

/**
 * The statement resolves word by word as the section crosses the viewport —
 * it makes a reader slow down to exactly the speed of the sentence.
 */
export function Mission() {
  const ref = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 0.85', 'end 0.55'],
  })

  const words = mission.statement.split(' ')

  return (
    <section id="mission" className="relative py-24 sm:py-32 lg:py-40">
      <div className="shell">
        <Reveal>
          <p className="eyebrow">{mission.eyebrow}</p>
        </Reveal>

        <div ref={ref} className="mt-8 max-w-[52rem]">
          <p className="flex flex-wrap gap-x-[0.28em] gap-y-1 font-display text-[length:var(--text-display)] font-semibold leading-[1.16]">
            {words.map((word, i) => (
              <Word
                key={`${word}-${i}`}
                word={word}
                index={i}
                total={words.length}
                progress={scrollYProgress}
                reduced={!!reduced}
              />
            ))}
          </p>
        </div>

        <RevealGroup className="mt-20 grid gap-x-10 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {mission.supporting.map((item) => (
            <motion.div key={item.title} variants={revealChild}>
              <div className="h-px w-full bg-line-strong" />
              <h3 className="mt-5 text-[1.15rem] font-semibold tracking-tight">
                {item.title}
              </h3>
              <p className="mt-3 text-[0.97rem] leading-[1.7] text-muted">{item.body}</p>
            </motion.div>
          ))}
        </RevealGroup>
      </div>
    </section>
  )
}

type WordProps = {
  word: string
  index: number
  total: number
  progress: MotionValue<number>
  reduced: boolean
}

function Word({ word, index, total, progress, reduced }: WordProps) {
  // Each word claims a slice of the scroll, overlapping its neighbours so the
  // sentence flows instead of ticking over one word at a time.
  const start = index / total
  const end = Math.min(start + 1.8 / total, 1)
  // The floor stays legible on its own — a visitor who never scrolls further
  // should still be able to read the sentence.
  const opacity = useTransform(progress, [start, end], [0.32, 1])

  if (reduced) return <span>{word}</span>

  return <motion.span style={{ opacity }}>{word}</motion.span>
}
