"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { useSession } from "next-auth/react"

export function MacronutrientTracker() {
  const { data: session } = useSession()
  const [macros, setMacros] = useState({
    protein: 0,
    proteinGoal: 120,
    carbs: 0,
    carbsGoal: 200,
    fat: 0,
    fatGoal: 65,
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
        setMacros({
          protein: data.protein || 0,
          proteinGoal: data.proteinGoal || 120,
          carbs: data.carbs || 0,
          carbsGoal: data.carbsGoal || 200,
          fat: data.fat || 0,
          fatGoal: data.fatGoal || 65,
        })
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const calculatePercentage = (value: number, goal: number) => {
    return Math.min(Math.round((value / goal) * 100), 100)
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Macronutrients</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="animate-pulse space-y-2">
            <div className="h-4 bg-muted rounded"></div>
            <div className="h-2 bg-muted rounded"></div>
            <div className="h-4 bg-muted rounded mt-4"></div>
            <div className="h-2 bg-muted rounded"></div>
            <div className="h-4 bg-muted rounded mt-4"></div>
            <div className="h-2 bg-muted rounded"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Macronutrients</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Protein</span>
            <span className="text-sm">
              {macros.protein}g / {macros.proteinGoal}g
            </span>
          </div>
          <Progress value={calculatePercentage(macros.protein, macros.proteinGoal)} className="h-2" />
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Carbs</span>
            <span className="text-sm">
              {macros.carbs}g / {macros.carbsGoal}g
            </span>
          </div>
          <Progress value={calculatePercentage(macros.carbs, macros.carbsGoal)} className="h-2" />
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Fat</span>
            <span className="text-sm">
              {macros.fat}g / {macros.fatGoal}g
            </span>
          </div>
          <Progress value={calculatePercentage(macros.fat, macros.fatGoal)} className="h-2" />
        </div>
      </CardContent>
    </Card>
  )
}
