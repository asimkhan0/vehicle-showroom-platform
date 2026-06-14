import Link from 'next/link'
import { requireUser } from '@/lib/auth'

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

  if (inquiries.length === 0) {
    return (
      <div className="rounded-lg border border-dashed p-12 text-center text-sm text-neutral-500">
        No inquiries yet. Once buyers reach out, you’ll see them here.
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {inquiries.map((i) => (
        <article
          key={i.id}
          className="rounded-lg border bg-white p-5 dark:bg-neutral-900"
        >
          <header className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
            <div className="flex items-baseline gap-2">
              <h3 className="font-medium">{i.name}</h3>
              <a
                href={`mailto:${i.email}`}
                className="text-sm text-neutral-500 hover:underline"
              >
                {i.email}
              </a>
              {i.phone && (
                <span className="text-sm text-neutral-500">· {i.phone}</span>
              )}
            </div>
            <time className="text-xs text-neutral-400">{formatDate(i.created_at)}</time>
          </header>
          {i.vehicles?.title && i.vehicle_id && (
            <p className="mt-1 text-xs uppercase tracking-wider text-neutral-500">
              Re:{' '}
              <Link
                href={`/dashboard/${showroomId}/vehicles/${i.vehicle_id}`}
                className="hover:underline"
              >
                {i.vehicles.title}
              </Link>
            </p>
          )}
          <p className="mt-3 whitespace-pre-line text-sm text-neutral-700 dark:text-neutral-200">
            {i.message}
          </p>
        </article>
      ))}
    </div>
  )
}
