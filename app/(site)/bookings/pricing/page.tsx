import type { Metadata } from "next";
import { NsLink } from "@components/ns-link";
import { buttonVariants } from "@components/ui/button";
import { cn } from "@lib/utils";
import { SectionHeading } from "@components/event-manager/SectionHeading";
import { BookingsCtaSection } from "@components/bookings/BookingsCtaSection";
import { BkFaqList } from "@components/bookings/BkFaqList";
import { EVENT_MANAGER_HREF, TICKETING_HREF } from "@components/bookings/bk-config";
import { Check, CalendarClock, Ticket } from "lucide-react";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Simple, transparent pricing for Christian360 Bookings. No per-booking fees. Plans to fit a small church pastoral team and a national conference ministry operation.",
};

const PLANS = [
  {
    name: "Starter",
    price: "£19",
    period: "/month",
    description: "For a small church with one or two pastoral booking pages.",
    features: [
      "3 active booking pages",
      "Unlimited bookings",
      "Weekly magic link for volunteers",
      "ICS calendar sync",
      "Post-meeting review emails",
      "Minimum host safeguarding rule",
      "Inline and pop-up website embed",
      "QR code generation",
    ],
    cta: "Get started",
    highlight: false,
  },
  {
    name: "Standard",
    price: "£49",
    period: "/month",
    description: "For growing pastoral teams and multi-page operations.",
    features: [
      "Everything in Starter",
      "Unlimited active booking pages",
      "All five booking types",
      "Google Calendar OAuth",
      "Group sessions with waitlists",
      "Volunteer reliability dashboard",
      "Analytics and booking heatmap",
      "Floating button embed",
    ],
    cta: "Get started",
    highlight: true,
  },
  {
    name: "Platform",
    price: "£99",
    period: "/month",
    description: "For conference and training organisations using the full platform.",
    features: [
      "Everything in Standard",
      "LMS integration (supervision cohorts)",
      "Publish to multiple LMS cohorts",
      "Mobile app Booking Links widget",
      "Date overrides and advanced scheduling",
      "Resend confirmations and admin tools",
      "Block bookers",
      "Priority support",
    ],
    cta: "Talk to us",
    highlight: false,
  },
];

const FAQS = [
  {
    q: "We already manage appointments by email — why change?",
    a: "Email is not auditable, not scalable, and not safe. When an appointment is made by email, there is no record of the confirmation, no automatic reminder, no structured follow-up, and no oversight of who met whom. Christian360 Bookings creates a record of every booking, every confirmation, and every outcome — visible to coordinators, searchable and exportable.",
  },
  {
    q: "Our volunteers aren't technical enough to manage a calendar system.",
    a: "They don't need to. The only thing a volunteer needs to do is tap a link in an email and select the times they are free. There is no account to create, no settings to configure, no app to install. If they can read an email and tap a time slot, they can use Christian360 Bookings.",
  },
  {
    q: "We already use Calendly — why change?",
    a: "Calendly works well for a professional staff member who manages their own calendar. It is much harder to use for a team of volunteers who don't all have Google accounts, who need minimum-host safeguarding rules, whose reliability needs to be tracked, and whose booking pages need to be integrated with a learning platform and a mobile app. If you currently use Calendly for one or two named staff members, that may be fine. If you want to extend scheduling to a pastoral volunteer team or a conference prayer ministry, Christian360 Bookings is built for that context.",
  },
  {
    q: "We're worried about the safeguarding implications of online booking for pastoral care.",
    a: "So are we — which is why safeguarding is built into the system. The minimum-host setting means a session is never offered when only one volunteer is available. The post-meeting review means every session is followed up. The volunteer reliability view means patterns are visible. These are structural controls, not procedural ones.",
  },
  {
    q: "What if no volunteers are available?",
    a: "The booking page will not show slots that don't have enough available volunteers. If there are no slots at all, the page can display a 'Request a time' form — so the person's interest is captured and a coordinator can respond, even if no immediate availability exists.",
  },
  {
    q: "Can we use it without the rest of the Christian360 platform?",
    a: "Yes, though you will get less value from it. The Bookings module can be used as a standalone scheduling tool on your website — you do not need to use the Events module, the LMS or the mobile app. The LMS supervision integration requires the LMS module, and the app widget requires a branded mobile app, but the core scheduling functionality works independently.",
  },
  {
    q: "Is this only for large organisations?",
    a: "Not at all. A 60-person church with a team of three volunteer listeners gets as much from Christian360 Bookings as a national conference with a ministry team of fifty. The scale adjusts; the problem being solved is the same.",
  },
  {
    q: "Does this handle paid bookings?",
    a: "No — Christian360 Bookings is for scheduling appointments, not selling tickets. Paid events and ticketed access are handled by the Ticketing module. The reason to flag this is not to limit the product, but to avoid confusion: if you are looking for Eventbrite-style ticket sales, that is Ticketing. If you are looking for pastoral appointment scheduling, this is Bookings.",
  },
];

export default function BookingsPricingPage() {
  return (
    <main>
      {/* Header */}
      <section className="border-b border-border bg-accent/30 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4">
          <span className="text-xs font-semibold uppercase tracking-widest text-primary">Pricing</span>
          <h1 className="mt-4 text-balance font-serif text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
            Simple pricing. No per-booking fees.
          </h1>
          <p className="mt-5 max-w-xl text-pretty text-lg leading-relaxed text-muted-foreground">
            A flat monthly subscription. No charges per booking, per host or per page. Your community books in — you keep full control.
          </p>
        </div>
      </section>

      {/* Pricing cards */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:py-24">
        <div className="grid gap-6 md:grid-cols-3">
          {PLANS.map((plan) => (
            <div
              key={plan.name}
              className={`flex flex-col rounded-2xl border p-8 ${
                plan.highlight
                  ? "border-primary bg-primary/5 shadow-lg"
                  : "border-border bg-card"
              }`}
            >
              {plan.highlight && (
                <span className="mb-3 self-start rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">
                  Most popular
                </span>
              )}
              <h2 className="font-serif text-xl font-semibold text-foreground">{plan.name}</h2>
              <div className="mt-2 flex items-end gap-1">
                <span className="font-serif text-4xl font-bold text-foreground">{plan.price}</span>
                <span className="mb-1 text-sm text-muted-foreground">{plan.period}</span>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">{plan.description}</p>
              <ul className="mt-6 flex-1 space-y-2">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-foreground">
                    <Check className="mt-0.5 size-4 shrink-0 text-primary" />
                    {f}
                  </li>
                ))}
              </ul>
              <NsLink
                href="mailto:hello@eden.co.uk"
                className={cn(
                  buttonVariants({ variant: plan.highlight ? "default" : "outline", size: "lg" }),
                  "mt-8",
                )}
              >
                {plan.cta}
              </NsLink>
            </div>
          ))}
        </div>
      </section>

      {/* Cross-product callouts */}
      <section className="mx-auto max-w-7xl px-4 pb-8">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="flex items-start gap-4 rounded-2xl border border-primary/20 bg-primary/5 p-5">
            <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <CalendarClock className="size-4" />
            </span>
            <div>
              <p className="text-sm font-semibold text-foreground">Need a full event programme too?</p>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                Christian360 Bookings integrates with the Event Manager — day-planner, push notifications, mobile app and more.{" "}
                <NsLink href={EVENT_MANAGER_HREF} className="font-semibold text-primary underline underline-offset-2">
                  Explore the Event Manager
                </NsLink>
                .
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4 rounded-2xl border border-primary/20 bg-primary/5 p-5">
            <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Ticket className="size-4" />
            </span>
            <div>
              <p className="text-sm font-semibold text-foreground">Need to sell tickets too?</p>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                Paid events and ticketed access are handled separately by Christian360 Ticketing.{" "}
                <NsLink href={TICKETING_HREF} className="font-semibold text-primary underline underline-offset-2">
                  View Ticketing pricing
                </NsLink>
                .
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-4xl px-4 py-16 sm:py-24">
        <SectionHeading eyebrow="FAQs" title="Questions churches and charities ask" />
        <div className="mt-10">
          <BkFaqList items={FAQS} />
        </div>
      </section>

      <BookingsCtaSection />
    </main>
  );
}
