import Link from 'next/link'
import { ArrowRight, type LucideIcon } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

export interface QuickAction {
  href: string
  label: string
  description: string
  icon: LucideIcon
}

interface QuickActionGridProps {
  actions: QuickAction[]
  title?: string
}

export function QuickActionGrid({
  actions,
  title = 'Quick actions',
}: QuickActionGridProps) {
  return (
    <div>
      <h2 className="mb-4 text-lg font-semibold">{title}</h2>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {actions.map(({ href, label, description, icon: Icon }) => (
          <Link key={href} href={href} className="group">
            <Card className="h-full transition-all hover:border-primary/30 hover:bg-accent/20 hover:shadow-sm">
              <CardContent className="flex items-center gap-4 p-5">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-medium">{label}</p>
                  <p className="text-xs text-muted-foreground">{description}</p>
                </div>
                <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
