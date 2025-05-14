"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { UserNav } from "@/components/user-nav"
import { useSession } from "next-auth/react"
import { toast } from "@/components/ui/use-toast"

export default function SettingsPage() {
  const { data: session } = useSession()
  const [currentWeight, setCurrentWeight] = useState("")
  const [targetWeight, setTargetWeight] = useState("")
  const [height, setHeight] = useState("")
  const [gender, setGender] = useState("male")
  const [waterGoal, setWaterGoal] = useState([8])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

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
        setCurrentWeight(data.current_weight?.toString() || "75")
        setTargetWeight(data.target_weight?.toString() || "68")
        setHeight(data.height?.toString() || "175")
        setGender(data.gender || "male")
        setWaterGoal([data.water_goal || 8])
      }
    } catch (error) {
      console.error("Error fetching user profile:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const saveSettings = async () => {
    try {
      setIsSaving(true)

      const response = await fetch("/api/user-profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          currentWeight: Number.parseFloat(currentWeight),
          targetWeight: Number.parseFloat(targetWeight),
          height: Number.parseInt(height),
          gender,
          waterGoal: waterGoal[0],
        }),
      })

      if (response.ok) {
        toast({
          title: "Settings saved",
          description: "Your profile settings have been updated successfully.",
        })
      } else {
        toast({
          title: "Error",
          description: "Failed to save settings. Please try again.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error saving settings:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="p-4 space-y-6">
        <header className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">Settings</h1>
            <p className="text-sm text-muted-foreground">Personalize your experience</p>
          </div>
          <UserNav />
        </header>

        <div className="animate-pulse space-y-6">
          <div className="h-64 bg-muted rounded-lg"></div>
          <div className="h-32 bg-muted rounded-lg"></div>
          <div className="h-48 bg-muted rounded-lg"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 space-y-6">
      <header className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Settings</h1>
          <p className="text-sm text-muted-foreground">Personalize your experience</p>
        </div>
        <UserNav />
      </header>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Personal Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="current-weight">Current Weight (kg)</Label>
            <Input
              id="current-weight"
              type="number"
              value={currentWeight}
              onChange={(e) => setCurrentWeight(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="target-weight">Target Weight (kg)</Label>
            <Input
              id="target-weight"
              type="number"
              value={targetWeight}
              onChange={(e) => setTargetWeight(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="height">Height (cm)</Label>
            <Input id="height" type="number" value={height} onChange={(e) => setHeight(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Gender</Label>
            <RadioGroup value={gender} onValueChange={setGender} className="flex space-x-4">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="male" id="male" />
                <Label htmlFor="male">Male</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="female" id="female" />
                <Label htmlFor="female">Female</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="other" id="other" />
                <Label htmlFor="other">Other</Label>
              </div>
            </RadioGroup>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Water Goal</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div className="flex justify-between">
              <Label>Daily Water Goal (glasses)</Label>
              <span>{waterGoal[0]} glasses</span>
            </div>
            <Slider value={waterGoal} min={1} max={12} step={1} onValueChange={setWaterGoal} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Notifications</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="water-reminder">Water Reminders</Label>
            <Switch id="water-reminder" defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="meal-reminder">Meal Reminders</Label>
            <Switch id="meal-reminder" defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="activity-reminder">Activity Reminders</Label>
            <Switch id="activity-reminder" />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="progress-updates">Weekly Progress Updates</Label>
            <Switch id="progress-updates" defaultChecked />
          </div>
        </CardContent>
      </Card>

      <Button className="w-full" onClick={saveSettings} disabled={isSaving}>
        {isSaving ? "Saving..." : "Save Changes"}
      </Button>
    </div>
  )
}
