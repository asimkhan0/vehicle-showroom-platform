import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ShowroomSwitcher } from './showroom-switcher'

type ShowroomOption = {
  id: string
  name: string
  slug: string
}

export function DashboardHeader({
  userEmail,
  showrooms = [],
}: {
  userEmail: string
  showrooms?: ShowroomOption[]
}) {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-card/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3">
        <div className="flex min-w-0 items-center gap-4">
          <Link
            href="/dashboard"
            className="shrink-0 text-lg font-semibold tracking-tight text-brand transition-colors hover:text-brand/80"
          >
            Showroom
          </Link>
          {showrooms.length > 0 && (
            <ShowroomSwitcher showrooms={showrooms} className="hidden sm:inline-flex" />
          )}
        </div>
        <div className="flex items-center gap-3">
          <span className="hidden max-w-[200px] truncate text-sm text-muted-foreground md:inline">
            {userEmail}
          </span>
          <form action="/auth/signout" method="post">
            <Button type="submit" variant="ghost" size="sm" className="cursor-pointer">
              Sign out
            </Button>
          </form>
        </div>
      </div>
    </header>
  )
}
