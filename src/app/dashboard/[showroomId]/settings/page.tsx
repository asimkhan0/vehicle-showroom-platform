import { notFound } from 'next/navigation'
import { requireUser } from '@/lib/auth'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { PageHeader } from '@/components/page-header'
import { ShowroomForm } from '../../_components/showroom-form'
import { ShowroomBrandingForm } from '../../_components/showroom-branding-form'
import { updateShowroom, updateShowroomBranding } from '../../_actions/showrooms'
import type { ShowroomTheme } from '@/app/(storefront)/[slug]/_lib/queries'

export default async function ShowroomSettingsPage({
  params,
}: {
  params: Promise<{ showroomId: string }>
}) {
  const { showroomId } = await params
  const { supabase } = await requireUser()

  const { data: showroom } = await supabase
    .from('showrooms')
    .select('name, slug, bio, theme_json')
    .eq('id', showroomId)
    .maybeSingle()

  if (!showroom) notFound()

  const theme = (showroom.theme_json ?? {}) as ShowroomTheme

  const { data: publishedVehicles } = await supabase
    .from('vehicles')
    .select('id, title')
    .eq('showroom_id', showroomId)
    .eq('status', 'published')
    .order('title')

  return (
    <div className="space-y-6">
      <PageHeader
        title="Showroom settings"
        description="Update your showroom name, URL slug, public bio, and storefront branding."
      />
      <Card className="max-w-lg">
        <CardHeader>
          <CardTitle>Profile</CardTitle>
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

      <Card className="max-w-lg">
        <CardHeader>
          <CardTitle>Storefront branding</CardTitle>
        </CardHeader>
        <CardContent>
          <ShowroomBrandingForm
            action={updateShowroomBranding}
            showroomId={showroomId}
            initialCoverPath={theme.coverImagePath}
            initialFeatured={theme.featured ?? []}
            publishedVehicles={publishedVehicles ?? []}
          />
        </CardContent>
      </Card>
    </div>
  )
}
