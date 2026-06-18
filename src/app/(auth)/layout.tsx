import Link from 'next/link'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-background px-4 py-12">
      <Link
        href="/"
        className="mb-8 text-xl font-semibold tracking-tight text-brand transition-colors hover:text-brand/80"
      >
        Showroom
      </Link>
      <div className="w-full max-w-sm">{children}</div>
      <p className="mt-8 text-center text-xs text-muted-foreground">
        Independent dealers · Platform marketplace
      </p>
    </div>
  )
}
