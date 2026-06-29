"use client";

import type { HealthResponse } from "@hooks/health/types";

type HealthStatusViewProps = {
  data: HealthResponse;
};

export function HealthStatusView({ data }: HealthStatusViewProps) {
  return (
    <div className="rounded-lg border border-border bg-muted/30 px-4 py-3 text-sm">
      <p>
        API status: <span className="font-medium text-foreground">{data.status}</span>
      </p>
      <p className="text-muted-foreground">Last check: {data.timestamp}</p>
    </div>
  );
}
