import { CheckCircle2, MessageSquare, Search, Shield } from 'lucide-react'
import type { PlatformStats } from '@/app/_lib/discovery/queries'

export function TrustStrip({ stats }: { stats: PlatformStats }) {
  const claims = [
    {
      icon: MessageSquare,
      text: (
        <>
          Inquiries go <strong className="font-semibold text-foreground">directly to the dealer</strong>{' '}
          — we don&apos;t sell your lead
        </>
      ),
    },
    {
      icon: Search,
      text: (
        <>
          <strong className="font-semibold text-foreground">{stats.vehicleCount.toLocaleString()}</strong>{' '}
          published vehicles from independent showrooms
        </>
      ),
    },
    {
      icon: Shield,
      text: (
        <>
          Every listing from a <strong className="font-semibold text-foreground">verified dealer account</strong>
        </>
      ),
    },
    {
      icon: CheckCircle2,
      text: 'Search by make, model, price, and mileage',
    },
  ]

  return (
    <section
      aria-label="Why use Showroom"
      className="rounded-xl border border-border bg-card px-6 py-8 shadow-sm"
    >
      <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {claims.map((claim, i) => (
          <li key={i} className="flex gap-3">
            <claim.icon
              className="mt-0.5 size-5 shrink-0 text-primary"
              aria-hidden
            />
            <p className="text-sm leading-relaxed text-muted-foreground">{claim.text}</p>
          </li>
        ))}
      </ul>
    </section>
  )
}
