"use client"

import Image from "next/image"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { UserNav } from "@/components/user-nav"
import { Users, MessageSquare } from "lucide-react"

export default function MarketplacePage() {
  return (
    <div className="p-4 space-y-6">
      <header className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Marketplace</h1>
          <p className="text-sm text-muted-foreground">Find diet plans that work for you</p>
        </div>
        <UserNav />
      </header>

      {/* Community Section */}
      <Card className="mb-6">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <Users className="h-5 w-5" />
            Community
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center p-6 text-center">
          <div className="bg-primary/10 p-4 rounded-full mb-4">
            <MessageSquare className="h-10 w-10 text-primary" />
          </div>
          <h3 className="text-lg font-medium mb-2">Join the Nourisia Community</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Connect with other fitness enthusiasts, share your progress, and get motivated together.
          </p>
          <Button className="relative">
            Explore Community
            <Badge className="absolute -top-2 -right-2 px-2 py-0.5 text-[10px] bg-primary text-primary-foreground">
              Coming Soon
            </Badge>
          </Button>
        </CardContent>
      </Card>

      <div className="grid gap-4">
        <Card>
          <CardHeader className="p-0">
            <div className="relative h-40 w-full">
              <Image
                src="/placeholder.svg?height=160&width=400"
                alt="Keto Diet Plan"
                fill
                className="object-cover rounded-t-lg"
              />
              <Badge className="absolute top-2 right-2">Popular</Badge>
            </div>
          </CardHeader>
          <CardContent className="p-4">
            <CardTitle className="text-lg mb-2">Keto Diet Plan</CardTitle>
            <p className="text-sm text-muted-foreground mb-2">
              A 30-day ketogenic diet plan designed for maximum fat loss while maintaining muscle mass.
            </p>
            <div className="flex items-center justify-between">
              <span className="font-bold">$29.99</span>
              <div className="flex items-center">
                <span className="text-sm mr-1">4.8</span>
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg key={star} className="w-4 h-4 fill-primary" viewBox="0 0 24 24">
                      <path d="M12 17.27L18.18 21L16.54 13.97L22 9.24L14.81 8.63L12 2L9.19 8.63L2 9.24L7.46 13.97L5.82 21L12 17.27Z" />
                    </svg>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="p-4 pt-0">
            <Button className="w-full">Buy Now</Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader className="p-0">
            <div className="relative h-40 w-full">
              <Image
                src="/placeholder.svg?height=160&width=400"
                alt="Vegan Meal Plan"
                fill
                className="object-cover rounded-t-lg"
              />
            </div>
          </CardHeader>
          <CardContent className="p-4">
            <CardTitle className="text-lg mb-2">Vegan Meal Plan</CardTitle>
            <p className="text-sm text-muted-foreground mb-2">
              Complete plant-based nutrition with delicious recipes for 4 weeks.
            </p>
            <div className="flex items-center justify-between">
              <span className="font-bold">$24.99</span>
              <div className="flex items-center">
                <span className="text-sm mr-1">4.6</span>
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg
                      key={star}
                      className={`w-4 h-4 ${star === 5 ? "fill-muted-foreground" : "fill-primary"}`}
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 17.27L18.18 21L16.54 13.97L22 9.24L14.81 8.63L12 2L9.19 8.63L2 9.24L7.46 13.97L5.82 21L12 17.27Z" />
                    </svg>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="p-4 pt-0">
            <Button className="w-full">Buy Now</Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader className="p-0">
            <div className="relative h-40 w-full">
              <Image
                src="/placeholder.svg?height=160&width=400"
                alt="Muscle Building Plan"
                fill
                className="object-cover rounded-t-lg"
              />
            </div>
          </CardHeader>
          <CardContent className="p-4">
            <CardTitle className="text-lg mb-2">Muscle Building Plan</CardTitle>
            <p className="text-sm text-muted-foreground mb-2">
              High protein meal plan designed for muscle growth and recovery.
            </p>
            <div className="flex items-center justify-between">
              <span className="font-bold">$34.99</span>
              <div className="flex items-center">
                <span className="text-sm mr-1">4.9</span>
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg key={star} className="w-4 h-4 fill-primary" viewBox="0 0 24 24">
                      <path d="M12 17.27L18.18 21L16.54 13.97L22 9.24L14.81 8.63L12 2L9.19 8.63L2 9.24L7.46 13.97L5.82 21L12 17.27Z" />
                    </svg>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="p-4 pt-0">
            <Button className="w-full">Buy Now</Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
