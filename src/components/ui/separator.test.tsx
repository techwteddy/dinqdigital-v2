import { render } from '@testing-library/react'
import { Separator } from './separator'

describe('Separator', () => {
  it('renders horizontal separator by default', () => {
    const { container } = render(<Separator />)
    expect(container.firstChild).toHaveClass('h-[1px]')
  })

  it('renders vertical separator', () => {
    const { container } = render(<Separator orientation="vertical" decorative={false} />)
    expect(container.firstChild).toHaveClass('w-[1px]')
  })
})
