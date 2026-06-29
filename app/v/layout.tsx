import { getSandboxAccess } from "@/lib/sandbox/is-sandbox-enabled.server";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";

export const dynamic = "force-dynamic";

type VersionLayoutProps = {
  children: ReactNode;
};

/** Gates all `/v{n}/…` routes — same access rules as sandbox (Vercel origin only). */
export default async function VersionLayout({ children }: VersionLayoutProps) {
  const accessMode = await getSandboxAccess();

  if (!accessMode) {
    notFound();
  }

  return children;
}
