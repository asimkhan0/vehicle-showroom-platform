// Canonical platform URLs for sitemaps, JSON-LD, and Open Graph.

export function platformOrigin(): string {
  const host = process.env.NEXT_PUBLIC_PLATFORM_HOST ?? 'localhost:3000'
  const protocol = host.includes('localhost') ? 'http' : 'https'
  return `${protocol}://${host}`
}

export function platformUrl(path = '/'): string {
  const normalized = path.startsWith('/') ? path : `/${path}`
  return `${platformOrigin()}${normalized}`
}
