import { render } from '@testing-library/react'
import { DeveloperCredit } from './developer-credit'

describe('DeveloperCredit', () => {
  it('renders nothing', () => {
    const { container } = render(<DeveloperCredit />)
    expect(container).toBeEmptyDOMElement()
  })

  it('renders nothing for compact variant', () => {
    const { container } = render(
      <DeveloperCredit variant="compact" className="mt-4" />
    )
    expect(container).toBeEmptyDOMElement()
  })
})
