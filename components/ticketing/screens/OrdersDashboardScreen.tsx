import { Search, Download } from "lucide-react";

const STATS = [
  { label: "Revenue", value: "£18,420" },
  { label: "Tickets sold", value: "412" },
  { label: "Checked in", value: "248" },
  { label: "Waitlist", value: "37" },
];

const ORDERS = [
  { ref: "SH-1042", name: "Sarah Bennett", type: "Early Bird Adult ×3", paid: "£237", status: "Checked in" },
  { ref: "SH-1041", name: "James Okafor", type: "Standard Adult ×2", paid: "£198", status: "Confirmed" },
  { ref: "SH-1040", name: "Grace Community", type: "Youth ×12", paid: "Comp", status: "Confirmed" },
  { ref: "SH-1039", name: "Priya Sharma", type: "Standard Adult ×1", paid: "£99", status: "Refunded" },
];

const STATUS_STYLE: Record<string, string> = {
  "Checked in": "bg-primary/15 text-primary",
  Confirmed: "bg-accent text-foreground",
  Refunded: "bg-destructive/15 text-destructive",
};

export function OrdersDashboardScreen() {
  return (
    <div className="flex h-[300px] flex-col text-foreground sm:h-[340px]">
      <div className="flex items-center justify-between border-b border-border px-4 py-2.5">
        <p className="font-serif text-sm font-semibold">Spring Harvest 2026 · Orders</p>
        <span className="inline-flex items-center gap-1 rounded-lg bg-primary px-2.5 py-1 text-[10px] font-semibold text-primary-foreground">
          <Download className="size-3" /> Export CSV
        </span>
      </div>

      <div className="grid grid-cols-4 gap-2 px-4 py-3">
        {STATS.map((s) => (
          <div key={s.label} className="rounded-lg border border-border bg-muted/30 p-2">
            <p className="font-serif text-base font-semibold tabular-nums text-foreground">{s.value}</p>
            <p className="text-[9px] text-muted-foreground">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="mx-4 mb-2 flex items-center gap-2 rounded-lg border border-border bg-background px-2.5 py-1.5 text-[10px] text-muted-foreground">
        <Search className="size-3" /> Search orders by name, email or reference
      </div>

      <div className="flex-1 overflow-hidden px-4">
        <table className="w-full text-left text-[10px]">
          <thead className="text-muted-foreground">
            <tr className="border-b border-border">
              <th className="py-1.5 font-medium">Ref</th>
              <th className="py-1.5 font-medium">Buyer</th>
              <th className="hidden py-1.5 font-medium sm:table-cell">Tickets</th>
              <th className="py-1.5 font-medium">Paid</th>
              <th className="py-1.5 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {ORDERS.map((o) => (
              <tr key={o.ref} className="border-b border-border/60">
                <td className="py-1.5 font-mono text-foreground">{o.ref}</td>
                <td className="py-1.5 text-foreground">{o.name}</td>
                <td className="hidden py-1.5 text-muted-foreground sm:table-cell">{o.type}</td>
                <td className="py-1.5 tabular-nums text-foreground">{o.paid}</td>
                <td className="py-1.5">
                  <span className={`rounded-full px-2 py-0.5 text-[9px] font-semibold ${STATUS_STYLE[o.status]}`}>
                    {o.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
