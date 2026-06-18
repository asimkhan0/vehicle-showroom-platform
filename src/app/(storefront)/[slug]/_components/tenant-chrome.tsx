import Image from 'next/image'
import Link from 'next/link'
import type { Showroom } from '../_lib/queries'

export function TenantHeader({
  showroom,
  inventoryHome,
}: {
  showroom: Showroom
  inventoryHome: string
}) {
  return (
    <header className="sticky top-0 z-10 border-b border-border bg-card/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link
          href={inventoryHome}
          className="flex cursor-pointer items-center gap-3 transition-opacity hover:opacity-80"
        >
          {showroom.logo_url && (
            <Image
              src={showroom.logo_url}
              alt=""
              width={36}
              height={36}
              className="rounded-lg object-cover ring-1 ring-border"
            />
          )}
          <span className="text-sm font-semibold tracking-tight">{showroom.name}</span>
        </Link>
        <nav className="text-sm">
          <Link
            href={inventoryHome}
            className="cursor-pointer font-medium text-muted-foreground transition-colors duration-200 hover:text-[color:var(--tenant-accent)]"
          >
            Inventory
          </Link>
        </nav>
      </div>
      <div className="h-0.5 w-full bg-[color:var(--tenant-accent)]" aria-hidden />
    </header>
  )
}

export function TenantFooter({ showroom }: { showroom: Showroom }) {
  return (
    <footer className="mt-24 border-t border-border py-10 text-sm text-muted-foreground">
      <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-3 px-6 sm:flex-row sm:items-center">
        <span>© {new Date().getFullYear()} {showroom.name}</span>
        <span className="text-xs">
          Powered by{' '}
          <Link
            href="/"
            className="cursor-pointer font-medium text-foreground transition-colors hover:text-[color:var(--tenant-accent)]"
          >
            Showroom
          </Link>
        </span>
      </div>
    </footer>
  )
}
