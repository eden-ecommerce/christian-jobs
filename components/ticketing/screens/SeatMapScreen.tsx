"use client";

import { useState } from "react";
import { Screen, StatusBar } from "@components/event-manager/screens/chrome";
import { Clock } from "lucide-react";

const ROWS = ["A", "B", "C", "D", "E"];
const COLS = 8;
const PRICE = 22;
// Pre-sold seats (row index * COLS + col index)
const SOLD = new Set([0, 1, 9, 18, 27, 28, 35, 36, 37]);

export function SeatMapScreen() {
  const [selected, setSelected] = useState<Set<number>>(new Set([20, 21]));

  const toggle = (id: number) => {
    if (SOLD.has(id)) return;
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const total = selected.size * PRICE;

  return (
    <Screen>
      <div className="shrink-0 bg-primary px-4 pb-3 pt-1 text-primary-foreground">
        <StatusBar light />
        <h4 className="text-sm font-semibold">Choose your seats</h4>
        <p className="text-[11px] text-primary-foreground/80">Worship Night · Main Auditorium</p>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div className="mb-3 rounded-md bg-foreground/90 py-1 text-center text-[10px] font-semibold uppercase tracking-widest text-card">
          Stage
        </div>

        <div className="flex flex-col gap-1.5">
          {ROWS.map((row, r) => (
            <div key={row} className="flex items-center justify-center gap-1.5">
              <span className="w-3 text-[9px] font-semibold text-muted-foreground">{row}</span>
              {Array.from({ length: COLS }).map((_, c) => {
                const id = r * COLS + c;
                const sold = SOLD.has(id);
                const sel = selected.has(id);
                return (
                  <button
                    key={id}
                    type="button"
                    disabled={sold}
                    onClick={() => toggle(id)}
                    aria-label={`Seat ${row}${c + 1}${sold ? " (sold)" : sel ? " (selected)" : ""}`}
                    aria-pressed={sel}
                    className={`size-5 rounded-[4px] text-[8px] font-semibold transition-colors ${
                      sold
                        ? "cursor-not-allowed bg-muted text-muted-foreground/50"
                        : sel
                          ? "bg-primary text-primary-foreground"
                          : "bg-primary/15 text-primary hover:bg-primary/30"
                    }`}
                  >
                    {c + 1}
                  </button>
                );
              })}
            </div>
          ))}
        </div>

        <div className="mt-4 flex items-center justify-center gap-4 text-[9px] text-muted-foreground">
          <span className="flex items-center gap-1"><span className="size-2.5 rounded-[3px] bg-primary/15" /> Available</span>
          <span className="flex items-center gap-1"><span className="size-2.5 rounded-[3px] bg-primary" /> Selected</span>
          <span className="flex items-center gap-1"><span className="size-2.5 rounded-[3px] bg-muted" /> Sold</span>
        </div>
      </div>

      <div className="shrink-0 border-t border-border bg-card px-4 pb-3 pt-2.5">
        <div className="flex items-center justify-between text-[11px] text-muted-foreground">
          <span className="inline-flex items-center gap-1"><Clock className="size-3" /> Seats held 15 min</span>
          <span>{selected.size} selected</span>
        </div>
        <button
          type="button"
          className="mt-2 flex w-full items-center justify-between rounded-xl bg-primary px-4 py-2.5 text-primary-foreground disabled:opacity-50"
          disabled={selected.size === 0}
        >
          <span className="text-[12px] font-semibold">Continue to checkout</span>
          <span className="font-serif text-[15px] font-semibold tabular-nums">£{total}</span>
        </button>
      </div>
    </Screen>
  );
}
