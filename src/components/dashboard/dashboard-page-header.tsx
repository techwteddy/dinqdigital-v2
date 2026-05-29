import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface DashboardPageHeaderProps {
  title: string
  description: string
  isDemo?: boolean
  badge?: string
  action?: {
    label: string
    href: string
  }
  className?: string
}

export function DashboardPageHeader({
  title,
  description,
  isDemo,
  badge,
  action,
  className,
}: DashboardPageHeaderProps) {
  return (
    <div
      className={cn(
        'flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between',
        className
      )}
    >
      <div>
        {(isDemo || badge) && (
          <Badge variant="secondary" className="mb-3">
            {badge ?? 'Demo mode'}
          </Badge>
        )}
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
          {title}
        </h1>
        <p className="mt-1 max-w-2xl text-muted-foreground">{description}</p>
      </div>
      {action && (
        <Button asChild className="shrink-0">
          <Link href={action.href}>
            {action.label}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      )}
    </div>
  )
}
