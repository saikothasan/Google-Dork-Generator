"use client"

import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"

export function TelegramPrompt() {
  return (
    <Alert variant="default" className="bg-blue-500 text-white border-blue-600 mb-4">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Join our Telegram channel!</AlertTitle>
      <AlertDescription className="flex items-center justify-between">
        <span>Stay updated with the latest Google dork techniques and tips.</span>
        <Button
          variant="secondary"
          className="bg-white text-blue-500 hover:bg-blue-100"
          onClick={() => window.open("https://t.me/googledorkgenerator", "_blank")}
        >
          Join Now
        </Button>
      </AlertDescription>
    </Alert>
  )
}

