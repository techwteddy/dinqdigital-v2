import { fireEvent, render, screen } from '@testing-library/react'
import { CtaSection } from './cta-section'
import { FaqSection } from './faq-section'
import { FeaturesSection } from './features-section'
import { HeroSection } from './hero-section'
import { HowItWorksSection } from './how-it-works-section'
import { IntegrationsSection } from './integrations-section'
import { LogoCloud } from './logo-cloud'
import { PricingSection } from './pricing-section'
import { ProductShowcase } from './product-showcase'
import { StatsBar } from './stats-bar'
import { TestimonialsSection } from './testimonials-section'
import { SectionHeading } from './section-heading'

describe('marketing sections', () => {
  it('renders HeroSection with demo visual', () => {
    render(<HeroSection />)
    expect(
      screen.getByRole('heading', {
        name: /the smarter way to run, grow, and scale your business/i,
      })
    ).toBeInTheDocument()
    expect(
      screen.getByRole('link', { name: /start free trial/i })
    ).toBeInTheDocument()
    expect(
      screen.getByRole('link', { name: /view live demo/i })
    ).toHaveAttribute('href', '/demo')
  })

  it('renders StatsBar, LogoCloud, and IntegrationsSection', () => {
    render(<StatsBar />)
    expect(screen.getByText('12,000+')).toBeInTheDocument()

    render(<LogoCloud />)
    expect(screen.getByText('Stripe')).toBeInTheDocument()

    render(<IntegrationsSection />)
    expect(screen.getAllByText('Slack').length).toBeGreaterThan(0)
    expect(screen.getByText('Zapier')).toBeInTheDocument()
  })

  it('renders features, showcase, and how-it-works', () => {
    render(<FeaturesSection />)
    expect(screen.getByText('Real-time analytics')).toBeInTheDocument()

    render(<ProductShowcase />)
    expect(screen.getByText('Unified dashboard')).toBeInTheDocument()

    render(<HowItWorksSection />)
    expect(screen.getByText('Create your workspace')).toBeInTheDocument()
  })

  it('renders pricing, testimonials, and CTA', () => {
    render(<PricingSection />)
    expect(screen.getByText('Most popular')).toBeInTheDocument()

    render(<TestimonialsSection />)
    expect(screen.getByText(/alex chen/i)).toBeInTheDocument()

    render(<CtaSection />)
    expect(screen.getByText(/ready to transform/i)).toBeInTheDocument()
  })

  it('renders SectionHeading alignments', () => {
    const { rerender } = render(<SectionHeading title="Title" align="left" />)
    expect(screen.getByText('Title')).toBeInTheDocument()
    rerender(<SectionHeading title="Center" eyebrow="Eyebrow" />)
    expect(screen.getByText('Eyebrow')).toBeInTheDocument()
  })

  it('toggles FAQ items', () => {
    render(<FaqSection />)
    expect(
      screen.getByText(/every plan includes a 14-day free trial/i)
    ).toBeInTheDocument()

    const trialButton = screen.getByRole('button', {
      name: /is there a free trial/i,
    })
    fireEvent.click(trialButton)
    expect(
      screen.queryByText(/every plan includes a 14-day free trial/i)
    ).not.toBeInTheDocument()

    fireEvent.click(trialButton)
    expect(
      screen.getByText(/every plan includes a 14-day free trial/i)
    ).toBeInTheDocument()

    fireEvent.click(
      screen.getByRole('button', { name: /can i change plans later/i })
    )
  })
})
