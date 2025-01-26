"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { Search, BookOpen, Info, Save, Copy, Download, Share, Upload } from "lucide-react"
import { supabase } from "@/lib/supabase"

interface Dork {
  id?: string
  name: string
  dork: string
  user_id?: string
}

export default function GoogleDorkGenerator() {
  const [keyword, setKeyword] = useState("")
  const [site, setSite] = useState("")
  const [fileType, setFileType] = useState("")
  const [inUrl, setInUrl] = useState("")
  const [inTitle, setInTitle] = useState("")
  const [inText, setInText] = useState("")
  const [excludeWords, setExcludeWords] = useState("")
  const [dateRange, setDateRange] = useState("")
  const [useCache, setUseCache] = useState<boolean>(false)
  const [useRelated, setUseRelated] = useState<boolean>(false)
  const [generatedDork, setGeneratedDork] = useState("")
  const [savedDorks, setSavedDorks] = useState<Dork[]>([])
  const [bulkKeywords, setBulkKeywords] = useState("")
  const [bulkDorks, setBulkDorks] = useState<string[]>([])

  useEffect(() => {
    fetchSavedDorks()
  }, [])

  const fetchSavedDorks = async () => {
    const { data, error } = await supabase.from("dorks").select("*")
    if (error) {
      console.error("Error fetching dorks:", error)
    } else {
      setSavedDorks(data || [])
    }
  }

  const generateDork = (customKeyword?: string) => {
    let dork = customKeyword || keyword

    if (site) dork += ` site:${site}`
    if (fileType) dork += ` filetype:${fileType}`
    if (inUrl) dork += ` inurl:${inUrl}`
    if (inTitle) dork += ` intitle:${inTitle}`
    if (inText) dork += ` intext:${inText}`
    if (excludeWords) dork += ` -${excludeWords.split(" ").join(" -")}`
    if (dateRange) dork += ` daterange:${dateRange}`
    if (useCache) dork += " cache:"
    if (useRelated) dork += " related:"

    return dork.trim()
  }

  const handleGenerateDork = () => {
    const dork = generateDork()
    setGeneratedDork(dork)
  }

  const handleBulkGenerate = () => {
    const keywords = bulkKeywords.split("\n").filter((k) => k.trim() !== "")
    const generatedDorks = keywords.map((keyword) => generateDork(keyword))
    setBulkDorks(generatedDorks)
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
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

  const saveDork = async () => {
    const name = prompt("Enter a name for this dork:")
    if (name) {
      const newDork: Dork = { name, dork: generatedDork }
      const { data, error } = await supabase.from("dorks").insert(newDork)
      if (error) {
        console.error("Error saving dork:", error)
        toast.error("Failed to save dork")
      } else {
        toast.success("Dork saved successfully!")
        fetchSavedDorks()
      }
    }
  }

  const loadDork = (dork: string) => {
    setGeneratedDork(dork)
    toast.info("Dork loaded successfully!", {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    })
  }

  const saveToFile = (content: string, filename: string) => {
    const blob = new Blob([content], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = filename
    link.click()
    URL.revokeObjectURL(url)
  }

  const handleSaveToFile = () => {
    if (generatedDork) {
      saveToFile(generatedDork, "google_dork.txt")
    } else {
      toast.error("No dork generated to save")
    }
  }

  const handleSaveBulkToFile = () => {
    if (bulkDorks.length > 0) {
      const content = bulkDorks.join("\n")
      saveToFile(content, "bulk_google_dorks.txt")
    } else {
      toast.error("No bulk dorks generated to save")
    }
  }

  const shareDork = async () => {
    if (generatedDork) {
      const { data, error } = await supabase.from("shared_dorks").insert({ dork: generatedDork }).select()
      if (error) {
        console.error("Error sharing dork:", error)
        toast.error("Failed to share dork")
      } else if (data && data.length > 0) {
        const shareUrl = `${window.location.origin}/shared/${data[0].id}`
        copyToClipboard(shareUrl)
        toast.success("Share URL copied to clipboard!")
      } else {
        toast.error("Failed to generate share URL")
      }
    } else {
      toast.error("No dork generated to share")
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="w-full max-w-4xl mx-auto shadow-lg card-hover">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-primary">Advanced Google Dork Generator</CardTitle>
          <CardDescription>Generate complex Google search queries for advanced information gathering.</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="generator" className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-8">
              <TabsTrigger value="generator" className="flex items-center justify-center">
                <Search className="w-4 h-4 mr-2" />
                Generator
              </TabsTrigger>
              <TabsTrigger value="bulk" className="flex items-center justify-center">
                <Upload className="w-4 h-4 mr-2" />
                Bulk Generate
              </TabsTrigger>
              <TabsTrigger value="saved" className="flex items-center justify-center">
                <BookOpen className="w-4 h-4 mr-2" />
                Saved Dorks
              </TabsTrigger>
              <TabsTrigger value="about" className="flex items-center justify-center">
                <Info className="w-4 h-4 mr-2" />
                About
              </TabsTrigger>
            </TabsList>
            <TabsContent value="generator">
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  handleGenerateDork()
                }}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="keyword">Main Keyword</Label>
                    <Input
                      id="keyword"
                      value={keyword}
                      onChange={(e) => setKeyword(e.target.value)}
                      placeholder="Enter main search term"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="site">Site</Label>
                    <Input
                      id="site"
                      value={site}
                      onChange={(e) => setSite(e.target.value)}
                      placeholder="e.g., example.com"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="fileType">File Type</Label>
                    <Input
                      id="fileType"
                      value={fileType}
                      onChange={(e) => setFileType(e.target.value)}
                      placeholder="e.g., pdf, doc, xls"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="inUrl">In URL</Label>
                    <Input
                      id="inUrl"
                      value={inUrl}
                      onChange={(e) => setInUrl(e.target.value)}
                      placeholder="Text in the URL"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="inTitle">In Title</Label>
                    <Input
                      id="inTitle"
                      value={inTitle}
                      onChange={(e) => setInTitle(e.target.value)}
                      placeholder="Text in the page title"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="inText">In Text</Label>
                    <Input
                      id="inText"
                      value={inText}
                      onChange={(e) => setInText(e.target.value)}
                      placeholder="Text in the page content"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="excludeWords">Exclude Words</Label>
                    <Input
                      id="excludeWords"
                      value={excludeWords}
                      onChange={(e) => setExcludeWords(e.target.value)}
                      placeholder="Words to exclude (space-separated)"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="dateRange">Date Range</Label>
                    <Input
                      id="dateRange"
                      value={dateRange}
                      onChange={(e) => setDateRange(e.target.value)}
                      placeholder="e.g., 2457777-2457777"
                      className="mt-1"
                    />
                  </div>
                </div>
                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="useCache"
                      checked={useCache}
                      onCheckedChange={(checked) => setUseCache(checked === true)}
                    />
                    <Label htmlFor="useCache">Use cache:</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="useRelated"
                      checked={useRelated}
                      onCheckedChange={(checked) => setUseRelated(checked === true)}
                    />
                    <Label htmlFor="useRelated">Use related:</Label>
                  </div>
                </div>
                <Button type="submit" className="w-full">
                  Generate Dork
                </Button>
              </form>
              {generatedDork && (
                <div className="mt-8">
                  <Label htmlFor="generatedDork">Generated Dork</Label>
                  <Textarea id="generatedDork" value={generatedDork} readOnly className="mt-2" />
                  <div className="flex flex-wrap gap-2 mt-2">
                    <Button onClick={() => copyToClipboard(generatedDork)} className="flex items-center">
                      <Copy className="w-4 h-4 mr-2" />
                      Copy to Clipboard
                    </Button>
                    <Button onClick={saveDork} className="flex items-center">
                      <Save className="w-4 h-4 mr-2" />
                      Save Dork
                    </Button>
                    <Button onClick={handleSaveToFile} className="flex items-center">
                      <Download className="w-4 h-4 mr-2" />
                      Save to File
                    </Button>
                    <Button onClick={shareDork} className="flex items-center">
                      <Share className="w-4 h-4 mr-2" />
                      Share Dork
                    </Button>
                  </div>
                </div>
              )}
            </TabsContent>
            <TabsContent value="bulk">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="bulkKeywords">Bulk Keywords (one per line)</Label>
                  <Textarea
                    id="bulkKeywords"
                    value={bulkKeywords}
                    onChange={(e) => setBulkKeywords(e.target.value)}
                    placeholder="Enter keywords, one per line"
                    rows={5}
                    className="mt-1"
                  />
                </div>
                <Button onClick={handleBulkGenerate} className="w-full">
                  Generate Bulk Dorks
                </Button>
                {bulkDorks.length > 0 && (
                  <div className="mt-4">
                    <Label htmlFor="bulkResults">Generated Bulk Dorks</Label>
                    <Textarea id="bulkResults" value={bulkDorks.join("\n")} readOnly rows={10} className="mt-2" />
                    <div className="flex flex-wrap gap-2 mt-2">
                      <Button onClick={() => copyToClipboard(bulkDorks.join("\n"))} className="flex items-center">
                        <Copy className="w-4 h-4 mr-2" />
                        Copy All
                      </Button>
                      <Button onClick={handleSaveBulkToFile} className="flex items-center">
                        <Download className="w-4 h-4 mr-2" />
                        Save to File
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>
            <TabsContent value="saved">
              <div className="space-y-4">
                <Label htmlFor="savedDorks">Saved Dorks</Label>
                <Select onValueChange={(value) => loadDork(value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a saved dork" />
                  </SelectTrigger>
                  <SelectContent>
                    {savedDorks.map((savedDork) => (
                      <SelectItem key={savedDork.id} value={savedDork.dork}>
                        {savedDork.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {generatedDork && (
                  <div className="mt-4">
                    <Label htmlFor="loadedDork">Loaded Dork</Label>
                    <Textarea id="loadedDork" value={generatedDork} readOnly className="mt-2" />
                    <Button onClick={() => copyToClipboard(generatedDork)} className="mt-2 flex items-center">
                      <Copy className="w-4 h-4 mr-2" />
                      Copy to Clipboard
                    </Button>
                  </div>
                )}
              </div>
            </TabsContent>
            <TabsContent value="about">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">About Google Dorking</h3>
                <p>
                  Google dorking, also known as Google hacking, is an advanced search technique that uses specific
                  search operators to find information that isn't easily accessible through simple search queries. While
                  it's a powerful tool for information gathering, it's important to use it responsibly and ethically.
                </p>
                <h4 className="text-md font-semibold">Common Google dork operators:</h4>
                <ul className="list-disc list-inside space-y-2">
                  <li>site: - Limit results to a specific website</li>
                  <li>filetype: - Search for specific file types</li>
                  <li>inurl: - Search for a specific word in the URL</li>
                  <li>intitle: - Search for a specific word in the page title</li>
                  <li>intext: - Search for a specific word in the page content</li>
                  <li>- (minus sign) - Exclude words from your search</li>
                  <li>daterange: - Limit results to a specific date range</li>
                  <li>cache: - Show Google's cached version of a page</li>
                  <li>related: - Find sites related to a given URL</li>
                </ul>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      <ToastContainer />
    </div>
  )
}

