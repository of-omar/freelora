"use client"

import { useEffect, useMemo, useState } from "react"

import {
  Plus,
  Search,
  Calendar,
  MoreHorizontal,
  Edit,
  Trash2,
  CheckCircle2,
  Circle,
  Clock,
  Loader2,
} from "lucide-react"

import { api } from "@/lib/api"
import { cn } from "@/lib/utils"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { Checkbox } from "@/components/ui/checkbox"

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

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { Textarea } from "@/components/ui/textarea"

import { toast } from "sonner"

type TaskStatus =
  | "Todo"
  | "In Progress"
  | "Done"

type TaskPriority =
  | "Low"
  | "Medium"
  | "High"
  | "Urgent"

interface Task {
  id: number
  title: string
  description: string
  project: string
  status: TaskStatus
  priority: TaskPriority
  dueDate: string
}

const statusColumns = [
  {
    status: "Todo" as TaskStatus,
    label: "To Do",
    icon: Circle,
    color: "text-muted-foreground",
  },
  {
    status: "In Progress" as TaskStatus,
    label: "In Progress",
    icon: Clock,
    color: "text-primary",
  },
  {
    status: "Done" as TaskStatus,
    label: "Done",
    icon: CheckCircle2,
    color: "text-green-500",
  },
]

const priorityStyles: Record<
  TaskPriority,
  string
> = {
  Low: "bg-muted text-muted-foreground border-border",

  Medium:
    "bg-blue-500/10 text-blue-600 border-blue-500/20",

  High:
    "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",

  Urgent:
    "bg-red-500/10 text-red-600 border-red-500/20",
}

function TaskCard({
  task,
  onDelete,
  onStatusChange,
}: {
  task: Task
  onDelete: (id: number) => void
  onStatusChange: (
    id: number,
    status: TaskStatus
  ) => void
}) {
  return (
    <Card className="group hover:shadow-md transition-all">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">

          <Checkbox
            checked={task.status === "Done"}
            onCheckedChange={(checked) =>
              onStatusChange(
                task.id,
                checked ? "Done" : "Todo"
              )
            }
            className="mt-1"
          />

          <div className="flex-1 space-y-2">

            <div className="flex items-start justify-between gap-2">

              <h4
                className={cn(
                  "font-medium leading-tight",
                  task.status === "Done" &&
                    "line-through text-muted-foreground"
                )}
              >
                {task.title}
              </h4>

              <DropdownMenu>

                <DropdownMenuTrigger asChild>

                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>

                </DropdownMenuTrigger>

                <DropdownMenuContent align="end">

                  <DropdownMenuItem
                    onClick={() =>
                      onStatusChange(
                        task.id,
                        "Todo"
                      )
                    }
                  >
                    Move to Todo
                  </DropdownMenuItem>

                  <DropdownMenuItem
                    onClick={() =>
                      onStatusChange(
                        task.id,
                        "In Progress"
                      )
                    }
                  >
                    Move to In Progress
                  </DropdownMenuItem>

                  <DropdownMenuItem
                    onClick={() =>
                      onStatusChange(
                        task.id,
                        "Done"
                      )
                    }
                  >
                    Mark as Done
                  </DropdownMenuItem>

                  <DropdownMenuSeparator />

                  <DropdownMenuItem>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </DropdownMenuItem>

                  <DropdownMenuItem
                    className="text-destructive"
                    onClick={() =>
                      onDelete(task.id)
                    }
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </DropdownMenuItem>

                </DropdownMenuContent>

              </DropdownMenu>

            </div>

            <p className="text-sm text-muted-foreground">
              {task.description}
            </p>

            <div className="flex items-center flex-wrap gap-2">

              <Badge variant="secondary">
                {task.project}
              </Badge>

              <Badge
                variant="outline"
                className={cn(
                  priorityStyles[
                    task.priority
                  ]
                )}
              >
                {task.priority}
              </Badge>

              <div className="flex items-center gap-1 text-xs text-muted-foreground ml-auto">

                <Calendar className="h-3 w-3" />

                {task.dueDate}

              </div>

            </div>

          </div>

        </div>
      </CardContent>
    </Card>
  )
}

export default function TasksPage() {

  const [tasks, setTasks] =
    useState<Task[]>([])

  const [loading, setLoading] =
    useState(true)

  const [searchQuery, setSearchQuery] =
    useState("")

  const [dialogOpen, setDialogOpen] =
    useState(false)

  const [title, setTitle] =
    useState("")

  const [description, setDescription] =
    useState("")

  const [project, setProject] =
    useState("")

  const [priority, setPriority] =
    useState<TaskPriority>("Medium")

  const [dueDate, setDueDate] =
    useState("")

  useEffect(() => {

    const fetchTasks = async () => {

      try {

        setLoading(true)

        const token =
          localStorage.getItem("token")

        const res = await api.get("/tasks", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        setTasks(res.data)

      } catch (err) {

        console.error(
          "Fetch tasks error:",
          err
        )

        toast.error(
          "Failed to fetch tasks"
        )

      } finally {

        setLoading(false)

      }
    }

    fetchTasks()

  }, [])

  const filteredTasks = useMemo(
    () =>
      tasks.filter(
        (task) =>
          task.title
            .toLowerCase()
            .includes(
              searchQuery.toLowerCase()
            ) ||

          task.project
            .toLowerCase()
            .includes(
              searchQuery.toLowerCase()
            )
      ),
    [tasks, searchQuery]
  )

  const getTasksByStatus = (
    status: TaskStatus
  ) =>
    filteredTasks.filter(
      (task) => task.status === status
    )

  const handleStatusChange = async (
    taskId: number,
    newStatus: TaskStatus
  ) => {

    setTasks((prev) =>
      prev.map((task) =>
        task.id === taskId
          ? {
              ...task,
              status: newStatus,
            }
          : task
      )
    )
  }

  const handleDeleteTask = async (
    taskId: number
  ) => {

    setTasks((prev) =>
      prev.filter(
        (task) => task.id !== taskId
      )
    )

    toast.success("Task deleted")
  }

  const handleCreateTask = async () => {

    const newTask: Task = {
      id: Date.now(),
      title,
      description,
      project,
      priority,
      dueDate,
      status: "Todo",
    }

    setTasks((prev) => [
      newTask,
      ...prev,
    ])

    toast.success("Task created")

    setDialogOpen(false)

    setTitle("")
    setDescription("")
    setProject("")
    setPriority("Medium")
    setDueDate("")
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6">

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

        <div>

          <h1 className="text-3xl font-bold">
            Tasks
          </h1>

          <p className="text-muted-foreground mt-1">
            Manage your tasks and workflow.
          </p>

        </div>

        <Dialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
        >

          <DialogTrigger asChild>

            <Button>

              <Plus className="h-4 w-4 mr-2" />

              Add Task

            </Button>

          </DialogTrigger>

          <DialogContent>

            <DialogHeader>

              <DialogTitle>
                Create Task
              </DialogTitle>

              <DialogDescription>
                Add a new task
              </DialogDescription>

            </DialogHeader>

            <div className="space-y-4 py-4">

              <div className="space-y-2">

                <Label>
                  Title
                </Label>

                <Input
                  value={title}
                  onChange={(e) =>
                    setTitle(e.target.value)
                  }
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
                />

              </div>

              <div className="space-y-2">

                <Label>
                  Project
                </Label>

                <Input
                  value={project}
                  onChange={(e) =>
                    setProject(e.target.value)
                  }
                />

              </div>

              <div className="space-y-2">

                <Label>
                  Priority
                </Label>

                <Select
                  onValueChange={(value) =>
                    setPriority(
                      value as TaskPriority
                    )
                  }
                >

                  <SelectTrigger>
                    <SelectValue placeholder="Priority" />
                  </SelectTrigger>

                  <SelectContent>

                    <SelectItem value="Low">
                      Low
                    </SelectItem>

                    <SelectItem value="Medium">
                      Medium
                    </SelectItem>

                    <SelectItem value="High">
                      High
                    </SelectItem>

                    <SelectItem value="Urgent">
                      Urgent
                    </SelectItem>

                  </SelectContent>

                </Select>

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

            <DialogFooter>

              <Button
                variant="outline"
                onClick={() =>
                  setDialogOpen(false)
                }
              >
                Cancel
              </Button>

              <Button
                onClick={handleCreateTask}
              >
                Create Task
              </Button>

            </DialogFooter>

          </DialogContent>

        </Dialog>

      </div>

      <div className="relative max-w-md">

        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

        <Input
          placeholder="Search tasks..."
          value={searchQuery}
          onChange={(e) =>
            setSearchQuery(e.target.value)
          }
          className="pl-9"
        />

      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {statusColumns.map((column) => (

          <div
            key={column.status}
            className="space-y-4"
          >

            <div className="flex items-center gap-2">

              <column.icon
                className={cn(
                  "h-5 w-5",
                  column.color
                )}
              />

              <h2 className="font-semibold">
                {column.label}
              </h2>

              <Badge
                variant="secondary"
                className="ml-auto"
              >
                {
                  getTasksByStatus(
                    column.status
                  ).length
                }
              </Badge>

            </div>

            <div className="space-y-3">

              {getTasksByStatus(
                column.status
              ).map((task) => (

                <TaskCard
                  key={task.id}
                  task={task}
                  onDelete={
                    handleDeleteTask
                  }
                  onStatusChange={
                    handleStatusChange
                  }
                />

              ))}

            </div>

          </div>

        ))}

      </div>

    </div>
  )
}