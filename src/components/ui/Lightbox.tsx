import { useCallback, useEffect } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowLeft, ArrowRight, X } from 'lucide-react'
import { lockScroll } from '@/lib/lenis'
import { fallbackSrc, getMedia, srcSet } from '@/lib/media'

type Props = {
  items: readonly string[]
  index: number | null
  onClose: () => void
  onNavigate: (index: number) => void
}

export function Lightbox({ items, index, onClose, onNavigate }: Props) {
  const open = index !== null

  const step = useCallback(
    (delta: number) => {
      if (index === null) return
      onNavigate((index + delta + items.length) % items.length)
    },
    [index, items.length, onNavigate],
  )

  useEffect(() => {
    lockScroll(open)
    return () => lockScroll(false)
  }, [open])

  useEffect(() => {
    if (!open) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'ArrowRight') step(1)
      if (event.key === 'ArrowLeft') step(-1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, step])

  const name = index !== null ? items[index] : null

  return (
    <Dialog.Root open={open} onOpenChange={(next) => !next && onClose()}>
      <AnimatePresence>
        {open && name && (
          <Dialog.Portal forceMount>
            <Dialog.Overlay asChild>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="fixed inset-0 z-[90] bg-dusk/92 backdrop-blur-md"
              />
            </Dialog.Overlay>

            <Dialog.Content
              aria-label="Photo viewer"
              className="fixed inset-0 z-[95] flex items-center justify-center p-4 sm:p-10"
            >
              <Dialog.Title className="sr-only">
                Field photograph {index + 1} of {items.length}
              </Dialog.Title>

              <motion.img
                key={name}
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                src={fallbackSrc(name)}
                srcSet={srcSet(name, 'jpg')}
                sizes="92vw"
                alt={`May Foundation volunteers in the field, photograph ${index + 1}`}
                style={{ aspectRatio: getMedia(name).aspect }}
                className="max-h-[82vh] w-auto max-w-full rounded-xl object-contain shadow-2xl"
              />

              <div className="absolute inset-x-0 bottom-6 flex items-center justify-center gap-3">
                <button
                  onClick={() => step(-1)}
                  className="rounded-full bg-white/12 p-3 text-white backdrop-blur transition-colors hover:bg-white/25"
                >
                  <ArrowLeft size={18} />
                  <span className="sr-only">Previous photo</span>
                </button>
                <span className="tnum min-w-[4.5rem] text-center text-sm text-white/70">
                  {index + 1} / {items.length}
                </span>
                <button
                  onClick={() => step(1)}
                  className="rounded-full bg-white/12 p-3 text-white backdrop-blur transition-colors hover:bg-white/25"
                >
                  <ArrowRight size={18} />
                  <span className="sr-only">Next photo</span>
                </button>
              </div>

              <Dialog.Close className="absolute right-5 top-5 rounded-full bg-white/12 p-3 text-white backdrop-blur transition-colors hover:bg-white/25">
                <X size={18} />
                <span className="sr-only">Close viewer</span>
              </Dialog.Close>
            </Dialog.Content>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  )
}
