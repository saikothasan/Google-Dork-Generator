"use client"

import { useState, useCallback } from "react"
import { v4 as uuidv4 } from "uuid"
import { motion, AnimatePresence } from "framer-motion"
import { Loader2, Upload, Download, Filter, Trash2, Play, Pause, RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Progress } from "@/components/ui/progress"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { type BulkGeneratorOptions, BulkDork, type BulkGeneratorState } from "@/types/bulk-generator"
import { toast } from "react-toastify"

const BATCH_SIZE = 50
const DELAY_BETWEEN_BATCHES = 1000

export function BulkGenerator() {
  const [keywords, setKeywords] = useState("")
  const [options, setOptions] = useState<BulkGeneratorOptions>({
    site: "",
    fileType: "",
    inUrl: "",
    inTitle: "",
    inText: "",
    excludeWords: "",
    dateRange: "",
    useCache: false,
    useRelated: false,
  })
  const [state, setState] = useState<BulkGeneratorState>({
    isGenerating: false,
    progress: 0,
    total: 0,
    results: [],
  })
  const [filter, setFilter] = useState("")
  const [paused, setPaused] = useState(false)

  const generateDork = (keyword: string, options: BulkGeneratorOptions): string => {
    let dork = keyword.trim()

    if (options.site) dork += ` site:${options.site}`
    if (options.fileType) dork += ` filetype:${options.fileType}`
    if (options.inUrl) dork += ` inurl:${options.inUrl}`
    if (options.inTitle) dork += ` intitle:${options.inTitle}`
    if (options.inText) dork += ` intext:${options.inText}`
    if (options.excludeWords) dork += ` -${options.excludeWords.split(" ").join(" -")}`
    if (options.dateRange) dork += ` daterange:${options.dateRange}`
    if (options.useCache) dork += " cache:"
    if (options.useRelated) dork += " related:"

    return dork.trim()
  }

  const processBatch = async (keywordList: string[], startIndex: number, options: BulkGeneratorOptions) => {
    const endIndex = Math.min(startIndex + BATCH_SIZE, keywordList.length)
    const batch = keywordList.slice(startIndex, endIndex)

    const newResults = batch.map((keyword) => ({
      id: uuidv4(),
      keyword,
      dork: generateDork(keyword, options),
      generated: true,
    }))

    setState((prev) => ({
      ...prev,
      results: [...prev.results, ...newResults],
      progress: endIndex,
    }))

    if (endIndex < keywordList.length && !paused) {
      await new Promise((resolve) => setTimeout(resolve, DELAY_BETWEEN_BATCHES))
      await processBatch(keywordList, endIndex, options)
    }
  }

  const handleGenerate = async () => {
    const keywordList = keywords
      .split("\n")
      .map((k) => k.trim())
      .filter((k) => k !== "")

    if (keywordList.length === 0) {
      toast.error("Please enter at least one keyword")
      return
    }

    setState({
      isGenerating: true,
      progress: 0,
      total: keywordList.length,
      results: [],
    })

    setPaused(false)
    await processBatch(keywordList, 0, options)
    setState((prev) => ({ ...prev, isGenerating: false }))
  }

  const handlePauseResume = () => {
    setPaused((prev) => !prev)
    if (paused) {
      const remainingKeywords = keywords
        .split("\n")
        .map((k) => k.trim())
        .filter((k) => k !== "")
        .slice(state.progress)
      processBatch(remainingKeywords, 0, options)
    }
  }

  const handleReset = () => {
    setState({
      isGenerating: false,
      progress: 0,
      total: 0,
      results: [],
    })
    setPaused(false)
    setKeywords("")
    setFilter("")
  }

  const handleImport = () => {
    const input = document.createElement("input")
    input.type = "file"
    input.accept = ".txt,.csv"
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (file) {
        const text = await file.text()
        setKeywords(text)
      }
    }
    input.click()
  }

  const handleExport = () => {
    const filteredResults = getFilteredResults()
    if (filteredResults.length === 0) {
      toast.error("No dorks to export")
      return
    }
    const content = filteredResults.map((r) => r.dork).join("\n")
    const blob = new Blob([content], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "google_dorks.txt"
    a.click()
    URL.revokeObjectURL(url)
    toast.success("Dorks exported successfully")
  }

  const getFilteredResults = useCallback(() => {
    return state.results.filter(
      (result) =>
        result.keyword.toLowerCase().includes(filter.toLowerCase()) ||
        result.dork.toLowerCase().includes(filter.toLowerCase()),
    )
  }, [state.results, filter])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label>Keywords (one per line)</Label>
          <div className="flex items-center gap-2 mt-1">
            <Button onClick={handleImport} variant="outline" size="sm">
              <Upload className="w-4 h-4 mr-2" />
              Import
            </Button>
            <Button onClick={handleReset} variant="outline" size="sm" disabled={state.results.length === 0}>
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset
            </Button>
          </div>
          <Textarea
            value={keywords}
            onChange={(e) => setKeywords(e.target.value)}
            placeholder="Enter keywords, one per line"
            rows={10}
            className="mt-2"
          />
        </div>
        <div className="space-y-4">
          <div>
            <Label htmlFor="site">Site</Label>
            <Input
              id="site"
              value={options.site}
              onChange={(e) => setOptions((prev) => ({ ...prev, site: e.target.value }))}
              placeholder="e.g., example.com"
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="fileType">File Type</Label>
            <Input
              id="fileType"
              value={options.fileType}
              onChange={(e) => setOptions((prev) => ({ ...prev, fileType: e.target.value }))}
              placeholder="e.g., pdf, doc, xls"
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="inUrl">In URL</Label>
            <Input
              id="inUrl"
              value={options.inUrl}
              onChange={(e) => setOptions((prev) => ({ ...prev, inUrl: e.target.value }))}
              placeholder="Text in the URL"
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="inTitle">In Title</Label>
            <Input
              id="inTitle"
              value={options.inTitle}
              onChange={(e) => setOptions((prev) => ({ ...prev, inTitle: e.target.value }))}
              placeholder="Text in the page title"
              className="mt-1"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="useCache"
              checked={options.useCache}
              onCheckedChange={(checked) => setOptions((prev) => ({ ...prev, useCache: checked === true }))}
            />
            <Label htmlFor="useCache">Use cache:</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="useRelated"
              checked={options.useRelated}
              onCheckedChange={(checked) => setOptions((prev) => ({ ...prev, useRelated: checked === true }))}
            />
            <Label htmlFor="useRelated">Use related:</Label>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <Button
          onClick={handleGenerate}
          disabled={state.isGenerating && !paused}
          className="bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 text-white"
        >
          {state.isGenerating && !paused ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <Play className="w-4 h-4 mr-2" />
          )}
          Generate Dorks
        </Button>
        {state.isGenerating && (
          <Button onClick={handlePauseResume} variant="outline">
            {paused ? (
              <>
                <Play className="w-4 h-4 mr-2" />
                Resume
              </>
            ) : (
              <>
                <Pause className="w-4 h-4 mr-2" />
                Pause
              </>
            )}
          </Button>
        )}
        {state.results.length > 0 && (
          <Button onClick={handleExport} variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export Results
          </Button>
        )}
      </div>

      {state.isGenerating && (
        <div className="space-y-2">
          <Progress value={(state.progress / state.total) * 100} />
          <p className="text-sm text-gray-500">
            Processing {state.progress} of {state.total} keywords
            {paused && " (Paused)"}
          </p>
        </div>
      )}

      {state.results.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Input
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              placeholder="Filter results..."
              className="max-w-sm"
            />
            <Select value={filter} onValueChange={(value) => setFilter(value)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All Results">All Results</SelectItem>
                <SelectItem value="site:">Site</SelectItem>
                <SelectItem value="filetype:">File Type</SelectItem>
                <SelectItem value="inurl:">In URL</SelectItem>
                <SelectItem value="intitle:">In Title</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <AnimatePresence>
            {getFilteredResults().map((result, index) => (
              <motion.div
                key={result.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2, delay: index * 0.05 }}
              >
                <Card>
                  <CardContent className="p-4">
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{result.keyword}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            navigator.clipboard.writeText(result.dork)
                            toast.success("Dork copied to clipboard!")
                          }}
                        >
                          Copy
                        </Button>
                      </div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{result.dork}</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  )
}

