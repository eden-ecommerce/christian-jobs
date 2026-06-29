import { SandboxFormLink } from "@app/sandbox/_components/SandboxFormLink";
import { AlgoliaSandboxProbeSection } from "@app/sandbox/_sections/algolia/AlgoliaSandboxProbeSection";
import { AlgoliaSandboxSection } from "@app/sandbox/_sections/algolia/AlgoliaSandboxSection";
import { SanitySandboxSection } from "@app/sandbox/_sections/sanity/SanitySandboxSection";
import { UserBeaconSandboxSection } from "@app/sandbox/_sections/user-beacon/UserBeaconSandboxSection";
import type { SandboxAccessMode } from "@/lib/sandbox/is-sandbox-enabled.server";

type SandboxPageContentProps = {
  accessMode: SandboxAccessMode;
};

export function SandboxPageContent({ accessMode }: SandboxPageContentProps) {
  return (
    <main className="mx-auto flex w-full max-w-4xl flex-col gap-10 px-4 py-10">
      <header className="space-y-2">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Internal sandbox
        </p>
        <h1 className="text-3xl font-semibold text-foreground">Integration health check</h1>
        <p className="text-sm text-muted-foreground">
          Verify integrations on the Vercel deployment origin. These routes are not proxied
          through the Cloudflare Worker namespace — use the direct Vercel URL (not the worker
          domain). Access mode:{" "}
          <span className="font-mono text-foreground">{accessMode}</span>.
        </p>
      </header>

      <SandboxFormLink />
      <SanitySandboxSection />
      <UserBeaconSandboxSection />
      <AlgoliaSandboxSection />
      <AlgoliaSandboxProbeSection />
    </main>
  );
}
