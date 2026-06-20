import type { Metadata } from "next";
import { PhoneMockup } from "@components/event-manager/PhoneMockup";
import { SectionHeading } from "@components/event-manager/SectionHeading";
import { BookingsCtaSection } from "@components/bookings/BookingsCtaSection";
import { SplitSection } from "@components/ticketing/SplitSection";
import { GroupSessionScreen } from "@components/bookings/screens";
import {
  BookOpen,
  Users,
  CalendarCheck,
  Layers,
  ArrowRight,
} from "lucide-react";

export const metadata: Metadata = {
  title: "LMS Integration",
  description:
    "Supervision sessions and cohort registration directly from the learner dashboard. No separate booking tool, no manual coordination — booking and learning are the same system.",
};

const LMS_FEATURES = [
  {
    icon: BookOpen,
    title: "Register from the learner dashboard",
    body: "When a facilitator links a booking page to an LMS Group Event, learners see a Register button on the session card in their learning dashboard. One tap registers them — no leaving the platform, no separate sign-up sheet.",
  },
  {
    icon: Users,
    title: "Capacity tracked automatically",
    body: "Each session slot has its own capacity. When it fills, the waitlist opens automatically. Learners joining the waitlist are notified the moment a place opens up — with a two-hour claim window.",
  },
  {
    icon: CalendarCheck,
    title: "Confirmation and reminders included",
    body: "Registered learners receive a confirmation email with a calendar invite, a join link, and a 24-hour reminder. The facilitator receives an attendee list. Nothing else needs to be managed.",
  },
  {
    icon: Layers,
    title: "Publish to multiple cohorts at once",
    body: "Running parallel cohorts for the same training programme? Create one booking page and publish it to all matching LMS groups at once. The system creates the right pages for each cohort's schedule without manual duplication.",
  },
];

export default function LmsPage() {
  return (
    <main>
      {/* Header */}
      <section className="border-b border-border bg-accent/30 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4">
          <span className="text-xs font-semibold uppercase tracking-widest text-primary">LMS integration</span>
          <h1 className="mt-4 text-balance font-serif text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
            Supervision sessions, booked from inside the learning platform
          </h1>
          <p className="mt-5 max-w-2xl text-pretty text-lg leading-relaxed text-muted-foreground">
            Training programmes on Christian360 frequently include live supervised sessions alongside self-paced content. In most platforms this requires a separate booking system. In Christian360, booking and learning are the same system.
          </p>
        </div>
      </section>

      {/* Group session demo */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:py-24">
        <SplitSection
          eyebrow="The TLG pattern"
          title="Monthly supervision cohorts — set up once, managed automatically"
          description="This is how TLG (Transforming Lives for Good) runs their Coaching Network supervision programme on Christian360. Coaches are enrolled in a cohort and register for their preferred monthly supervision session from within the learning platform. The system handles registration, reminders, waitlists and cancellations — the coordinator sets it up once."
          bullets={[
            "Morning and afternoon time options per month",
            "Small group capacity of 4–6 per session",
            "Waitlist and automatic notification when a place opens",
            "Calendar invite and join link in the confirmation email",
            "Facilitator receives the full attendee list",
          ]}
          media={<PhoneMockup><GroupSessionScreen /></PhoneMockup>}
          footer={
            <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <ArrowRight className="size-4 text-primary" />
              TLG Coaching Network runs this way on Christian360 today
            </span>
          }
        />
      </section>

      {/* Feature cards */}
      <section className="border-y border-border bg-card py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4">
          <SectionHeading
            eyebrow="What the integration includes"
            title="Everything a facilitator needs — nothing extra to manage"
          />
          <div className="mt-12 grid gap-5 md:grid-cols-2">
            {LMS_FEATURES.map(({ icon: Icon, title, body }) => (
              <div key={title} className="rounded-2xl border border-border bg-background p-6">
                <span className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Icon className="size-5" />
                </span>
                <h3 className="mt-4 font-serif text-lg font-semibold text-foreground">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Use case callout */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:py-24">
        <div className="rounded-3xl border border-border bg-accent/40 p-8 sm:p-12">
          <span className="text-xs font-semibold uppercase tracking-widest text-primary">Who it&apos;s for</span>
          <h2 className="mt-3 text-balance font-serif text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            Any training programme with live supervised sessions
          </h2>
          <p className="mt-4 max-w-2xl text-pretty text-base leading-relaxed text-muted-foreground">
            Discipleship courses, coaching academies, theological education, pastoral training, chaplaincy programmes and professional development for Christian workers. If your programme includes live sessions that need to be scheduled — and your learners are already on Christian360 — the LMS integration removes the need for any separate booking system.
          </p>
          <ul className="mt-6 grid gap-2 sm:grid-cols-2">
            {[
              "Coaching and mentoring supervision",
              "Theological college pastoral placements",
              "Discipleship course weekly groups",
              "Chaplaincy training cohorts",
              "Youth and children&apos;s ministry training",
              "Alpha or discovery course facilitation",
            ].map((item) => (
              <li key={item} className="flex items-center gap-2 text-sm text-foreground">
                <span className="size-1.5 shrink-0 rounded-full bg-primary" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <BookingsCtaSection />
    </main>
  );
}
