import { NextResponse, type NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'
import { resolveTenant } from '@/lib/tenant'
import { RESERVED_SLUGS } from '@/lib/reserved-slugs'

export async function proxy(request: NextRequest) {
  const url = request.nextUrl
  const host = request.headers.get('host')
  const tenant = await resolveTenant(host)

  // Legacy: /tenant/{slug}/... → /{slug}/... on the platform host.
  if (tenant.kind === 'platform' && url.pathname.startsWith('/tenant/')) {
    const rest = url.pathname.slice('/tenant/'.length)
    const slug = rest.split('/')[0]
    if (slug && !RESERVED_SLUGS.has(slug)) {
      const suffix = rest.slice(slug.length)
      return NextResponse.redirect(new URL(`/${slug}${suffix || ''}${url.search}`, request.url), 308)
    }
  }

  if (tenant.kind === 'tenant') {
    const { slug } = tenant
    const pathname = url.pathname

    // Strip leaked internal prefix on tenant subdomains.
    if (pathname.startsWith('/tenant/')) {
      return NextResponse.redirect(new URL(`/${url.search}`, request.url), 308)
    }

    const prefix = `/${slug}`
    const alreadyPrefixed =
      pathname === prefix || pathname === `${prefix}/` || pathname.startsWith(`${prefix}/`)

    if (alreadyPrefixed) {
      return updateSession(request, NextResponse.next())
    }

    // Foreign slug as first path segment (e.g. /other-showroom/...) — send home.
    const firstSegment = pathname.split('/').filter(Boolean)[0]
    if (firstSegment && firstSegment !== slug && firstSegment !== 'v') {
      return NextResponse.redirect(new URL(`/${url.search}`, request.url), 308)
    }

    const rewriteUrl = url.clone()
    rewriteUrl.pathname = `${prefix}${pathname === '/' ? '' : pathname}`
    return updateSession(request, NextResponse.rewrite(rewriteUrl))
  }

  return updateSession(request, NextResponse.next())
}

export const config = {
  // Exclude static assets, _next internals, and the favicon.
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
}
