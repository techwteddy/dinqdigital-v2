export interface DashboardMetric {
  label: string
  value: string
  change: string
  up: boolean
}

export interface DashboardChartPoint {
  label: string
  value: number
}

export interface DashboardActivityItem {
  id: string
  action: string
  user: string
  time: string
  type: 'success' | 'info' | 'warning'
}

export interface DashboardTeamMember {
  id: string
  name: string
  email: string
  role: string
  status: 'active' | 'invited' | 'away'
  avatar?: string
}

export interface DashboardInvoice {
  id: string
  date: string
  amount: string
  status: 'paid' | 'pending' | 'failed'
  description: string
}
