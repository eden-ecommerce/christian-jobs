"use client";

import { useState } from "react";
import { Screen } from "@components/event-manager/screens/chrome";
import { ChevronLeft, Lock, Minus, Plus, Clock } from "lucide-react";

type TicketType = {
  id: string;
  name: string;
  note: string;
  price: number;
};

const TICKET_TYPES: TicketType[] = [
  { id: "early", name: "Early Bird Adult", note: "Ends 31 Jan", price: 79 },
  { id: "standard", name: "Standard Adult", price: 99, note: "Most popular" },
  { id: "youth", name: "Under 18", note: "Concession", price: 39 },
];

const DONATION = 10;

export function CheckoutScreen() {
  const [qty, setQty] = useState<Record<string, number>>({
    early: 2,
    standard: 0,
    youth: 1,
  });
  const [gift, setGift] = useState(true);

  const update = (id: string, delta: number) =>
    setQty((q) => ({ ...q, [id]: Math.max(0, (q[id] ?? 0) + delta) }));

  const ticketTotal = TICKET_TYPES.reduce(
    (sum, t) => sum + (qty[t.id] ?? 0) * t.price,
    0,
  );
  const total = ticketTotal + (gift ? DONATION : 0);
  const count = Object.values(qty).reduce((a, b) => a + b, 0);

  return (
    <Screen>
      <div className="flex shrink-0 items-center justify-between border-b border-border bg-card px-4 pb-2.5 pt-3 text-foreground">
        <ChevronLeft className="size-4 text-muted-foreground" />
        <span className="text-[12px] font-semibold">Secure checkout</span>
        <Lock className="size-3.5 text-primary" />
      </div>

      <div className="flex-1 overflow-y-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div className="bg-accent/50 px-4 py-3">
          <p className="font-serif text-[15px] font-semibold leading-tight text-foreground">
            Spring Harvest 2026
          </p>
          <p className="text-[11px] text-muted-foreground">12–16 Apr · Minehead</p>
        </div>

        <div className="flex flex-col gap-2.5 px-4 py-3">
          {TICKET_TYPES.map((t) => (
            <div
              key={t.id}
              className="flex items-center justify-between rounded-xl border border-border bg-card p-3"
            >
              <div className="min-w-0">
                <p className="truncate text-[12px] font-semibold text-foreground">{t.name}</p>
                <p className="text-[10px] text-muted-foreground">
                  {t.note} · £{t.price}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => update(t.id, -1)}
                  aria-label={`Remove one ${t.name}`}
                  className="flex size-6 items-center justify-center rounded-full border border-border text-muted-foreground"
                >
                  <Minus className="size-3" />
                </button>
                <span className="w-4 text-center text-[12px] font-semibold tabular-nums text-foreground">
                  {qty[t.id] ?? 0}
                </span>
                <button
                  type="button"
                  onClick={() => update(t.id, 1)}
                  aria-label={`Add one ${t.name}`}
                  className="flex size-6 items-center justify-center rounded-full bg-primary text-primary-foreground"
                >
                  <Plus className="size-3" />
                </button>
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={() => setGift((g) => !g)}
            aria-pressed={gift}
            className="mt-1 flex items-center justify-between rounded-xl border border-dashed border-primary/40 bg-primary/5 p-3 text-left"
          >
            <span className="text-[11px] font-medium text-foreground">
              Add a £10 gift to the Bursary Fund
            </span>
            <span
              className={`relative h-4 w-7 shrink-0 rounded-full transition-colors ${
                gift ? "bg-primary" : "bg-muted-foreground/40"
              }`}
            >
              <span
                className={`absolute top-0.5 size-3 rounded-full bg-card transition-all ${
                  gift ? "left-3.5" : "left-0.5"
                }`}
              />
            </span>
          </button>
        </div>
      </div>

      <div className="shrink-0 border-t border-border bg-card px-4 pb-3 pt-2.5">
        <div className="flex items-center justify-between text-[11px] text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <Clock className="size-3" /> Held for 15:00
          </span>
          <span>{count} ticket{count === 1 ? "" : "s"}</span>
        </div>
        <button
          type="button"
          className="mt-2 flex w-full items-center justify-between rounded-xl bg-primary px-4 py-2.5 text-primary-foreground"
        >
          <span className="text-[12px] font-semibold">Pay with card</span>
          <span className="font-serif text-[15px] font-semibold tabular-nums">£{total}</span>
        </button>
      </div>
    </Screen>
  );
}
