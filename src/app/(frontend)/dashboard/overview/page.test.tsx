import { redirect } from 'next/navigation'
import DashboardOverviewPage from './page'

jest.mock('next/navigation', () => ({
  redirect: jest.fn(),
}))

describe('DashboardOverviewPage', () => {
  it('redirects to main dashboard', async () => {
    await DashboardOverviewPage()
    expect(redirect).toHaveBeenCalledWith('/dashboard')
  })
})
