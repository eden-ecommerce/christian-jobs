import type { ReactNode } from "react";
import { Lock } from "lucide-react";
import { cn } from "@lib/utils";

type BrowserMockupProps = {
  url?: string;
  children: ReactNode;
  className?: string;
};

/** A desktop browser window frame for admin / web screens. */
export function BrowserMockup({
  url = "tickets.christian360.com",
  children,
  className,
}: BrowserMockupProps) {
  return (
    <div
      className={cn(
        "w-full overflow-hidden rounded-xl border border-border bg-card shadow-xl",
        className,
      )}
    >
      <div className="flex items-center gap-3 border-b border-border bg-muted/60 px-3 py-2.5">
        <div className="flex gap-1.5" aria-hidden="true">
          <span className="size-2.5 rounded-full bg-destructive/60" />
          <span className="size-2.5 rounded-full bg-chart-4/70" />
          <span className="size-2.5 rounded-full bg-primary/60" />
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="flex items-center gap-1.5 rounded-md bg-background px-3 py-1 text-[11px] text-muted-foreground">
            <Lock className="size-3" />
            {url}
          </div>
        </div>
      </div>
      <div className="bg-card">{children}</div>
    </div>
  );
}
