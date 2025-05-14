"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Plus, Minus } from "lucide-react"
import { useSession } from "next-auth/react"

export function WaterIntake() {
  const { data: session } = useSession()
  const [glasses, setGlasses] = useState(0)
  const [waterGoal, setWaterGoal] = useState(8)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (session?.user) {
      fetchWaterData()
      fetchUserProfile()
    }
  }, [session])

  const fetchWaterData = async () => {
    try {
      const response = await fetch("/api/water")
      if (response.ok) {
        const data = await response.json()
        setGlasses(data.glasses || 0)
      }
    } catch (error) {
      console.error("Error fetching water data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchUserProfile = async () => {
    try {
      const response = await fetch("/api/user-profile")
      if (response.ok) {
        const data = await response.json()
        setWaterGoal(data.water_goal || 8)
      }
    } catch (error) {
      console.error("Error fetching user profile:", error)
    }
  }

  const updateWaterIntake = async (newGlasses: number) => {
    try {
      const response = await fetch("/api/water", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ glasses: newGlasses }),
      })

      if (response.ok) {
        setGlasses(newGlasses)
      }
    } catch (error) {
      console.error("Error updating water intake:", error)
    }
  }

  const addGlass = () => {
    if (glasses < waterGoal) {
      const newGlasses = glasses + 1
      setGlasses(newGlasses)
      updateWaterIntake(newGlasses)
    }
  }

  const removeGlass = () => {
    if (glasses > 0) {
      const newGlasses = glasses - 1
      setGlasses(newGlasses)
      updateWaterIntake(newGlasses)
    }
  }

  const percentage = (glasses / waterGoal) * 100

  if (isLoading) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Water Intake</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center py-6">
          <div className="animate-pulse h-20 w-full bg-muted rounded"></div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg">Water Intake</CardTitle>
        <div className="text-sm font-medium">
          {glasses} / {waterGoal} glasses
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <Progress value={percentage} className="h-2" />

        <div className="flex items-center justify-between">
          <Button variant="outline" size="icon" onClick={removeGlass} disabled={glasses <= 0}>
            <Minus className="h-4 w-4" />
          </Button>

          <div className="flex space-x-1">
            {Array.from({ length: waterGoal }).map((_, index) => (
              <div key={index} className={`w-6 h-10 rounded-b-full ${index < glasses ? "bg-primary" : "bg-muted"}`} />
            ))}
          </div>

          <Button variant="outline" size="icon" onClick={addGlass} disabled={glasses >= waterGoal}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
