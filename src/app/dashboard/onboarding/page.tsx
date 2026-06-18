import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { PageHeader } from '@/components/page-header'
import { ShowroomForm } from '../_components/showroom-form'
import { createShowroom } from '../_actions/showrooms'

export default function OnboardingPage() {
  return (
    <div className="mx-auto max-w-lg space-y-6">
      <PageHeader
        title="Create your showroom"
        description="Set up your dealer profile — this becomes your public listing page."
      />
      <Card>
        <CardHeader>
          <CardTitle>Showroom details</CardTitle>
          <CardDescription>Name, URL slug, and a short bio for buyers.</CardDescription>
        </CardHeader>
        <CardContent>
          <ShowroomForm action={createShowroom} submitLabel="Create showroom" />
        </CardContent>
      </Card>
    </div>
  )
}
