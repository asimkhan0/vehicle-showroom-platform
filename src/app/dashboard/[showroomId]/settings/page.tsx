import { notFound } from 'next/navigation'
import { requireUser } from '@/lib/auth'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ShowroomForm } from '../../_components/showroom-form'
import { updateShowroom } from '../../_actions/showrooms'

export default async function ShowroomSettingsPage({
  params,
}: {
  params: Promise<{ showroomId: string }>
}) {
  const { showroomId } = await params
  const { supabase } = await requireUser()

  const { data: showroom } = await supabase
    .from('showrooms')
    .select('name, slug, bio')
    .eq('id', showroomId)
    .maybeSingle()

  if (!showroom) notFound()

  return (
    <div className="max-w-lg">
      <Card>
        <CardHeader>
          <CardTitle>Showroom settings</CardTitle>
        </CardHeader>
        <CardContent>
          <ShowroomForm
            action={updateShowroom}
            initial={{ name: showroom.name, slug: showroom.slug, bio: showroom.bio }}
            showroomId={showroomId}
            submitLabel="Save changes"
          />
        </CardContent>
      </Card>
    </div>
  )
}
