import { handlers } from "@/lib/auth"
import type { NextRequest } from "next/server"

const { GET: authGet, POST: authPost } = handlers

// Distinct wrappers so next-on-pages registers both GET and POST.
export async function GET(req: NextRequest) {
  return authGet(req)
}

export async function POST(req: NextRequest) {
  return authPost(req)
}

export const runtime = "edge"
