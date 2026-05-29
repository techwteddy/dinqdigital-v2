import Link from 'next/link'
import { BrandLogo } from '@/components/brand/brand-logo'
import { DeveloperCredit } from '@/components/layout/developer-credit'
import { Separator } from '@/components/ui/separator'
import { FOOTER_LINKS } from '@/lib/marketing'
import { APP_DESCRIPTION, APP_NAME, SHOW_DEVELOPER_CREDIT } from '@/lib/site'

export function MarketingFooter() {
  return (
    <footer className="border-t border-border bg-muted/20">
      <div className="container py-12 md:py-16">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <BrandLogo />
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">
              {APP_DESCRIPTION}
            </p>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold">Product</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              {FOOTER_LINKS.product.map((link) => (
                <li key={link.label}>
                  <FooterLink {...link} />
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold">Legal</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              {FOOTER_LINKS.company.map((link) => (
                <li key={link.label}>
                  <FooterLink {...link} />
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold">Connect</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              {FOOTER_LINKS.connect.map((link) => (
                <li key={link.label}>
                  <FooterLink {...link} />
                </li>
              ))}
            </ul>
          </div>
        </div>

        <Separator className="my-8" />

        <div className="flex flex-col items-center justify-between gap-4 text-sm text-muted-foreground sm:flex-row">
          <p>© {new Date().getFullYear()} {APP_NAME}. Open source · MIT License.</p>
          {SHOW_DEVELOPER_CREDIT && <DeveloperCredit variant="compact" />}
        </div>
      </div>
    </footer>
  )
}

function FooterLink({
  href,
  label,
  external,
}: {
  href: string
  label: string
  external?: boolean
}) {
  const className = 'transition-colors hover:text-foreground'
  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
        {label}
      </a>
    )
  }
  return (
    <Link href={href} className={className}>
      {label}
    </Link>
  )
}
