import { BookingsSubNav } from "@components/bookings/BookingsSubNav";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "Christian360 Bookings — Appointment Scheduling for Churches & Charities",
    template: "%s | Christian360 Bookings",
  },
  description:
    "Scheduling built for volunteer teams and faith organisations. Collect availability with a weekly magic link, enforce safeguarding rules automatically, and catch the moment before it passes.",
};

export default function BookingsLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="bg-background">
      <BookingsSubNav />
      {children}
    </div>
  );
}
