"use client"

import { useState, useEffect } from "react"
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts"
import { ChartContainer } from "@/components/ui/chart"
import { useSession } from "next-auth/react"

export function StepsChart() {
  const { data: session } = useSession()
  const [stepsData, setStepsData] = useState({
    completed: 0,
    goal: 10000,
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (session?.user) {
      fetchStepsData()
    }
  }, [session])

  const fetchStepsData = async () => {
    try {
      const response = await fetch("/api/dashboard")
      if (response.ok) {
        const data = await response.json()
        setStepsData({
          completed: data.steps || 0,
          goal: data.stepsGoal || 10000,
        })
      }
    } catch (error) {
      console.error("Error fetching steps data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const remaining = Math.max(0, stepsData.goal - stepsData.completed)

  const data = [
    { name: "Completed", value: stepsData.completed },
    { name: "Remaining", value: remaining },
  ]

  const COLORS = ["hsl(var(--chart-1))", "hsl(var(--chart-4))"]

  if (isLoading) {
    return (
      <div className="h-[200px] flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-2 border-primary rounded-full border-t-transparent"></div>
      </div>
    )
  }

  return (
    <ChartContainer
      config={{
        completed: {
          label: "Completed",
          color: "hsl(var(--chart-1))",
        },
        remaining: {
          label: "Remaining",
          color: "hsl(var(--chart-4))",
        },
      }}
    >
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={5}
            dataKey="value"
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            labelLine={false}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}
