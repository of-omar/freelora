"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle2, Clock, DollarSign, FileText, MessageSquare } from "lucide-react"
import { cn } from "@/lib/utils"

const activities = [
  {
    id: 1,
    type: "payment",
    title: "Payment received",
    description: "$2,500 from TechCorp Inc.",
    time: "2 hours ago",
    icon: DollarSign,
  },
  {
    id: 2,
    type: "task",
    title: "Task completed",
    description: "Homepage design review",
    time: "4 hours ago",
    icon: CheckCircle2,
  },
  {
    id: 3,
    type: "message",
    title: "New message",
    description: "Sarah from StartupXYZ",
    time: "5 hours ago",
    icon: MessageSquare,
  },
  {
    id: 4,
    type: "deadline",
    title: "Deadline approaching",
    description: "Brand Identity - 2 days left",
    time: "6 hours ago",
    icon: Clock,
  },
  {
    id: 5,
    type: "contract",
    title: "Contract signed",
    description: "New project with HealthPlus",
    time: "1 day ago",
    icon: FileText,
  },
]

const iconStyles = {
  payment: "bg-success/10 text-success",
  task: "bg-primary/10 text-primary",
  message: "bg-chart-4/10 text-chart-4",
  deadline: "bg-warning/10 text-warning-foreground",
  contract: "bg-chart-5/10 text-chart-5",
}

export function ActivityFeed() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>Latest updates and notifications</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity, index) => (
            <div key={activity.id} className="flex gap-3">
              <div className="relative">
                <div
                  className={cn(
                    "flex h-9 w-9 items-center justify-center rounded-full",
                    iconStyles[activity.type as keyof typeof iconStyles]
                  )}
                >
                  <activity.icon className="h-4 w-4" />
                </div>
                {index < activities.length - 1 && (
                  <div className="absolute left-1/2 top-9 h-full w-px -translate-x-1/2 bg-border" />
                )}
              </div>
              <div className="flex-1 pb-4">
                <p className="text-sm font-medium text-foreground">{activity.title}</p>
                <p className="text-sm text-muted-foreground">{activity.description}</p>
                <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
