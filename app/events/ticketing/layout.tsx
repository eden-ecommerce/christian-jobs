import { TicketSubNav } from "@components/ticketing/TicketSubNav";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "Christian360 Ticketing — Event Ticketing for Churches & Charities",
    template: "%s | Christian360 Ticketing",
  },
  description:
    "A complete, fully-integrated ticketing system for churches and charities — free and paid events, reserved seating, QR check-in, waitlists and donation add-ons. No percentage fees on your ticket revenue.",
};

export default function TicketingLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="bg-background">
      <TicketSubNav />
      {children}
    </div>
  );
}
