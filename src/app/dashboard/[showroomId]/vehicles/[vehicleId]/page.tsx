import { notFound } from 'next/navigation'
import { requireUser } from '@/lib/auth'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { VehicleForm } from '../../../_components/vehicle-form'
import { VehicleImageManager } from '../../../_components/vehicle-image-manager'
import { deleteVehicle, updateVehicle } from '../../../_actions/vehicles'

export default async function EditVehiclePage({
  params,
}: {
  params: Promise<{ showroomId: string; vehicleId: string }>
}) {
  const { showroomId, vehicleId } = await params
  const { supabase } = await requireUser()

  const { data: vehicle } = await supabase
    .from('vehicles')
    .select(
      'id, title, make, model, year, price_cents, mileage, body_type, transmission, fuel, vin, description, status',
    )
    .eq('id', vehicleId)
    .eq('showroom_id', showroomId)
    .maybeSingle()

  if (!vehicle) notFound()

  const { data: images } = await supabase
    .from('vehicle_images')
    .select('id, storage_path, is_primary, sort_order')
    .eq('vehicle_id', vehicleId)
    .order('sort_order', { ascending: true })

  return (
    <div className="max-w-2xl space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Images</CardTitle>
        </CardHeader>
        <CardContent>
          <VehicleImageManager
            showroomId={showroomId}
            vehicleId={vehicleId}
            images={images ?? []}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Edit vehicle</CardTitle>
        </CardHeader>
        <CardContent>
          <VehicleForm
            key={vehicleId}
            action={updateVehicle}
            showroomId={showroomId}
            initial={{
              id: vehicle.id,
              title: vehicle.title,
              make: vehicle.make,
              model: vehicle.model,
              year: vehicle.year,
              price_cents: vehicle.price_cents,
              mileage: vehicle.mileage,
              body_type: vehicle.body_type,
              transmission: vehicle.transmission,
              fuel: vehicle.fuel,
              vin: vehicle.vin,
              description: vehicle.description,
              status: vehicle.status,
            }}
            submitLabel="Save changes"
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base text-destructive">Danger zone</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={deleteVehicle}>
            <input type="hidden" name="showroomId" value={showroomId} />
            <input type="hidden" name="vehicleId" value={vehicleId} />
            <Button type="submit" variant="destructive">
              Delete listing
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
