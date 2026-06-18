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

const STATUS_LABEL: Record<string, string> = {
  draft: 'Draft',
  published: 'Published',
  sold: 'Sold',
}

function formatPrice(cents: number | null) {
  if (cents == null) return '—'
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(cents / 100)
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
    .select('id, title, year, price_cents, mileage, status')
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
        <div className="rounded-xl border border-dashed border-border bg-muted/30 p-12 text-center text-sm text-muted-foreground">
          No vehicles yet. Add your first listing to get started.
        </div>
      ) : (
        <Card className="overflow-hidden py-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Year</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Mileage</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-24" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {vehicles.map((v) => (
                <TableRow key={v.id} className="hover:bg-muted/50">
                  <TableCell className="font-medium">{v.title}</TableCell>
                  <TableCell>{v.year ?? '—'}</TableCell>
                  <TableCell className="tabular-nums">{formatPrice(v.price_cents)}</TableCell>
                  <TableCell className="tabular-nums">
                    {v.mileage?.toLocaleString() ?? '—'}
                  </TableCell>
                  <TableCell>{STATUS_LABEL[v.status] ?? v.status}</TableCell>
                  <TableCell className="text-right">
                    <Link
                      href={`/dashboard/${showroomId}/vehicles/${v.id}`}
                      className={buttonVariants({ size: 'sm', variant: 'ghost' })}
                    >
                      Edit
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}
    </div>
  )
}
