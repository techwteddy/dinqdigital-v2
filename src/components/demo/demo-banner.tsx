import Link from 'next/link'
import { Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function DemoBanner() {
  return (
    <div className="border-b border-primary/20 bg-primary/10 px-4 py-2.5">
      <div className="container flex flex-wrap items-center justify-center gap-2 text-center text-sm sm:justify-between sm:text-left">
        <p className="flex items-center justify-center gap-2 font-medium text-foreground">
          <Sparkles className="h-4 w-4 text-primary" />
          Live demo — explore the full dashboard without signing in
        </p>
        <div className="flex items-center gap-2">
          <Button size="sm" variant="outline" asChild>
            <Link href="/">Back to homepage</Link>
          </Button>
          <Button size="sm" asChild>
            <Link href="/auth/register">Start free trial</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
