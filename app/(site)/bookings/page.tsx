import type { Metadata } from "next";
import { NsLink } from "@components/ns-link";
import { buttonVariants } from "@components/ui/button";
import { cn } from "@lib/utils";
import { SectionHeading } from "@components/event-manager/SectionHeading";
import { FeatureGrid } from "@components/event-manager/FeatureGrid";
import { LogoStrip } from "@components/event-manager/LogoStrip";
import { PhoneMockup } from "@components/event-manager/PhoneMockup";
import { BrowserMockup } from "@components/ticketing/BrowserMockup";
import { SplitSection } from "@components/ticketing/SplitSection";
import { BookingsHero } from "@components/bookings/BookingsHero";
import { BookingsCtaSection } from "@components/bookings/BookingsCtaSection";
import { BookingTypeCard } from "@components/bookings/BookingTypeCard";
import {
  BookingCalendarScreen,
  VolunteerMagicLinkScreen,
  SafeguardingReviewScreen,
  GroupSessionScreen,
  AdminReliabilityScreen,
} from "@components/bookings/screens";
import { bkHref, EVENT_MANAGER_HREF, TICKETING_HREF } from "@components/bookings/bk-config";
import {
  Users,
  User,
  RotateCcw,
  CalendarDays,
  Layers,
  QrCode,
  Shield,
  Video,
  BookOpen,
  BarChart3,
  Link2,
  ArrowRight,
  CalendarCheck,
  Ticket,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Appointment Scheduling for Churches & Charities",
  description:
    "No opportunity wasted. A booking link on your website and a QR code on your noticeboard mean anyone can take the first step — volunteer-first, safeguarding by design.",
};

const HOW_IT_WORKS = [
  { n: "1", title: "Admin creates a booking page", body: "Set the session type, duration, safeguarding rules and availability window. Publish in minutes." },
  { n: "2", title: "Volunteers say when they're free", body: "A weekly email with a magic link — no app, no account. Tap the times you're free and submit." },
  { n: "3", title: "Your community books in", body: "A clean, mobile-friendly page with no login. Select a time, enter a name and email, confirm." },
  { n: "4", title: "Everyone is notified automatically", body: "Confirmation, calendar invite, reminders, post-meeting follow-up — handled without any admin action." },
];

const BOOKING_TYPES = [
  {
    icon: Users,
    name: "Host Pool",
    tagline: "For volunteer teams",
    description: "A slot only appears when enough volunteers are simultaneously free. You set the minimum — typically two, for safeguarding. The system assigns those with the lightest recent load.",
    useCases: ["Prayer ministry", "Pastoral care team", "Conference ministry desk"],
    highlight: true,
  },
  {
    icon: User,
    name: "One-to-One",
    tagline: "For confidential appointments",
    description: "One person books one available host. Round-robin assignment, optional anonymous hosts until after booking is confirmed.",
    useCases: ["Pastor consultation", "Welfare check-ins", "Spiritual direction"],
  },
  {
    icon: RotateCcw,
    name: "Round Robin",
    tagline: "For teams of practitioners",
    description: "Bookings distribute evenly across hosts by fewest recent appointments. No coordinator managing the rota.",
    useCases: ["Counselling team", "Multi-chaplain programme", "Youth worker caseloads"],
  },
  {
    icon: CalendarDays,
    name: "Group Session",
    tagline: "For workshops and training",
    description: "Multiple people register for the same slot up to a set capacity. Waitlist kicks in automatically when full.",
    useCases: ["LMS supervision", "Alpha registration", "Support groups"],
  },
  {
    icon: Layers,
    name: "Collective",
    tagline: "For panel sessions",
    description: "A slot only appears when all named hosts are simultaneously free. For sessions that require a specific combination of people.",
    useCases: ["Safeguarding reviews", "Trustee consultations", "Co-facilitated workshops"],
  },
];

const INTEGRATION_ITEMS = [
  { icon: CalendarCheck, text: "Pastoral booking pages scoped to a conference or event context" },
  { icon: Ticket,        text: "Session check-in and attendee data shared with Ticketing" },
  { icon: BookOpen,      text: "Supervision sessions linked from inside the LMS learner dashboard" },
  { icon: Link2,         text: "Booking Links widget for the Christian360 branded mobile app" },
];

export default function BookingsOverviewPage() {
  return (
    <main>
      {/* 1. Hero */}
      <BookingsHero
        eyebrow="Christian360 Bookings"
        headline="No opportunity wasted"
        subheadline="Scheduling built for volunteer teams. A QR code on your noticeboard, a link on your website, or a button in your event app — anyone who wants to talk can book in, instantly, without having to knock on a door."
        screen={<BookingCalendarScreen />}
        secondaryScreen={<VolunteerMagicLinkScreen />}
      />

      {/* Social proof */}
      <section className="border-b border-border bg-card py-10">
        <div className="mx-auto max-w-7xl px-4">
          <LogoStrip heading="Trusted by" />
        </div>
      </section>

      {/* 3. The missed moment */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:py-24">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div>
            <span className="text-xs font-semibold uppercase tracking-widest text-primary">
              The missed moment
            </span>
            <h2 className="mt-3 text-balance font-serif text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              The person who almost didn&apos;t reach out
            </h2>
            <p className="mt-4 text-pretty text-base leading-relaxed text-muted-foreground">
              Someone walks past your building on a Tuesday afternoon. Something makes them look at the noticeboard. They think about going inside — and don&apos;t. They wonder if it&apos;s okay to send an email to a church they&apos;ve never visited — and talk themselves out of it.
            </p>
            <p className="mt-4 text-pretty text-base leading-relaxed text-muted-foreground">
              That moment passes. No one in your congregation ever knew it happened.
            </p>
            <p className="mt-4 font-medium text-foreground">
              A QR code on that noticeboard changes this. The moment of interest becomes a confirmed appointment — automatically assigned, confirmed by email, and in everyone&apos;s calendar.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              { icon: QrCode,    title: "QR code on your noticeboard",  body: "Scan, pick a time, done. No phone number to find, no email to write." },
              { icon: Video,     title: "First virtual conversation",   body: "Built-in video rooms — no Zoom subscription needed." },
              { icon: Users,     title: "Two volunteers in the room",   body: "Safeguarding minimum-host rules enforced automatically." },
              { icon: CalendarDays, title: "Calendar invite arrives",   body: "ICS invite works in Google, Outlook, Apple Calendar, and every other app." },
            ].map(({ icon: Icon, title, body }) => (
              <div key={title} className="rounded-2xl border border-border bg-card p-5">
                <Icon className="size-5 text-primary" />
                <h3 className="mt-3 text-sm font-semibold text-foreground">{title}</h3>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. How it works */}
      <section id="how-it-works" className="border-y border-border bg-accent/30 py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4">
          <SectionHeading eyebrow="How it works" title="Set it up once. The system runs itself." />
          <ol className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {HOW_IT_WORKS.map((step) => (
              <li key={step.n} className="rounded-2xl border border-border bg-card p-6">
                <span className="flex size-9 items-center justify-center rounded-full bg-primary font-serif text-base font-semibold text-primary-foreground">
                  {step.n}
                </span>
                <h3 className="mt-4 font-serif text-lg font-semibold text-foreground">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{step.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* 5. Built for volunteers */}
      <section className="mx-auto flex max-w-7xl flex-col gap-20 px-4 py-16 sm:py-24">
        <SplitSection
          eyebrow="Built for volunteers"
          title="No Google account required — ever"
          description="Most scheduling tools assume every host has a connected digital calendar. Christian360 Bookings doesn't. Volunteers who find technology difficult can submit their availability from a simple weekly email — no account, no app, no login."
          bullets={[
            "Weekly magic link — tap a time, tap submit",
            "Configurable prompt day and time",
            "ICS sync for Outlook, Apple Calendar and others",
            "Google Calendar OAuth for those who prefer it",
            "Large-type host onboarding hub — one link, one page",
          ]}
          media={<PhoneMockup><VolunteerMagicLinkScreen /></PhoneMockup>}
          footer={
            <NsLink
              href={bkHref("/volunteers")}
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary"
            >
              More on volunteer availability <ArrowRight className="size-4" />
            </NsLink>
          }
        />

        {/* 6. Safeguarding */}
        <SplitSection
          reverse
          eyebrow="Safeguarding by design"
          title="The only scheduling system built around safeguarding"
          description="Minimum host requirements, post-session flagging and volunteer reliability tracking are not add-ons. They are core features, built because we understand what faith organisations are responsible for."
          bullets={[
            "Slot only appears when minimum hosts are free",
            "Post-meeting 'How did it go?' email to all volunteers",
            "Flag sessions for coordinator review",
            "Anonymous hosts until after booking is confirmed",
            "Block problem bookers by email address",
          ]}
          media={<PhoneMockup><SafeguardingReviewScreen /></PhoneMockup>}
          footer={
            <NsLink
              href={bkHref("/safeguarding")}
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary"
            >
              Explore safeguarding features <ArrowRight className="size-4" />
            </NsLink>
          }
        />

        {/* Group sessions */}
        <SplitSection
          eyebrow="Group sessions"
          title="Registration, capacity and waitlists — fully automatic"
          description="Set a maximum per slot and let people register directly. When a session fills the waitlist captures demand automatically. When a place opens up, everyone on the waitlist is notified simultaneously — the first to claim it secures the spot."
          bullets={[
            "Multiple registrants per slot",
            "Set capacity or track headcount only",
            "Automatic waitlist when full",
            "Two-hour claim window when a place opens",
            "LMS supervision pattern built in",
          ]}
          media={<PhoneMockup><GroupSessionScreen /></PhoneMockup>}
          footer={
            <NsLink
              href={bkHref("/booking-types")}
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary"
            >
              All five booking types <ArrowRight className="size-4" />
            </NsLink>
          }
        />

        {/* Analytics */}
        <SplitSection
          reverse
          eyebrow="Analytics"
          title="See how your volunteer team is really doing"
          description="The reliability dashboard shows every host's assignment and completion record. Coordinators can spot volunteers who are over-stretched or stepping back — and have a pastoral conversation before burnout sets in."
          bullets={[
            "Sessions assigned, confirmed and flagged per host",
            "Reliability score and trend per volunteer",
            "Booking volume, cancellations and no-shows",
            "Heatmap of when people seek support",
          ]}
          media={
            <BrowserMockup url="admin.christian360.com/bookings/reliability">
              <AdminReliabilityScreen />
            </BrowserMockup>
          }
        />
      </section>

      {/* 7. Five booking types */}
      <section className="border-y border-border bg-card py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4">
          <SectionHeading
            eyebrow="Booking types"
            title="Five modes. One system."
            description="Every ministry context is different. Christian360 Bookings has a scheduling mode designed for each one."
          />
          <div className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {BOOKING_TYPES.map((bt) => (
              <BookingTypeCard key={bt.name} {...bt} />
            ))}
          </div>
          <div className="mt-8 text-center">
            <NsLink
              href={bkHref("/booking-types")}
              className={cn(buttonVariants({ variant: "outline", size: "lg" }))}
            >
              Explore all booking types
            </NsLink>
          </div>
        </div>
      </section>

      {/* 8. Use cases */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:py-24">
        <SectionHeading
          eyebrow="Church and charity use cases"
          title="From a village church to a national conference"
          description="The same system handles a small pastoral listening team and Spring Harvest's in-the-moment ministry booking at scale."
        />
        <div className="mt-12">
          <FeatureGrid items={[
            { icon: QrCode,       title: "Open-door outreach",          description: "A QR code on your noticeboard reaches people before they are ready to attend a service." },
            { icon: Users,        title: "Conference prayer ministry",  description: "Spring Harvest attendees book a prayer appointment inside the app — no queuing at a desk." },
            { icon: Shield,       title: "Counselling referral triage", description: "Host Pool ensures triage sessions are never one-to-one. Custom intake questions brief the team." },
            { icon: BookOpen,     title: "LMS supervision cohorts",     description: "TLG Coaching Network coaches register for monthly supervision from inside the learning platform." },
            { icon: Video,        title: "Chaplaincy programme",        description: "Students book welfare sessions via a university website embed. No university login required." },
            { icon: BarChart3,    title: "Pastoral care team",          description: "Round Robin distributes referrals evenly. The reliability dashboard surfaces unsustainable caseloads." },
          ]} />
        </div>
      </section>

      {/* 11. Integration */}
      <section className="border-y border-border bg-accent/30 py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4">
          <div className="rounded-3xl border border-border bg-card p-8 sm:p-12">
            <div className="grid items-center gap-8 lg:grid-cols-2">
              <div>
                <span className="text-xs font-semibold uppercase tracking-widest text-primary">
                  Part of one platform
                </span>
                <h2 className="mt-3 text-balance font-serif text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                  Bookings, Events and Learning — connected
                </h2>
                <p className="mt-4 text-pretty text-base leading-relaxed text-muted-foreground">
                  Christian360 Bookings is a module, not a standalone tool. It connects to the Event Manager for conference pastoral teams, to Ticketing for session management, and to the LMS for supervision cohorts — all from one admin panel.
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <NsLink
                    href={EVENT_MANAGER_HREF}
                    className={cn(buttonVariants({ size: "lg" }))}
                  >
                    Event Manager
                  </NsLink>
                  <NsLink
                    href={TICKETING_HREF}
                    className={cn(buttonVariants({ variant: "outline", size: "lg" }))}
                  >
                    Ticketing
                  </NsLink>
                </div>
              </div>
              <ul className="grid gap-3">
                {INTEGRATION_ITEMS.map(({ icon: Icon, text }) => (
                  <li key={text} className="flex items-start gap-3 rounded-xl border border-border bg-background p-4">
                    <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <Icon className="size-4" />
                    </span>
                    <span className="text-sm leading-relaxed text-foreground">{text}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <BookingsCtaSection />
    </main>
  );
}
