"use client"

import { useEffect, useMemo, useState } from "react"

import {
  Plus,
  Search,
  LayoutGrid,
  List,
  Calendar,
  DollarSign,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  Loader2,
  FolderKanban,
  TrendingUp,
  CheckCircle2,
  Clock3,
} from "lucide-react"

import { api } from "@/lib/api"
import { cn } from "@/lib/utils"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

import { toast } from "sonner"

type ProjectStatus =
  | "Not Started"
  | "In Progress"
  | "Review"
  | "Completed"

interface Project {
  id: number
  name: string
  description: string
  client: string
  clientInitials: string
  status: ProjectStatus
  progress: number
  budget: string
  spent: string
  startDate: string
  dueDate: string
  tasks: {
    completed: number
    total: number
  }
}

const statusColumns = [
  {
    status: "Not Started" as ProjectStatus,
    label: "Not Started",
    color: "bg-muted",
  },
  {
    status: "In Progress" as ProjectStatus,
    label: "In Progress",
    color: "bg-primary",
  },
  {
    status: "Review" as ProjectStatus,
    label: "Review",
    color: "bg-yellow-500",
  },
  {
    status: "Completed" as ProjectStatus,
    label: "Completed",
    color: "bg-green-500",
  },
]

const statusStyles: Record<ProjectStatus, string> = {
  "Not Started":
    "bg-muted text-muted-foreground border-border",

  "In Progress":
    "bg-primary/10 text-primary border-primary/20",

  Review:
    "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",

  Completed:
    "bg-green-500/10 text-green-600 border-green-500/20",
}

function formatProject(project: any): Project {

  const validStatuses: ProjectStatus[] = [
    "Not Started",
    "In Progress",
    "Review",
    "Completed",
  ]

  const safeStatus: ProjectStatus =
    validStatuses.includes(project?.status)
      ? project.status
      : "Not Started"

  return {
    id: Number(project?.id || 0),

    name:
      project?.name || "Untitled Project",

    description:
      project?.description ||
      "No description",

    client:
      project?.client ||
      project?.client_name ||
      "Unknown Client",

    clientInitials:
      (
        project?.client ||
        project?.client_name ||
        "CL"
      )
        .slice(0, 2)
        .toUpperCase(),

    status: safeStatus,

    progress:
      Number(project?.progress ?? 0),

    budget: `$${Number(project?.budget ?? 0)}`,

    spent: `$${Number(project?.spent ?? 0)}`,

    startDate:
      project?.startDate ||
      project?.starts_on ||
      "N/A",

    dueDate:
      project?.dueDate ||
      project?.ends_on ||
      "N/A",

    tasks: {
      completed: Number(
        project?.completedTasks ?? 0
      ),

      total: Number(
        project?.totalTasks ?? 0
      ),
    },
  }
}

function StatsCard({
  title,
  value,
  icon: Icon,
}: {
  title: string
  value: string | number
  icon: any
}) {
  return (
    <Card>
      <CardContent className="p-5 flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">
            {title}
          </p>

          <h3 className="text-2xl font-bold mt-1">
            {value}
          </h3>
        </div>

        <div className="h-11 w-11 rounded-xl bg-primary/10 flex items-center justify-center">
          <Icon className="h-5 w-5 text-primary" />
        </div>
      </CardContent>
    </Card>
  )
}

function ProjectCard({
  project,
  onDelete,
  onEdit,
}: {
  project: Project
  onDelete: (id: number) => void
  onEdit: (project: Project) => void
}) {
  return (
    <Card className="group hover:shadow-lg transition-all duration-300 border-border/60">

      <CardHeader className="pb-3">

        <div className="flex items-start justify-between gap-3">

          <div className="space-y-1 min-w-0">

            <h3 className="font-semibold text-foreground leading-tight truncate">
              {project.name}
            </h3>

            <p className="text-sm text-muted-foreground line-clamp-2">
              {project.description}
            </p>

          </div>

          <DropdownMenu>

            <DropdownMenuTrigger asChild>

              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>

            </DropdownMenuTrigger>

            <DropdownMenuContent align="end">

              <DropdownMenuItem>
                <Eye className="h-4 w-4 mr-2" />
                View Details
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={() => onEdit(project)}
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem
                className="text-destructive"
                onClick={() => onDelete(project.id)}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>

            </DropdownMenuContent>

          </DropdownMenu>

        </div>

      </CardHeader>

      <CardContent className="space-y-5">

        <div className="flex items-center justify-between">

          <div className="flex items-center gap-2 min-w-0">

            <Avatar className="h-7 w-7">

              <AvatarFallback className="bg-primary/10 text-primary text-xs font-medium">
                {project.clientInitials}
              </AvatarFallback>

            </Avatar>

            <span className="text-sm text-muted-foreground truncate">
              {project.client}
            </span>

          </div>

          <Badge
            variant="outline"
            className={cn(
              "text-xs",
              statusStyles[project.status]
            )}
          >
            {project.status}
          </Badge>

        </div>

        <div className="space-y-2">

          <div className="flex items-center justify-between text-sm">

            <span className="text-muted-foreground">
              Progress
            </span>

            <span className="font-medium text-foreground">
              {project.progress}%
            </span>

          </div>

          <Progress
            value={project.progress}
            className="h-2"
          />

        </div>

        <div className="grid grid-cols-2 gap-3">

          <div className="rounded-xl border p-3">

            <div className="flex items-center gap-1 text-muted-foreground text-xs mb-1">
              <DollarSign className="h-3 w-3" />
              Budget
            </div>

            <p className="font-semibold">
              {project.budget}
            </p>

          </div>

          <div className="rounded-xl border p-3">

            <div className="flex items-center gap-1 text-muted-foreground text-xs mb-1">
              <Calendar className="h-3 w-3" />
              Due Date
            </div>

            <p className="font-semibold text-sm">
              {project.dueDate}
            </p>

          </div>

        </div>

        <div className="text-xs text-muted-foreground">
          {project.tasks.completed}/
          {project.tasks.total} tasks completed
        </div>

      </CardContent>

    </Card>
  )
}

export default function ProjectsPage() {

  const [projects, setProjects] =
    useState<Project[]>([])

  const [loading, setLoading] =
    useState(true)

  const [viewMode, setViewMode] =
    useState<"kanban" | "list">("kanban")

  const [searchQuery, setSearchQuery] =
    useState("")

  const [dialogOpen, setDialogOpen] =
    useState(false)

  const [editingProject, setEditingProject] =
    useState<Project | null>(null)

  const [name, setName] = useState("")
  const [description, setDescription] =
    useState("")
  const [client, setClient] = useState("")
  const [budget, setBudget] = useState("")
  const [startDate, setStartDate] =
    useState("")
  const [dueDate, setDueDate] =
    useState("")

  useEffect(() => {

  let mounted = true

  const fetchProjects = async () => {

    try {

      setLoading(true)

      const token =
        localStorage.getItem("token")

      if (!token) {

        console.warn("No token found")

        if (mounted) {
          setProjects([])
        }

        return
      }

      const res = await api.get("/projects", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      const data = Array.isArray(res.data)
        ? res.data
        : []

      if (mounted) {

        setProjects(
          data.map((project: any) =>
            formatProject(project)
          )
        )
      }

    } catch (err: any) {

      console.error(
        "Fetch projects error:",
        err?.response?.data || err.message
      )

      if (mounted) {

        setProjects([])

        toast.error(
          "Could not load projects"
        )
      }

    } finally {

      if (mounted) {
        setLoading(false)
      }
    }
  }

  fetchProjects()

  return () => {
    mounted = false
  }

}, [])

  const resetForm = () => {

    setName("")
    setDescription("")
    setClient("")
    setBudget("")
    setStartDate("")
    setDueDate("")
  }

  const handleCreateProject = async () => {

  try {

    const token =
      localStorage.getItem("token")

    const res = await api.post(
      "/projects",
      {
        name,
        description,
        client_name: client,
        budget: Number(budget),
        starts_on: startDate
  ? startDate.slice(0, 10)
  : null,

ends_on: dueDate
  ? dueDate.slice(0, 10)
  : null,
        status: "active",
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )

    const newProject =
      formatProject(res.data)

    setProjects((prev) => [
      newProject,
      ...prev,
    ])

    toast.success(
      "Project created successfully"
    )

    setDialogOpen(false)

    resetForm()

  } catch (err: any) {

    console.error(
      "Create project error:",
      err.response?.data || err
    )

    toast.error(
      err.response?.data?.error ||
      "Failed to create project"
    )
  }
}

  const handleDeleteProject = async (
    id: number
  ) => {

    try {

      const token =
        localStorage.getItem("token")

      await api.delete(`/projects/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      setProjects((prev) =>
        prev.filter(
          (project) => project.id !== id
        )
      )

      toast.success(
        "Project deleted successfully"
      )

    } catch (err) {

      console.error(
        "Delete project error:",
        err
      )

      toast.error(
        "Failed to delete project"
      )
    }
  }

  const openEditDialog = (
    project: Project
  ) => {

    setEditingProject(project)

    setName(project.name)

    setDescription(project.description)

    setClient(project.client)

    setBudget(
      project.budget.replace("$", "")
    )

    setStartDate(project.startDate)

    setDueDate(project.dueDate)
  }

  const handleEditProject = async () => {

  if (!editingProject) return

  try {

    const token =
      localStorage.getItem("token")

    const res = await api.patch(
      `/projects/${editingProject.id}`,
      {
        name,
        description,
        client_name: client,
        budget: Number(budget),
       starts_on: startDate
  ? startDate.slice(0, 10)
  : null,

ends_on: dueDate
  ? dueDate.slice(0, 10)
  : null,
        status: "active",

      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )

    const updatedProject =
      formatProject(res.data)

    setProjects((prev) =>
      prev.map((project) =>
        project.id === editingProject.id
          ? updatedProject
          : project
      )
    )

    toast.success(
      "Project updated successfully"
    )

    setEditingProject(null)

    setDialogOpen(false)

    resetForm()

  } catch (err: any) {

    console.error(
      "REAL EDIT ERROR:",
      err.response?.data || err
    )

    toast.error(
      err.response?.data?.error ||
      "Failed to update project"
    )
  }
}

  const filteredProjects = useMemo(
    () =>
      projects.filter(
        (project) =>
          project.name
            .toLowerCase()
            .includes(
              searchQuery.toLowerCase()
            ) ||

          project.client
            .toLowerCase()
            .includes(
              searchQuery.toLowerCase()
            )
      ),
    [projects, searchQuery]
  )

  const totalBudget = useMemo(() => {

    return filteredProjects.reduce(
      (acc, project) =>
        acc +
        Number(
          project.budget.replace("$", "")
        ),
      0
    )

  }, [filteredProjects])

  const completedProjects =
    filteredProjects.filter(
      (project) =>
        project.status === "Completed"
    ).length

  const inProgressProjects =
    filteredProjects.filter(
      (project) =>
        project.status === "In Progress"
    ).length

  const getProjectsByStatus = (
    status: ProjectStatus
  ) =>
    filteredProjects.filter(
      (project) =>
        project.status === status
    )

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

        <div>

          <h1 className="text-3xl font-bold tracking-tight">
            Projects
          </h1>

          <p className="text-muted-foreground mt-1">
            Track and manage all your freelance projects.
          </p>

        </div>

        <Dialog
          open={dialogOpen || !!editingProject}
          onOpenChange={(open) => {

            setDialogOpen(open)

            if (!open) {
              setEditingProject(null)
              resetForm()
            }
          }}
        >

          <DialogTrigger asChild>

            <Button
              onClick={() => {
                setEditingProject(null)
                resetForm()
                setDialogOpen(true)
              }}
            >

              <Plus className="h-4 w-4 mr-2" />

              New Project

            </Button>

          </DialogTrigger>

          <DialogContent className="sm:max-w-[550px]">

            <DialogHeader>

              <DialogTitle>
                {editingProject
                  ? "Edit Project"
                  : "Create New Project"}
              </DialogTitle>

              <DialogDescription>
                Fill project information below.
              </DialogDescription>

            </DialogHeader>

            <div className="grid gap-4 py-4">

              <div className="space-y-2">

                <Label>
                  Project Name
                </Label>

                <Input
                  value={name}
                  onChange={(e) =>
                    setName(e.target.value)
                  }
                  placeholder="Project name"
                />

              </div>

              <div className="space-y-2">

                <Label>
                  Description
                </Label>

                <Textarea
                  value={description}
                  onChange={(e) =>
                    setDescription(
                      e.target.value
                    )
                  }
                  placeholder="Project description"
                />

              </div>

              <div className="grid grid-cols-2 gap-4">

                <div className="space-y-2">

                  <Label>
                    Client
                  </Label>

                  <Input
                    value={client}
                    onChange={(e) =>
                      setClient(e.target.value)
                    }
                    placeholder="Client name"
                  />

                </div>

                <div className="space-y-2">

                  <Label>
                    Budget
                  </Label>

                  <Input
                    type="number"
                    value={budget}
                    onChange={(e) =>
                      setBudget(e.target.value)
                    }
                    placeholder="0"
                  />

                </div>

              </div>

              <div className="grid grid-cols-2 gap-4">

                <div className="space-y-2">

                  <Label>
                    Start Date
                  </Label>

                  <Input
                    type="date"
                    value={startDate}
                    onChange={(e) =>
                      setStartDate(
                        e.target.value
                      )
                    }
                  />

                </div>

                <div className="space-y-2">

                  <Label>
                    Due Date
                  </Label>

                  <Input
                    type="date"
                    value={dueDate}
                    onChange={(e) =>
                      setDueDate(
                        e.target.value
                      )
                    }
                  />

                </div>

              </div>

            </div>

            <DialogFooter>

              <Button
                variant="outline"
                onClick={() => {

                  setDialogOpen(false)

                  setEditingProject(null)

                  resetForm()
                }}
              >
                Cancel
              </Button>

              <Button
                onClick={
                  editingProject
                    ? handleEditProject
                    : handleCreateProject
                }
              >
                {editingProject
                  ? "Save Changes"
                  : "Create Project"}
              </Button>

            </DialogFooter>

          </DialogContent>

        </Dialog>

      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">

        <StatsCard
          title="Total Projects"
          value={filteredProjects.length}
          icon={FolderKanban}
        />

        <StatsCard
          title="In Progress"
          value={inProgressProjects}
          icon={TrendingUp}
        />

        <StatsCard
          title="Completed"
          value={completedProjects}
          icon={CheckCircle2}
        />

        <StatsCard
          title="Total Budget"
          value={`$${totalBudget}`}
          icon={Clock3}
        />

      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">

        <div className="relative w-full sm:max-w-md">

          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

          <Input
            placeholder="Search projects..."
            value={searchQuery}
            onChange={(e) =>
              setSearchQuery(e.target.value)
            }
            className="pl-9"
          />

        </div>

        <div className="flex items-center gap-2">

          <Button
            variant={
              viewMode === "kanban"
                ? "default"
                : "outline"
            }
            size="sm"
            onClick={() =>
              setViewMode("kanban")
            }
          >

            <LayoutGrid className="h-4 w-4 mr-2" />

            Kanban

          </Button>

          <Button
            variant={
              viewMode === "list"
                ? "default"
                : "outline"
            }
            size="sm"
            onClick={() =>
              setViewMode("list")
            }
          >

            <List className="h-4 w-4 mr-2" />

            List

          </Button>

        </div>

      </div>

      {/* Kanban View */}
      {viewMode === "kanban" && (

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">

          {statusColumns.map((column) => (

            <div
              key={column.status}
              className="space-y-4"
            >

              <div className="flex items-center gap-2">

                <div
                  className={cn(
                    "h-2 w-2 rounded-full",
                    column.color
                  )}
                />

                <h2 className="font-semibold text-foreground">
                  {column.label}
                </h2>

                <Badge
                  variant="secondary"
                  className="ml-auto"
                >
                  {
                    getProjectsByStatus(
                      column.status
                    ).length
                  }
                </Badge>

              </div>

              <div className="space-y-3">

                {getProjectsByStatus(
                  column.status
                ).map((project) => (

                  <ProjectCard
                    key={project.id}
                    project={project}
                    onDelete={
                      handleDeleteProject
                    }
                    onEdit={
                      openEditDialog
                    }
                  />

                ))}

              </div>

            </div>

          ))}

        </div>

      )}

      {/* List View */}
      {viewMode === "list" && (

        <div className="grid gap-4">

          {filteredProjects.map((project) => (

            <Card
              key={project.id}
              className="hover:shadow-md transition-all"
            >

              <CardContent className="p-5">

                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">

                  <div className="space-y-2">

                    <div className="flex items-center gap-3">

                      <Avatar className="h-9 w-9">

                        <AvatarFallback className="bg-primary/10 text-primary">
                          {project.clientInitials}
                        </AvatarFallback>

                      </Avatar>

                      <div>

                        <h3 className="font-semibold">
                          {project.name}
                        </h3>

                        <p className="text-sm text-muted-foreground">
                          {project.client}
                        </p>

                      </div>

                    </div>

                    <p className="text-sm text-muted-foreground">
                      {project.description}
                    </p>

                  </div>

                  <div className="flex items-center gap-2">

                    <Badge
                      variant="outline"
                      className={cn(
                        statusStyles[
                          project.status
                        ]
                      )}
                    >
                      {project.status}
                    </Badge>

                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        openEditDialog(
                          project
                        )
                      }
                    >
                      <Edit className="h-4 w-4" />
                    </Button>

                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() =>
                        handleDeleteProject(
                          project.id
                        )
                      }
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>

                  </div>

                </div>

              </CardContent>

            </Card>

          ))}

        </div>

      )}

      {/* Empty State */}
      {filteredProjects.length === 0 && (

        <Card>

          <CardContent className="py-16 text-center">

            <FolderKanban className="h-12 w-12 mx-auto text-muted-foreground mb-4" />

            <h3 className="text-lg font-semibold">
              No Projects Found
            </h3>

            <p className="text-muted-foreground mt-1">
              Try changing your search or create a new project.
            </p>

          </CardContent>

        </Card>

      )}

    </div>
  )
}