'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Car,
  Globe,
  Inbox,
  LayoutDashboard,
  Menu,
  Settings,
} from 'lucide-react'
import { buttonVariants } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { cn } from '@/lib/utils'

const NAV_ITEMS = [
  { href: 'vehicles', label: 'Vehicles', icon: Car },
  { href: 'inquiries', label: 'Inquiries', icon: Inbox },
  { href: 'domains', label: 'Domains', icon: Globe },
  { href: 'settings', label: 'Settings', icon: Settings },
] as const

export function DashboardSidebarNav({
  showroomId,
  showroomName,
}: {
  showroomId: string
  showroomName: string
}) {
  const pathname = usePathname()
  const base = `/dashboard/${showroomId}`

  const links = NAV_ITEMS.map((item) => {
    const href = `${base}/${item.href}`
    const active = pathname === href || pathname.startsWith(`${href}/`)
    return { ...item, href, active }
  })

  const navContent = (
    <nav className="flex flex-col gap-1">
      {links.map(({ href, label, icon: Icon, active }) => (
        <Link
          key={href}
          href={href}
          className={cn(
            'flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-200',
            active
              ? 'bg-sidebar-accent text-sidebar-accent-foreground'
              : 'text-muted-foreground hover:bg-muted hover:text-foreground',
          )}
        >
          <Icon className="size-4 shrink-0" aria-hidden />
          {label}
        </Link>
      ))}
    </nav>
  )

  return (
    <>
      <aside className="hidden w-56 shrink-0 lg:block">
        <div className="sticky top-24 space-y-6">
          <div>
            <Link
              href="/dashboard"
              className="inline-flex cursor-pointer items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-foreground"
            >
              <LayoutDashboard className="size-3.5" aria-hidden />
              All showrooms
            </Link>
            <p className="mt-2 truncate text-sm font-semibold text-foreground">{showroomName}</p>
          </div>
          {navContent}
        </div>
      </aside>

      <div className="mb-4 lg:hidden">
        <Sheet>
          <SheetTrigger
            className={cn(
              buttonVariants({ variant: 'outline', size: 'sm' }),
              'cursor-pointer gap-2',
            )}
          >
            <Menu className="size-4" aria-hidden />
            Menu
          </SheetTrigger>
          <SheetContent side="left" className="w-72">
            <SheetHeader>
              <SheetTitle>{showroomName}</SheetTitle>
            </SheetHeader>
            <div className="mt-6">{navContent}</div>
          </SheetContent>
        </Sheet>
      </div>
    </>
  )
}
