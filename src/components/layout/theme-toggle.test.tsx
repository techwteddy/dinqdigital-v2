import { fireEvent, render, screen } from '@testing-library/react'
import { ThemeToggle } from './theme-toggle'

const mockSetTheme = jest.fn()

jest.mock('next-themes', () => ({
  useTheme: () => ({
    setTheme: mockSetTheme,
    resolvedTheme: 'light',
  }),
}))

describe('ThemeToggle', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('toggles theme after mount', async () => {
    render(<ThemeToggle />)
    await screen.findByLabelText(/switch to dark mode/i)
    fireEvent.click(screen.getByRole('button'))
    expect(mockSetTheme).toHaveBeenCalledWith('dark')
  })
})
