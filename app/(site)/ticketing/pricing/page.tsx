import type { Metadata } from "next";
import { SectionHeading } from "@components/event-manager/SectionHeading";
import { PageHeader } from "@components/ticketing/PageHeader";
import { TicketPricing } from "@components/ticketing/TicketPricing";
import { FaqList, type FaqItem } from "@components/ticketing/FaqList";
import { TicketCtaSection } from "@components/ticketing/TicketCtaSection";
import { tkHref, EVENT_MANAGER_HREF } from "@components/ticketing/tk-config";
import { NsLink } from "@components/ns-link";
import { BadgePoundSterling, ShieldCheck, Banknote, CalendarClock } from "lucide-react";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Simple subscription pricing with no percentage fees on your ticket revenue. Paid tickets go straight to your own Stripe account.",
  alternates: { canonical: `https://www.eden.co.uk${tkHref("/pricing")}` },
};

const REVENUE_POINTS = [
  { icon: BadgePoundSterling, title: "No fees on revenue", body: "We never take a percentage of your ticket sales — unlike Eventbrite and other commercial platforms." },
  { icon: Banknote, title: "Money goes direct", body: "Paid tickets process through your own Stripe account. You set the price; you keep every penny." },
  { icon: ShieldCheck, title: "PCI-compliant payments", body: "Card details are entered in Stripe's secure, hosted form. Christian360 never sees a card number." },
];

const FAQS: FaqItem[] = [
  {
    question: "We already use Eventbrite — why change?",
    answer:
      "Eventbrite charges a percentage of every ticket sale — on a £20 ticket that can be several percent plus a fixed fee, and it goes to Eventbrite, not you. It's also completely separate from your programme, app and community, so you end up managing two systems. Christian360 Ticketing is part of the platform that runs everything else, so the integration saves time on every event.",
  },
  {
    question: "Our events are mostly free — do we even need ticketing?",
    answer:
      "Yes, if you ever need to manage capacity, check people in, collect information, or know how many to expect. Free tickets work exactly like paid ones without the payment step — you still get a headcount, QR check-in, attendee data and the ability to email your registered attendees. Many churches use free tickets for their Christmas Carol Service.",
  },
  {
    question: "We're not technical enough to set up reserved seating.",
    answer:
      "The seating designer is a visual drag-and-drop tool — you draw your venue the way it looks and label the sections, with no code or spreadsheets. Once you've drawn a venue, you save it to your library, so your second event at the same place takes essentially no set-up time.",
  },
  {
    question: "What if check-in fails on the day?",
    answer:
      "The door PIN check-in is designed to be resilient. Volunteers can enter codes manually if the camera struggles, and can find someone by name in the attendee list. It works offline and syncs when connectivity returns, and multiple volunteers can work different doors on the same PIN.",
  },
  {
    question: "What happens when someone needs a refund?",
    answer:
      "Admins issue refunds from the admin panel, which triggers a Stripe refund to the buyer's card. You control whether a refunded ticket can still be used. For partial refunds — someone bought four tickets and returns one — you can refund and void a single holder within the order.",
  },
  {
    question: "Can we take cash or card-terminal payments on the door?",
    answer:
      "Yes. Admins can issue tickets manually with a payment method of cash, cheque, bank transfer or invoice — creating the ticket and sending the confirmation without a Stripe charge. For card terminals, take the payment offline and issue the ticket manually to match.",
  },
];

export default function PricingPage() {
  return (
    <main>
      <PageHeader
        eyebrow="Pricing"
        title="A subscription, never a cut of your sales"
        description="Christian360 Ticketing is priced as a simple platform subscription. We don't take a percentage of your ticket revenue — that money stays with your organisation."
      />

      <section className="mx-auto max-w-7xl px-4 py-16 sm:py-24">
        <TicketPricing />
        <p className="mt-8 text-center text-sm text-muted-foreground">
          Prices shown are illustrative. Ticketing is included with the wider Christian360 platform — talk to us for a quote tailored to your organisation.
        </p>
      </section>

      <section className="border-y border-border bg-card py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4">
          <SectionHeading
            eyebrow="How our pricing works"
            title="Keep your revenue"
            description="The killer difference against commercial ticketing platforms: no per-ticket fees, and payment straight to your own account."
          />
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {REVENUE_POINTS.map(({ icon: Icon, title, body }) => (
              <div key={title} className="rounded-2xl border border-border bg-card p-6">
                <div className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Icon className="size-5" />
                </div>
                <h3 className="mt-4 font-serif text-lg font-semibold text-foreground">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Event Manager cross-link */}
      <section className="mx-auto max-w-7xl px-4 pb-4 pt-4">
        <div className="flex items-start gap-4 rounded-2xl border border-primary/20 bg-primary/5 p-5">
          <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <CalendarClock className="size-4" />
          </span>
          <div>
            <p className="text-sm font-semibold text-foreground">
              Want a mobile app and programme manager too?
            </p>
            <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
              Christian360 Ticketing works seamlessly alongside the Event Manager — day-planner, live translation, push notifications, click-and-collect and more.{" "}
              <NsLink href={EVENT_MANAGER_HREF} className="font-semibold text-primary underline underline-offset-2">
                Explore the Event Manager
              </NsLink>
              .
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:py-24">
        <SectionHeading eyebrow="FAQs" title="Questions churches and charities ask" />
        <div className="mt-12">
          <FaqList items={FAQS} />
        </div>
      </section>

      <TicketCtaSection />
    </main>
  );
}
