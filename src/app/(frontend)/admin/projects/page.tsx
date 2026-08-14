'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  DndContext,
  PointerSensor,
  closestCorners,
  useDroppable,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core'
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { DashboardPageHeader } from '@/components/dashboard/dashboard-page-header'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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

const STATUS_LABELS: Record<ProjectStatus, string> = {
  discovery: 'Discovery',
  design: 'Design',
  dev: 'Dev',
  qa: 'QA',
  launch: 'Launch',
  complete: 'Complete',
}

function formatValue(value?: number | null): string {
  if (value == null || Number.isNaN(value)) return '—'
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value)
}

function normalizeStatus(status?: string | null): ProjectStatus {
  return COLUMNS.some((column) => column.key === status)
    ? (status as ProjectStatus)
    : 'discovery'
}

function SortableProjectCard({ project }: { project: ProjectCard }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: project.id })

  return (
    <Card
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
      }}
      {...attributes}
      {...listeners}
      className={cn(
        'cursor-grab touch-none transition-all hover:border-primary/20 hover:shadow-md active:cursor-grabbing',
        isDragging && 'border-primary opacity-70 shadow-lg'
      )}
    >
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-bold">
          {project.clientName}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <p className="text-sm font-semibold text-foreground">
          {formatValue(project.value)}
        </p>
        <p className="truncate text-xs text-muted-foreground">{project.orgId}</p>
        <Badge variant="secondary">{STATUS_LABELS[project.status]}</Badge>
      </CardContent>
    </Card>
  )
}

function KanbanColumn({
  status,
  label,
  projects,
}: {
  status: ProjectStatus
  label: string
  projects: ProjectCard[]
}) {
  const { setNodeRef, isOver } = useDroppable({ id: status })

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between px-1">
        <h2 className="text-sm font-semibold">{label}</h2>
        <Badge variant="secondary">{projects.length}</Badge>
      </div>
      <SortableContext
        items={projects.map((project) => project.id)}
        strategy={verticalListSortingStrategy}
      >
        <div
          ref={setNodeRef}
          className={cn(
            'flex min-h-[220px] flex-col gap-3 rounded-xl border border-border bg-muted/20 p-3 transition-colors',
            isOver && 'border-primary/40 bg-primary/5'
          )}
        >
          {projects.length === 0 ? (
            <p className="px-1 py-8 text-center text-xs text-muted-foreground">
              No projects
            </p>
          ) : (
            projects.map((project) => (
              <SortableProjectCard key={project.id} project={project} />
            ))
          )}
        </div>
      </SortableContext>
    </div>
  )
}

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<ProjectCard[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } })
  )

  const loadProjects = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch('/api/projects?limit=100')
      if (!response.ok) throw new Error('Failed to load projects')
      const data = (await response.json()) as {
        docs?: Array<{
          id?: string | number
          clientName?: string | null
          orgId?: string | null
          status?: string | null
          value?: number | null
        }>
      }

      setProjects(
        (data.docs ?? []).map((doc) => ({
          id: String(doc.id),
          clientName: doc.clientName?.trim() || 'Untitled project',
          orgId: doc.orgId?.trim() || '—',
          status: normalizeStatus(doc.status),
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

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (!over) return

    const projectId = String(active.id)
    const overId = String(over.id)
    const nextStatus = COLUMNS.some((column) => column.key === overId)
      ? normalizeStatus(overId)
      : projects.find((project) => project.id === overId)?.status

    if (!nextStatus) return

    const current = projects.find((project) => project.id === projectId)
    if (!current || current.status === nextStatus) return

    const previous = projects
    setProjects((items) =>
      items.map((project) =>
        project.id === projectId ? { ...project, status: nextStatus } : project
      )
    )

    try {
      const response = await fetch(`/api/projects/${projectId}`, {
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
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragEnd={handleDragEnd}
        >
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
            {columns.map((column) => (
              <KanbanColumn
                key={column.key}
                status={column.key}
                label={column.label}
                projects={column.projects}
              />
            ))}
          </div>
        </DndContext>
      )}
    </div>
  )
}
