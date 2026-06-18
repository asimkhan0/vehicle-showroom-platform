import Link from 'next/link'
import { requireUser } from '@/lib/auth'
import { PageHeader } from '@/components/page-header'
import { Card } from '@/components/ui/card'

type InquiryRow = {
  id: string
  name: string
  email: string
  phone: string | null
  message: string
  created_at: string
  read_at: string | null
  vehicle_id: string | null
  vehicles: { title: string } | null
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}

export default async function InquiriesPage({
  params,
}: {
  params: Promise<{ showroomId: string }>
}) {
  const { showroomId } = await params
  const { supabase } = await requireUser()

  const { data } = await supabase
    .from('inquiries')
    .select(
      'id, name, email, phone, message, created_at, read_at, vehicle_id, vehicles(title)',
    )
    .eq('showroom_id', showroomId)
    .order('created_at', { ascending: false })

  const inquiries = (data ?? []) as unknown as InquiryRow[]

  return (
    <div className="space-y-6">
      <PageHeader
        title="Inquiries"
        description="Messages from buyers interested in your vehicles."
      />

      {inquiries.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border bg-muted/30 p-12 text-center text-sm text-muted-foreground">
          No inquiries yet. Once buyers reach out, you&apos;ll see them here.
        </div>
      ) : (
        <div className="space-y-3">
          {inquiries.map((i) => (
            <Card key={i.id} className="p-5">
              <header className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                <div className="flex flex-wrap items-baseline gap-2">
                  <h3 className="font-medium text-foreground">{i.name}</h3>
                  <a
                    href={`mailto:${i.email}`}
                    className="cursor-pointer text-sm text-muted-foreground transition-colors hover:text-primary"
                  >
                    {i.email}
                  </a>
                  {i.phone && (
                    <span className="text-sm text-muted-foreground">· {i.phone}</span>
                  )}
                  {!i.read_at && (
                    <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                      New
                    </span>
                  )}
                </div>
                <time className="text-xs text-muted-foreground">{formatDate(i.created_at)}</time>
              </header>
              {i.vehicles?.title && i.vehicle_id && (
                <p className="mt-1 text-xs uppercase tracking-wider text-muted-foreground">
                  Re:{' '}
                  <Link
                    href={`/dashboard/${showroomId}/vehicles/${i.vehicle_id}`}
                    className="cursor-pointer transition-colors hover:text-primary"
                  >
                    {i.vehicles.title}
                  </Link>
                </p>
              )}
              <p className="mt-3 whitespace-pre-line text-sm text-foreground/90">{i.message}</p>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
