import { useRef, type ReactNode } from 'react'
import { motion, useMotionValue, useReducedMotion, useSpring } from 'framer-motion'
import { cn } from '@/lib/cn'

type Variant = 'solid' | 'outline' | 'ghost' | 'light'

const base =
  'group relative inline-flex items-center justify-center gap-2 rounded-full px-7 py-3.5 text-[0.95rem] font-medium tracking-tight transition-colors duration-300 will-change-transform'

const variants: Record<Variant, string> = {
  solid: 'bg-coral-deep text-white hover:bg-[#b1332b]',
  outline:
    'border border-line-strong text-ink hover:border-ink hover:bg-ink hover:text-canvas',
  ghost: 'text-ink hover:text-coral-deep',
  light: 'bg-canvas text-ink hover:bg-white',
}

type Props = {
  children: ReactNode
  variant?: Variant
  className?: string
  href?: string
  onClick?: () => void
  external?: boolean
}

/**
 * Buttons lean a few pixels toward the cursor. It is a small thing, but it is
 * the difference between a page that responds and a page that just sits there.
 */
export function Button({
  children,
  variant = 'solid',
  className,
  href,
  onClick,
  external,
}: Props) {
  const ref = useRef<HTMLElement>(null)
  const reduced = useReducedMotion()

  const rawX = useMotionValue(0)
  const rawY = useMotionValue(0)
  const x = useSpring(rawX, { stiffness: 260, damping: 18, mass: 0.4 })
  const y = useSpring(rawY, { stiffness: 260, damping: 18, mass: 0.4 })

  function handleMove(event: React.MouseEvent) {
    if (reduced || !ref.current) return
    const rect = ref.current.getBoundingClientRect()
    // Capped so the control never detaches from where it is meant to live.
    rawX.set(((event.clientX - rect.left) / rect.width - 0.5) * 14)
    rawY.set(((event.clientY - rect.top) / rect.height - 0.5) * 10)
  }

  function handleLeave() {
    rawX.set(0)
    rawY.set(0)
  }

  const shared = {
    ref: ref as never,
    className: cn(base, variants[variant], className),
    style: { x, y },
    onMouseMove: handleMove,
    onMouseLeave: handleLeave,
  }

  if (href) {
    return (
      <motion.a
        {...shared}
        href={href}
        {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      >
        {children}
      </motion.a>
    )
  }

  return (
    <motion.button {...shared} type="button" onClick={onClick}>
      {children}
    </motion.button>
  )
}
