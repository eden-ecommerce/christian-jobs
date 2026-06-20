import { NsLink } from "@components/ns-link";
import { buttonVariants } from "@components/ui/button";
import { cn } from "@lib/utils";
import { GET_STARTED_HREF, tkHref } from "./tk-config";

type TicketCtaSectionProps = {
  title?: string;
  description?: string;
};

export function TicketCtaSection({
  title = "Start selling tickets the smarter way",
  description = "Free or paid, simple headcount or full reserved seating — run it all from the platform your team already uses. No percentage fees on your ticket revenue.",
}: TicketCtaSectionProps) {
  return (
    <section className="bg-primary text-primary-foreground">
      <div className="mx-auto max-w-4xl px-4 py-16 text-center sm:py-20">
        <h2 className="text-balance font-serif text-3xl font-semibold tracking-tight sm:text-4xl">
          {title}
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-pretty text-lg leading-relaxed text-primary-foreground/80">
          {description}
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <NsLink
            href={GET_STARTED_HREF}
            className={cn(buttonVariants({ variant: "secondary", size: "lg" }))}
          >
            Get started
          </NsLink>
          <NsLink
            href={tkHref("/pricing")}
            className={cn(
              buttonVariants({ variant: "outline", size: "lg" }),
              "border-primary-foreground/40 bg-transparent text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground",
            )}
          >
            See pricing & FAQs
          </NsLink>
        </div>
      </div>
    </section>
  );
}
