import Link from 'next/link'
import { Check, Circle } from 'lucide-react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { cn } from '@/lib/utils'

export interface OnboardingStep {
  id: string
  label: string
  done: boolean
  href: string
}

interface OnboardingChecklistProps {
  steps: OnboardingStep[]
}

export function OnboardingChecklist({ steps }: OnboardingChecklistProps) {
  const completed = steps.filter((s) => s.done).length
  const progress = Math.round((completed / steps.length) * 100)

  if (completed === steps.length) return null

  return (
    <Card className="border-primary/20 bg-gradient-to-br from-primary/5 via-transparent to-transparent">
      <CardHeader>
        <CardTitle className="text-base">Get set up</CardTitle>
        <CardDescription>
          {completed} of {steps.length} complete · {progress}% ready
        </CardDescription>
        <div className="mt-3 h-2 overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-primary transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        {steps.map((step) => (
          <Link
            key={step.id}
            href={step.href}
            className={cn(
              'flex items-center gap-3 rounded-lg border border-transparent px-3 py-2.5 text-sm transition-colors hover:border-border hover:bg-muted/50',
              step.done && 'opacity-70'
            )}
          >
            {step.done ? (
              <Check className="h-4 w-4 shrink-0 text-emerald-600" />
            ) : (
              <Circle className="h-4 w-4 shrink-0 text-muted-foreground" />
            )}
            <span className={cn(step.done && 'line-through')}>
              {step.label}
            </span>
          </Link>
        ))}
      </CardContent>
    </Card>
  )
}
