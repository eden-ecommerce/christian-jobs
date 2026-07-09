import { getSandboxAccess } from "@/lib/sandbox/is-sandbox-enabled.server";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";

export const dynamic = "force-dynamic";

/** Gates all /v6/… routes — same access rules as /v5/ (Vercel origin only). */
export default async function V6Layout({ children }: { children: ReactNode }) {
  const accessMode = await getSandboxAccess();
  if (!accessMode) notFound();
  return children;
}
