import Link from 'next/link'
import { notFound } from 'next/navigation'
import { requireUser } from '@/lib/auth'

export default async function ShowroomLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ showroomId: string }>
}) {
  const { showroomId } = await params
  const { supabase, user } = await requireUser()

  const { data: showroom } = await supabase
    .from('showrooms')
    .select('id, slug, name, owner_user_id')
    .eq('id', showroomId)
    .maybeSingle()

  if (!showroom || showroom.owner_user_id !== user.id) notFound()

  const tabs = [
    { href: `/dashboard/${showroomId}/vehicles`, label: 'Vehicles' },
    { href: `/dashboard/${showroomId}/inquiries`, label: 'Inquiries' },
    { href: `/dashboard/${showroomId}/settings`, label: 'Settings' },
  ]

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/dashboard"
          className="text-sm text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100"
        >
          ← All showrooms
        </Link>
        <h1 className="mt-1 text-2xl font-semibold">{showroom.name}</h1>
        <p className="text-sm text-neutral-500">
          <code>{showroom.slug}</code>
        </p>
      </div>

      <nav className="flex gap-1 border-b">
        {tabs.map((t) => (
          <Link
            key={t.href}
            href={t.href}
            className="border-b-2 border-transparent px-3 py-2 text-sm hover:border-neutral-300"
          >
            {t.label}
          </Link>
        ))}
      </nav>

      {children}
    </div>
  )
}
