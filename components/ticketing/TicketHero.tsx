import type { ReactNode } from "react";
import { NsLink } from "@components/ns-link";
import { buttonVariants } from "@components/ui/button";
import { cn } from "@lib/utils";
import { PhoneMockup } from "@components/event-manager/PhoneMockup";
import { BadgeCheck } from "lucide-react";
import { GET_STARTED_HREF, tkHref } from "./tk-config";

type TicketHeroProps = {
  eyebrow: string;
  headline: string;
  subheadline: string;
  screen: ReactNode;
  secondaryScreen?: ReactNode;
  trustLine?: string;
};

export function TicketHero({
  eyebrow,
  headline,
  subheadline,
  screen,
  secondaryScreen,
  trustLine = "No percentage fees on your ticket revenue",
}: TicketHeroProps) {
  return (
    <section className="relative overflow-hidden border-b border-border bg-gradient-to-b from-accent/40 to-background">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-16 sm:py-20 lg:grid-cols-2 lg:gap-8">
        <div>
          <span className="inline-flex items-center rounded-full border border-primary/30 bg-card px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary">
            {eyebrow}
          </span>
          <h1 className="mt-5 text-balance font-serif text-4xl font-semibold leading-tight tracking-tight text-foreground sm:text-5xl">
            {headline}
          </h1>
          <p className="mt-5 max-w-xl text-pretty text-lg leading-relaxed text-muted-foreground">
            {subheadline}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <NsLink href={GET_STARTED_HREF} className={cn(buttonVariants({ size: "lg" }))}>
              Get started
            </NsLink>
            <NsLink
              href={tkHref("/features")}
              className={cn(buttonVariants({ variant: "outline", size: "lg" }))}
            >
              Explore features
            </NsLink>
          </div>
          {trustLine ? (
            <p className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-foreground">
              <BadgeCheck className="size-4 text-primary" />
              {trustLine}
            </p>
          ) : null}
        </div>

        <div className="relative flex items-center justify-center">
          <PhoneMockup className="z-10">{screen}</PhoneMockup>
          {secondaryScreen ? (
            <PhoneMockup className="-ml-10 mt-16 hidden max-w-[210px] opacity-95 sm:block">
              {secondaryScreen}
            </PhoneMockup>
          ) : null}
        </div>
      </div>
    </section>
  );
}
