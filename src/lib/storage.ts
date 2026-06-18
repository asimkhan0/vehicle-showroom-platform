export const VEHICLE_IMAGES_BUCKET = 'vehicle-images'

// Path convention used by both client uploads and storage RLS policies.
// First segment MUST be the showroom_id (the policy parses it out).
export function vehicleImagePath(opts: {
  showroomId: string
  vehicleId: string
  ext: string
}) {
  const safeExt = opts.ext.replace(/[^a-z0-9]/gi, '').toLowerCase() || 'jpg'
  return `${opts.showroomId}/${opts.vehicleId}/${crypto.randomUUID()}.${safeExt}`
}

export function showroomCoverPath(opts: { showroomId: string; ext: string }) {
  const safeExt = opts.ext.replace(/[^a-z0-9]/gi, '').toLowerCase() || 'jpg'
  return `${opts.showroomId}/cover/${crypto.randomUUID()}.${safeExt}`
}

export function publicImageUrl(path: string) {
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL
  if (!base) return ''
  return `${base}/storage/v1/object/public/${VEHICLE_IMAGES_BUCKET}/${path}`
}

export function extFromMime(mime: string): string {
  if (mime === 'image/jpeg') return 'jpg'
  if (mime === 'image/png') return 'png'
  if (mime === 'image/webp') return 'webp'
  if (mime === 'image/avif') return 'avif'
  return 'jpg'
}
