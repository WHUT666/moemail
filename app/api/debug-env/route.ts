import { NextResponse } from "next/server"
import { getRequestContext } from "@cloudflare/next-on-pages"

export const runtime = "edge"

export async function GET() {
  try {
    const { env } = getRequestContext()
    const hasDB = !!(env as { DB?: unknown }).DB
    const hasKV = !!(env as { SITE_CONFIG?: unknown }).SITE_CONFIG

    let dbOk = false
    let dbError: string | null = null
    if (hasDB) {
      try {
        const db = (env as { DB: { prepare: (s: string) => { first: () => Promise<unknown> } } }).DB
        const result = await db.prepare("SELECT 1 AS ok").first()
        dbOk = !!result
      } catch (e) {
        dbError = e instanceof Error ? e.message : String(e)
      }
    }

    return NextResponse.json({
      ok: true,
      hasDB,
      hasKV,
      hasAuthSecret: !!(process.env.AUTH_SECRET),
      hasGithub: !!(process.env.AUTH_GITHUB_ID),
      authUrl: process.env.AUTH_URL ?? null,
      trustHost: process.env.AUTH_TRUST_HOST ?? null,
      dbOk,
      dbError,
    })
  } catch (e) {
    return NextResponse.json(
      {
        ok: false,
        error: e instanceof Error ? e.message : String(e),
      },
      { status: 500 }
    )
  }
}
