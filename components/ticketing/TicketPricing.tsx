import { NsLink } from "@components/ns-link";
import { buttonVariants } from "@components/ui/button";
import { cn } from "@lib/utils";
import { Check } from "lucide-react";
import { GET_STARTED_HREF } from "./tk-config";

type Tier = {
  name: string;
  price: string;
  cadence: string;
  description: string;
  features: string[];
  cta: string;
  highlighted?: boolean;
};

const TIERS: Tier[] = [
  {
    name: "Free Events",
    price: "£0",
    cadence: "always free",
    description: "For free events you need to manage — services, workshops, small groups.",
    features: [
      "Unlimited free tickets",
      "QR code check-in",
      "Door PIN for volunteers",
      "Attendee list & exports",
      "Email your attendees",
    ],
    cta: "Start for free",
  },
  {
    name: "Paid Events",
    price: "£39",
    cadence: "per month",
    description: "For churches and charities selling tickets — no fees on your revenue.",
    features: [
      "Everything in Free Events",
      "Paid tickets via Stripe",
      "No percentage fees on sales",
      "Early bird & tiered pricing",
      "Discount & access codes",
      "Automated waitlists",
    ],
    cta: "Choose Paid Events",
    highlighted: true,
  },
  {
    name: "Conference",
    price: "Custom",
    cadence: "let's talk",
    description: "For major conferences and events that need seating and gating at scale.",
    features: [
      "Everything in Paid Events",
      "Reserved seating designer",
      "Session ticket-gating",
      "Bulk CSV ticket issue",
      "Donation add-on at checkout",
      "Dedicated account manager",
    ],
    cta: "Talk to sales",
  },
];

export function TicketPricing() {
  return (
    <div className="grid items-stretch gap-6 lg:grid-cols-3">
      {TIERS.map((tier) => (
        <div
          key={tier.name}
          className={cn(
            "flex flex-col rounded-3xl border bg-card p-8",
            tier.highlighted
              ? "border-primary shadow-lg ring-1 ring-primary"
              : "border-border",
          )}
        >
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-xl font-semibold text-foreground">{tier.name}</h3>
            {tier.highlighted ? (
              <span className="rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">
                Most popular
              </span>
            ) : null}
          </div>

          <div className="mt-5 flex items-baseline gap-1.5">
            <span className="font-serif text-4xl font-semibold text-foreground">{tier.price}</span>
            <span className="text-sm text-muted-foreground">{tier.cadence}</span>
          </div>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{tier.description}</p>

          <ul className="mt-6 flex flex-1 flex-col gap-3">
            {tier.features.map((feature) => (
              <li key={feature} className="flex items-start gap-3">
                <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Check className="size-3.5" />
                </span>
                <span className="text-sm leading-relaxed text-foreground">{feature}</span>
              </li>
            ))}
          </ul>

          <NsLink
            href={GET_STARTED_HREF}
            className={cn(
              buttonVariants({
                variant: tier.highlighted ? "default" : "outline",
                size: "lg",
              }),
              "mt-8 w-full",
            )}
          >
            {tier.cta}
          </NsLink>
        </div>
      ))}
    </div>
  );
}
