import type { ReactNode } from "react";

type StatusRowProps = {
  label: string;
  value: string;
  detail?: string;
};

const toStatusRowTestId = (label: string): string =>
  label
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

function StatusRow({ label, value, detail }: StatusRowProps) {
  const testId = toStatusRowTestId(label);

  return (
    <div
      className="flex flex-col gap-1 border-b border-border py-3 last:border-b-0 sm:flex-row sm:items-start sm:justify-between"
      data-testid={`status-row-${testId}`}
    >
      <span className="text-sm font-medium text-foreground">{label}</span>
      <div className="text-right">
        <span
          className="font-mono text-sm text-foreground"
          data-testid={`status-row-${testId}-value`}
        >
          {value}
        </span>
        {detail ? (
          <p className="mt-1 text-xs text-muted-foreground">{detail}</p>
        ) : null}
      </div>
    </div>
  );
}

type StatusListProps = {
  children: ReactNode;
};

export function StatusList({ children }: StatusListProps) {
  return <div className="rounded-lg border border-border bg-background px-4">{children}</div>;
}

export { StatusRow };
