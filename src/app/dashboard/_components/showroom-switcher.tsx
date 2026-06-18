'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ChevronDown } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'

type ShowroomOption = {
  id: string
  name: string
  slug: string
}

export function ShowroomSwitcher({
  showrooms,
  className,
}: {
  showrooms: ShowroomOption[]
  className?: string
}) {
  const pathname = usePathname()
  const current =
    showrooms.find((s) => pathname.startsWith(`/dashboard/${s.id}`)) ?? showrooms[0]

  if (!current || showrooms.length <= 1) {
    return current ? (
      <span className={cn('truncate text-sm font-medium text-foreground', className)}>
        {current.name}
      </span>
    ) : null
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={cn(
          buttonVariants({ variant: 'outline', size: 'sm' }),
          'max-w-[200px] cursor-pointer gap-1 truncate',
          className,
        )}
      >
        <span className="truncate">{current.name}</span>
        <ChevronDown className="size-4 shrink-0 opacity-50" aria-hidden />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-56">
        {showrooms.map((s) => {
          const vehiclesHref = `/dashboard/${s.id}/vehicles`
          const isActive = pathname.startsWith(`/dashboard/${s.id}`)
          return (
            <DropdownMenuItem key={s.id} className="cursor-pointer p-0">
              <Link
                href={vehiclesHref}
                className={cn(
                  'flex w-full flex-col px-2 py-1.5',
                  isActive && 'font-medium text-primary',
                )}
              >
                <span>{s.name}</span>
                <span className="text-xs text-muted-foreground">{s.slug}</span>
              </Link>
            </DropdownMenuItem>
          )
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
