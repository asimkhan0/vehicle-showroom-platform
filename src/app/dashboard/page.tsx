import Link from 'next/link'
import { redirect } from 'next/navigation'
import { Car, FileText, Inbox } from 'lucide-react'
import { requireUser } from '@/lib/auth'
import { buttonVariants } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { PageHeader } from '@/components/page-header'

export default async function DashboardHome() {
  const { supabase, user } = await requireUser()

  const { data: showrooms } = await supabase
    .from('showrooms')
    .select('id, slug, name, status')
    .eq('owner_user_id', user.id)
    .order('created_at', { ascending: false })

  if (!showrooms || showrooms.length === 0) {
    redirect('/dashboard/onboarding')
  }

  const showroomIds = showrooms.map((s) => s.id)

  const [{ count: published }, { count: drafts }, { count: unread }] = await Promise.all([
    supabase
      .from('vehicles')
      .select('id', { count: 'exact', head: true })
      .in('showroom_id', showroomIds)
      .eq('status', 'published'),
    supabase
      .from('vehicles')
      .select('id', { count: 'exact', head: true })
      .in('showroom_id', showroomIds)
      .eq('status', 'draft'),
    supabase
      .from('inquiries')
      .select('id', { count: 'exact', head: true })
      .in('showroom_id', showroomIds)
      .is('read_at', null),
  ])

  const stats = [
    {
      label: 'Published',
      value: published ?? 0,
      icon: Car,
      description: 'Live on storefronts',
    },
    {
      label: 'Drafts',
      value: drafts ?? 0,
      icon: FileText,
      description: 'Not yet published',
    },
    {
      label: 'Unread inquiries',
      value: unread ?? 0,
      icon: Inbox,
      description: 'Awaiting your reply',
    },
  ]

  return (
    <div className="space-y-8">
      <PageHeader
        title="Your showrooms"
        description="Manage inventory, respond to leads, and configure your dealer storefronts."
        actions={
          <Link href="/dashboard/onboarding" className={buttonVariants()}>
            New showroom
          </Link>
        }
      />

      <div className="grid gap-4 sm:grid-cols-3">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.label}
              </CardTitle>
              <stat.icon className="size-4 text-muted-foreground" aria-hidden />
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold tabular-nums text-foreground">{stat.value}</p>
              <p className="mt-1 text-xs text-muted-foreground">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {showrooms.map((s) => (
          <Card
            key={s.id}
            className="transition-shadow duration-200 hover:shadow-md"
          >
            <CardHeader>
              <CardTitle>{s.name}</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-between">
              <code className="rounded-md bg-muted px-2 py-1 text-xs text-muted-foreground">
                {s.slug}
              </code>
              <Link
                href={`/dashboard/${s.id}/vehicles`}
                className={buttonVariants({ size: 'sm', variant: 'outline' })}
              >
                Manage
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
