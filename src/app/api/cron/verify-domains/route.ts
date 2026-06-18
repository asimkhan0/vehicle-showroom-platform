import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { runDomainVerification } from '@/lib/domains/verify'
import { isCustomDomainsConfigured } from '@/lib/domains/config'

export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET
  if (!secret) {
    return NextResponse.json({ error: 'CRON_SECRET not configured' }, { status: 503 })
  }

  const auth = request.headers.get('authorization')
  if (auth !== `Bearer ${secret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  if (!isCustomDomainsConfigured()) {
    return NextResponse.json({ checked: 0, message: 'Custom domains not configured' })
  }

  const supabase = createAdminClient()
  const { data: pending } = await supabase
    .from('domains')
    .select('id')
    .in('status', ['pending', 'verifying'])

  let verified = 0
  for (const row of pending ?? []) {
    try {
      const result = await runDomainVerification(supabase, row.id)
      if (result.verified) verified += 1
    } catch {
      // Skip domains that fail verification checks.
    }
  }

  return NextResponse.json({ checked: pending?.length ?? 0, verified })
}
