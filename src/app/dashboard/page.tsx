import Link from 'next/link'
import { redirect } from 'next/navigation'
import { requireUser } from '@/lib/auth'
import { buttonVariants } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Your showrooms</h1>
        <Link href="/dashboard/onboarding" className={buttonVariants()}>
          New showroom
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {showrooms.map((s) => (
          <Card key={s.id}>
            <CardHeader>
              <CardTitle>{s.name}</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-between">
              <code className="text-xs text-neutral-500">{s.slug}</code>
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
