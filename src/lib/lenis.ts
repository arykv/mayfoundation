import type Lenis from 'lenis'

/**
 * Lenis owns the scroll position, so anything that needs to freeze the page
 * (dialogs, the lightbox) has to tell it directly — setting `overflow: hidden`
 * on the body is not enough.
 */
let instance: Lenis | null = null

export function setLenis(next: Lenis | null) {
  instance = next
}

export function lockScroll(locked: boolean) {
  if (!instance) return
  locked ? instance.stop() : instance.start()
}
