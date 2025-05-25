"use client"

import Image from "next/image"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { UserNav } from "@/components/user-nav"
import { Users, MessageSquare, Clock, MapPin } from "lucide-react"

export default function MarketplacePage() {
  return (
    <div className="p-4 space-y-6">
      <header className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Marketplace</h1>
          <p className="text-sm text-muted-foreground">Find nearby stores with fresh, nutritious meals</p>
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
            Connect with others, share experiences, and find your go-to healthy food spots.
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
        {[
          {
            name: "Nourisia",
            description: "Your go-to store for organic, fresh, and local healthy food.",
            delivery: "15-25 min",
            distance: "2.4 km",
            rating: 4.8,
            logo: "/icons/nourisia-market.png",
            popular: true,
          },
          {
            name: "Plant Power Deli",
            description: "Vegan and gluten-free meals crafted with care.",
            delivery: "20-30 min",
            distance: "3.1 km",
            rating: 4.6,
            logo: "/store1.jpg",
            popular: false,
          },
          {
            name: "Muscle Fuel Kitchen",
            description: "Protein-packed meals for fitness-focused lifestyles.",
            delivery: "10-20 min",
            distance: "1.8 km",
            rating: 4.9,
            logo: "/store2.jpg",
            popular: false,
          },
        ].map((store, idx) => (
          <Card key={idx}>
            <CardHeader className="p-0">
              <div className="relative h-40 w-full">
                <Image
                  src={store.logo}
                  alt={store.name}
                  fill
                  className="object-cover rounded-t-lg"
                />
                {store.popular && (
                  <Badge className="absolute top-2 right-2">Popular</Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className="p-4">
              <CardTitle className="text-lg mb-1">{store.name}</CardTitle>
              <p className="text-sm text-muted-foreground mb-2">{store.description}</p>

              {/* Delivery Time and Distance */}
              <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>{store.delivery}</span>
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  <span>{store.distance}</span>
                </div>
              </div>

              {/* Rating */}
              <div className="flex items-center">
                <span className="text-sm mr-1">{store.rating}</span>
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg
                      key={star}
                      className={`w-4 h-4 ${
                        star <= Math.round(store.rating) ? "fill-primary" : "fill-muted-foreground"
                      }`}
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 17.27L18.18 21L16.54 13.97L22 9.24L14.81 8.63L12 2L9.19 8.63L2 9.24L7.46 13.97L5.82 21L12 17.27Z" />
                    </svg>
                  ))}
                </div>
              </div>
            </CardContent>
            <CardFooter className="p-4 pt-0">
              <Button className="w-full">View Store</Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}
