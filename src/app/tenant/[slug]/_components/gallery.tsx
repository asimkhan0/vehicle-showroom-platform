'use client'

import { useState } from 'react'
import Image from 'next/image'
import { publicImageUrl } from '@/lib/storage'

type Img = { id: string; storage_path: string }

export function Gallery({ images, alt }: { images: Img[]; alt: string }) {
  const [active, setActive] = useState(0)
  const current = images[active]

  if (!current) {
    return (
      <div className="flex aspect-[4/3] items-center justify-center rounded-2xl bg-neutral-100 text-xs uppercase tracking-wider text-neutral-400 dark:bg-neutral-900">
        No photos yet
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-neutral-100 dark:bg-neutral-900">
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
              className={`relative aspect-square overflow-hidden rounded-lg bg-neutral-100 ring-2 transition-all dark:bg-neutral-900 ${
                i === active
                  ? 'ring-[color:var(--tenant-accent)]'
                  : 'ring-transparent hover:ring-neutral-300 dark:hover:ring-neutral-700'
              }`}
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
