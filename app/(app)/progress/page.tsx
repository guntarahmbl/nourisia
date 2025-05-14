"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Award, TrendingDown, Plus } from "lucide-react"
import { UserNav } from "@/components/user-nav"
import { useSession } from "next-auth/react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function ProgressPage() {
  const { data: session } = useSession()
  const [weightData, setWeightData] = useState({
    currentWeight: 0,
    targetWeight: 0,
    weightToGo: 0,
    progress: 0,
  })
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [newWeight, setNewWeight] = useState("")

  useEffect(() => {
    if (session?.user) {
      fetchUserProfile()
    }
  }, [session])

  const fetchUserProfile = async () => {
    try {
      const response = await fetch("/api/user-profile")
      if (response.ok) {
        const data = await response.json()

        const currentWeight = Number.parseFloat(data.current_weight) || 75
        const targetWeight = Number.parseFloat(data.target_weight) || 68

        // Calculate weight to go and progress
        const initialDifference = Math.abs(currentWeight - targetWeight)
        const currentDifference = Math.abs(currentWeight - targetWeight)
        const progress =
          initialDifference > 0 ? Math.round(((initialDifference - currentDifference) / initialDifference) * 100) : 0

        setWeightData({
          currentWeight,
          targetWeight,
          weightToGo: Math.abs(currentWeight - targetWeight),
          progress,
        })
      }
    } catch (error) {
      console.error("Error fetching user profile:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const updateWeight = async () => {
    try {
      const weight = Number.parseFloat(newWeight)
      if (isNaN(weight) || weight <= 0) return

      const response = await fetch("/api/weight", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ weight }),
      })

      if (response.ok) {
        // Update the current weight and recalculate progress
        const newWeightToGo = Math.abs(weight - weightData.targetWeight)
        const initialDifference = Math.abs(weightData.currentWeight - weightData.targetWeight)
        const progress =
          initialDifference > 0 ? Math.round(((initialDifference - newWeightToGo) / initialDifference) * 100) : 0

        setWeightData((prev) => ({
          ...prev,
          currentWeight: weight,
          weightToGo: newWeightToGo,
          progress,
        }))

        setIsDialogOpen(false)
        setNewWeight("")
      }
    } catch (error) {
      console.error("Error updating weight:", error)
    }
  }

  return (
    <div className="p-4 space-y-6">
      <header className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Progress</h1>
          <p className="text-sm text-muted-foreground">Track your achievements</p>
        </div>
        <UserNav />
      </header>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Achievements</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-4">
          <div className="flex flex-col items-center justify-center p-3 border rounded-lg">
            <Award className="w-8 h-8 mb-2 text-primary" />
            <span className="text-sm font-medium">10K Steps</span>
            <Badge variant="outline" className="mt-1">
              Completed
            </Badge>
          </div>
          <div className="flex flex-col items-center justify-center p-3 border rounded-lg">
            <TrendingDown className="w-8 h-8 mb-2 text-primary" />
            <span className="text-sm font-medium">Weight Loss 5kg</span>
            <Badge variant="outline" className="mt-1">
              In Progress
            </Badge>
          </div>
          <div className="flex flex-col items-center justify-center p-3 border rounded-lg">
            <Award className="w-8 h-8 mb-2 text-muted-foreground" />
            <span className="text-sm font-medium">30 Day Streak</span>
            <Badge variant="outline" className="mt-1">
              Locked
            </Badge>
          </div>
          <div className="flex flex-col items-center justify-center p-3 border rounded-lg">
            <Award className="w-8 h-8 mb-2 text-muted-foreground" />
            <span className="text-sm font-medium">Protein Goal</span>
            <Badge variant="outline" className="mt-1">
              Locked
            </Badge>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg">Weight Progress</CardTitle>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="ghost" size="icon">
                <Plus className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Log Weight</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="weight">Current Weight (kg)</Label>
                  <Input
                    id="weight"
                    type="number"
                    placeholder="Enter your weight"
                    value={newWeight}
                    onChange={(e) => setNewWeight(e.target.value)}
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={updateWeight}>Save</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent className="space-y-4">
          {isLoading ? (
            <div className="animate-pulse space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="h-20 bg-muted rounded"></div>
                <div className="h-20 bg-muted rounded"></div>
              </div>
              <div className="h-6 bg-muted rounded"></div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 border rounded-lg text-center">
                  <p className="text-sm text-muted-foreground">Current</p>
                  <p className="text-xl font-bold">{weightData.currentWeight} kg</p>
                </div>
                <div className="p-3 border rounded-lg text-center">
                  <p className="text-sm text-muted-foreground">Target</p>
                  <p className="text-xl font-bold">{weightData.targetWeight} kg</p>
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm">{weightData.weightToGo.toFixed(1)} kg to go</span>
                  <span className="text-sm">{weightData.progress}%</span>
                </div>
                <Progress value={weightData.progress} className="h-2" />
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
