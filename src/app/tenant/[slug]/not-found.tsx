import Link from 'next/link'

export default function TenantNotFound() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-neutral-50 px-6 text-center dark:bg-neutral-950">
      <h1 className="text-2xl font-semibold">Showroom not found</h1>
      <p className="mt-2 text-sm text-neutral-500">
        We couldn’t find a showroom at this address.
      </p>
      <Link
        href="/"
        className="mt-6 text-sm font-medium underline-offset-4 hover:underline"
      >
        Go to homepage
      </Link>
    </div>
  )
}
