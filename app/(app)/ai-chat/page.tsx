"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { UserNav } from "@/components/user-nav"
import { Send, Bot, User } from "lucide-react"
import { useRouter } from "next/navigation"

export default function AIChatPage() {
  const router = useRouter()
  const [message, setMessage] = useState("")

  // Sample messages for UI demonstration
  const messages = [
    {
      role: "assistant",
      content:
        "Hello! I'm your Nourisia AI assistant. I can help with nutrition advice, workout suggestions, and healthy lifestyle tips.",
    },
    { role: "assistant", content: "This feature is coming soon! In the meantime, feel free to explore the interface." },
  ]

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    // This would handle sending messages when the feature is implemented
    setMessage("")
  }

  return (
    <div className="p-4 space-y-6">
      <header className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">AI Nutrition Coach</h1>
          <p className="text-sm text-muted-foreground">Get personalized advice</p>
        </div>
        <UserNav />
      </header>

      <Card className="relative">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg">Chat with AI</CardTitle>
            <Badge variant="outline" className="bg-primary/10">
              Coming Soon
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="h-[60vh] flex flex-col">
          <div className="flex-1 overflow-y-auto mb-4 space-y-4">
            {messages.map((msg, index) => (
              <div key={index} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`flex items-start gap-2 max-w-[80%] ${
                    msg.role === "user" ? "flex-row-reverse" : "flex-row"
                  }`}
                >
                  <div className={`p-1 rounded-full ${msg.role === "user" ? "bg-primary" : "bg-muted"}`}>
                    {msg.role === "user" ? (
                      <User className="h-5 w-5 text-white" />
                    ) : (
                      <Bot className="h-5 w-5 text-primary" />
                    )}
                  </div>
                  <div
                    className={`p-3 rounded-lg ${
                      msg.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <form onSubmit={handleSendMessage} className="flex gap-2">
            <Input
              placeholder="Type your message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              disabled
            />
            <Button type="submit" size="icon" disabled>
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </CardContent>
      </Card>

      <Button variant="outline" className="w-full" onClick={() => router.back()}>
        Back to Activity
      </Button>
    </div>
  )
}
