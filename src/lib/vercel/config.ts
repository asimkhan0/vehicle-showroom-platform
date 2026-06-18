// Server-only Vercel API configuration.

export function requireVercelConfig() {
  const token = process.env.VERCEL_TOKEN
  const projectId = process.env.VERCEL_PROJECT_ID
  if (!token || !projectId) {
    throw new Error('VERCEL_TOKEN and VERCEL_PROJECT_ID must be set for custom domains')
  }
  return { token, projectId, teamId: process.env.VERCEL_TEAM_ID }
}

export function vercelApiUrl(path: string): string {
  const { teamId } = requireVercelConfig()
  const url = new URL(`https://api.vercel.com${path}`)
  if (teamId) url.searchParams.set('teamId', teamId)
  return url.toString()
}

export async function vercelFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const { token } = requireVercelConfig()
  const res = await fetch(vercelApiUrl(path), {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      ...init?.headers,
    },
  })

  const body = (await res.json().catch(() => ({}))) as T & { error?: { code?: string; message?: string } }

  if (!res.ok) {
    const message = body.error?.message ?? `Vercel API error (${res.status})`
    throw new VercelApiError(message, res.status, body.error?.code)
  }

  return body
}

export class VercelApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
    readonly code?: string,
  ) {
    super(message)
    this.name = 'VercelApiError'
  }
}

export function mapVercelError(error: unknown): string {
  if (error instanceof VercelApiError) {
    if (error.code === 'domain_already_in_use' || error.status === 409) {
      return 'That domain is already connected to another Vercel project'
    }
    if (error.status === 400) return error.message
    if (error.status === 403) return 'Vercel API token lacks permission for this project'
    return error.message
  }
  if (error instanceof Error) return error.message
  return 'Something went wrong talking to Vercel'
}
