import Image from 'next/image'
import type { Showroom } from '../_lib/queries'
import { publicImageUrl } from '@/lib/storage'
import { cn } from '@/lib/utils'

export function StorefrontHero({
  showroom,
  coverPath,
  vehicleCount,
}: {
  showroom: Pick<Showroom, 'name' | 'bio' | 'logo_url'>
  coverPath?: string | null
  vehicleCount: number
}) {
  const hasCover = Boolean(coverPath)

  return (
    <section className="relative">
      <div className={cn('relative w-full', hasCover ? 'aspect-[21/9] min-h-[280px]' : 'min-h-[320px] sm:min-h-[380px]')}>
        {hasCover ? (
          <>
            <Image
              src={publicImageUrl(coverPath!)}
              alt=""
              fill
              priority
              className="object-cover"
              sizes="100vw"
            />
            <div
              className="absolute inset-0 bg-gradient-to-t from-background via-background/85 to-background/25"
              aria-hidden
            />
          </>
        ) : (
          <>
            <div
              className="absolute inset-0 bg-gradient-to-br from-[color:var(--tenant-accent)] via-[color:var(--tenant-accent)]/70 to-background"
              aria-hidden
            />
            <div
              className="absolute inset-0 opacity-[0.07]"
              style={{
                backgroundImage:
                  'radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)',
                backgroundSize: '24px 24px',
              }}
              aria-hidden
            />
            <div
              className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent"
              aria-hidden
            />
          </>
        )}

        <div className="absolute inset-0 flex items-end">
          <div className="mx-auto w-full max-w-6xl px-6 pb-10 pt-24 sm:pb-14 sm:pt-28">
            <div className="flex flex-col items-start gap-5 sm:gap-6">
              {showroom.logo_url && (
                <Image
                  src={showroom.logo_url}
                  alt=""
                  width={80}
                  height={80}
                  className={cn(
                    'rounded-xl object-cover shadow-lg ring-2',
                    hasCover
                      ? 'ring-background/80'
                      : 'ring-white/30',
                  )}
                />
              )}
              <div className="space-y-3">
                <p
                  className={cn(
                    'text-overline',
                    hasCover ? 'text-[color:var(--tenant-accent)]' : 'text-white/80',
                  )}
                >
                  Vehicle showroom
                </p>
                <h1
                  className={cn(
                    'text-balance text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl',
                    hasCover ? 'text-foreground' : 'text-white',
                  )}
                >
                  {showroom.name}
                </h1>
                {showroom.bio && (
                  <p
                    className={cn(
                      'max-w-2xl text-pretty text-base leading-relaxed sm:text-lg',
                      hasCover ? 'text-muted-foreground' : 'text-white/85',
                    )}
                  >
                    {showroom.bio}
                  </p>
                )}
              </div>
              <p
                className={cn(
                  'rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-wider backdrop-blur-sm',
                  hasCover
                    ? 'border border-border bg-background/90 text-muted-foreground'
                    : 'bg-white/15 text-white ring-1 ring-white/25',
                )}
              >
                {vehicleCount === 0
                  ? 'No vehicles available'
                  : `${vehicleCount} vehicle${vehicleCount === 1 ? '' : 's'} available`}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
