import { CreditCard, Users } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

export interface WorkspaceCard {
  id: string
  name: string
  role: string
  members: number
  planLabel: string
  active: boolean
  renewsLabel?: string
}

interface OrgWorkspaceGridProps {
  workspaces: WorkspaceCard[]
  title?: string
}

export function OrgWorkspaceGrid({
  workspaces,
  title = 'Your workspaces',
}: OrgWorkspaceGridProps) {
  if (workspaces.length === 0) return null

  return (
    <div>
      <h2 className="mb-4 text-lg font-semibold">{title}</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {workspaces.map((org) => (
          <Card
            key={org.id}
            className="transition-all hover:border-primary/20 hover:shadow-md"
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-2">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-lg font-bold text-primary">
                  {org.name[0]?.toUpperCase()}
                </div>
                <Badge variant={org.active ? 'success' : 'secondary'}>
                  {org.planLabel}
                </Badge>
              </div>
              <CardTitle className="text-lg">{org.name}</CardTitle>
              <CardDescription className="capitalize">
                Role: {org.role}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Users className="h-3.5 w-3.5" />
                  {org.members} member{org.members !== 1 ? 's' : ''}
                </span>
                {org.renewsLabel && (
                  <span className="flex items-center gap-1">
                    <CreditCard className="h-3.5 w-3.5" />
                    {org.renewsLabel}
                  </span>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
