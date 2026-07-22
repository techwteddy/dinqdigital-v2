export default function DashboardLoading() {
  return (
    <div className="flex animate-pulse flex-col gap-8">
      <div className="space-y-3">
        <div className="h-9 w-64 rounded-md bg-muted" />
        <div className="h-4 w-96 max-w-full rounded-md bg-muted" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="h-28 rounded-xl border border-border bg-muted/40"
          />
        ))}
      </div>
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="h-64 rounded-xl border border-border bg-muted/40 lg:col-span-2" />
        <div className="h-64 rounded-xl border border-border bg-muted/40" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2].map((i) => (
          <div
            key={i}
            className="h-40 rounded-xl border border-border bg-muted/40"
          />
        ))}
      </div>
    </div>
  )
}
