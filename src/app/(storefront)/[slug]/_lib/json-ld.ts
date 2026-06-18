import type { VehicleDetail } from '../_lib/queries'
import { platformUrl } from '@/lib/platform-url'
import { publicImageUrl } from '@/lib/storage'

type VehicleJsonLdInput = {
  vehicle: VehicleDetail
  showroom: { name: string; slug: string }
}

export function vehicleJsonLd({ vehicle, showroom }: VehicleJsonLdInput) {
  const url = platformUrl(`/${showroom.slug}/v/${vehicle.id}`)
  const image = vehicle.primary_image ? publicImageUrl(vehicle.primary_image) : undefined

  return {
    '@context': 'https://schema.org',
    '@type': 'Vehicle',
    name: vehicle.title,
    url,
    image,
    description: vehicle.description ?? undefined,
    brand: vehicle.make
      ? { '@type': 'Brand', name: vehicle.make }
      : undefined,
    model: vehicle.model ?? undefined,
    vehicleModelDate: vehicle.year ?? undefined,
    mileageFromOdometer:
      vehicle.mileage != null
        ? {
            '@type': 'QuantitativeValue',
            value: vehicle.mileage,
            unitCode: 'SMI',
          }
        : undefined,
    offers:
      vehicle.price_cents != null
        ? {
            '@type': 'Offer',
            price: (vehicle.price_cents / 100).toFixed(2),
            priceCurrency: 'USD',
            availability: 'https://schema.org/InStock',
            seller: {
              '@type': 'AutoDealer',
              name: showroom.name,
            },
          }
        : undefined,
    identifier: vehicle.vin ?? undefined,
    fuelType: vehicle.fuel ?? undefined,
    vehicleTransmission: vehicle.transmission ?? undefined,
    bodyType: vehicle.body_type ?? undefined,
  }
}
