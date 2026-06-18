import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { PageHeader } from '@/components/page-header'
import { ShowroomForm } from '../_components/showroom-form'
import { createShowroom } from '../_actions/showrooms'

const STEPS = [
  { label: 'Create showroom', active: true },
  { label: 'Add vehicles', active: false },
  { label: 'Publish & share', active: false },
]

export default function OnboardingPage() {
  return (
    <div className="mx-auto max-w-lg space-y-6">
      <PageHeader
        title="Create your showroom"
        description="Set up your dealer profile — this becomes your public listing page."
      />

      <ol className="flex items-center gap-2" aria-label="Onboarding progress">
        {STEPS.map((step, i) => (
          <li key={step.label} className="flex flex-1 items-center gap-2">
            <span
              className={`flex size-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${
                step.active
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground'
              }`}
            >
              {i + 1}
            </span>
            <span
              className={`hidden text-xs font-medium sm:inline ${
                step.active ? 'text-foreground' : 'text-muted-foreground'
              }`}
            >
              {step.label}
            </span>
            {i < STEPS.length - 1 && (
              <span className="mx-1 hidden h-px flex-1 bg-border sm:block" aria-hidden />
            )}
          </li>
        ))}
      </ol>

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
