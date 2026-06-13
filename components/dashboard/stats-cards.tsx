"use client"

import { useEffect, useState } from "react"
import { DollarSign, FolderKanban, CheckSquare, TrendingUp } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { api } from "@/lib/api"

export function StatsCards() {
  const [stats, setStats] = useState<any>(null)

  useEffect(() => {

  const fetchStats = async () => {

    try {

      const token = localStorage.getItem("token")

      if (!token) return

      const res = await api.get(
        "/dashboard/stats",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      setStats(res.data)

    } catch (err) {

      console.error(
        "Analytics error:",
        err
      )
    }
  }

  fetchStats()

}, [])

  const cards = [
    {
      title: "Total Earnings",
      value: `$${stats?.total_earnings || 0}`,
      icon: DollarSign,
      description: "Total earnings",
    },
    {
      title: "Projects",
      value: stats?.total_projects || 0,
      icon: FolderKanban,
      description: "Total projects",
    },
    {
      title: "Completed Tasks",
      value: stats?.completed_tasks || 0,
      icon: CheckSquare,
      description: "Completed tasks",
    },
    {
      title: "Productivity",
      value: `${stats?.productivity || 0}%`,
      icon: TrendingUp,
      description: "Current productivity",
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {cards.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {stat.title}
            </CardTitle>

            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
              <stat.icon className="h-4 w-4 text-primary" />
            </div>
          </CardHeader>

          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {stat.value}
            </div>

            <p className="text-xs text-muted-foreground mt-1">
              {stat.description}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}