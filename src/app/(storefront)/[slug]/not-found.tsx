export default function TenantNotFound() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-background px-6 text-center">
      <h1 className="text-2xl font-semibold text-foreground">Showroom not found</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        This dealership page doesn&apos;t exist or may have been removed.
      </p>
    </div>
  )
}
