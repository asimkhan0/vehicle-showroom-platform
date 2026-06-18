import { notFound } from 'next/navigation'
import { requireUser } from '@/lib/auth'
import { DashboardSidebarNav } from '../_components/dashboard-sidebar-nav'

export default async function ShowroomLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ showroomId: string }>
}) {
  const { showroomId } = await params
  const { supabase, user } = await requireUser()

  const { data: showroom } = await supabase
    .from('showrooms')
    .select('id, slug, name, owner_user_id')
    .eq('id', showroomId)
    .maybeSingle()

  if (!showroom || showroom.owner_user_id !== user.id) notFound()

  return (
    <div className="flex gap-8">
      <DashboardSidebarNav showroomId={showroomId} showroomName={showroom.name} />
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  )
}
