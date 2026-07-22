import { render, screen } from '@testing-library/react'
import DemoLayout, { metadata } from './layout'

jest.mock('@/components/dashboard/dashboard-shell', () => ({
  DashboardShell: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="shell">{children}</div>
  ),
}))

describe('DemoLayout', () => {
  it('wraps children with demo shell', () => {
    render(
      <DemoLayout>
        <p>Demo child</p>
      </DemoLayout>
    )
    expect(screen.getByTestId('shell')).toBeInTheDocument()
    expect(screen.getByText('Demo child')).toBeInTheDocument()
    expect(screen.getByText(/live demo/i)).toBeInTheDocument()
  })

  it('exports metadata', () => {
    expect(metadata.title).toBe('Live Demo')
  })
})
