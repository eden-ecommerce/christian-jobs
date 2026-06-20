import type { Metadata } from "next";
import { SectionHeading } from "@components/event-manager/SectionHeading";
import { BookingsCtaSection } from "@components/bookings/BookingsCtaSection";
import { BookingTypeCard } from "@components/bookings/BookingTypeCard";
import {
  Users,
  User,
  RotateCcw,
  CalendarDays,
  Layers,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Five Booking Types",
  description:
    "Host Pool, One-to-One, Round Robin, Group Session and Collective — five scheduling modes for every ministry and operational context, managed from one admin panel.",
};

const TYPES = [
  {
    icon: Users,
    name: "Host Pool",
    tagline: "For teams of volunteers",
    description:
      "A slot appears on the booking page only when enough volunteers are simultaneously free — you set the minimum, typically two for safeguarding. The system automatically assigns those with the lightest recent load so no one is over-stretched.",
    useCases: ["Prayer ministry", "Foyer pastoral care", "Post-service listening team", "Hospital chaplaincy rota", "Conference pastoral support"],
    highlight: true,
  },
  {
    icon: User,
    name: "One-to-One",
    tagline: "For confidential appointments",
    description:
      "One person books one available host. The system picks the next available host automatically, or uses round-robin load balancing. Host names and photos can be withheld from the public page until after the booking is confirmed.",
    useCases: ["Confidential pastor consultation", "Welfare check-ins", "Mentoring", "Spiritual direction", "First conversations with enquirers"],
  },
  {
    icon: RotateCcw,
    name: "Round Robin",
    tagline: "For teams of practitioners",
    description:
      "Multiple hosts, each with their own expertise or caseload. Bookings distribute evenly across the team based on who has received the fewest recent appointments. Over time the workload stays balanced without a coordinator managing the distribution.",
    useCases: ["Trained counselling teams", "Multi-practitioner chaplaincy", "Youth worker caseloads", "Referral management"],
  },
  {
    icon: CalendarDays,
    name: "Group Session",
    tagline: "For workshops and training",
    description:
      "Multiple people register for the same slot, up to a maximum capacity you set. When a session fills, a waitlist captures demand automatically — and notifies everyone simultaneously when a place opens up.",
    useCases: ["Training workshops", "Support group registration", "LMS cohort supervision", "Alpha or discovery course registration", "Coffee mornings"],
  },
  {
    icon: Layers,
    name: "Collective",
    tagline: "For panel sessions",
    description:
      "A slot is only offered when all assigned hosts are simultaneously free. Use when you need a specific combination of people in the room — a panel interview, a co-led session, or a debrief that requires two specific roles.",
    useCases: ["Safeguarding reviews", "Trustee consultations", "Panel interviews", "Co-facilitated workshops"],
  },
];

const SETTINGS_TABLE = [
  ["Session duration", "How long each appointment lasts (e.g. 30 minutes, 1 hour)"],
  ["Buffer time",      "Gap before and after bookings — prevents back-to-back sessions"],
  ["Minimum notice",  "How far ahead a booking must be made (e.g. 24 hours notice)"],
  ["Advance window",  "How far into the future slots are shown (e.g. up to 60 days)"],
  ["Slot interval",   "The grid granularity (e.g. every 30 minutes, every hour)"],
  ["Daily / weekly caps", "Optional maximum bookings per day or week across the whole page"],
  ["Date overrides",  "Specific dates set as closed (bank holidays) or open with different hours"],
  ["Timezone support","35+ timezones — booker sees slots in their local time"],
];

export default function BookingTypesPage() {
  return (
    <main>
      {/* Header */}
      <section className="border-b border-border bg-accent/30 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4">
          <span className="text-xs font-semibold uppercase tracking-widest text-primary">Booking types</span>
          <h1 className="mt-4 text-balance font-serif text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
            Five modes. One system.
          </h1>
          <p className="mt-5 max-w-2xl text-pretty text-lg leading-relaxed text-muted-foreground">
            Every ministry context is different. Christian360 Bookings has a scheduling mode designed for each one — all managed from the same admin panel, all sharing the same volunteer availability system.
          </p>
        </div>
      </section>

      {/* Type cards */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:py-24">
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {TYPES.map((t) => (
            <BookingTypeCard key={t.name} {...t} />
          ))}
        </div>
      </section>

      {/* Page-level settings */}
      <section className="border-y border-border bg-card py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4">
          <SectionHeading
            eyebrow="Scheduling rules"
            title="Every setting you need, per booking page"
            description="Each booking page has its own scheduling configuration — set once and left to run, or adjusted whenever your needs change."
          />
          <div className="mt-10 overflow-hidden rounded-2xl border border-border">
            <table className="w-full">
              <thead className="bg-accent/50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Setting</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">What it controls</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {SETTINGS_TABLE.map(([setting, description]) => (
                  <tr key={setting} className="hover:bg-accent/20">
                    <td className="px-6 py-3 text-sm font-medium text-foreground">{setting}</td>
                    <td className="px-6 py-3 text-sm text-muted-foreground">{description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <BookingsCtaSection />
    </main>
  );
}
