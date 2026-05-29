import { render, screen, act } from '@testing-library/react'
import { Toaster } from './toaster'
import { toast } from '@/hooks/use-toast'

describe('Toaster', () => {
  beforeEach(() => {
    act(() => {
      toast({ title: 'Test toast', description: 'Details' })
    })
  })

  it('renders active toasts', () => {
    render(<Toaster />)
    expect(screen.getByText('Test toast')).toBeInTheDocument()
    expect(screen.getByText('Details')).toBeInTheDocument()
  })
})
