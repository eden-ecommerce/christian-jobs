import { cn } from "@lib/utils";

type JsonBlockProps = {
  label: string;
  value: unknown;
  className?: string;
};

export function JsonBlock({ label, value, className }: JsonBlockProps) {
  return (
    <div className={cn("space-y-2", className)}>
      <p className="text-sm font-medium text-foreground">{label}</p>
      <pre className="overflow-x-auto rounded-lg border border-border bg-muted/40 p-4 font-mono text-xs text-foreground">
        {JSON.stringify(value, null, 2)}
      </pre>
    </div>
  );
}
