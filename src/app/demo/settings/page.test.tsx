import { render, screen } from '@testing-library/react'
import DemoSettingsPage from './page'

describe('DemoSettingsPage', () => {
  it('renders demo settings content', () => {
    render(<DemoSettingsPage />)
    expect(screen.getByRole('heading', { name: /settings/i })).toBeInTheDocument()
    expect(screen.getByDisplayValue('Alex Rivera')).toBeInTheDocument()
    expect(screen.getByText('Studio North')).toBeInTheDocument()
  })
})
