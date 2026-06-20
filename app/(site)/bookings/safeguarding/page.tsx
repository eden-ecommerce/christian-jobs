import type { Metadata } from "next";
import { PhoneMockup } from "@components/event-manager/PhoneMockup";
import { SectionHeading } from "@components/event-manager/SectionHeading";
import { BookingsCtaSection } from "@components/bookings/BookingsCtaSection";
import { SplitSection } from "@components/ticketing/SplitSection";
import { BrowserMockup } from "@components/ticketing/BrowserMockup";
import {
  SafeguardingReviewScreen,
  AdminReliabilityScreen,
} from "@components/bookings/screens";
import {
  Shield,
  Users,
  Flag,
  EyeOff,
  Ban,
  BarChart3,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Safeguarding by Design",
  description:
    "Minimum host requirements, post-session flagging and volunteer reliability tracking — not add-ons, but core features built because we understand what faith organisations are responsible for.",
};

const FEATURES = [
  {
    icon: Users,
    title: "Minimum hosts per booking",
    body: "A slot appears on the booking page only when at least your required number of volunteers are simultaneously free. A session with one available volunteer is never shown — the safeguarding rule is structural, not procedural.",
  },
  {
    icon: Flag,
    title: "Post-meeting review",
    body: "After every session, the assigned volunteers receive a 'How did it go?' email. They can confirm it went well or flag the session for coordinator review. Flagged sessions appear in the admin panel with full context.",
  },
  {
    icon: EyeOff,
    title: "Anonymised host identity",
    body: "For sensitive booking types, the system can withhold host names and photos from the public booking page until after the booking is confirmed. Bookers see collective availability, not individual volunteers.",
  },
  {
    icon: Ban,
    title: "Block problem bookers",
    body: "If an email address misuses your booking system, admins can block it. Blocked emails are silently rejected from the booking flow — no conflict, no explanation needed.",
  },
  {
    icon: BarChart3,
    title: "Volunteer reliability tracking",
    body: "The admin panel tracks every volunteer's assignment and completion record. Volunteers who regularly decline or whose post-meeting flags accumulate are visible — not to shame them, but to prompt a pastoral check-in.",
  },
  {
    icon: Shield,
    title: "Structural controls, not procedural ones",
    body: "These are not reminders or checklists. They are rules enforced by the system itself. Your safeguarding policy doesn't depend on a coordinator manually checking every booking.",
  },
];

export default function SafeguardingPage() {
  return (
    <main>
      {/* Header */}
      <section className="border-b border-border bg-accent/30 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4">
          <span className="text-xs font-semibold uppercase tracking-widest text-primary">Safeguarding by design</span>
          <h1 className="mt-4 text-balance font-serif text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
            The only scheduling system built around safeguarding
          </h1>
          <p className="mt-5 max-w-2xl text-pretty text-lg leading-relaxed text-muted-foreground">
            No other scheduling product leads with safeguarding. Christian360 Bookings does — because the people who built it understand that pastoral ministry, prayer care and chaplaincy carry real responsibilities, and the scheduling system needs to reflect that.
          </p>
        </div>
      </section>

      {/* Feature cards */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:py-24">
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map(({ icon: Icon, title, body }) => (
            <div key={title} className="rounded-2xl border border-border bg-card p-6">
              <span className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Icon className="size-5" />
              </span>
              <h3 className="mt-4 font-serif text-lg font-semibold text-foreground">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Post-meeting review demo */}
      <section className="border-y border-border bg-card py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4">
          <SplitSection
            eyebrow="Post-meeting review"
            title="A lightweight oversight channel — fully automatic"
            description="After every session, each volunteer receives a simple 'How did it go?' check-in. They confirm it went well or flag the session for coordinator review. No form to fill in, no process to remember. The system sends it, the volunteer taps a response."
            bullets={[
              "Sent automatically after every session ends",
              "One tap to confirm, one tap to flag",
              "Flagged sessions surface to admins with full context",
              "Creates a searchable audit trail without extra admin work",
            ]}
            media={<PhoneMockup><SafeguardingReviewScreen /></PhoneMockup>}
          />
        </div>
      </section>

      {/* Reliability dashboard */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:py-24">
        <SectionHeading
          eyebrow="Volunteer reliability"
          title="Care for your volunteers as well as your community"
          description="A volunteer who regularly steps back, or whose post-meeting flags accumulate, is visible to coordinators. Not to embarrass them — but to prompt the right pastoral conversation: 'We've noticed you've had to step back a few times recently. Is everything okay?'"
        />
        <div className="mt-12">
          <BrowserMockup url="admin.christian360.com/bookings/reliability">
            <AdminReliabilityScreen />
          </BrowserMockup>
        </div>
      </section>

      <BookingsCtaSection />
    </main>
  );
}
