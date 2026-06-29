import { getSandboxAccess } from "@/lib/sandbox/is-sandbox-enabled.server";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";

export const dynamic = "force-dynamic";

type SandboxLayoutProps = {
  children: ReactNode;
};

export default async function SandboxLayout({ children }: SandboxLayoutProps) {
  const accessMode = await getSandboxAccess();

  if (!accessMode) {
    notFound();
  }

  return children;
}
