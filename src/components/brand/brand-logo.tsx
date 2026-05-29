import Link from 'next/link'
import { Zap } from 'lucide-react'
import { cn } from '@/lib/utils'
import { APP_NAME } from '@/lib/site'

interface BrandLogoProps {
  href?: string
  className?: string
  showText?: boolean
  size?: 'sm' | 'md' | 'lg'
}

const sizeMap = {
  sm: { icon: 'h-4 w-4', text: 'text-base' },
  md: { icon: 'h-5 w-5', text: 'text-lg' },
  lg: { icon: 'h-6 w-6', text: 'text-xl' },
}

export function BrandLogo({
  href = '/',
  className,
  showText = true,
  size = 'md',
}: BrandLogoProps) {
  const sizes = sizeMap[size]

  const content = (
    <>
      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
        <Zap className={cn(sizes.icon, 'text-primary')} aria-hidden />
      </span>
      {showText && (
        <span className={cn('font-semibold tracking-tight', sizes.text)}>
          {APP_NAME}
        </span>
      )}
    </>
  )

  return (
    <Link
      href={href}
      className={cn(
        'flex items-center gap-2.5 transition-opacity hover:opacity-90',
        className
      )}
    >
      {content}
    </Link>
  )
}
