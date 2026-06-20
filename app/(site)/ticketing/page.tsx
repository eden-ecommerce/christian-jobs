import type { Metadata } from "next";
import { NsLink } from "@components/ns-link";
import { buttonVariants } from "@components/ui/button";
import { cn } from "@lib/utils";
import { SectionHeading } from "@components/event-manager/SectionHeading";
import { FeatureGrid } from "@components/event-manager/FeatureGrid";
import { LogoStrip } from "@components/event-manager/LogoStrip";
import { PhoneMockup } from "@components/event-manager/PhoneMockup";
import { TicketHero } from "@components/ticketing/TicketHero";
import { TicketCtaSection } from "@components/ticketing/TicketCtaSection";
import { SplitSection } from "@components/ticketing/SplitSection";
import { BrowserMockup } from "@components/ticketing/BrowserMockup";
import {
  CheckoutScreen,
  TicketWalletScreen,
  DoorCheckinScreen,
  SeatingDesignerScreen,
} from "@components/ticketing/screens";
import { tkHref, EVENT_MANAGER_HREF } from "@components/ticketing/tk-config";
import {
  BadgePoundSterling,
  CalendarHeart,
  Utensils,
  Music,
  GraduationCap,
  Users,
  PlusCircle,
  ScanQrCode,
  Armchair,
  ListChecks,
  ArrowRight,
  CalendarClock,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Event Ticketing for Churches & Charities",
  description:
    "Sell tickets, check people in and manage your events — all from the same platform that runs everything else. No percentage fees on your ticket revenue.",
  alternates: { canonical: `https://www.eden.co.uk/christian-jobs${tkHref("")}` },
};

const STEPS = [
  { n: "1", title: "Create an occasion", body: "Add ticket types — free or paid, with prices, quantities and sales windows. Publish to get a clean checkout page." },
  { n: "2", title: "People buy tickets", body: "A fast, no-login checkout. Card payment via Stripe, a confirmation email and a PDF ticket with a QR code." },
  { n: "3", title: "Check in on the day", body: "Scan QR codes from any phone — or hand volunteers a door PIN. No spreadsheets, no clipboards." },
  { n: "4", title: "See what happened", body: "One dashboard for attendance, revenue and the most popular sessions. Export everything to CSV." },
];

const USE_CASES = [
  { icon: CalendarHeart, title: "Carol & Easter services", description: "Free tickets and reserved seating to fairly allocate high-demand services, with QR check-in on the door." },
  { icon: Users, title: "Conferences & conventions", description: "Multiple ticket types, session gating and reserved seating for the evening celebration — at any scale." },
  { icon: Utensils, title: "Fundraising dinners", description: "Tables of ten, custom dietary questions and a donation add-on at checkout — all to your Stripe account." },
  { icon: Music, title: "Concerts & worship nights", description: "Reserved seating, concession pricing and early bird windows that close automatically." },
  { icon: GraduationCap, title: "Training days", description: "Sell out, then let the automated waitlist offer places as they free up — no manual list to manage." },
  { icon: BadgePoundSterling, title: "Charity galas", description: "Subsidised admission with optional giving, full financial reporting and zero platform fees on revenue." },
];

export default function TicketingOverviewPage() {
  return (
    <main>
      <TicketHero
        eyebrow="Christian360 Ticketing"
        headline="Ticketing built for churches and charities"
        subheadline="Sell tickets, check people in and manage your events — all from the same platform that runs your programme, app and community. Free or paid, simple or fully seated."
        screen={<CheckoutScreen />}
        secondaryScreen={<TicketWalletScreen />}
      />

      {/* Social proof */}
      <section className="border-b border-border bg-card py-10">
        <div className="mx-auto max-w-7xl px-4">
          <LogoStrip heading="In good company" />
        </div>
      </section>

      {/* Problem / no fees */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:py-24">
        <SectionHeading
          eyebrow="Why it's different"
          title="One platform instead of five disconnected tools"
          description="Most churches juggle Eventbrite for sales, a spreadsheet for attendees, email for delivery and a clipboard on the door. Christian360 Ticketing brings it all together — and never takes a cut of your ticket revenue."
        />
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {[
            { title: "No fees on your revenue", body: "Paid tickets run through your own Stripe account. You set the price, you keep the money — we charge a simple subscription, never a percentage." },
            { title: "Built for faith organisations", body: "From Keswick Convention to a 60-person church weekend away, the same system scales to fit — designed around how churches and charities actually run events." },
            { title: "Connected to everything", body: "Tickets know about your programme sessions, your mobile app and your donations. One admin team manages it all." },
          ].map((card) => (
            <div key={card.title} className="rounded-2xl border border-border bg-card p-6">
              <h3 className="font-serif text-lg font-semibold text-foreground">{card.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{card.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="border-y border-border bg-accent/30 py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4">
          <SectionHeading eyebrow="How it works" title="From set-up to sold out in four steps" />
          <ol className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((step) => (
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

      {/* Feature blocks */}
      <section className="mx-auto flex max-w-7xl flex-col gap-20 px-4 py-16 sm:py-24">
        <SplitSection
          eyebrow="The checkout"
          title="A checkout people can finish in under a minute"
          description="A clean, mobile-first checkout that needs no account. Tickets are held for 15 minutes while buyers pay securely through Stripe — and they can add a gift to your cause on the way through."
          bullets={[
            "No login required — buy in a few taps",
            "Early bird and tiered pricing, applied automatically",
            "Optional donation add-on at checkout",
            "Instant confirmation email with a PDF ticket",
          ]}
          media={<PhoneMockup>{<CheckoutScreen />}</PhoneMockup>}
        />

        <SplitSection
          reverse
          eyebrow="Check-in"
          title="Any volunteer can run the door in minutes"
          description="Generate a door PIN, hand a volunteer any smartphone, and they have a full QR scanner — with no login and no access to anything else. It works offline and syncs when connectivity returns."
          bullets={[
            "Door PIN check-in — no accounts for volunteers",
            "Instant valid / duplicate / invalid feedback",
            "Manual code entry and name search as a backup",
            "Live attendance counts across every door",
          ]}
          media={<PhoneMockup>{<DoorCheckinScreen />}</PhoneMockup>}
          footer={
            <NsLink
              href={tkHref("/check-in")}
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary"
            >
              More on check-in <ArrowRight className="size-4" />
            </NsLink>
          }
        />

        <SplitSection
          eyebrow="Reserved seating"
          title="Draw your venue once, reuse it forever"
          description="A visual drag-and-drop seating designer for rows, tables and general admission areas. Save each venue to your library and attach it to any future event — no code, no spreadsheets."
          bullets={[
            "Rows, tables and general admission sections",
            "Seat blocking and orphan-seat prevention",
            "Reusable venue and layout library",
            "Buyers pick seats on an interactive map",
          ]}
          media={
            <BrowserMockup url="admin.christian360.com/seating">
              <SeatingDesignerScreen />
            </BrowserMockup>
          }
          footer={
            <NsLink
              href={tkHref("/seating")}
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary"
            >
              Explore reserved seating <ArrowRight className="size-4" />
            </NsLink>
          }
        />
      </section>

      {/* Use cases */}
      <section className="border-y border-border bg-card py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4">
          <SectionHeading
            eyebrow="What kind of events"
            title="From a free Sunday service to a 10,000-seat convention"
            description="The same system handles simple headcount control and full reserved-seating venues. Start simple and grow into the capability you need."
          />
          <div className="mt-12">
            <FeatureGrid items={USE_CASES} />
          </div>
        </div>
      </section>

      {/* Integration — cross-link to Event Manager */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:py-24">
        <div className="rounded-3xl border border-border bg-accent/40 p-8 sm:p-12">
          <div className="grid items-center gap-8 lg:grid-cols-2">
            <div>
              <span className="text-xs font-semibold uppercase tracking-widest text-primary">
                Part of one platform
              </span>
              <h2 className="mt-3 text-balance font-serif text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                Ticketing and your event app, working as one
              </h2>
              <p className="mt-4 text-pretty text-base leading-relaxed text-muted-foreground">
                Christian360 Ticketing plugs straight into the Event Manager. Link occasions to programme sessions, gate premium or limited-capacity sessions behind the right ticket, and let attendees buy and show tickets inside your branded mobile app.
              </p>
              <NsLink
                href={EVENT_MANAGER_HREF}
                className={cn(buttonVariants({ size: "lg" }), "mt-7")}
              >
                Discover the Event Manager
              </NsLink>
            </div>
            <ul className="grid gap-3">
              {[
                { icon: ListChecks, text: "Session ticket-gating — crèche places, premium concerts, extended streams" },
                { icon: ScanQrCode, text: "In-app ticket purchase, wallet and staff QR scanning" },
                { icon: PlusCircle, text: "Donation add-on shared with the Donations module" },
                { icon: Armchair, text: "One admin team manages tickets, programme and app together" },
              ].map(({ icon: Icon, text }) => (
                <li key={text} className="flex items-start gap-3 rounded-xl border border-border bg-card p-4">
                  <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Icon className="size-4" />
                  </span>
                  <span className="text-sm leading-relaxed text-foreground">{text}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Bookings cross-link */}
      <section className="mx-auto max-w-7xl px-4 pb-4">
        <div className="flex items-start gap-4 rounded-2xl border border-primary/20 bg-primary/5 p-5">
          <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <CalendarClock className="size-4" />
          </span>
          <div>
            <p className="text-sm font-semibold text-foreground">
              Need a pastoral booking desk at your event?
            </p>
            <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
              Christian360 Bookings lets attendees reserve prayer and pastoral appointments inside the app — safeguarding rules enforced automatically, volunteer availability collected with a weekly magic link.{" "}
              <NsLink href="/bookings" className="font-semibold text-primary underline underline-offset-2">
                Explore Bookings
              </NsLink>
              .
            </p>
          </div>
        </div>
      </section>

      <TicketCtaSection />
    </main>
  );
}
