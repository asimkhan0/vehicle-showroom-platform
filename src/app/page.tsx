import Link from 'next/link'
import { buttonVariants } from '@/components/ui/button'
import { getUser } from '@/lib/auth'

export default async function Home() {
  const { user } = await getUser()

  return (
    <div className="flex min-h-dvh flex-col bg-neutral-50 dark:bg-neutral-950">
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

      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col items-center justify-center px-4 py-16 text-center">
        <h1 className="text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
          A showroom of your own, without building a website.
        </h1>
        <p className="mt-4 max-w-xl text-pretty text-neutral-600 dark:text-neutral-400">
          Sign up, publish your inventory, and point your own domain at us. We handle hosting,
          SSL, and the storefront.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link href="/signup" className={buttonVariants({ size: 'lg' })}>
            Create your showroom
          </Link>
          <Link
            href="/login"
            className={buttonVariants({ size: 'lg', variant: 'outline' })}
          >
            Sign in
          </Link>
        </div>
      </main>
    </div>
  )
}
