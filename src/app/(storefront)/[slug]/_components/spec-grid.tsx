type Spec = { label: string; value: string | null | undefined }

export function SpecGrid({ specs }: { specs: Spec[] }) {
  const visible = specs.filter((s) => s.value)
  if (visible.length === 0) return null

  return (
    <dl className="grid grid-cols-2 gap-3 sm:grid-cols-3">
      {visible.map((s) => (
        <div
          key={s.label}
          className="rounded-lg border border-border bg-muted/40 px-3 py-2.5"
        >
          <dt className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            {s.label}
          </dt>
          <dd className="mt-0.5 text-sm font-medium text-foreground">{s.value}</dd>
        </div>
      ))}
    </dl>
  )
}
