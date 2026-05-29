import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

interface UsageMeterProps {
  label: string
  used: string
  limit: string
  percent: number
}

export function UsageMeter({ label, used, limit, percent }: UsageMeterProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Usage this period</CardTitle>
        <CardDescription>{label}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-end justify-between text-sm">
          <span className="font-semibold">{used}</span>
          <span className="text-muted-foreground">of {limit}</span>
        </div>
        <div className="mt-3 h-3 overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-gradient-to-r from-primary to-violet-500 transition-all"
            style={{ width: `${Math.min(100, percent)}%` }}
          />
        </div>
        <p className="mt-2 text-xs text-muted-foreground">
          {percent}% of monthly quota used
        </p>
      </CardContent>
    </Card>
  )
}
