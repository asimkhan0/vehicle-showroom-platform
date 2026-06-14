type Spec = { label: string; value: string | null | undefined }

export function SpecGrid({ specs }: { specs: Spec[] }) {
  const visible = specs.filter((s) => s.value)
  if (visible.length === 0) return null

  return (
    <dl className="grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-3">
      {visible.map((s) => (
        <div key={s.label}>
          <dt className="text-xs font-medium uppercase tracking-wider text-neutral-500">
            {s.label}
          </dt>
          <dd className="mt-0.5 text-sm text-neutral-900 dark:text-neutral-100">{s.value}</dd>
        </div>
      ))}
    </dl>
  )
}
