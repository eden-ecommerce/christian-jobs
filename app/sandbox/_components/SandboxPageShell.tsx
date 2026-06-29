import { NsLink } from "@components/ns-link";
import { buttonVariants } from "@components/ui/button";
import { SANDBOX_PATH } from "@/lib/config";
import type { ReactNode } from "react";

type SandboxPageShellProps = {
  title: string;
  description: string;
  children: ReactNode;
};

export function SandboxPageShell({ title, description, children }: SandboxPageShellProps) {
  return (
    <main className="mx-auto flex w-full max-w-4xl flex-col gap-8 px-4 py-10">
      <header className="space-y-2">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Sandbox
        </p>
        <h1 className="text-3xl font-semibold text-foreground">{title}</h1>
        <p className="text-sm text-muted-foreground">{description}</p>
      </header>

      {children}

      <NsLink
        href={SANDBOX_PATH}
        className={buttonVariants({ variant: "outline" })}
      >
        Back to sandbox
      </NsLink>
    </main>
  );
}
