"use client"

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const data = [
  { month: "Jan", revenue: 4200, expenses: 2100 },
  { month: "Feb", revenue: 3800, expenses: 1900 },
  { month: "Mar", revenue: 5100, expenses: 2300 },
  { month: "Apr", revenue: 4700, expenses: 2200 },
  { month: "May", revenue: 5800, expenses: 2500 },
  { month: "Jun", revenue: 6200, expenses: 2700 },
  { month: "Jul", revenue: 5900, expenses: 2400 },
  { month: "Aug", revenue: 7100, expenses: 2900 },
  { month: "Sep", revenue: 6800, expenses: 2800 },
  { month: "Oct", revenue: 7500, expenses: 3100 },
  { month: "Nov", revenue: 8200, expenses: 3400 },
  { month: "Dec", revenue: 8900, expenses: 3600 },
]

export function RevenueChart() {
  return (
    <Card className="col-span-1 lg:col-span-2">
      <CardHeader>
        <CardTitle>Revenue Overview</CardTitle>
        <CardDescription>Monthly revenue and expenses for 2024</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="oklch(0.55 0.2 250)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="oklch(0.55 0.2 250)" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="oklch(0.65 0.2 145)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="oklch(0.65 0.2 145)" stopOpacity={0} />
                </linearGradient>
              </defs>
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
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="oklch(0.55 0.2 250)"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorRevenue)"
                name="Revenue"
              />
              <Area
                type="monotone"
                dataKey="expenses"
                stroke="oklch(0.65 0.2 145)"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorExpenses)"
                name="Expenses"
              />
            </AreaChart>
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
  )
}
