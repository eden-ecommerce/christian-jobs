import { Rows3, Circle, Square, Ban, MousePointer2 } from "lucide-react";

const TOOLS = [
  { icon: MousePointer2, label: "Select" },
  { icon: Rows3, label: "Row" },
  { icon: Circle, label: "Table" },
  { icon: Square, label: "GA area" },
  { icon: Ban, label: "Block" },
];

export function SeatingDesignerScreen() {
  return (
    <div className="flex h-[300px] text-foreground sm:h-[340px]">
      {/* Tool palette */}
      <div className="flex w-12 shrink-0 flex-col items-center gap-1 border-r border-border bg-muted/40 py-3">
        {TOOLS.map(({ icon: Icon, label }, i) => (
          <div
            key={label}
            title={label}
            className={`flex size-8 items-center justify-center rounded-lg ${
              i === 1 ? "bg-primary text-primary-foreground" : "text-muted-foreground"
            }`}
          >
            <Icon className="size-4" />
          </div>
        ))}
      </div>

      {/* Canvas */}
      <div className="relative flex-1 overflow-hidden bg-[radial-gradient(var(--color-border)_1px,transparent_1px)] [background-size:14px_14px]">
        <div className="absolute left-1/2 top-3 -translate-x-1/2 rounded bg-foreground/90 px-6 py-1 text-[9px] font-semibold uppercase tracking-widest text-card">
          Stage
        </div>

        {/* Rows */}
        <div className="absolute left-6 top-12 flex flex-col gap-1.5">
          {["A", "B", "C"].map((row) => (
            <div key={row} className="flex items-center gap-1">
              <span className="w-3 text-[8px] font-semibold text-muted-foreground">{row}</span>
              {Array.from({ length: 10 }).map((_, c) => (
                <span key={c} className="size-3 rounded-[3px] bg-primary/30" />
              ))}
            </div>
          ))}
        </div>

        {/* Tables */}
        <div className="absolute right-8 top-14 grid grid-cols-2 gap-3">
          {[1, 2, 3, 4].map((t) => (
            <div
              key={t}
              className="flex size-12 items-center justify-center rounded-full border-2 border-dashed border-primary/50 text-[8px] font-semibold text-primary"
            >
              T{t}
            </div>
          ))}
        </div>

        {/* GA area */}
        <div className="absolute bottom-4 left-6 right-8 flex h-12 items-center justify-center rounded-lg border-2 border-dashed border-chart-4/60 bg-chart-4/10 text-[9px] font-semibold uppercase tracking-wide text-chart-4">
          General Admission · Balcony
        </div>
      </div>

      {/* Properties panel */}
      <div className="hidden w-44 shrink-0 flex-col gap-3 border-l border-border bg-card p-3 lg:flex">
        <p className="text-[11px] font-semibold text-foreground">Row A</p>
        <div className="flex flex-col gap-2 text-[10px] text-muted-foreground">
          <label className="flex flex-col gap-1">
            Seats
            <span className="rounded border border-border bg-background px-2 py-1 text-foreground">10</span>
          </label>
          <label className="flex flex-col gap-1">
            Ticket type
            <span className="rounded border border-border bg-background px-2 py-1 text-foreground">Standard</span>
          </label>
          <label className="flex flex-col gap-1">
            Numbering
            <span className="rounded border border-border bg-background px-2 py-1 text-foreground">Left → right</span>
          </label>
        </div>
        <button
          type="button"
          className="mt-auto rounded-lg bg-primary px-3 py-1.5 text-[11px] font-semibold text-primary-foreground"
        >
          Save to venue library
        </button>
      </div>
    </div>
  );
}
