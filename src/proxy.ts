import { NextResponse, type NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'
import { resolveTenant } from '@/lib/tenant'

export async function proxy(request: NextRequest) {
  const url = request.nextUrl
  const host = request.headers.get('host')
  const tenant = resolveTenant(host)

  let response: NextResponse

  if (tenant.kind === 'tenant' && !url.pathname.startsWith('/tenant/')) {
    const rewriteUrl = url.clone()
    rewriteUrl.pathname = `/tenant/${tenant.slug}${url.pathname}`
    response = NextResponse.rewrite(rewriteUrl)
  } else {
    response = NextResponse.next()
  }

  return updateSession(request, response)
}

export const config = {
  // Exclude static assets, _next internals, and the favicon.
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
}
