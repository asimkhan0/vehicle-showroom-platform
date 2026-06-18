'use client'

import { useState } from 'react'
import Image from 'next/image'
import { publicImageUrl } from '@/lib/storage'
import { cn } from '@/lib/utils'

type Img = { id: string; storage_path: string }

export function Gallery({ images, alt }: { images: Img[]; alt: string }) {
  const [active, setActive] = useState(0)
  const current = images[active]

  if (!current) {
    return (
      <div className="flex aspect-[4/3] items-center justify-center rounded-xl border border-dashed border-border bg-muted text-xs font-medium uppercase tracking-wider text-muted-foreground">
        No photos yet
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <div className="relative aspect-[4/3] overflow-hidden rounded-xl border border-border bg-muted">
        <Image
          key={current.id}
          src={publicImageUrl(current.storage_path)}
          alt={alt}
          fill
          sizes="(min-width: 1024px) 60vw, 100vw"
          priority
          className="object-cover"
        />
      </div>
      {images.length > 1 && (
        <div className="grid grid-cols-5 gap-2">
          {images.map((img, i) => (
            <button
              key={img.id}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`Photo ${i + 1}`}
              aria-current={i === active}
              className={cn(
                'relative aspect-square cursor-pointer overflow-hidden rounded-lg border-2 bg-muted transition-colors duration-200',
                i === active
                  ? 'border-[color:var(--tenant-accent)]'
                  : 'border-transparent hover:border-border',
              )}
            >
              <Image
                src={publicImageUrl(img.storage_path)}
                alt=""
                fill
                sizes="120px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
