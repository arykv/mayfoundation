import { motion } from 'framer-motion'
import { ArrowUpRight, QrCode } from 'lucide-react'
import { involve, org } from '@/data/site'
import { Reveal } from '@/components/ui/Reveal'

type Props = { onDonate: () => void }

/**
 * The finale. Everything above is light; this lands dark so the two actions
 * are the last thing anyone sees.
 */
export function Involve({ onDonate }: Props) {
  return (
    <section id="involve" className="relative overflow-hidden bg-dusk text-canvas">
      <div className="aura opacity-60" />
      <div className="grain absolute inset-0" />

      <div className="shell relative py-24 sm:py-28 lg:py-36">
        <Reveal>
          <p className="eyebrow !text-canvas/50">{involve.eyebrow}</p>
          <h2 className="mt-6 max-w-[18ch] text-[length:var(--text-display)] font-semibold leading-[1.05]">
            {involve.title}
          </h2>
          <p className="mt-6 max-w-[46ch] text-[1.02rem] leading-[1.7] text-canvas/65">
            {involve.body}
          </p>
        </Reveal>

        <div className="mt-16 grid gap-4 sm:grid-cols-2">
          <ActionCard
            title={involve.volunteer.title}
            body={involve.volunteer.body}
            cta={involve.volunteer.cta}
            href={org.registerUrl}
            emphasis
            delay={0}
          />
          <ActionCard
            title={involve.donate.title}
            body={involve.donate.body}
            cta={involve.donate.cta}
            onClick={onDonate}
            icon={<QrCode size={18} />}
            delay={0.08}
          />
        </div>
      </div>
    </section>
  )
}

type CardProps = {
  title: string
  body: string
  cta: string
  href?: string
  onClick?: () => void
  emphasis?: boolean
  icon?: React.ReactNode
  delay: number
}

function ActionCard({
  title,
  body,
  cta,
  href,
  onClick,
  emphasis,
  icon,
  delay,
}: CardProps) {
  const content = (
    <>
      <div className="flex items-start justify-between gap-4">
        <h3 className="font-display text-[1.9rem] font-semibold leading-none">{title}</h3>
        <span
          className={`transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 ${
            emphasis ? 'text-dusk/60' : 'text-canvas/50'
          }`}
        >
          {icon ?? <ArrowUpRight size={20} />}
        </span>
      </div>

      <p
        className={`mt-4 max-w-[34ch] text-[0.97rem] leading-[1.65] ${
          emphasis ? 'text-dusk/70' : 'text-canvas/60'
        }`}
      >
        {body}
      </p>

      <span
        className={`mt-10 inline-flex items-center gap-2 text-sm font-medium ${
          emphasis ? 'text-dusk' : 'text-canvas'
        }`}
      >
        {cta}
        <span
          className={`h-px w-8 transition-all duration-300 group-hover:w-12 ${
            emphasis ? 'bg-dusk/40' : 'bg-canvas/40'
          }`}
        />
      </span>
    </>
  )

  const className = `group flex min-h-[19rem] w-full flex-col justify-between rounded-[1.75rem] p-8 text-left transition-colors duration-400 sm:p-10 ${
    emphasis
      ? 'bg-coral text-dusk hover:bg-[#ff8377]'
      : 'border border-canvas/12 bg-canvas/[0.04] hover:bg-canvas/[0.08]'
  }`

  return (
    <Reveal delay={delay}>
      <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.3 }}>
        {href ? (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className={className}
          >
            {content}
          </a>
        ) : (
          <button type="button" onClick={onClick} className={className}>
            {content}
          </button>
        )}
      </motion.div>
    </Reveal>
  )
}
