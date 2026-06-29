import { NsLink } from "@components/ns-link";
import { buttonVariants } from "@components/ui/button";
import { SANDBOX_PATH } from "@/lib/config";

export function SandboxFormLink() {
  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold text-foreground">Form patterns</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Partial update, tab form, and multi-step examples with per-section schemas and hooks.
        </p>
      </div>
      <NsLink href={`${SANDBOX_PATH}/form`} className={buttonVariants({ variant: "outline" })}>
        Open form demos
      </NsLink>
    </section>
  );
}
