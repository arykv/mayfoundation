import { useEffect, type ReactNode } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'
import { lockScroll } from '@/lib/lenis'
import { involve, org } from '@/data/site'

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  children?: ReactNode
}

export function DonateDialog({ open, onOpenChange, children }: Props) {
  useEffect(() => {
    lockScroll(open)
    return () => lockScroll(false)
  }, [open])

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      {children && <Dialog.Trigger asChild>{children}</Dialog.Trigger>}
      <AnimatePresence>
        {open && (
          <Dialog.Portal forceMount>
            <Dialog.Overlay asChild>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="fixed inset-0 z-[90] bg-dusk/70 backdrop-blur-sm"
              />
            </Dialog.Overlay>
            <Dialog.Content asChild>
              <motion.div
                initial={{ opacity: 0, scale: 0.96, y: 12 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.97, y: 8 }}
                transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
                className="fixed left-1/2 top-1/2 z-[95] w-[min(92vw,26rem)] -translate-x-1/2 -translate-y-1/2 rounded-[1.75rem] bg-paper p-8 text-center shadow-[0_30px_80px_-20px_rgba(13,23,56,0.45)]"
              >
                <Dialog.Close className="absolute right-5 top-5 rounded-full p-1.5 text-muted transition-colors hover:bg-blush hover:text-ink">
                  <X size={18} />
                  <span className="sr-only">Close</span>
                </Dialog.Close>

                <Dialog.Title className="font-display text-2xl font-semibold">
                  {involve.donate.title}
                </Dialog.Title>
                <Dialog.Description className="mx-auto mt-2 max-w-[22rem] text-sm leading-relaxed text-muted">
                  {involve.donate.body}
                </Dialog.Description>

                <img
                  src="/donate-qr.jpeg"
                  alt="UPI QR code for donating to May Foundation"
                  width={512}
                  height={512}
                  className="mx-auto mt-6 w-56 rounded-2xl border border-line"
                />

                <p className="mt-6 text-xs text-muted">
                  Trouble scanning? Write to{' '}
                  <a
                    href={`mailto:${org.email}`}
                    className="text-royal underline underline-offset-4"
                  >
                    {org.email}
                  </a>
                </p>
              </motion.div>
            </Dialog.Content>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  )
}
