import { STATS } from '@/lib/marketing'

export function StatsBar() {
  return (
    <section className="border-b border-border bg-muted/30 py-12">
      <div className="container">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {STATS.map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
                {stat.value}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
