import { NextResponse } from "next/server";
import { CORS_HEADERS, corsPreflight } from "@eden-ecommerce/lib/cors";

/**
 * Example API route at `/api/health`.
 *
 * Every API route MUST:
 *  - export an `OPTIONS` handler for CORS preflight, and
 *  - return the shared `CORS_HEADERS` on its responses.
 *
 * CORS headers are also applied globally in `next.config.ts`; reusing
 * `CORS_HEADERS` here keeps the preflight + actual responses consistent.
 */

export function OPTIONS() {
  return corsPreflight();
}

export function GET() {
  return NextResponse.json(
    { status: "ok", timestamp: new Date().toISOString() },
    { headers: CORS_HEADERS },
  );
}
