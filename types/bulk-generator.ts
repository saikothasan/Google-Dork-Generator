export interface BulkGeneratorOptions {
  site?: string
  fileType?: string
  inUrl?: string
  inTitle?: string
  inText?: string
  excludeWords?: string
  dateRange?: string
  useCache: boolean
  useRelated: boolean
}

export interface BulkDork {
  id: string
  keyword: string
  dork: string
  generated: boolean
  error?: string
}

export interface BulkGeneratorState {
  isGenerating: boolean
  progress: number
  total: number
  results: BulkDork[]
}

