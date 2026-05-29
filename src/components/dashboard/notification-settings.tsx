'use client'

import { useState } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { cn } from '@/lib/utils'

const PREFS = [
  {
    id: 'weekly',
    label: 'Weekly digest',
    description: 'Summary of activity across workspaces',
  },
  {
    id: 'billing',
    label: 'Billing alerts',
    description: 'Invoices, renewals, and payment issues',
  },
  {
    id: 'team',
    label: 'Team updates',
    description: 'Invites, role changes, and mentions',
  },
  {
    id: 'product',
    label: 'Product news',
    description: 'New features and improvement tips',
  },
] as const

interface NotificationSettingsProps {
  readOnly?: boolean
}

export function NotificationSettings({
  readOnly = false,
}: NotificationSettingsProps) {
  const [enabled, setEnabled] = useState<Record<string, boolean>>({
    weekly: true,
    billing: true,
    team: true,
    product: false,
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Notifications</CardTitle>
        <CardDescription>
          {readOnly
            ? 'Configure email preferences in your live deployment.'
            : 'Toggle what you receive — demo only, not saved.'}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-1">
        {PREFS.map((pref) => (
          <label
            key={pref.id}
            className={cn(
              'flex cursor-pointer items-center justify-between gap-4 rounded-lg border border-transparent px-3 py-3 transition-colors',
              !readOnly && 'hover:border-border hover:bg-muted/40',
              readOnly && 'cursor-default opacity-80'
            )}
          >
            <div>
              <p className="text-sm font-medium">{pref.label}</p>
              <p className="text-xs text-muted-foreground">
                {pref.description}
              </p>
            </div>
            <input
              type="checkbox"
              checked={enabled[pref.id]}
              disabled={readOnly}
              onChange={(e) =>
                setEnabled((prev) => ({
                  ...prev,
                  [pref.id]: e.target.checked,
                }))
              }
              className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
            />
          </label>
        ))}
      </CardContent>
    </Card>
  )
}
