import { SandboxPageContent } from "@app/sandbox/_components/SandboxPageContent";
import { getSandboxAccess } from "@/lib/sandbox/is-sandbox-enabled.server";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function SandboxPage() {
  const accessMode = await getSandboxAccess();

  if (!accessMode) {
    notFound();
  }

  return <SandboxPageContent accessMode={accessMode} />;
}
