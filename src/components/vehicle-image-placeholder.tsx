import { Camera } from 'lucide-react'
import { cn } from '@/lib/utils'

/**
 * Missing photography. MASTER §13: never a grey box with a broken-image glyph.
 *
 * Roughly one listing in ten arrives without usable photography, so this is a
 * real state rather than an edge case. It stays branded and calm, and it tells
 * the buyer the photos are coming rather than implying the listing is broken.
 */
export function VehicleImagePlaceholder({
  className,
  label = 'Photos coming soon',
}: {
  className?: string
  label?: string | null
}) {
  return (
    <div
      className={cn(
        'flex h-full w-full flex-col items-center justify-center gap-2',
        'bg-gradient-to-br from-chrome-raised via-chrome to-chrome-raised',
        className,
      )}
    >
      <Camera className="size-7 text-on-chrome/45" strokeWidth={1.25} aria-hidden />
      {label && (
        <span className="text-overline text-on-chrome/60">{label}</span>
      )}
    </div>
  )
}
