import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import { VEHICLE_IMAGES_BUCKET } from '../../src/lib/storage'
import './env'

// Service-role client. SERVER/TEST ONLY — bypasses RLS. Used to provision a
// pre-confirmed test user (so we skip the email-confirmation step) and to tear
// it down afterwards.
/** When E2E_SUPABASE_PROJECT_REF is set, refuse to run against any other project. */
function assertE2eSupabaseTarget() {
  const url = process.env.E2E_SUPABASE_URL ?? ''
  const expectedRef = process.env.E2E_SUPABASE_PROJECT_REF
  if (expectedRef && !url.includes(expectedRef)) {
    throw new Error(
      `Refusing e2e against "${url}": URL must contain E2E_SUPABASE_PROJECT_REF="${expectedRef}".`,
    )
  }
}

function adminClient(): SupabaseClient {
  const url = process.env.E2E_SUPABASE_URL
  const key = process.env.E2E_SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) {
    throw new Error(
      'Missing E2E_SUPABASE_URL or E2E_SUPABASE_SERVICE_ROLE_KEY. ' +
        'Add them to .env.local before running e2e tests.',
    )
  }
  return createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  })
}

export type TestUser = { id: string; email: string; password: string }

export async function createConfirmedUser(): Promise<TestUser> {
  assertE2eSupabaseTarget()
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
  const pageSize = 1000
  let offset = 0

  while (true) {
    const { data: entries, error } = await client.storage
      .from(bucket)
      .list(prefix, { limit: pageSize, offset })

    if (error) throw new Error(`Storage list failed for ${prefix}: ${error.message}`)
    if (!entries?.length) break

    for (const entry of entries) {
      const path = prefix ? `${prefix}/${entry.name}` : entry.name
      // Folders have no id; files have id metadata.
      if (entry.id == null) {
        paths.push(...(await listAllStoragePaths(client, bucket, path)))
      } else {
        paths.push(path)
      }
    }

    if (entries.length < pageSize) break
    offset += pageSize
  }

  return paths
}

async function deleteShowroomStorage(client: SupabaseClient, showroomId: string): Promise<void> {
  const paths = await listAllStoragePaths(client, VEHICLE_IMAGES_BUCKET, showroomId)
  if (paths.length === 0) return

  const batchSize = 100
  for (let i = 0; i < paths.length; i += batchSize) {
    const batch = paths.slice(i, i + batchSize)
    const { error } = await client.storage.from(VEHICLE_IMAGES_BUCKET).remove(batch)
    if (error) {
      throw new Error(`Storage delete failed for showroom ${showroomId}: ${error.message}`)
    }
  }
}

export async function deleteTestArtifacts(userId: string): Promise<void> {
  assertE2eSupabaseTarget()
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
