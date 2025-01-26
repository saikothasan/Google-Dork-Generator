"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Copy } from "lucide-react"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

export default function SharedDork() {
  const params = useParams()
  const [dork, setDork] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchDork = async () => {
      try {
        const response = await fetch(`/api/shared-dork/${params.id}`)
        if (!response.ok) {
          throw new Error("Failed to fetch dork")
        }
        const data = await response.json()
        setDork(data.dork)
      } catch (err) {
        setError("Failed to load the shared dork")
      } finally {
        setLoading(false)
      }
    }

    fetchDork()
  }, [params.id])

  const copyToClipboard = () => {
    navigator.clipboard.writeText(dork)
    toast.success("Dork copied to clipboard!", {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    })
  }

  if (loading) {
    return <div>Loading...</div>
  }

  if (error) {
    return <div>{error}</div>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="w-full max-w-2xl mx-auto shadow-lg card-hover">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-primary">Shared Google Dork</CardTitle>
          <CardDescription>This dork has been shared with you</CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea value={dork} readOnly className="mt-2" rows={4} />
          <Button onClick={copyToClipboard} className="mt-4 w-full flex items-center justify-center">
            <Copy className="w-4 h-4 mr-2" />
            Copy to Clipboard
          </Button>
        </CardContent>
      </Card>
      <ToastContainer />
    </div>
  )
}

