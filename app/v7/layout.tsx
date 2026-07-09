import { getSandboxAccess } from "@/lib/sandbox/is-sandbox-enabled.server";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";

export const dynamic = "force-dynamic";

/** Gates all /v7/… routes — same access rules as /v6/ (Vercel origin only). */
export default async function V7Layout({ children }: { children: ReactNode }) {
  const accessMode = await getSandboxAccess();
  if (!accessMode) notFound();
  return children;
}
