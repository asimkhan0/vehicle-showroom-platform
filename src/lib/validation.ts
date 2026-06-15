import { z } from 'zod'
import { RESERVED_SLUGS } from '@/lib/reserved-slugs'

export const credentialsSchema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(8, 'At least 8 characters'),
})

export const slugSchema = z
  .string()
  .min(3, 'At least 3 characters')
  .max(40, 'At most 40 characters')
  .regex(/^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/, 'Lowercase letters, numbers, and hyphens only')

export { RESERVED_SLUGS }
