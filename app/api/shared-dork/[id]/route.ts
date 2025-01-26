import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const id = params.id

  const { data, error } = await supabase.from("shared_dorks").select("dork").eq("id", id).single()

  if (error) {
    return NextResponse.json({ error: "Dork not found" }, { status: 404 })
  }

  return NextResponse.json(data)
}

