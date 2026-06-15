import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { headers } from 'next/headers'
import { TenantFooter, TenantHeader } from './_components/tenant-chrome'
import { inventoryHref } from '@/lib/tenant-path'
import { getShowroomBySlug } from './_lib/queries'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const showroom = await getShowroomBySlug(slug)
  if (!showroom) return { title: 'Not found' }

  return {
    title: showroom.name,
    description: showroom.bio ?? `Browse the inventory at ${showroom.name}.`,
    openGraph: {
      title: showroom.name,
      description: showroom.bio ?? undefined,
      images: showroom.logo_url ? [{ url: showroom.logo_url }] : undefined,
    },
  }
}

export default async function TenantLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const showroom = await getShowroomBySlug(slug)
  if (!showroom) notFound()

  const accent = showroom.theme_json?.accent ?? '#0a0a0a'
  const accentInk = '#ffffff'
  const style = {
    ['--tenant-accent' as string]: accent,
    ['--tenant-accent-ink' as string]: accentInk,
  } as React.CSSProperties

  const host = (await headers()).get('host')
  const inventoryHome = inventoryHref(slug, host)

  return (
    <div
      style={style}
      className="min-h-dvh bg-neutral-50 font-[family-name:var(--font-geist-sans)] text-neutral-900 antialiased dark:bg-neutral-950 dark:text-neutral-100"
    >
      <TenantHeader showroom={showroom} inventoryHome={inventoryHome} />
      <main>{children}</main>
      <TenantFooter showroom={showroom} />
    </div>
  )
}
