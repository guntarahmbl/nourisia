"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { StepsChart } from "@/components/steps-chart"
import { ExerciseTracker } from "@/components/exercise-tracker"
import { ConnectWearables } from "@/components/connect-wearables"
import { UserNav } from "@/components/user-nav"
import { useSession } from "next-auth/react"
import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Edit2, MessageSquare, Bot } from "lucide-react"
import { useRouter } from "next/navigation"
import { Badge } from "@/components/ui/badge"

export default function ActivityPage() {
  const router = useRouter()
  const { data: session } = useSession()
  const [stepsData, setStepsData] = useState({
    steps: 0,
    stepsGoal: 10000,
  })
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [newSteps, setNewSteps] = useState("")

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
          steps: data.steps || 0,
          stepsGoal: data.stepsGoal || 10000,
        })
      }
    } catch (error) {
      console.error("Error fetching steps data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const updateSteps = async () => {
    try {
      const steps = Number.parseInt(newSteps)
      if (isNaN(steps) || steps < 0) return

      const response = await fetch("/api/steps", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ steps }),
      })

      if (response.ok) {
        setStepsData((prev) => ({ ...prev, steps }))
        setIsDialogOpen(false)
        setNewSteps("")
      }
    } catch (error) {
      console.error("Error updating steps:", error)
    }
  }

  const stepsPercentage = Math.min(Math.round((stepsData.steps / stepsData.stepsGoal) * 100), 100)

  return (
    <div className="p-4 space-y-6">
      <header className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Activity</h1>
          <p className="text-sm text-muted-foreground">Track your daily activities</p>
        </div>
        <UserNav />
      </header>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-lg">Daily Steps</CardTitle>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="ghost" size="icon">
                <Edit2 className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Update Steps</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="steps">Steps Count</Label>
                  <Input
                    id="steps"
                    type="number"
                    placeholder="Enter steps"
                    value={newSteps}
                    onChange={(e) => setNewSteps(e.target.value)}
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={updateSteps}>Update</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
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
                  {stepsData.steps.toLocaleString()} / {stepsData.stepsGoal.toLocaleString()} steps
                </span>
                <span className="text-sm">{stepsPercentage}%</span>
              </div>
              <Progress value={stepsPercentage} className="h-2" />
              <div className="h-[200px] mt-4">
                <StepsChart />
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <Card className="relative overflow-hidden">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">AI Nutrition Coach</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="bg-primary/10 p-3 rounded-full">
              <Bot className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h3 className="font-medium">Get personalized advice</h3>
              <p className="text-sm text-muted-foreground">
                Chat with our AI nutrition coach for diet and workout tips
              </p>
            </div>
          </div>
          <Button className="w-full flex items-center gap-2" onClick={() => router.push("/ai-chat")}>
            <MessageSquare className="h-4 w-4" />
            Chat with AI
            <Badge className="ml-2" variant="outline">
              Coming Soon
            </Badge>
          </Button>
        </CardContent>
      </Card>

      <ExerciseTracker />

      <ConnectWearables />
    </div>
  )
}
