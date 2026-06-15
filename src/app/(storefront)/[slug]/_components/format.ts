const priceFmt = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
})

const numberFmt = new Intl.NumberFormat('en-US')

export function formatPrice(cents: number | null): string {
  if (cents == null) return 'Call for price'
  return priceFmt.format(cents / 100)
}

export function formatMileage(miles: number | null): string | null {
  if (miles == null) return null
  return `${numberFmt.format(miles)} mi`
}

export function vehicleSubtitle(v: {
  year: number | null
  make: string | null
  model: string | null
}): string {
  return [v.year, v.make, v.model].filter(Boolean).join(' ')
}
