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
        name: /the smarter way to build, launch, and grow your business/i,
      })
    ).toBeInTheDocument()
    expect(
      screen.getByRole('link', { name: /start a project/i })
    ).toBeInTheDocument()
    expect(
      screen.getByRole('link', { name: /view live demo/i })
    ).toHaveAttribute('href', '/demo')
  })

  it('renders StatsBar, LogoCloud, and IntegrationsSection', () => {
    render(<StatsBar />)
    expect(screen.getByText('25+')).toBeInTheDocument()

    render(<LogoCloud />)
    expect(screen.getByText('Next.js')).toBeInTheDocument()

    render(<IntegrationsSection />)
    expect(screen.getAllByText('Claude AI').length).toBeGreaterThan(0)
    expect(screen.getByText('Zapier')).toBeInTheDocument()
  })

  it('renders features, showcase, and how-it-works', () => {
    render(<FeaturesSection />)
    expect(screen.getByText('Premium Web Design')).toBeInTheDocument()

    render(<ProductShowcase />)
    expect(screen.getByText('Unified Dashboard')).toBeInTheDocument()

    render(<HowItWorksSection />)
    expect(screen.getByText('Start your project')).toBeInTheDocument()
  })

  it('renders pricing, testimonials, and CTA', () => {
    render(<PricingSection />)
    expect(screen.getByText('Most popular')).toBeInTheDocument()

    render(<TestimonialsSection />)
    expect(screen.getByText(/nice braids/i)).toBeInTheDocument()

    render(<CtaSection />)
    expect(
      screen.getByText(/ready to build something great/i)
    ).toBeInTheDocument()
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
      screen.getByText(/every website we build is 100% custom/i)
    ).toBeInTheDocument()

    const websitesButton = screen.getByRole('button', {
      name: /do you build custom websites/i,
    })
    fireEvent.click(websitesButton)
    expect(
      screen.getByText(/every website we build is 100% custom/i)
    ).not.toBeVisible()

    fireEvent.click(websitesButton)
    expect(
      screen.getByText(/every website we build is 100% custom/i)
    ).toBeVisible()

    fireEvent.click(screen.getByRole('button', { name: /what is dinqplus/i }))
  })
})
