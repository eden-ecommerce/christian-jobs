import { PricingTable } from "@components/event-manager/PricingTable";
import { SectionHeading } from "@components/event-manager/SectionHeading";
import { LogoStrip } from "@components/event-manager/LogoStrip";
import { CtaSection } from "@components/event-manager/CtaSection";
import { EM_PATH } from "@components/event-manager/em-config";
import { NsLink } from "@components/ns-link";
import { Ticket } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Simple, tiered pricing for Christian360 Events — affordable plans for smaller churches and enterprise capabilities for major conferences and festivals.",
  alternates: { canonical: `https://www.eden.co.uk/christian-jobs${EM_PATH}/pricing` },
};

const FAQS = [
  {
    q: "Is there a plan for small churches?",
    a: "Yes. Our Church plan is designed to be affordable for smaller congregations, including a branded app, weekly planner and talks archive from £29 a month.",
  },
  {
    q: "Can we scale up as we grow?",
    a: "Absolutely. You can move between plans at any time — start on Church, step up to Growth for multi-site features, or move to Enterprise for large festivals.",
  },
  {
    q: "Do festivals really get unlimited delegates?",
    a: "Our Enterprise plan supports unlimited delegates along with live translation, multi-stage programme building and dedicated account management.",
  },
  {
    q: "Is the mobile app included?",
    a: "Every plan includes a beautifully branded mobile app for both iOS and Android — there is no separate app development cost.",
  },
];

export default function PricingPage() {
  return (
    <main>
      <section className="border-b border-border bg-gradient-to-b from-accent/40 to-background py-14 sm:py-20">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <span className="inline-flex items-center rounded-full border border-primary/30 bg-card px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary">
            Pricing
          </span>
          <h1 className="mt-5 text-balance font-serif text-4xl font-semibold leading-tight tracking-tight text-foreground sm:text-5xl">
            Affordable for churches, powerful enough for festivals
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-pretty text-lg leading-relaxed text-muted-foreground">
            Straightforward, tiered pricing that grows with you. No hidden fees, and a branded mobile app included on every plan.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:py-20">
        <PricingTable />
        <p className="mt-8 text-center text-sm text-muted-foreground">
          All prices exclude VAT. Annual billing available with two months free.
        </p>
      </section>

      {/* Ticketing cross-link */}
      <section className="mx-auto max-w-7xl px-4 pb-4">
        <div className="flex items-start gap-4 rounded-2xl border border-primary/20 bg-primary/5 p-5">
          <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Ticket className="size-4" />
          </span>
          <div>
            <p className="text-sm font-semibold text-foreground">
              Ticketing is priced separately.
            </p>
            <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
              Christian360 Ticketing has its own simple fee-free plans starting at £19/month.{" "}
              <NsLink href="/ticketing/pricing" className="font-semibold text-primary underline underline-offset-2">
                View Ticketing pricing
              </NsLink>
              {" "}— or add it to your Event Manager plan at any time.
            </p>
          </div>
        </div>
      </section>

      <section className="border-y border-border bg-card py-12">
        <div className="mx-auto max-w-7xl px-4">
          <LogoStrip heading="Chosen by organisations large and small" />
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 py-16 sm:py-20">
        <SectionHeading title="Pricing questions, answered" />
        <dl className="mt-10 flex flex-col gap-6">
          {FAQS.map((faq) => (
            <div key={faq.q} className="rounded-2xl border border-border bg-card p-6">
              <dt className="font-serif text-lg font-semibold text-foreground">{faq.q}</dt>
              <dd className="mt-2 text-sm leading-relaxed text-muted-foreground">{faq.a}</dd>
            </div>
          ))}
        </dl>
      </section>

      <CtaSection
        title="Not sure which plan fits?"
        description="Book a demo and we'll recommend the right plan for your church, conference or retreat — and answer any pricing questions."
      />
    </main>
  );
}
