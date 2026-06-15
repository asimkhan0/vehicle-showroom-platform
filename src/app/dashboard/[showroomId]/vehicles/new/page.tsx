import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { VehicleForm } from '../../../_components/vehicle-form'
import { createVehicle } from '../../../_actions/vehicles'

export default async function NewVehiclePage({
  params,
}: {
  params: Promise<{ showroomId: string }>
}) {
  const { showroomId } = await params

  return (
    <div className="max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>Add vehicle</CardTitle>
        </CardHeader>
        <CardContent>
          <VehicleForm
            key="new"
            action={createVehicle}
            showroomId={showroomId}
            submitLabel="Create listing"
          />
        </CardContent>
      </Card>
    </div>
  )
}
