"use client"

import { Badge } from "@/components/ui/badge"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Watch } from "lucide-react"

export function ConnectWearables() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Connect Your Wearables</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center p-6 text-center">
        <Watch className="h-12 w-12 text-muted-foreground mb-4" />
        <p className="text-sm text-muted-foreground mb-4">
          Connect your fitness tracker or smartwatch to automatically sync your activity data.
        </p>
        <Button className="relative">
          Connect Device
          <Badge className="absolute -top-2 -right-2 px-2 py-0.5 text-[10px] bg-primary text-primary-foreground">
            Coming Soon
          </Badge>
        </Button>
      </CardContent>
    </Card>
  )
}
