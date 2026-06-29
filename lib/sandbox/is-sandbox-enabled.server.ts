import "server-only";

import { edenFetch } from "@lib/eden/fetch";
import { getServerHeaders } from "@lib/eden/server-session";
import { isEdenApiEnvConfigured } from "@lib/env-configured";
import type { EdenSessionUserResponse } from "@lib/user-beacon/types";

export type SandboxAccessMode = "development" | "public" | "eden-user";

const SANDBOX_ACCESS_VALUES = new Set(["public", "eden-user"]);

async function hasEdenSessionUser(): Promise<boolean> {
  try {
    const response = await edenFetch("/session", {
      headers: await getServerHeaders(),
      cache: "no-store",
    });

    if (!response.ok) {
      return false;
    }

    const body = (await response.json()) as EdenSessionUserResponse;

    return Boolean(body.data?.user ?? body.data?.staffId);
  } catch {
    return false;
  }
}

/**
 * Returns how the sandbox may be accessed, or null when the route should 404.
 * Sandbox routes live at `/sandbox/*` on the Vercel origin only — not via the
 * Cloudflare Worker namespace proxy.
 */
export async function getSandboxAccess(): Promise<SandboxAccessMode | null> {
  if (process.env.NODE_ENV === "development") {
    return "development";
  }

  const access = process.env.SANDBOX_ACCESS?.trim().toLowerCase();

  if (!access || !SANDBOX_ACCESS_VALUES.has(access)) {
    return null;
  }

  if (access === "public") {
    return "public";
  }

  if (!isEdenApiEnvConfigured()) {
    return null;
  }

  return (await hasEdenSessionUser()) ? "eden-user" : null;
}
