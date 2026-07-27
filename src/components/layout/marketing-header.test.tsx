import { fireEvent, render, screen, within } from '@testing-library/react'
import { StartProjectProvider } from '@/components/marketing/start-project-provider'
import { MarketingHeader } from './marketing-header'

jest.mock('@/components/layout/theme-toggle', () => ({
  ThemeToggle: () => <button type="button">Theme</button>,
}))

function renderHeader() {
  return render(
    <StartProjectProvider>
      <MarketingHeader />
    </StartProjectProvider>
  )
}

describe('MarketingHeader', () => {
  it('renders navigation links', () => {
    renderHeader()
    expect(
      screen.getAllByRole('link', { name: /services/i })[0]
    ).toHaveAttribute('href', '#features')
    expect(
      screen.getAllByRole('link', { name: /view demo/i })[0]
    ).toHaveAttribute('href', '/demo')
    expect(
      screen.getByRole('button', { name: /start a project/i })
    ).toBeInTheDocument()
  })

  it('opens quote modal from Start a Project', () => {
    renderHeader()
    fireEvent.click(screen.getByRole('button', { name: /start a project/i }))
    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /send my project details/i })
    ).toBeInTheDocument()
  })

  it('toggles mobile navigation and closes via nav actions', () => {
    renderHeader()
    fireEvent.click(screen.getByLabelText(/open menu/i))
    expect(screen.getByLabelText(/close menu/i)).toBeInTheDocument()

    const [, mobileNav] = screen.getAllByRole('navigation')
    const mobile = within(mobileNav)

    fireEvent.click(mobile.getByRole('link', { name: /^services$/i }))
    fireEvent.click(screen.getByLabelText(/open menu/i))

    fireEvent.click(mobile.getByRole('link', { name: /^dinqplus$/i }))
    fireEvent.click(screen.getByLabelText(/open menu/i))

    fireEvent.click(mobile.getByRole('link', { name: /^pricing$/i }))
    fireEvent.click(screen.getByLabelText(/open menu/i))

    fireEvent.click(mobile.getByRole('link', { name: /^faq$/i }))
    fireEvent.click(screen.getByLabelText(/open menu/i))

    fireEvent.click(mobile.getByRole('link', { name: /view demo/i }))
    fireEvent.click(screen.getByLabelText(/open menu/i))

    fireEvent.click(mobile.getByRole('link', { name: /client login/i }))
    fireEvent.click(screen.getByLabelText(/open menu/i))
    fireEvent.click(screen.getByLabelText(/close menu/i))
  })
})
