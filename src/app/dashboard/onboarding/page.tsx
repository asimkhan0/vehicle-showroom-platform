import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ShowroomForm } from '../_components/showroom-form'
import { createShowroom } from '../_actions/showrooms'

export default function OnboardingPage() {
  return (
    <div className="mx-auto max-w-lg">
      <Card>
        <CardHeader>
          <CardTitle>Create your showroom</CardTitle>
          <CardDescription>This becomes your public listing page.</CardDescription>
        </CardHeader>
        <CardContent>
          <ShowroomForm action={createShowroom} submitLabel="Create showroom" />
        </CardContent>
      </Card>
    </div>
  )
}
