import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import { VEHICLE_IMAGES_BUCKET } from '../../src/lib/storage'
import './env'

// Service-role client. SERVER/TEST ONLY — bypasses RLS. Used to provision a
// pre-confirmed test user (so we skip the email-confirmation step) and to tear
// it down afterwards.
function adminClient(): SupabaseClient {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) {
    throw new Error(
      'Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY. ' +
        'Set them in .env.e2e.local (or .env.local) before running e2e tests.',
    )
  }
  return createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  })
}

export type TestUser = { id: string; email: string; password: string }

export async function createConfirmedUser(): Promise<TestUser> {
  const unique = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`
  const email = `e2e-${unique}@example.com`
  const password = 'e2e-Password-123!'

  const { data, error } = await adminClient().auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  })

  if (error || !data.user) {
    throw new Error(`Failed to create test user: ${error?.message ?? 'unknown error'}`)
  }

  return { id: data.user.id, email, password }
}

async function listAllStoragePaths(
  client: SupabaseClient,
  bucket: string,
  prefix: string,
): Promise<string[]> {
  const paths: string[] = []
  const { data: entries, error } = await client.storage.from(bucket).list(prefix, { limit: 1000 })
  if (error) throw new Error(`Storage list failed for ${prefix}: ${error.message}`)
  if (!entries?.length) return paths

  for (const entry of entries) {
    const path = prefix ? `${prefix}/${entry.name}` : entry.name
    // Folders have no id; files have id metadata.
    if (entry.id == null) {
      paths.push(...(await listAllStoragePaths(client, bucket, path)))
    } else {
      paths.push(path)
    }
  }
  return paths
}

async function deleteShowroomStorage(client: SupabaseClient, showroomId: string): Promise<void> {
  const paths = await listAllStoragePaths(client, VEHICLE_IMAGES_BUCKET, showroomId)
  if (paths.length === 0) return

  const { error } = await client.storage.from(VEHICLE_IMAGES_BUCKET).remove(paths)
  if (error) throw new Error(`Storage delete failed for showroom ${showroomId}: ${error.message}`)
}

export async function deleteTestArtifacts(userId: string): Promise<void> {
  const client = adminClient()

  const { data: showrooms, error: showroomErr } = await client
    .from('showrooms')
    .select('id')
    .eq('owner_user_id', userId)

  if (showroomErr) {
    throw new Error(`Failed to list showrooms for cleanup: ${showroomErr.message}`)
  }

  for (const showroom of showrooms ?? []) {
    await deleteShowroomStorage(client, showroom.id)
  }

  const { error: deleteErr } = await client.auth.admin.deleteUser(userId)
  if (deleteErr) {
    throw new Error(`Failed to delete test user ${userId}: ${deleteErr.message}`)
  }
}

// Kept for backwards compatibility in case other helpers import it.
export async function deleteUser(id: string): Promise<void> {
  await deleteTestArtifacts(id)
}
