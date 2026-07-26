import { lazy, Suspense, useState } from 'react'
import { Nav } from '@/components/layout/Nav'
import { Footer } from '@/components/layout/Footer'
import { ScrollProgress } from '@/components/layout/ScrollProgress'
import { SmoothScroll } from '@/components/layout/SmoothScroll'
import { Hero } from '@/components/sections/Hero'
import { Mission } from '@/components/sections/Mission'
import { Impact } from '@/components/sections/Impact'
import { DonateDialog } from '@/components/ui/DonateDialog'

// Below the fold, and none of it is needed to render or measure the first
// screen — so it ships as separate chunks.
const Programs = lazy(() =>
  import('@/components/sections/Programs').then((m) => ({ default: m.Programs })),
)
const Gallery = lazy(() =>
  import('@/components/sections/Gallery').then((m) => ({ default: m.Gallery })),
)
const Team = lazy(() =>
  import('@/components/sections/Team').then((m) => ({ default: m.Team })),
)
const Involve = lazy(() =>
  import('@/components/sections/Involve').then((m) => ({ default: m.Involve })),
)

/** Holds the vertical space a lazy section will occupy, so nothing shifts. */
function Placeholder({ className = 'h-[70vh]' }: { className?: string }) {
  return <div className={className} aria-hidden />
}

export default function App() {
  const [donateOpen, setDonateOpen] = useState(false)
  const openDonate = () => setDonateOpen(true)

  return (
    <>
      <SmoothScroll />
      <ScrollProgress />
      <Nav onDonate={openDonate} />

      <main>
        <Hero onDonate={openDonate} />
        <Mission />
        <Impact />

        <Suspense fallback={<Placeholder />}>
          <Programs />
        </Suspense>
        <Suspense fallback={<Placeholder />}>
          <Gallery />
        </Suspense>
        <Suspense fallback={<Placeholder className="h-[80vh]" />}>
          <Team />
        </Suspense>
        <Suspense fallback={<Placeholder className="h-[60vh]" />}>
          <Involve onDonate={openDonate} />
        </Suspense>
      </main>

      <Footer />

      <DonateDialog open={donateOpen} onOpenChange={setDonateOpen} />
    </>
  )
}
