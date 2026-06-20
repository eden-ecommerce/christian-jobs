import { getEventsByIds } from "@lib/algolia/events";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  let ids: string[];
  try {
    const body = await req.json();
    ids = Array.isArray(body.ids) ? (body.ids as string[]) : [];
  } catch {
    return NextResponse.json({ events: [] });
  }

  if (ids.length === 0) {
    return NextResponse.json({ events: [] });
  }

  // Cap at 50 to avoid abuse
  const events = await getEventsByIds(ids.slice(0, 50));
  return NextResponse.json({ events });
}
