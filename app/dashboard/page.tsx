import { StatsCards } from "@/components/dashboard/stats-cards"
import { RevenueChart } from "@/components/dashboard/revenue-chart"
import { RecentProjects } from "@/components/dashboard/recent-projects"
import { ActivityFeed } from "@/components/dashboard/activity-feed"

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Welcome back! Here&apos;s an overview of your freelance business.
        </p>
      </div>

      {/* Stats Cards */}
      <StatsCards />

      {/* Charts and Recent Projects */}
      <div className="grid gap-6 lg:grid-cols-3">
        <RevenueChart />
        <ActivityFeed />
      </div>

      {/* Recent Projects */}
      <RecentProjects />
    </div>
  )
}
