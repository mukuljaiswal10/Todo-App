export default function DashboardSkeleton() {
  return (
    <div className="p-4 md:p-8 space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-2">
          <div className="h-7 w-52 rounded-lg bg-muted animate-pulse" />
          <div className="h-4 w-72 rounded-md bg-muted/70 animate-pulse" />
        </div>
        <div className="h-10 w-28 rounded-xl bg-muted animate-pulse" />
      </div>

      <div className="space-y-3">
        <div className="h-11 w-full max-w-xl rounded-xl bg-muted animate-pulse" />
        <div className="flex gap-2 flex-wrap">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="h-9 w-24 rounded-xl bg-muted/80 animate-pulse"
            />
          ))}
        </div>
      </div>

      <div className="grid gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="rounded-2xl border bg-card p-4 md:p-5 shadow-sm"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-2 w-full">
                <div className="h-5 w-2/3 rounded-md bg-muted animate-pulse" />
                <div className="h-4 w-1/3 rounded-md bg-muted/70 animate-pulse" />
                <div className="flex gap-2 pt-1">
                  <div className="h-6 w-16 rounded-full bg-muted/80 animate-pulse" />
                  <div className="h-6 w-16 rounded-full bg-muted/80 animate-pulse" />
                </div>
              </div>
              <div className="h-9 w-24 rounded-xl bg-muted animate-pulse" />
            </div>

            <div className="mt-4 space-y-2">
              <div className="h-4 w-28 rounded-md bg-muted/70 animate-pulse" />
              <div className="h-10 w-full rounded-xl bg-muted animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
