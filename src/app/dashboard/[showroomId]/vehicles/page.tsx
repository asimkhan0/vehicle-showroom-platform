import Image from 'next/image'
import Link from 'next/link'
import { requireUser } from '@/lib/auth'
import { buttonVariants } from '@/components/ui/button'
import { PageHeader } from '@/components/page-header'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Card } from '@/components/ui/card'
import { VehicleImagePlaceholder } from '@/components/vehicle-image-placeholder'
import { publicImageUrl } from '@/lib/storage'
import { cn } from '@/lib/utils'

const STATUS_STYLES: Record<string, string> = {
  draft: 'bg-muted text-muted-foreground',
  published: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200',
  sold: 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-200',
}

const STATUS_LABEL: Record<string, string> = {
  draft: 'Draft',
  published: 'Published',
  sold: 'Sold',
}

function formatPrice(cents: number | null) {
  if (cents == null) return '—'
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(cents / 100)
}

function primaryImageFromRow(
  imgs: Array<{ storage_path: string; is_primary: boolean; sort_order: number }> | null,
): string | null {
  if (!imgs?.length) return null
  const primary =
    imgs.find((i) => i.is_primary) ??
    imgs.slice().sort((a, b) => a.sort_order - b.sort_order)[0]
  return primary?.storage_path ?? null
}

export default async function VehiclesListPage({
  params,
}: {
  params: Promise<{ showroomId: string }>
}) {
  const { showroomId } = await params
  const { supabase } = await requireUser()

  const { data: vehicles } = await supabase
    .from('vehicles')
    .select('id, title, year, price_cents, mileage, status, vehicle_images(storage_path, is_primary, sort_order)')
    .eq('showroom_id', showroomId)
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-6">
      <PageHeader
        title="Vehicles"
        description="Create, edit, and publish listings for your showroom."
        actions={
          <Link
            href={`/dashboard/${showroomId}/vehicles/create`}
            className={buttonVariants({ size: 'sm' })}
          >
            Add vehicle
          </Link>
        }
      />

      {!vehicles || vehicles.length === 0 ? (
        <div className="rounded-xl border border-border bg-muted/30 p-12 text-center text-sm text-muted-foreground">
          No vehicles yet. Add your first listing to get started.
        </div>
      ) : (
        <Card className="overflow-hidden py-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-16">Photo</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Year</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Mileage</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-24" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {vehicles.map((v) => {
                const primaryPath = primaryImageFromRow(
                  v.vehicle_images as Array<{
                    storage_path: string
                    is_primary: boolean
                    sort_order: number
                  }> | null,
                )
                return (
                  <TableRow key={v.id} className="hover:bg-muted/50">
                    <TableCell>
                      <div className="relative size-12 overflow-hidden rounded-md border border-border bg-muted">
                        {primaryPath ? (
                          <Image
                            src={publicImageUrl(primaryPath)}
                            alt=""
                            fill
                            sizes="48px"
                            className="object-cover"
                          />
                        ) : (
                          <VehicleImagePlaceholder className="size-12" />
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{v.title}</TableCell>
                    <TableCell>{v.year ?? '—'}</TableCell>
                    <TableCell className="tabular-nums">{formatPrice(v.price_cents)}</TableCell>
                    <TableCell className="tabular-nums">
                      {v.mileage?.toLocaleString() ?? '—'}
                    </TableCell>
                    <TableCell>
                      <span
                        className={cn(
                          'inline-flex rounded-full px-2 py-0.5 text-xs font-medium',
                          STATUS_STYLES[v.status] ?? STATUS_STYLES.draft,
                        )}
                      >
                        {STATUS_LABEL[v.status] ?? v.status}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <Link
                        href={`/dashboard/${showroomId}/vehicles/${v.id}`}
                        className={buttonVariants({ size: 'sm', variant: 'ghost' })}
                      >
                        Edit
                      </Link>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </Card>
      )}
    </div>
  )
}
