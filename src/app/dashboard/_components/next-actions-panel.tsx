import Link from 'next/link'
import { ArrowRight, Car, Inbox } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export type NextAction = {
  href: string
  label: string
  icon: 'inquiry' | 'draft'
}

export function NextActionsPanel({ actions }: { actions: NextAction[] }) {
  if (actions.length === 0) return null

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Next actions</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {actions.map((action) => (
            <li key={action.href}>
              <Link
                href={action.href}
                className="group flex cursor-pointer items-center gap-3 rounded-lg border border-border px-4 py-3 transition-colors hover:bg-muted/50"
              >
                {action.icon === 'inquiry' ? (
                  <Inbox className="size-4 shrink-0 text-primary" aria-hidden />
                ) : (
                  <Car className="size-4 shrink-0 text-muted-foreground" aria-hidden />
                )}
                <span className="flex-1 text-sm font-medium text-foreground">{action.label}</span>
                <ArrowRight
                  className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5"
                  aria-hidden
                />
              </Link>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}
