import { render, screen } from '@testing-library/react'
import RootLayout, { metadata, viewport } from './layout'

jest.mock('@/components/providers/theme-provider', () => ({
  ThemeProvider: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
}))

jest.mock('@/components/ui/toaster', () => ({
  Toaster: () => <div data-testid="toaster" />,
}))

describe('RootLayout', () => {
  it('renders children in layout', () => {
    render(
      <RootLayout>
        <main>Child content</main>
      </RootLayout>
    )
    expect(screen.getByText('Child content')).toBeInTheDocument()
    expect(screen.getByTestId('toaster')).toBeInTheDocument()
  })

  it('exports metadata and viewport', () => {
    expect(metadata.title).toBeDefined()
    expect(viewport.themeColor).toBeDefined()
  })
})
