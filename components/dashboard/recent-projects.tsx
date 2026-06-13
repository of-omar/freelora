"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"

const projects = [
  {
    id: 1,
    name: "E-commerce Redesign",
    client: "TechCorp Inc.",
    clientInitials: "TC",
    status: "In Progress",
    progress: 65,
    budget: "$8,500",
    dueDate: "Dec 15",
  },
  {
    id: 2,
    name: "Mobile App Development",
    client: "StartupXYZ",
    clientInitials: "SX",
    status: "In Progress",
    progress: 40,
    budget: "$15,000",
    dueDate: "Jan 20",
  },
  {
    id: 3,
    name: "Brand Identity",
    client: "Local Cafe",
    clientInitials: "LC",
    status: "Review",
    progress: 90,
    budget: "$3,200",
    dueDate: "Dec 8",
  },
  {
    id: 4,
    name: "Website Maintenance",
    client: "HealthPlus",
    clientInitials: "HP",
    status: "On Hold",
    progress: 25,
    budget: "$1,800",
    dueDate: "Dec 30",
  },
]

const statusStyles = {
  "In Progress": "bg-primary/10 text-primary border-primary/20",
  "Review": "bg-warning/10 text-warning-foreground border-warning/20",
  "On Hold": "bg-muted text-muted-foreground border-border",
  "Completed": "bg-success/10 text-success border-success/20",
}

export function RecentProjects() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Projects</CardTitle>
        <CardDescription>Your latest active projects</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {projects.map((project) => (
          <div
            key={project.id}
            className="flex items-center gap-4 p-3 rounded-lg border border-border hover:bg-accent/50 transition-colors"
          >
            <Avatar className="h-10 w-10 shrink-0">
              <AvatarFallback className="bg-primary/10 text-primary text-sm font-medium">
                {project.clientInitials}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <h4 className="font-medium text-foreground truncate">{project.name}</h4>
                <Badge
                  variant="outline"
                  className={cn(
                    "shrink-0",
                    statusStyles[project.status as keyof typeof statusStyles]
                  )}
                >
                  {project.status}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground truncate">{project.client}</p>
              <div className="flex items-center gap-4 mt-2">
                <div className="flex-1">
                  <Progress value={project.progress} className="h-1.5" />
                </div>
                <span className="text-xs text-muted-foreground shrink-0">
                  {project.progress}%
                </span>
              </div>
            </div>
            <div className="hidden sm:flex flex-col items-end gap-1 shrink-0">
              <span className="text-sm font-medium text-foreground">{project.budget}</span>
              <span className="text-xs text-muted-foreground">Due {project.dueDate}</span>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
