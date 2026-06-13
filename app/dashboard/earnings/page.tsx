"use client"

import { useState } from "react"
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
  Download,
  Calendar,
  Filter,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Bar,
  BarChart,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts"
import { cn } from "@/lib/utils"

const monthlyData = [
  { month: "Jan", revenue: 4200, expenses: 1200 },
  { month: "Feb", revenue: 3800, expenses: 1100 },
  { month: "Mar", revenue: 5100, expenses: 1400 },
  { month: "Apr", revenue: 4700, expenses: 1300 },
  { month: "May", revenue: 5800, expenses: 1600 },
  { month: "Jun", revenue: 6200, expenses: 1700 },
  { month: "Jul", revenue: 5900, expenses: 1500 },
  { month: "Aug", revenue: 7100, expenses: 1900 },
  { month: "Sep", revenue: 6800, expenses: 1800 },
  { month: "Oct", revenue: 7500, expenses: 2000 },
  { month: "Nov", revenue: 8200, expenses: 2200 },
  { month: "Dec", revenue: 8900, expenses: 2400 },
]

const earningsHistory = [
  {
    id: 1,
    date: "Dec 5, 2024",
    client: "TechCorp Inc.",
    project: "E-commerce Redesign",
    amount: "$2,500",
    status: "Paid",
    type: "Payment",
  },
  {
    id: 2,
    date: "Dec 3, 2024",
    client: "StartupXYZ",
    project: "Mobile App Development",
    amount: "$4,000",
    status: "Paid",
    type: "Milestone",
  },
  {
    id: 3,
    date: "Dec 1, 2024",
    client: "Design Studio",
    project: "Dashboard Analytics",
    amount: "$3,500",
    status: "Pending",
    type: "Invoice",
  },
  {
    id: 4,
    date: "Nov 28, 2024",
    client: "Local Cafe",
    project: "Brand Identity",
    amount: "$1,600",
    status: "Paid",
    type: "Payment",
  },
  {
    id: 5,
    date: "Nov 25, 2024",
    client: "Innovate Tech",
    project: "API Integration",
    amount: "$2,750",
    status: "Paid",
    type: "Milestone",
  },
  {
    id: 6,
    date: "Nov 20, 2024",
    client: "TechCorp Inc.",
    project: "E-commerce Redesign",
    amount: "$3,000",
    status: "Paid",
    type: "Payment",
  },
  {
    id: 7,
    date: "Nov 15, 2024",
    client: "HealthPlus",
    project: "Website Maintenance",
    amount: "$900",
    status: "Overdue",
    type: "Invoice",
  },
  {
    id: 8,
    date: "Nov 10, 2024",
    client: "StartupXYZ",
    project: "Mobile App Development",
    amount: "$5,000",
    status: "Paid",
    type: "Milestone",
  },
]

const statusStyles = {
  Paid: "bg-success/10 text-success border-success/20",
  Pending: "bg-warning/10 text-warning-foreground border-warning/20",
  Overdue: "bg-destructive/10 text-destructive border-destructive/20",
}

const stats = [
  {
    title: "Total Revenue",
    value: "$74,200",
    change: "+18.2%",
    changeType: "positive" as const,
    icon: DollarSign,
    description: "vs last year",
  },
  {
    title: "This Month",
    value: "$8,900",
    change: "+8.5%",
    changeType: "positive" as const,
    icon: TrendingUp,
    description: "vs last month",
  },
  {
    title: "Pending Payments",
    value: "$4,400",
    change: "2 invoices",
    changeType: "neutral" as const,
    icon: Calendar,
    description: "awaiting payment",
  },
  {
    title: "Average Project",
    value: "$6,185",
    change: "+12.3%",
    changeType: "positive" as const,
    icon: ArrowUpRight,
    description: "per project",
  },
]

export default function EarningsPage() {
  const [timeRange, setTimeRange] = useState("year")

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Earnings</h1>
          <p className="text-muted-foreground mt-1">
            Track your revenue, payments, and financial analytics.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="quarter">This Quarter</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
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
              <div className="text-2xl font-bold text-foreground">{stat.value}</div>
              <div className="flex items-center gap-1 mt-1">
                {stat.changeType === "positive" && (
                  <ArrowUpRight className="h-3 w-3 text-success" />
                )}
                {stat.changeType === "negative" && (
                  <ArrowDownRight className="h-3 w-3 text-destructive" />
                )}
                <span
                  className={cn(
                    "text-xs font-medium",
                    stat.changeType === "positive" && "text-success",
                    stat.changeType === "negative" && "text-destructive",
                    stat.changeType === "neutral" && "text-muted-foreground"
                  )}
                >
                  {stat.change}
                </span>
                <span className="text-xs text-muted-foreground">{stat.description}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Revenue Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Monthly Revenue</CardTitle>
            <CardDescription>Revenue trend over the past 12 months</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" vertical={false} />
                  <XAxis
                    dataKey="month"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: 'oklch(0.6 0 0)', fontSize: 12 }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: 'oklch(0.6 0 0)', fontSize: 12 }}
                    tickFormatter={(value) => `$${value / 1000}k`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'oklch(0.12 0.008 250)',
                      border: '1px solid oklch(0.22 0.01 250)',
                      borderRadius: '8px',
                      color: 'oklch(0.96 0 0)',
                    }}
                    formatter={(value: number) => [`$${value.toLocaleString()}`, '']}
                    labelStyle={{ color: 'oklch(0.6 0 0)' }}
                  />
                  <Bar dataKey="revenue" fill="oklch(0.55 0.2 250)" radius={[4, 4, 0, 0]} name="Revenue" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Expenses vs Revenue */}
        <Card>
          <CardHeader>
            <CardTitle>Revenue vs Expenses</CardTitle>
            <CardDescription>Comparison of income and expenses</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" vertical={false} />
                  <XAxis
                    dataKey="month"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: 'oklch(0.6 0 0)', fontSize: 12 }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: 'oklch(0.6 0 0)', fontSize: 12 }}
                    tickFormatter={(value) => `$${value / 1000}k`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'oklch(0.12 0.008 250)',
                      border: '1px solid oklch(0.22 0.01 250)',
                      borderRadius: '8px',
                      color: 'oklch(0.96 0 0)',
                    }}
                    formatter={(value: number) => [`$${value.toLocaleString()}`, '']}
                    labelStyle={{ color: 'oklch(0.6 0 0)' }}
                  />
                  <Line
                    type="monotone"
                    dataKey="revenue"
                    stroke="oklch(0.55 0.2 250)"
                    strokeWidth={2}
                    dot={false}
                    name="Revenue"
                  />
                  <Line
                    type="monotone"
                    dataKey="expenses"
                    stroke="oklch(0.65 0.2 145)"
                    strokeWidth={2}
                    dot={false}
                    name="Expenses"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="flex items-center justify-center gap-6 mt-4">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-primary" />
                <span className="text-sm text-muted-foreground">Revenue</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-success" />
                <span className="text-sm text-muted-foreground">Expenses</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Earnings History */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle>Earnings History</CardTitle>
              <CardDescription>Recent payments and invoices</CardDescription>
            </div>
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="border border-border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50 hover:bg-muted/50">
                  <TableHead>Date</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead className="hidden md:table-cell">Project</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {earningsHistory.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="text-muted-foreground">{item.date}</TableCell>
                    <TableCell className="font-medium text-foreground">{item.client}</TableCell>
                    <TableCell className="hidden md:table-cell text-muted-foreground">
                      {item.project}
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="font-normal">
                        {item.type}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-medium text-foreground">
                      {item.amount}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={cn(statusStyles[item.status as keyof typeof statusStyles])}
                      >
                        {item.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
