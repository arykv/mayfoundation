import { useState } from 'react'
import { cn } from '@/lib/cn'
import { fallbackSrc, getMedia, srcSet } from '@/lib/media'

type Props = {
  name: string
  alt: string
  /** Matches the CSS width of the image at each breakpoint. */
  sizes?: string
  className?: string
  imgClassName?: string
  priority?: boolean
}

/**
 * AVIF → WebP → JPEG, always with intrinsic dimensions so nothing shifts, and
 * a blurred inline placeholder so the photo resolves out of its own colours.
 */
export function Photo({
  name,
  alt,
  sizes = '(min-width: 1024px) 45vw, 90vw',
  className,
  imgClassName,
  priority = false,
}: Props) {
  const { aspect, blur } = getMedia(name)
  const [loaded, setLoaded] = useState(false)

  return (
    <div
      className={cn('relative overflow-hidden bg-blush', className)}
      style={{ aspectRatio: aspect }}
    >
      <img
        aria-hidden
        src={blur}
        alt=""
        className={cn(
          'absolute inset-0 h-full w-full scale-110 object-cover blur-xl transition-opacity duration-700',
          loaded ? 'opacity-0' : 'opacity-100',
        )}
      />
      <picture>
        <source type="image/avif" srcSet={srcSet(name, 'avif')} sizes={sizes} />
        <source type="image/webp" srcSet={srcSet(name, 'webp')} sizes={sizes} />
        <img
          src={fallbackSrc(name)}
          srcSet={srcSet(name, 'jpg')}
          sizes={sizes}
          alt={alt}
          loading={priority ? 'eager' : 'lazy'}
          fetchPriority={priority ? 'high' : 'auto'}
          decoding="async"
          onLoad={() => setLoaded(true)}
          className={cn(
            'absolute inset-0 h-full w-full object-cover transition-opacity duration-700',
            loaded ? 'opacity-100' : 'opacity-0',
            imgClassName,
          )}
        />
      </picture>
    </div>
  )
}
