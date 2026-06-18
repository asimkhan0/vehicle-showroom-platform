import type { MetadataRoute } from 'next'
import {
  getSitemapPublishedVehicles,
  getSitemapShowrooms,
} from '@/app/_lib/discovery/queries'
import { platformUrl } from '@/lib/platform-url'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [showrooms, vehicles] = await Promise.all([
    getSitemapShowrooms(),
    getSitemapPublishedVehicles(),
  ])

  const entries: MetadataRoute.Sitemap = [
    {
      url: platformUrl('/'),
      changeFrequency: 'daily',
      priority: 1,
    },
  ]

  for (const showroom of showrooms) {
    entries.push({
      url: platformUrl(`/${showroom.slug}`),
      lastModified: showroom.updated_at,
      changeFrequency: 'weekly',
      priority: 0.8,
    })
  }

  for (const vehicle of vehicles) {
    entries.push({
      url: platformUrl(`/${vehicle.showroom_slug}/v/${vehicle.id}`),
      lastModified: vehicle.updated_at,
      changeFrequency: 'weekly',
      priority: 0.7,
    })
  }

  return entries
}
