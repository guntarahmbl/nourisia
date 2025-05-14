"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import { useSession } from "next-auth/react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useForm } from "react-hook-form"

export function MacronutrientTracker() {
  const { data: session } = useSession()
  const [macros, setMacros] = useState({
    calories: 0,
    protein: 0,
    proteinGoal: 120, // Hardcoded goal
    carbs: 0,
    carbsGoal: 200,  // Hardcoded goal
    fat: 0,
    fatGoal: 65,     // Hardcoded goal
  })
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  // Form for updating only values (not goals)
  const form = useForm({
    defaultValues: {
      calories: macros.calories,
      protein: macros.protein,
      carbs: macros.carbs,
      fat: macros.fat
      
    },
  })

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
          calories: data.calories || 0,
          protein: data.protein || 0,
          proteinGoal: 120,  // Hardcoded goal
          carbs: data.carbs || 0,
          carbsGoal: 200,   // Hardcoded goal
          fat: data.fat || 0,
          fatGoal: 65,      // Hardcoded goal
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

  const onSubmit = async (data: any) => {
    try {
      const response = await fetch("/api/dashboard", {
        method: "PUT", // Use PUT to update values only
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          calories: data.calories,
          protein: data.protein,
          carbs: data.carbs,
          fat: data.fat,
        }),
      })

      if (response.ok) {
        setMacros({
          calories: data.calories,
          protein: data.protein,
          carbs: data.carbs,
          fat: data.fat,
          proteinGoal: 120,  // Hardcoded goal
          carbsGoal: 200,   // Hardcoded goal
          fatGoal: 65,      // Hardcoded goal
        })
        setIsDialogOpen(false)
      } else {
        console.error("Failed to update macronutrients.")
      }
    } catch (error) {
      console.error("Error updating macronutrients:", error)
    }
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
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg">Macronutrients</CardTitle>
        <div className="flex items-center gap-2">
          <Badge variant="outline">
            Protein: {macros.protein}g / {macros.proteinGoal}g
          </Badge>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="ghost" size="icon">
                <PlusCircle className="h-5 w-5" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Update Macronutrients</DialogTitle>
              </DialogHeader>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
              <div className="space-y-2">
                  <Label htmlFor="calories">Calories (g)</Label>
                  <Input
                    id="calories"
                    type="number"
                    {...form.register("calories", { required: true, min: 0 })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="protein">Protein (g)</Label>
                  <Input
                    id="protein"
                    type="number"
                    {...form.register("protein", { required: true, min: 0 })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="carbs">Carbs (g)</Label>
                  <Input
                    id="carbs"
                    type="number"
                    {...form.register("carbs", { required: true, min: 0 })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fat">Fat (g)</Label>
                  <Input
                    id="fat"
                    type="number"
                    {...form.register("fat", { required: true, min: 0 })}
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">Update Macronutrients</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
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
