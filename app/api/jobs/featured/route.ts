import { NextResponse } from "next/server";
import { getFeaturedJobs, getLatestJobs } from "@lib/algolia/jobs";

export async function GET() {
  try {
    const [latest, featured] = await Promise.all([
      getLatestJobs(8),
      getFeaturedJobs(8),
    ]);
    return NextResponse.json({ latest, featured });
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch featured jobs" },
      { status: 500 },
    );
  }
}
