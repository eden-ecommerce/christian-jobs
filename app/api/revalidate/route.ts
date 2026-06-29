import { getServerEnv } from "@eden-ecommerce/lib/env-server";
import type { NextRequest } from "next/server";
import { revalidateTag } from "next/cache";

export const POST = async (request: NextRequest) => {
  const body = (await request.json()) as { tag?: string };
  const apiKey = request.headers.get("x-api-key");
  const env = getServerEnv();

  if (!apiKey || apiKey !== env.API_KEY) {
    return Response.json({ message: "Invalid token" }, { status: 401 });
  }

  if (!body.tag) {
    return new Response("", { status: 400 });
  }

  revalidateTag(body.tag, "max");
  return Response.json({ revalidated: true, now: Date.now() });
};
