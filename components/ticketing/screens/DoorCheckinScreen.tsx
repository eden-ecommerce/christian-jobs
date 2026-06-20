"use client";

import { useState } from "react";
import { Screen, StatusBar } from "@components/event-manager/screens/chrome";
import { QrCode as QrIcon, CheckCircle2, AlertTriangle, XCircle, ScanLine } from "lucide-react";

type ScanResult = {
  status: "valid" | "duplicate" | "invalid";
  name: string;
  detail: string;
};

const SCANS: ScanResult[] = [
  { status: "valid", name: "Sarah Bennett", detail: "Early Bird Adult · checked in" },
  { status: "duplicate", name: "James Okafor", detail: "Already checked in at 09:14" },
  { status: "valid", name: "Priya Sharma", detail: "Standard Adult · checked in" },
  { status: "invalid", name: "Unrecognised code", detail: "Not valid for this event" },
];

const STYLES = {
  valid: { icon: CheckCircle2, ring: "border-primary bg-primary/10 text-primary", label: "Valid ticket" },
  duplicate: { icon: AlertTriangle, ring: "border-chart-4 bg-chart-4/10 text-chart-4", label: "Already scanned" },
  invalid: { icon: XCircle, ring: "border-destructive bg-destructive/10 text-destructive", label: "Invalid code" },
} as const;

export function DoorCheckinScreen() {
  const [index, setIndex] = useState(0);
  const [checkedIn, setCheckedIn] = useState(248);
  const result = SCANS[index];
  const style = STYLES[result.status];
  const Icon = style.icon;

  const scanNext = () => {
    const next = (index + 1) % SCANS.length;
    setIndex(next);
    if (SCANS[next].status === "valid") setCheckedIn((c) => c + 1);
  };

  return (
    <Screen>
      <div className="shrink-0 bg-foreground px-4 pb-3 pt-1 text-card">
        <StatusBar light />
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-sm font-semibold">Door Check-in</h4>
            <p className="text-[11px] opacity-70">Main Entrance · PIN 4821</p>
          </div>
          <span className="rounded-full bg-card/15 px-2 py-1 text-[10px] font-semibold">
            Online
          </span>
        </div>
      </div>

      <div className="flex flex-1 flex-col items-center justify-center gap-4 px-4 py-5">
        <div className={`flex w-full flex-col items-center rounded-2xl border-2 px-4 py-5 ${style.ring}`}>
          <Icon className="size-9" />
          <p className="mt-2 text-[13px] font-semibold">{style.label}</p>
          <p className="mt-0.5 text-[13px] font-medium text-foreground">{result.name}</p>
          <p className="text-[11px] text-muted-foreground">{result.detail}</p>
        </div>

        <button
          type="button"
          onClick={scanNext}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-primary-foreground"
        >
          <ScanLine className="size-4" />
          <span className="text-[13px] font-semibold">Scan next ticket</span>
        </button>
        <button
          type="button"
          onClick={scanNext}
          className="flex items-center gap-1.5 text-[11px] font-medium text-muted-foreground"
        >
          <QrIcon className="size-3" /> Enter code manually
        </button>
      </div>

      <div className="shrink-0 border-t border-border bg-card px-4 py-3">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-serif text-xl font-semibold text-primary tabular-nums">{checkedIn}</p>
            <p className="text-[10px] text-muted-foreground">Checked in</p>
          </div>
          <div className="text-right">
            <p className="font-serif text-xl font-semibold text-foreground tabular-nums">412</p>
            <p className="text-[10px] text-muted-foreground">Expected</p>
          </div>
        </div>
      </div>
    </Screen>
  );
}
