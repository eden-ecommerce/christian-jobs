import { getSandboxAccess } from "@/lib/sandbox/is-sandbox-enabled.server";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";

export const dynamic = "force-dynamic";

/** Gates all /v3/… routes — same access rules as /v/ (Vercel origin only). */
export default async function V3Layout({ children }: { children: ReactNode }) {
  const accessMode = await getSandboxAccess();
  if (!accessMode) notFound();
  return children;
}
