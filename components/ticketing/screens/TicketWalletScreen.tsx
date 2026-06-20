"use client";

import { useState } from "react";
import { Screen, StatusBar } from "@components/event-manager/screens/chrome";
import { QrCode } from "../QrCode";
import { MapPin, CalendarDays } from "lucide-react";

const TICKETS = [
  { code: "K7M2P9QX", holder: "Sarah Bennett", type: "Early Bird Adult", seat: "Block B · Row F · 14" },
  { code: "X3R8T1LD", holder: "Tom Bennett", type: "Under 18", seat: "Block B · Row F · 15" },
];

export function TicketWalletScreen() {
  const [active, setActive] = useState(0);
  const ticket = TICKETS[active];

  return (
    <Screen className="bg-accent/40">
      <div className="shrink-0 bg-primary px-4 pb-3 pt-1 text-primary-foreground">
        <StatusBar light />
        <h4 className="text-sm font-semibold">My Tickets</h4>
        <p className="text-[11px] text-primary-foreground/80">Spring Harvest 2026</p>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
          <div className="flex items-center justify-between bg-foreground px-4 py-2 text-card">
            <span className="text-[11px] font-semibold uppercase tracking-wide">{ticket.type}</span>
            <span className="text-[10px] opacity-80">Valid</span>
          </div>
          <div className="flex flex-col items-center px-4 py-4">
            <QrCode value={ticket.code} className="w-32 rounded-lg" />
            <p className="mt-3 font-mono text-[15px] font-semibold tracking-[0.2em] text-foreground">
              {ticket.code}
            </p>
            <p className="mt-1 text-[12px] font-medium text-foreground">{ticket.holder}</p>
          </div>
          <div className="border-t border-dashed border-border px-4 py-3">
            <p className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
              <CalendarDays className="size-3" /> 12–16 Apr 2026
            </p>
            <p className="mt-1 flex items-center gap-1.5 text-[11px] text-muted-foreground">
              <MapPin className="size-3" /> {ticket.seat}
            </p>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-center gap-2">
          {TICKETS.map((t, i) => (
            <button
              key={t.code}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`Show ticket for ${t.holder}`}
              aria-current={i === active}
              className={`h-1.5 rounded-full transition-all ${
                i === active ? "w-6 bg-primary" : "w-1.5 bg-muted-foreground/40"
              }`}
            />
          ))}
        </div>
        <p className="mt-2 text-center text-[10px] text-muted-foreground">
          Tap dots to switch between your {TICKETS.length} tickets
        </p>
      </div>
    </Screen>
  );
}
