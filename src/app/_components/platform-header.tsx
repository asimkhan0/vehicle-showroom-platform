import Link from 'next/link'
import { buttonVariants } from '@/components/ui/button'
import { getUser } from '@/lib/auth'
import { cn } from '@/lib/utils'

export async function PlatformHeader() {
  const { user } = await getUser()

  return (
    <header className="sticky top-0 z-50 px-4 pt-4">
      <div
        className={cn(
          'mx-auto flex max-w-6xl items-center justify-between rounded-xl border border-border',
          'bg-card/90 px-4 py-3 shadow-sm backdrop-blur-md',
        )}
      >
        <Link
          href="/"
          className="text-lg font-semibold tracking-tight text-brand transition-colors hover:text-brand/80"
        >
          Showroom
        </Link>
        <nav className="flex items-center gap-2">
          {user ? (
            <Link href="/dashboard" className={buttonVariants({ size: 'sm' })}>
              Dashboard
            </Link>
          ) : (
            <>
              <Link
                href="/login"
                className={buttonVariants({ size: 'sm', variant: 'ghost' })}
              >
                Sign in
              </Link>
              <Link href="/signup" className={buttonVariants({ size: 'sm' })}>
                Get started
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}
