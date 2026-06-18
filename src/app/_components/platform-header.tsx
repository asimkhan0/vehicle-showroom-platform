import Link from 'next/link'
import { buttonVariants } from '@/components/ui/button'
import { getUser } from '@/lib/auth'

export async function PlatformHeader() {
  const { user } = await getUser()

  return (
    <header className="border-b bg-white dark:bg-neutral-900">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="font-semibold">
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
