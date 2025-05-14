"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Activity, TrendingUp, ShoppingBag, Settings } from "lucide-react"

export function NavigationBar() {
  const pathname = usePathname()

  const isActive = (path: string) => {
    return pathname === path
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 max-w-[430px] mx-auto border-t bg-background">
      <nav className="flex justify-around items-center h-16">
        <Link
          href="/dashboard"
          className={`flex flex-col items-center justify-center w-full h-full ${isActive("/dashboard") ? "text-primary" : "text-muted-foreground"}`}
        >
          <Home className="w-5 h-5" />
          <span className="text-xs mt-1">Home</span>
        </Link>
        <Link
          href="/activity"
          className={`flex flex-col items-center justify-center w-full h-full ${isActive("/activity") ? "text-primary" : "text-muted-foreground"}`}
        >
          <Activity className="w-5 h-5" />
          <span className="text-xs mt-1">Activity</span>
        </Link>
        <Link
          href="/progress"
          className={`flex flex-col items-center justify-center w-full h-full ${isActive("/progress") ? "text-primary" : "text-muted-foreground"}`}
        >
          <TrendingUp className="w-5 h-5" />
          <span className="text-xs mt-1">Progress</span>
        </Link>
        <Link
          href="/marketplace"
          className={`flex flex-col items-center justify-center w-full h-full ${isActive("/marketplace") ? "text-primary" : "text-muted-foreground"}`}
        >
          <ShoppingBag className="w-5 h-5" />
          <span className="text-xs mt-1">Shop</span>
        </Link>
        <Link
          href="/settings"
          className={`flex flex-col items-center justify-center w-full h-full ${isActive("/settings") ? "text-primary" : "text-muted-foreground"}`}
        >
          <Settings className="w-5 h-5" />
          <span className="text-xs mt-1">Settings</span>
        </Link>
      </nav>
    </div>
  )
}
