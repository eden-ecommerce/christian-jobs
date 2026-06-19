import "server-only";

import { cookies, headers } from "next/headers";

export async function getServerHeaders(): Promise<HeadersInit> {
  const headerList = await headers();
  const cookieStore = await cookies();
  const forwarded: Record<string, string> = {};

  const cookieHeader = cookieStore
    .getAll()
    .map((cookie) => `${cookie.name}=${cookie.value}`)
    .join("; ");

  if (cookieHeader) {
    forwarded.Cookie = cookieHeader;
  }

  const userAgent = headerList.get("user-agent");
  if (userAgent) {
    forwarded["user-agent"] = userAgent;
  }

  const forwardedFor = headerList.get("x-forwarded-for");
  if (forwardedFor) {
    forwarded["X-Forwarded-For"] = forwardedFor;
  }

  return forwarded;
}
