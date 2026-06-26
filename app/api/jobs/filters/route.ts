import { NextResponse } from "next/server";
import { getJobFilterOptions } from "@lib/algolia/jobs";

export async function GET() {
  try {
    const facets = await getJobFilterOptions();
    return NextResponse.json(facets);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch filters" },
      { status: 500 },
    );
  }
}
