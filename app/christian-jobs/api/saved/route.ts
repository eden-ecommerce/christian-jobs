import { getJobsByIds } from "@lib/algolia/jobs";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  let ids: string[];
  try {
    const body = await req.json();
    ids = Array.isArray(body.ids) ? (body.ids as string[]) : [];
  } catch {
    return NextResponse.json({ jobs: [] });
  }

  if (ids.length === 0) {
    return NextResponse.json({ jobs: [] });
  }

  // Cap at 50 to avoid abuse
  const jobs = await getJobsByIds(ids.slice(0, 50));
  return NextResponse.json({ jobs });
}
