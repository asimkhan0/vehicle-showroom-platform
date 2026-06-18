import { z } from 'zod'
import { RESERVED_SLUGS } from '@/lib/reserved-slugs'

const PLATFORM_HOST = (process.env.NEXT_PUBLIC_PLATFORM_HOST ?? 'localhost:3000')
  .split(':')[0]
  .toLowerCase()

export function normalizeHostname(input: string): string {
  let h = input.trim().toLowerCase()
  h = h.replace(/^https?:\/\//, '')
  h = (h.split('/')[0] ?? h).split(':')[0] ?? h
  return h.replace(/\.$/, '')
}

function isPlatformHostname(hostname: string): boolean {
  if (hostname === PLATFORM_HOST || hostname === `www.${PLATFORM_HOST}`) return true
  if (hostname.endsWith(`.${PLATFORM_HOST}`)) return true
  return false
}

export const credentialsSchema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(8, 'At least 8 characters'),
})

export const slugSchema = z
  .string()
  .min(3, 'At least 3 characters')
  .max(40, 'At most 40 characters')
  .regex(/^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/, 'Lowercase letters, numbers, and hyphens only')

export const hostnameSchema = z
  .string()
  .min(1, 'Enter a domain name')
  .transform(normalizeHostname)
  .refine(
    (h) => /^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]*[a-z0-9])?)+$/.test(h),
    'Enter a valid domain name (e.g. bobsmotors.com)',
  )
  .refine((h) => !isPlatformHostname(h), 'Cannot use the platform domain as a custom domain')
  .refine((h) => !RESERVED_SLUGS.has(h.split('.')[0] ?? ''), 'That hostname is reserved')

export { RESERVED_SLUGS }
