import Link from 'next/link'
import { requireUser } from '@/lib/auth'
import { Button } from '@/components/ui/button'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user } = await requireUser()

  return (
    <div className="min-h-dvh bg-neutral-50 dark:bg-neutral-950">
      <header className="border-b bg-white dark:bg-neutral-900">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <Link href="/dashboard" className="font-semibold">
            Showroom
          </Link>
          <div className="flex items-center gap-3">
            <span className="hidden text-sm text-neutral-500 sm:inline">{user.email}</span>
            <form action="/auth/signout" method="post">
              <Button type="submit" variant="ghost" size="sm">
                Sign out
              </Button>
            </form>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
    </div>
  )
}
