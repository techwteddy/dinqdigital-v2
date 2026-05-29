import { Globe, Plug, Webhook, Zap } from 'lucide-react'
import { SectionHeading } from '@/components/marketing/section-heading'

const INTEGRATIONS = [
  { icon: Plug, name: 'Slack', color: 'text-[#4A154B]' },
  { icon: Zap, name: 'Stripe', color: 'text-[#635BFF]' },
  { icon: Globe, name: 'Google', color: 'text-[#4285F4]' },
  { icon: Webhook, name: 'Webhooks', color: 'text-primary' },
]

export function IntegrationsSection() {
  return (
    <section className="border-b border-border bg-muted/20 py-20 md:py-24">
      <div className="container">
        <SectionHeading
          eyebrow="Integrations"
          title="Connects with the tools you already use"
          description="Sync data in real time and trigger workflows from your existing stack."
        />
        <div className="mx-auto grid max-w-3xl grid-cols-2 gap-4 sm:grid-cols-4">
          {INTEGRATIONS.map(({ icon: Icon, name, color }) => (
            <div
              key={name}
              className="flex flex-col items-center gap-3 rounded-xl border border-border bg-card p-6 shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-muted">
                <Icon className={`h-6 w-6 ${color}`} />
              </div>
              <span className="text-sm font-medium">{name}</span>
            </div>
          ))}
        </div>
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          {['Notion', 'HubSpot', 'Linear', 'GitHub', 'Zapier', 'Figma'].map(
            (tool) => (
              <span
                key={tool}
                className="rounded-full border border-border bg-background px-4 py-1.5 text-xs font-medium text-muted-foreground"
              >
                {tool}
              </span>
            )
          )}
        </div>
      </div>
    </section>
  )
}
