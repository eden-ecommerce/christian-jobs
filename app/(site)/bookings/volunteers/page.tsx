import type { Metadata } from "next";
import { PhoneMockup } from "@components/event-manager/PhoneMockup";
import { SectionHeading } from "@components/event-manager/SectionHeading";
import { BookingsCtaSection } from "@components/bookings/BookingsCtaSection";
import { SplitSection } from "@components/ticketing/SplitSection";
import { VolunteerMagicLinkScreen } from "@components/bookings/screens";
import {
  CalendarDays,
  Link,
  Smartphone,
  Mail,
  Clock,
  UserCheck,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Built for Volunteers",
  description:
    "No Google account needed. The weekly magic link means any volunteer can submit their availability from a simple email — no app, no login, no calendar settings to navigate.",
};

const METHODS = [
  {
    icon: Mail,
    title: "Weekly magic link",
    highlight: true,
    description:
      "Once a week, at a day and time you choose, every volunteer receives a short email with a link. They tap through, select the times they are free, and submit. No account. No app. No login. Just a simple 'I'm free Monday 2–4pm' and done.",
    detail:
      "This is the recommended approach for pastoral and prayer teams with retired volunteers, part-time workers, or people who find technology difficult. The only requirement is the ability to read an email and tap a time slot.",
  },
  {
    icon: Link,
    title: "ICS / iCal sync",
    highlight: false,
    description:
      "Volunteers using Outlook, Apple Calendar or any calendar that supports iCal export can paste their calendar's secret address into the system. The booking platform reads their busy times hourly and keeps availability up to date — no account connection required.",
    detail: "Works with Outlook, Apple Calendar, Fastmail, and any calendar app that supports iCal export.",
  },
  {
    icon: CalendarDays,
    title: "Google Calendar OAuth",
    highlight: false,
    description:
      "Volunteers who use Google Calendar can connect it. The system reads their FreeBusy data in real time and only offers slots when they are genuinely free. Confirmed sessions are written directly to their calendar.",
    detail: "Requires a Google account. Ideal for staff and volunteers who already manage their schedule in Google Calendar.",
  },
];

const ONBOARDING_FEATURES = [
  { icon: Smartphone, title: "Large-type, mobile-first page", body: "Designed for people who find small screens and dense interfaces difficult." },
  { icon: UserCheck,  title: "No platform account required", body: "Volunteers access their hub through a personal link — no username or password." },
  { icon: Clock,      title: "Upcoming bookings at a glance", body: "They see what they have committed to without any admin involvement." },
  { icon: Mail,       title: "Invite sent automatically",     body: "A new volunteer receives their onboarding link by email the moment they are added." },
];

export default function VolunteersPage() {
  return (
    <main>
      {/* Header */}
      <section className="border-b border-border bg-accent/30 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4">
          <span className="text-xs font-semibold uppercase tracking-widest text-primary">For Volunteers</span>
          <h1 className="mt-4 text-balance font-serif text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
            Your volunteers don&apos;t need a Google account
          </h1>
          <p className="mt-5 max-w-2xl text-pretty text-lg leading-relaxed text-muted-foreground">
            The biggest barrier to putting volunteer teams on a scheduling system is the assumption that everyone has a connected digital calendar. Christian360 Bookings removes that barrier entirely.
          </p>
        </div>
      </section>

      {/* Magic link hero split */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:py-24">
        <SplitSection
          eyebrow="The weekly magic link"
          title="Tap a link. Tap a time. Done."
          description="The weekly availability prompt is the most important feature in Christian360 Bookings for most churches and charities. It means a retired volunteer who rarely checks email can participate in your pastoral rota as easily as a full-time staff member."
          bullets={[
            "Weekly email sent at a day and time you choose",
            "Volunteer taps through and selects free times",
            "No account, no app, no calendar, no login",
            "Configurable prompt — Friday afternoon before Sunday ministry",
            "Submission takes under 60 seconds",
          ]}
          media={<PhoneMockup><VolunteerMagicLinkScreen /></PhoneMockup>}
        />
      </section>

      {/* Three availability methods */}
      <section className="border-y border-border bg-card py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4">
          <SectionHeading
            eyebrow="Availability methods"
            title="Three ways volunteers can tell the system when they're free"
          />
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {METHODS.map(({ icon: Icon, title, highlight, description, detail }) => (
              <div
                key={title}
                className={`rounded-2xl border p-6 ${highlight ? "border-primary bg-primary/5" : "border-border bg-background"}`}
              >
                <span className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Icon className="size-5" />
                </span>
                <h3 className="mt-4 font-serif text-lg font-semibold text-foreground">{title}</h3>
                {highlight && (
                  <span className="mt-1 inline-block rounded-full bg-primary px-2 py-0.5 text-[10px] font-semibold text-primary-foreground">
                    Recommended
                  </span>
                )}
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{description}</p>
                <p className="mt-3 text-xs leading-relaxed text-muted-foreground/70">{detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Host onboarding hub */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:py-24">
        <SectionHeading
          eyebrow="Host onboarding hub"
          title="One link. Everything a volunteer needs."
          description="Every volunteer host gets a personal onboarding link — a large-type, mobile-friendly page designed for people who find technology challenging. From this one page, they can set up their availability method, view upcoming bookings and understand what they have committed to."
        />
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {ONBOARDING_FEATURES.map(({ icon: Icon, title, body }) => (
            <div key={title} className="rounded-2xl border border-border bg-card p-5">
              <Icon className="size-5 text-primary" />
              <h3 className="mt-3 text-sm font-semibold text-foreground">{title}</h3>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{body}</p>
            </div>
          ))}
        </div>
      </section>

      <BookingsCtaSection />
    </main>
  );
}
