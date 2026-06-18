import { Car } from 'lucide-react'
import { cn } from '@/lib/utils'

export function VehicleImagePlaceholder({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'flex h-full w-full flex-col items-center justify-center gap-2 bg-gradient-to-br from-muted via-muted/80 to-muted/60',
        className,
      )}
      aria-hidden
    >
      <Car className="size-10 text-muted-foreground/40" strokeWidth={1.25} />
    </div>
  )
}
