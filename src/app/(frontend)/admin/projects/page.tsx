'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  DragDropContext,
  Draggable,
  Droppable,
  type DropResult,
} from '@hello-pangea/dnd'
import { Briefcase } from 'lucide-react'
import { DashboardPageHeader } from '@/components/dashboard/dashboard-page-header'
import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { cn } from '@/lib/utils'

type ProjectStatus =
  | 'discovery'
  | 'design'
  | 'dev'
  | 'qa'
  | 'launch'
  | 'complete'

type ProjectCard = {
  id: string
  clientName: string
  orgId: string
  status: ProjectStatus
  startDate?: string | null
  value?: number | null
}

const COLUMNS: Array<{ key: ProjectStatus; label: string }> = [
  { key: 'discovery', label: 'Discovery' },
  { key: 'design', label: 'Design' },
  { key: 'dev', label: 'Dev' },
  { key: 'qa', label: 'QA' },
  { key: 'launch', label: 'Launch' },
  { key: 'complete', label: 'Complete' },
]

function formatValue(value?: number | null): string {
  if (value == null || Number.isNaN(value)) return '—'
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value)
}

function formatStartDate(date?: string | null): string {
  if (!date) return '—'
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  })
}

function normalizeStatus(status?: string | null): ProjectStatus {
  const match = COLUMNS.find((column) => column.key === status)
  return match?.key ?? 'discovery'
}

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<ProjectCard[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadProjects = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch('/api/projects?limit=100&depth=0')
      if (!response.ok) throw new Error('Failed to load projects')
      const data = (await response.json()) as {
        docs?: Array<{
          id?: string | number
          clientName?: string | null
          orgId?: string | null
          status?: string | null
          startDate?: string | null
          value?: number | null
        }>
      }

      setProjects(
        (data.docs ?? []).map((doc) => ({
          id: String(doc.id),
          clientName: doc.clientName?.trim() || 'Untitled project',
          orgId: doc.orgId?.trim() || '—',
          status: normalizeStatus(doc.status),
          startDate: doc.startDate,
          value: doc.value,
        }))
      )
    } catch {
      setError('Could not load projects. Try again.')
      setProjects([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void loadProjects()
  }, [loadProjects])

  const columns = useMemo(
    () =>
      COLUMNS.map((column) => ({
        ...column,
        projects: projects.filter((project) => project.status === column.key),
      })),
    [projects]
  )

  async function handleDragEnd(result: DropResult) {
    const { destination, source, draggableId } = result
    if (!destination) return
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return
    }

    const nextStatus = normalizeStatus(destination.droppableId)
    const previous = projects

    setProjects((current) =>
      current.map((project) =>
        project.id === draggableId
          ? { ...project, status: nextStatus }
          : project
      )
    )

    try {
      const response = await fetch(`/api/projects/${draggableId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStatus }),
      })
      if (!response.ok) throw new Error('Failed to update project')
    } catch {
      setProjects(previous)
      setError('Could not update project status. Changes were reverted.')
    }
  }

  return (
    <div className="flex flex-col gap-8">
      <DashboardPageHeader
        title="Projects"
        description="Drag projects across stages as work moves from discovery to launch."
        action={{
          label: '+ New Project',
          href: '/cms/collections/projects',
        }}
      />

      {error && (
        <p className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {error}
        </p>
      )}

      {loading ? (
        <Card className="border-dashed">
          <CardContent className="py-14 text-center text-sm text-muted-foreground">
            Loading projects…
          </CardContent>
        </Card>
      ) : projects.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center py-14 text-center">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
              <Briefcase className="h-7 w-7 text-primary" />
            </div>
            <CardTitle className="mb-2">No projects yet</CardTitle>
            <CardDescription className="max-w-md">
              Create a project in Payload CMS to start tracking work on this
              board.
            </CardDescription>
          </CardContent>
        </Card>
      ) : (
        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
            {columns.map((column) => (
              <div key={column.key} className="flex flex-col gap-3">
                <div className="flex items-center justify-between px-1">
                  <h2 className="text-sm font-semibold">{column.label}</h2>
                  <Badge variant="secondary">{column.projects.length}</Badge>
                </div>

                <Droppable droppableId={column.key}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={cn(
                        'flex min-h-[220px] flex-col gap-3 rounded-xl border border-border bg-muted/20 p-3 transition-colors',
                        snapshot.isDraggingOver && 'border-primary/40 bg-primary/5'
                      )}
                    >
                      {column.projects.length === 0 && (
                        <p className="px-1 py-8 text-center text-xs text-muted-foreground">
                          No projects
                        </p>
                      )}

                      {column.projects.map((project, index) => (
                        <Draggable
                          key={project.id}
                          draggableId={project.id}
                          index={index}
                        >
                          {(dragProvided, dragSnapshot) => (
                            <Card
                              ref={dragProvided.innerRef}
                              {...dragProvided.draggableProps}
                              {...dragProvided.dragHandleProps}
                              className={cn(
                                'transition-all hover:border-primary/20 hover:shadow-md',
                                dragSnapshot.isDragging &&
                                  'border-primary shadow-lg'
                              )}
                            >
                              <CardHeader className="pb-2">
                                <CardTitle className="text-base font-bold">
                                  {project.clientName}
                                </CardTitle>
                              </CardHeader>
                              <CardContent className="space-y-1 text-xs text-muted-foreground">
                                <p className="text-sm font-semibold text-foreground">
                                  {formatValue(project.value)}
                                </p>
                                <p>{formatStartDate(project.startDate)}</p>
                                <p className="truncate text-[11px] text-muted-foreground">
                                  {project.orgId}
                                </p>
                              </CardContent>
                            </Card>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            ))}
          </div>
        </DragDropContext>
      )}
    </div>
  )
}
