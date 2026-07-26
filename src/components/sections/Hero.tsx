import { useRef } from 'react'
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from 'framer-motion'
import { ArrowDown } from 'lucide-react'
import { hero, org } from '@/data/site'
import { Photo } from '@/components/ui/Photo'
import { Button } from '@/components/ui/Button'

type Props = { onDonate: () => void }

const rise = {
  hidden: { opacity: 0, y: 28 },
  shown: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, delay: 0.1 + i * 0.09, ease: [0.16, 1, 0.3, 1] as const },
  }),
}

export function Hero({ onDonate }: Props) {
  const sectionRef = useRef<HTMLElement>(null)
  const reduced = useReducedMotion()

  // Cursor parallax, damped so the stack drifts rather than snaps.
  const pointerX = useMotionValue(0)
  const pointerY = useMotionValue(0)
  const px = useSpring(pointerX, { stiffness: 90, damping: 20, mass: 0.6 })
  const py = useSpring(pointerY, { stiffness: 90, damping: 20, mass: 0.6 })

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  })
  const stackY = useTransform(scrollYProgress, [0, 1], [0, reduced ? 0 : -70])
  const copyY = useTransform(scrollYProgress, [0, 1], [0, reduced ? 0 : 40])
  const fade = useTransform(scrollYProgress, [0, 0.75], [1, 0])

  function handlePointer(event: React.MouseEvent) {
    if (reduced) return
    const { innerWidth, innerHeight } = window
    pointerX.set((event.clientX / innerWidth - 0.5) * 2)
    pointerY.set((event.clientY / innerHeight - 0.5) * 2)
  }

  const layers = [
    { name: hero.stack[0], depth: 26, className: 'left-0 top-[6%] w-[57%] rotate-[-4deg]' },
    { name: hero.stack[1], depth: -18, className: 'right-0 top-0 w-[46%] rotate-[3deg]' },
    {
      name: hero.stack[2],
      depth: 40,
      className: 'bottom-0 left-[22%] w-[50%] rotate-[2deg]',
    },
  ]

  return (
    <section
      id="top"
      ref={sectionRef}
      onMouseMove={handlePointer}
      className="relative overflow-hidden pb-20 pt-32 sm:pb-28 sm:pt-40 lg:pb-36 lg:pt-44"
    >
      <div className="aura" />

      <div className="shell relative grid items-center gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10">
        <motion.div style={{ y: copyY }} initial="hidden" animate="shown">
          <motion.p variants={rise} custom={0} className="eyebrow">
            {hero.eyebrow}
          </motion.p>

          <h1 className="mt-6 text-[length:var(--text-hero)] font-semibold leading-[0.92]">
            <motion.span variants={rise} custom={1} className="block">
              {hero.headline[0]}
            </motion.span>
            <motion.span
              variants={rise}
              custom={2}
              className="block italic text-coral-deep"
            >
              {hero.headline[1]}
            </motion.span>
          </h1>

          <motion.p
            variants={rise}
            custom={3}
            className="mt-7 max-w-[34rem] text-[1.02rem] leading-[1.7] text-muted sm:text-[1.1rem]"
          >
            {hero.body}
          </motion.p>

          <motion.div variants={rise} custom={4} className="mt-9 flex flex-wrap gap-3">
            <Button onClick={onDonate}>{hero.primaryCta}</Button>
            <Button variant="outline" href={org.registerUrl} external>
              {hero.secondaryCta}
            </Button>
          </motion.div>
        </motion.div>

        {/* Photo stack. Each layer drifts a different distance, which is what
            reads as depth rather than as a wobble. */}
        <motion.div
          style={{ y: stackY }}
          className="relative mx-auto aspect-[4/3.4] w-full max-w-[34rem] lg:max-w-none"
        >
          {layers.map((layer, i) => (
            <StackLayer key={layer.name} {...layer} index={i} px={px} py={py} />
          ))}
        </motion.div>
      </div>

      <motion.div
        style={{ opacity: fade }}
        className="shell relative mt-16 flex items-center gap-3 text-muted lg:mt-20"
      >
        <motion.span
          animate={reduced ? {} : { y: [0, 6, 0] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ArrowDown size={16} />
        </motion.span>
        <span className="eyebrow">Scroll</span>
        <span className="h-px flex-1 bg-line" />
        <span className="eyebrow">{org.tagline}</span>
      </motion.div>
    </section>
  )
}

type LayerProps = {
  name: string
  /** Pixels this layer travels across the full width of the viewport. */
  depth: number
  className: string
  index: number
  px: MotionValue<number>
  py: MotionValue<number>
}

function StackLayer({ name, depth, className, index, px, py }: LayerProps) {
  const x = useTransform(px, (v) => v * depth)
  const y = useTransform(py, (v) => v * depth * 0.6)

  return (
    <motion.div
      initial={{ opacity: 0, y: 34, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 1, delay: 0.24 + index * 0.12, ease: [0.16, 1, 0.3, 1] }}
      style={{ x, y }}
      className={`absolute ${className}`}
    >
      <Photo
        name={name}
        alt="May Foundation volunteers working with children in the community"
        priority={index === 0}
        sizes="(min-width: 1024px) 26vw, 50vw"
        className="rounded-[1.4rem] shadow-[0_24px_60px_-24px_rgba(13,23,56,0.5)] ring-1 ring-white/60"
      />
    </motion.div>
  )
}
