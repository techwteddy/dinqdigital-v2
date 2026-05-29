import { Mail, MoreHorizontal } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import type { DashboardTeamMember } from '@/lib/dashboard-types'
const STATUS_VARIANT = {
  active: 'success',
  invited: 'secondary',
  away: 'outline',
} as const

interface TeamMemberListProps {
  members: DashboardTeamMember[]
  showInvite?: boolean
  onInviteClick?: () => void
}

export function TeamMemberList({
  members,
  showInvite,
  onInviteClick,
}: TeamMemberListProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-border">
      <ul className="divide-y divide-border">
        {members.map((member) => {
          const initials = member.name
            .split(' ')
            .map((n) => n[0])
            .join('')
            .slice(0, 2)
            .toUpperCase()

          return (
            <li
              key={member.id}
              className="flex items-center gap-4 bg-card px-4 py-3.5 transition-colors hover:bg-muted/30 sm:px-5"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                {initials}
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-medium">{member.name}</p>
                <p className="flex items-center gap-1 truncate text-xs text-muted-foreground">
                  <Mail className="h-3 w-3 shrink-0" />
                  {member.email}
                </p>
              </div>
              <span className="hidden text-sm text-muted-foreground sm:inline">
                {member.role}
              </span>
              <Badge
                variant={STATUS_VARIANT[member.status]}
                className="capitalize"
              >
                {member.status}
              </Badge>
              <Button
                variant="ghost"
                size="icon"
                className="shrink-0"
                aria-label={`Options for ${member.name}`}
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </li>
          )
        })}
      </ul>
      {showInvite && (
        <div className="border-t border-border bg-muted/20 px-4 py-3 sm:px-5">
          <Button
            variant="outline"
            size="sm"
            className="w-full sm:w-auto"
            onClick={onInviteClick}
            type="button"
          >
            Invite team member
          </Button>
        </div>
      )}
    </div>
  )
}
