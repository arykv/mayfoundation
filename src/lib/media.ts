import manifest from '@/data/media.json'

export type MediaName = keyof typeof manifest

type Entry = { widths: number[]; aspect: number; blur: string }

const media = manifest as Record<string, Entry>

export function getMedia(name: string): Entry {
  const entry = media[name]
  if (!entry) throw new Error(`Unknown image "${name}" — run \`npm run images\`.`)
  return entry
}

export function srcSet(name: string, format: 'avif' | 'webp' | 'jpg') {
  return getMedia(name)
    .widths.map((w) => `/media/${name}-${w}.${format} ${w}w`)
    .join(', ')
}

/** Largest generated width, used as the <img> fallback source. */
export function fallbackSrc(name: string) {
  const { widths } = getMedia(name)
  return `/media/${name}-${widths[widths.length - 1]}.jpg`
}
