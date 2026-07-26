import { motion, useReducedMotion, type HTMLMotionProps } from 'framer-motion'
import type { ReactNode } from 'react'

type Props = HTMLMotionProps<'div'> & {
  children: ReactNode
  delay?: number
  /** Distance travelled on the way in, in pixels. */
  distance?: number
}

/**
 * The site's one reveal primitive. Everything that appears on scroll uses it,
 * so the timing stays identical from section to section.
 */
export function Reveal({ children, delay = 0, distance = 22, ...rest }: Props) {
  const reduced = useReducedMotion()

  return (
    <motion.div
      initial={reduced ? false : { opacity: 0, y: distance }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -12% 0px' }}
      transition={{ duration: 0.75, delay, ease: [0.16, 1, 0.3, 1] }}
      {...rest}
    >
      {children}
    </motion.div>
  )
}

/** Wraps a group whose children should arrive one after another. */
export function RevealGroup({
  children,
  stagger = 0.08,
  ...rest
}: HTMLMotionProps<'div'> & { children: ReactNode; stagger?: number }) {
  const reduced = useReducedMotion()

  return (
    <motion.div
      initial={reduced ? undefined : 'hidden'}
      whileInView="shown"
      viewport={{ once: true, margin: '0px 0px -10% 0px' }}
      variants={{ hidden: {}, shown: { transition: { staggerChildren: stagger } } }}
      {...rest}
    >
      {children}
    </motion.div>
  )
}

export const revealChild = {
  hidden: { opacity: 0, y: 24 },
  shown: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as const },
  },
}
