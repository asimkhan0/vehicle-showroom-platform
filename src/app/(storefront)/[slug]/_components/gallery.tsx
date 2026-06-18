'use client'

import { useCallback, useEffect, useState } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from '@/components/ui/dialog'
import { VehicleImagePlaceholder } from '@/components/vehicle-image-placeholder'
import { publicImageUrl } from '@/lib/storage'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

type Img = { id: string; storage_path: string }

export function Gallery({ images, alt }: { images: Img[]; alt: string }) {
  const [active, setActive] = useState(0)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const current = images[active]

  const goPrev = useCallback(() => {
    setActive((i) => (i === 0 ? images.length - 1 : i - 1))
  }, [images.length])

  const goNext = useCallback(() => {
    setActive((i) => (i === images.length - 1 ? 0 : i + 1))
  }, [images.length])

  useEffect(() => {
    if (!lightboxOpen) return
    function onKey(e: KeyboardEvent) {
      if (e.key === 'ArrowLeft') goPrev()
      if (e.key === 'ArrowRight') goNext()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [lightboxOpen, goPrev, goNext])

  if (!current) {
    return (
      <div className="relative aspect-video overflow-hidden rounded-xl border border-border">
        <VehicleImagePlaceholder />
      </div>
    )
  }

  return (
    <div id="gallery" className="scroll-mt-24 space-y-3">
      <button
        type="button"
        onClick={() => setLightboxOpen(true)}
        className="relative aspect-video w-full cursor-pointer overflow-hidden rounded-xl border border-border bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        aria-label="Open photo gallery"
      >
        <Image
          key={current.id}
          src={publicImageUrl(current.storage_path)}
          alt={alt}
          fill
          sizes="(min-width: 1024px) 60vw, 100vw"
          priority
          className="object-cover transition-[filter] duration-200 hover:brightness-105"
        />
      </button>

      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {images.map((img, i) => (
            <button
              key={img.id}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`Photo ${i + 1}`}
              aria-current={i === active}
              className={cn(
                'relative size-16 shrink-0 cursor-pointer overflow-hidden rounded-lg border-2 bg-muted transition-colors duration-200 sm:size-20',
                i === active
                  ? 'border-[color:var(--tenant-accent)]'
                  : 'border-transparent hover:border-border',
              )}
            >
              <Image
                src={publicImageUrl(img.storage_path)}
                alt=""
                fill
                sizes="80px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}

      <Dialog open={lightboxOpen} onOpenChange={setLightboxOpen}>
        <DialogContent className="max-w-5xl border-0 bg-black/95 p-0 sm:max-w-5xl">
          <DialogTitle className="sr-only">{alt} — photo gallery</DialogTitle>
          <div className="relative aspect-video w-full">
            <Image
              src={publicImageUrl(current.storage_path)}
              alt={alt}
              fill
              sizes="100vw"
              className="object-contain"
              priority
            />
            {images.length > 1 && (
              <>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={goPrev}
                  className="absolute top-1/2 left-2 -translate-y-1/2 cursor-pointer bg-black/50 text-white hover:bg-black/70"
                  aria-label="Previous photo"
                >
                  <ChevronLeft className="size-6" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={goNext}
                  className="absolute top-1/2 right-2 -translate-y-1/2 cursor-pointer bg-black/50 text-white hover:bg-black/70"
                  aria-label="Next photo"
                >
                  <ChevronRight className="size-6" />
                </Button>
                <p className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-black/60 px-3 py-1 text-xs font-medium text-white">
                  {active + 1} / {images.length}
                </p>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
