import type { Metadata } from "next";
import { SectionHeading } from "@components/event-manager/SectionHeading";
import { FeatureGrid } from "@components/event-manager/FeatureGrid";
import { PageHeader } from "@components/ticketing/PageHeader";
import { SplitSection } from "@components/ticketing/SplitSection";
import { BrowserMockup } from "@components/ticketing/BrowserMockup";
import { TicketCtaSection } from "@components/ticketing/TicketCtaSection";
import { OrdersDashboardScreen } from "@components/ticketing/screens";
import { tkHref } from "@components/ticketing/tk-config";
import {
  Ticket,
  CreditCard,
  Timer,
  Gauge,
  EyeOff,
  Tags,
  ClipboardList,
  Mail,
  Upload,
  FileText,
  RefreshCcw,
  ListOrdered,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Features",
  description:
    "Free and paid tickets, early bird pricing, discount and access codes, custom questions, waitlists, manual and bulk issue, and a full admin dashboard.",
  alternates: { canonical: `https://www.eden.co.uk${tkHref("/features")}` },
};

const TICKET_FEATURES = [
  { icon: Ticket, title: "Free & paid tickets", description: "Manage capacity for free events, or sell paid tickets via Stripe — multiple ticket types per occasion." },
  { icon: Timer, title: "Early bird & tiered pricing", description: "Configure as many date-based pricing windows as you need; prices step up automatically, no manual changes." },
  { icon: Gauge, title: "Capacity & sales windows", description: "Per-type and overall capacity, plus start and end dates for when each ticket type goes on sale." },
  { icon: EyeOff, title: "Private ticket types", description: "Hide complimentary, volunteer or supporter tickets until the buyer enters an access code." },
  { icon: Tags, title: "Discount & promo codes", description: "Percentage or fixed-amount codes with usage limits, validity windows, minimums and caps." },
  { icon: ClipboardList, title: "Custom questions", description: "Collect dietary needs, accessibility, consent or T-shirt size — at order or per-ticket-holder level." },
];

const WAITLIST_FEATURES = [
  { icon: ListOrdered, title: "Automatic queue", description: "When you sell out, a Join Waitlist option appears and people add themselves with their details." },
  { icon: RefreshCcw, title: "Auto-offers on cancellation", description: "When a place opens up, the next person is emailed a claim link with a configurable time window." },
  { icon: Mail, title: "Admin-triggered offers", description: "See everyone queued and their position, and send an offer to anyone on the list at any time." },
];

export default function FeaturesPage() {
  return (
    <main>
      <PageHeader
        eyebrow="Features"
        title="Every kind of ticket, sold your way"
        description="A single occasion can carry as many ticket types, prices and rules as you need — from a free service headcount to a multi-tier conference pass."
      />

      <section className="mx-auto max-w-7xl px-4 py-16 sm:py-24">
        <SectionHeading
          eyebrow="Ticket types"
          title="Flexible pricing and access control"
          description="Set prices, capacities, sales windows and private access — all date-driven and automatic."
        />
        <div className="mt-12">
          <FeatureGrid items={TICKET_FEATURES} />
        </div>
      </section>

      <section className="border-y border-border bg-card py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4">
          <SplitSection
            eyebrow="Admin dashboard"
            title="Manage orders, refunds and reporting in one place"
            description="Search every order, view buyer and holder detail, refund whole orders or single holders, and export orders, attendees and a financial summary to CSV. Every action is logged."
            bullets={[
              "Searchable orders with full detail view",
              "Full and partial refunds, per holder",
              "Orders, attendee and financial CSV exports",
              "Queryable activity log of every action",
            ]}
            media={
              <BrowserMockup url="admin.christian360.com/orders">
                <OrdersDashboardScreen />
              </BrowserMockup>
            }
          />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:py-24">
        <SectionHeading
          eyebrow="Waitlists"
          title="Never lose an interested person"
          description="Sold-out events keep working for you — the automated waitlist captures interest and fills places the moment they free up."
        />
        <div className="mt-12">
          <FeatureGrid items={WAITLIST_FEATURES} />
        </div>
      </section>

      <section className="border-t border-border bg-accent/30 py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4">
          <SectionHeading
            eyebrow="Beyond the public checkout"
            title="Tickets that bypass payment, and messages that reach everyone"
          />
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {[
              { icon: FileText, title: "Manual issue", body: "Issue tickets directly — marking payment as complimentary, cash, cheque, bank transfer or invoice. The attendee gets the same PDF ticket." },
              { icon: Upload, title: "Bulk CSV issue", body: "Upload up to 500 attendees and issue them all in one operation — ideal for a youth group or a charity distributing places." },
              { icon: Mail, title: "Communications", body: "Email all confirmed attendees, just one ticket type, or everyone on the waitlist — straight from the admin panel." },
            ].map(({ icon: Icon, title, body }) => (
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

      <TicketCtaSection />
    </main>
  );
}
