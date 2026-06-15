import Image from 'next/image'
import Link from 'next/link'
import type { Showroom } from '../_lib/queries'

export function TenantHeader({ showroom }: { showroom: Showroom }) {
  return (
    <header className="sticky top-0 z-10 border-b border-neutral-200/80 bg-white/80 backdrop-blur dark:border-neutral-800/80 dark:bg-neutral-950/80">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-3">
          {showroom.logo_url && (
            <Image
              src={showroom.logo_url}
              alt=""
              width={32}
              height={32}
              className="rounded-md object-cover"
            />
          )}
          <span className="text-sm font-semibold tracking-tight">{showroom.name}</span>
        </Link>
        <nav className="text-sm text-neutral-500">
          <Link href="/" className="hover:text-neutral-900 dark:hover:text-neutral-100">
            Inventory
          </Link>
        </nav>
      </div>
    </header>
  )
}

export function TenantFooter({ showroom }: { showroom: Showroom }) {
  return (
    <footer className="mt-24 border-t border-neutral-200 py-10 text-sm text-neutral-500 dark:border-neutral-800">
      <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-3 px-6 sm:flex-row sm:items-center">
        <span>© {new Date().getFullYear()} {showroom.name}</span>
        <span className="text-xs">
          Powered by{' '}
          <a
            href="https://example.com"
            className="font-medium text-neutral-700 hover:underline dark:text-neutral-300"
          >
            Showroom
          </a>
        </span>
      </div>
    </footer>
  )
}
