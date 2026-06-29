import settingsFixture from "@/data/settings.mock.json";
import { NextResponse } from "next/server";
import { CORS_HEADERS, corsPreflight } from "@eden-ecommerce/lib/cors";
import type { SettingsApiResponse } from "@lib/settings.schema";
import { z } from "zod";

const settingsBodySchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  notificationsEnabled: z.boolean(),
});

let store: SettingsApiResponse = { ...settingsFixture };

export function OPTIONS() {
  return corsPreflight();
}

export function GET() {
  return NextResponse.json(store, { headers: CORS_HEADERS });
}

export async function PATCH(request: Request) {
  const json = await request.json();
  const parsed = settingsBodySchema.safeParse(json);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid body" },
      { status: 400, headers: CORS_HEADERS },
    );
  }

  store = {
    title: parsed.data.title,
    description: parsed.data.description ?? "",
    notificationsEnabled: parsed.data.notificationsEnabled,
  };

  return NextResponse.json(store, { headers: CORS_HEADERS });
}
