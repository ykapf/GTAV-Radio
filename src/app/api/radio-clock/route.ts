import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

/** Reference clock for the synced radio, so every device agrees on what's on air. */
export function GET() {
  return NextResponse.json({ now: Date.now() }, { headers: { "Cache-Control": "no-store" } });
}
