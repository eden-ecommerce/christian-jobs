import { getSandboxAccess } from "@/lib/sandbox/is-sandbox-enabled.server";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";

export const dynamic = "force-dynamic";

/** Gates all /v5/… routes — same access rules as /v3/ (Vercel origin only). */
export default async function V5Layout({ children }: { children: ReactNode }) {
  const accessMode = await getSandboxAccess();
  if (!accessMode) notFound();
  return children;
}
