import { NextResponse } from "next/server";
import { getFeaturedJobs, getCharityJobs } from "@lib/algolia/jobs";

export async function GET() {
  try {
    const [featured, charity] = await Promise.all([
      getFeaturedJobs(8),
      getCharityJobs(8),
    ]);
    return NextResponse.json({ featured, charity });
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch featured jobs" },
      { status: 500 },
    );
  }
}
