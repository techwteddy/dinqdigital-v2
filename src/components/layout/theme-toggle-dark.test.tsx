import { fireEvent, render, screen } from '@testing-library/react'

const mockSetTheme = jest.fn()

jest.mock('next-themes', () => ({
  useTheme: () => ({
    setTheme: mockSetTheme,
    resolvedTheme: 'dark',
  }),
}))

import { ThemeToggle } from './theme-toggle'

describe('ThemeToggle dark mode', () => {
  it('switches to light mode when dark', async () => {
    render(<ThemeToggle />)
    await screen.findByLabelText(/switch to light mode/i)
    fireEvent.click(screen.getByRole('button'))
    expect(mockSetTheme).toHaveBeenCalledWith('light')
  })
})
