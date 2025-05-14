"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { CaloriesChart } from "@/components/calories-chart"
import { MacronutrientTracker } from "@/components/macronutrient-tracker"
import { WaterIntake } from "@/components/water-intake"
import { UserNav } from "@/components/user-nav"
import { useSession } from "next-auth/react"
import { useState, useEffect } from "react"

export default function Dashboard() {
  const { data: session } = useSession()
  const [dashboardData, setDashboardData] = useState({
    calories: 0,
    caloriesGoal: 2000,
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (session?.user) {
      fetchDashboardData()
    }
  }, [session])

  const fetchDashboardData = async () => {
    try {
      const response = await fetch("/api/dashboard")
      if (response.ok) {
        const data = await response.json()
        setDashboardData({
          calories: data.calories || 0,
          caloriesGoal: data.caloriesGoal || 2000,
        })
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const caloriesPercentage = Math.min(Math.round((dashboardData.calories / dashboardData.caloriesGoal) * 100), 100)

  return (
    <div className="p-4 space-y-6">
      <header className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Hello, {session?.user?.name?.split(" ")[0] || "User"}!</h1>
          <p className="text-sm text-muted-foreground">Track your daily nutrition</p>
        </div>
        <UserNav />
      </header>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Daily Calories</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="animate-pulse space-y-2">
              <div className="flex items-center justify-between">
                <div className="h-4 w-24 bg-muted rounded"></div>
                <div className="h-4 w-12 bg-muted rounded"></div>
              </div>
              <div className="h-2 bg-muted rounded"></div>
              <div className="h-[200px] mt-4 bg-muted/50 rounded"></div>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm">
                  {dashboardData.calories} / {dashboardData.caloriesGoal} kcal
                </span>
                <span className="text-sm">{caloriesPercentage}%</span>
              </div>
              <Progress value={caloriesPercentage} className="h-2" />
              <div className="h-[200px] mt-4">
                <CaloriesChart />
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <MacronutrientTracker />

      <WaterIntake />
    </div>
  )
}
