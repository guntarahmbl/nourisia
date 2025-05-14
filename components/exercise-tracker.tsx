"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { PlusCircle, Trash } from "lucide-react"
import { useSession } from "next-auth/react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useForm } from "react-hook-form"

type Exercise = {
  id: number
  exerciseName: string
  duration: number
  caloriesBurned: number
  time?: string
}

export function ExerciseTracker() {
  const { data: session } = useSession()
  const [exercises, setExercises] = useState<Exercise[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const form = useForm({
    defaultValues: {
      exerciseName: "",
      duration: 30,
      caloriesBurned: 0,
    },
  })

  useEffect(() => {
    if (session?.user) {
      fetchExercises()
    }
  }, [session])

  const fetchExercises = async () => {
    try {
      const response = await fetch("/api/exercise")
      if (response.ok) {
        const data = await response.json()
        setExercises(
          data.map((exercise: any) => ({
            id: exercise.id,
            exerciseName: exercise.exercise_name,
            duration: exercise.duration,
            caloriesBurned: exercise.calories_burned || 0,
            time: new Date(exercise.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          })),
        )
      }
    } catch (error) {
      console.error("Error fetching exercises:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const totalCalories = exercises.reduce((sum, exercise) => sum + exercise.caloriesBurned, 0)

  const onSubmit = async (data: any) => {
    try {
      const response = await fetch("/api/exercise", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          exerciseName: data.exerciseName,
          duration: data.duration,
          caloriesBurned: data.caloriesBurned,
        }),
      })

      if (response.ok) {
        form.reset()
        setIsDialogOpen(false)
        fetchExercises()
      }
    } catch (error) {
      console.error("Error adding exercise:", error)
    }
  }

  const deleteExercise = async (id: number) => {
    try {
      const response = await fetch(`/api/exercise/${id}`, {
        method: "DELETE",
      })
      if (response.ok) {
        setExercises(exercises.filter(exercise => exercise.id !== id))
      } else {
        console.error("Failed to delete exercise.")
      }
    } catch (error) {
      console.error("Error deleting exercise:", error)
    }
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Exercise</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="h-12 bg-muted rounded"></div>
            <div className="h-12 bg-muted rounded"></div>
            <div className="h-12 bg-muted rounded"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg">Exercise</CardTitle>
        <div className="flex items-center gap-2">
          <Badge variant="outline">{totalCalories} kcal burned</Badge>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="ghost" size="icon">
                <PlusCircle className="h-5 w-5" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Exercise</DialogTitle>
              </DialogHeader>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="exerciseName">Exercise Name</Label>
                  <Input
                    id="exerciseName"
                    {...form.register("exerciseName", { required: true })}
                    placeholder="e.g., Running, Yoga, Weight Training"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="duration">Duration (minutes)</Label>
                  <Input id="duration" type="number" {...form.register("duration", { required: true, min: 1 })} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="caloriesBurned">Calories Burned</Label>
                  <Input
                    id="caloriesBurned"
                    type="number"
                    {...form.register("caloriesBurned", { required: true, min: 0 })}
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">Add Exercise</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {exercises.length > 0 ? (
            exercises.map((exercise) => (
              <div
                key={exercise.id}
                className="flex items-center justify-between border-b pb-3 last:border-0 last:pb-0"
              >
                <div>
                  <h4 className="font-medium">{exercise.exerciseName}</h4>
                  <div className="text-sm text-muted-foreground">
                    {exercise.duration} min • {exercise.time}
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-sm font-medium">{exercise.caloriesBurned} kcal</div>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => deleteExercise(exercise.id)}
                    className="text-red-500 hover:bg-red-500 hover:text-white"
                  >
                    <Trash className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-6 text-muted-foreground">
              No exercises logged today. Add your first exercise!
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
