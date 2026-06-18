import { requireUser } from '@/lib/auth'
import { DashboardHeader } from './_components/dashboard-header'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, supabase } = await requireUser()

  const { data: showrooms } = await supabase
    .from('showrooms')
    .select('id, slug, name')
    .eq('owner_user_id', user.id)
    .order('created_at', { ascending: false })

  return (
    <div className="min-h-dvh bg-background">
      <DashboardHeader
        userEmail={user.email ?? ''}
        showrooms={showrooms ?? []}
      />
      <main className="mx-auto max-w-7xl px-4 py-8">{children}</main>
    </div>
  )
}
