import Link from 'next/link'
import { cn } from '@/lib/utils'

const POPULAR_MAKES = ['Toyota', 'Honda', 'Ford', 'BMW', 'Tesla', 'Mercedes-Benz']

export function PlatformFooter({ className }: { className?: string }) {
  return (
    <footer
      className={cn(
        'mt-auto border-t border-border bg-card',
        className,
      )}
    >
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-3 sm:col-span-2 lg:col-span-1">
          <Link href="/" className="text-lg font-semibold text-brand">
            Showroom
          </Link>
          <p className="max-w-xs text-sm text-muted-foreground">
            The marketplace for independent vehicle dealers. Browse inventory from trusted showrooms
            or publish your own listings.
          </p>
        </div>

        <div>
          <h2 className="text-sm font-semibold text-foreground">Browse</h2>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li>
              <Link href="/" className="transition-colors hover:text-foreground">
                All vehicles
              </Link>
            </li>
            <li>
              <Link
                href="/?make=Toyota"
                className="transition-colors hover:text-foreground"
              >
                Toyota listings
              </Link>
            </li>
            <li>
              <Link href="/?make=BMW" className="transition-colors hover:text-foreground">
                BMW listings
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h2 className="text-sm font-semibold text-foreground">For dealers</h2>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li>
              <Link href="/signup" className="transition-colors hover:text-foreground">
                Create a showroom
              </Link>
            </li>
            <li>
              <Link href="/login" className="transition-colors hover:text-foreground">
                Dealer sign in
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h2 className="text-sm font-semibold text-foreground">Trust</h2>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li>Verified dealer storefronts</li>
            <li>Direct inquiry to sellers</li>
            <li>Published inventory only</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-border">
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-2 px-4 py-6 text-xs text-muted-foreground sm:flex-row sm:items-center">
          <span>© {new Date().getFullYear()} Showroom. All rights reserved.</span>
          <span>Independent dealers · Platform marketplace</span>
        </div>
      </div>
    </footer>
  )
}

export { POPULAR_MAKES }
