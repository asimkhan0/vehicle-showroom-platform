import Image from 'next/image'
import Link from 'next/link'
import type { Showroom } from '../_lib/queries'
import { platformUrl } from '@/lib/platform-url'

export function TenantHeader({
  showroom,
  inventoryHome,
}: {
  showroom: Showroom
  inventoryHome: string
}) {
  return (
    <header className="sticky top-0 z-50 px-4 pt-4">
      <div className="mx-auto flex max-w-6xl items-center justify-between rounded-xl border border-border border-b-2 border-b-[color:var(--tenant-accent)] bg-card/90 px-4 py-3 shadow-sm backdrop-blur-md">
        <Link
          href={inventoryHome}
          className="flex cursor-pointer items-center gap-3 transition-opacity hover:opacity-80"
        >
          {showroom.logo_url ? (
            <Image
              src={showroom.logo_url}
              alt=""
              width={32}
              height={32}
              className="size-8 rounded-lg object-cover ring-1 ring-border"
            />
          ) : (
            <span
              className="flex size-8 items-center justify-center rounded-lg bg-[color:var(--tenant-accent)] text-xs font-bold text-[color:var(--tenant-accent-ink)]"
              aria-hidden
            >
              {showroom.name.charAt(0).toUpperCase()}
            </span>
          )}
          <span className="text-sm font-semibold tracking-tight">{showroom.name}</span>
        </Link>
        <nav className="flex items-center gap-4 text-sm">
          <Link
            href={inventoryHome}
            className="cursor-pointer font-medium text-muted-foreground transition-colors duration-200 hover:text-[color:var(--tenant-accent)]"
          >
            Inventory
          </Link>
          <Link
            href={platformUrl('/')}
            className="hidden cursor-pointer text-xs font-medium text-muted-foreground transition-colors hover:text-foreground sm:inline"
          >
            Marketplace
          </Link>
        </nav>
      </div>
    </header>
  )
}

export function TenantFooter({ showroom }: { showroom: Showroom }) {
  return (
    <footer className="mt-20 border-t border-border bg-muted/30">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-6 py-12 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-2">
          <p className="font-semibold text-foreground">{showroom.name}</p>
          {showroom.bio && (
            <p className="max-w-sm text-sm leading-relaxed text-muted-foreground line-clamp-2">
              {showroom.bio}
            </p>
          )}
        </div>
        <div className="flex flex-col gap-2 text-sm text-muted-foreground">
          <Link
            href={platformUrl('/')}
            className="cursor-pointer font-medium text-foreground transition-colors hover:text-[color:var(--tenant-accent)]"
          >
            Browse all showrooms
          </Link>
          <span className="text-xs">
            Powered by{' '}
            <Link
              href={platformUrl('/')}
              className="cursor-pointer font-medium text-foreground transition-colors hover:text-[color:var(--tenant-accent)]"
            >
              Showroom
            </Link>
          </span>
        </div>
      </div>
      <div className="h-1 w-full bg-[color:var(--tenant-accent)]" aria-hidden />
    </footer>
  )
}
