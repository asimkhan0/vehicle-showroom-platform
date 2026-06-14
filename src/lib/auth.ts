import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

// Use from server components / server actions that require an authenticated user.
// Redirects to /login if no session. Returns the user when present.
export async function requireUser() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/login')
  return { supabase, user }
}

export async function getUser() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  return { supabase, user }
}
