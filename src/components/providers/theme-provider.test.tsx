import { render, screen } from '@testing-library/react'
import { ThemeProvider } from './theme-provider'

jest.mock('next-themes', () => ({
  ThemeProvider: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="theme-provider">{children}</div>
  ),
}))

describe('ThemeProvider', () => {
  it('renders children', () => {
    render(
      <ThemeProvider attribute="class" defaultTheme="system">
        <span>App content</span>
      </ThemeProvider>
    )
    expect(screen.getByTestId('theme-provider')).toBeInTheDocument()
    expect(screen.getByText('App content')).toBeInTheDocument()
  })
})
