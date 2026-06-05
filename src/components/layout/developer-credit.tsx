import Link from 'next/link'
import { DEVELOPER_NAME, DEVELOPER_URL } from '@/lib/site'

interface DeveloperCreditProps {
  variant?: 'bar' | 'compact'
  className?: string
}

export function DeveloperCredit({
  variant = 'bar',
  className = '',
}: DeveloperCreditProps) {
  const credit = (
    <>
      Developed by{' '}
      <Link
        href={DEVELOPER_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="font-medium text-foreground underline-offset-4 transition-colors hover:underline"
      >
        {DEVELOPER_NAME}
      </Link>
    </>
  )

  if (variant === 'compact') {
    return (
      <p className={`text-sm text-muted-foreground ${className}`}>{credit}</p>
    )
  }

  return (
    <footer
      className={`border-t border-border/60 bg-muted/20 py-3 text-center text-xs text-muted-foreground ${className}`}
      aria-label="Developer credit"
    >
      {credit}
    </footer>
  )
}
