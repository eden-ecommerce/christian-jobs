import type { ReactNode } from "react";
import { PhoneMockup } from "@components/event-manager/PhoneMockup";
import { CtaSection } from "@components/event-manager/CtaSection";
import {
  DayPlannerScreen,
  ArrivalFilterScreen,
} from "@components/event-manager/screens";
import { EM_PATH } from "@components/event-manager/em-config";
import { cn } from "@lib/utils";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Case Studies",
  description:
    "See how Keswick Convention and Spring Harvest Holidays use Christian360 Events to run their gatherings.",
  alternates: { canonical: `https://www.eden.co.uk${EM_PATH}/case-studies` },
};

type CaseStudy = {
  org: string;
  category: string;
  headline: string;
  challenge: string;
  solution: string;
  quote: string;
  author: string;
  stats: { value: string; label: string }[];
  screen: ReactNode;
};

const CASE_STUDIES: CaseStudy[] = [
  {
    org: "Keswick Convention",
    category: "Conference",
    headline: "A 10,000-strong convention, coordinated from one app",
    challenge:
      "With thousands of delegates moving between multiple venues across a three-week convention, printed programmes went out of date the moment they were published.",
    solution:
      "The day-planner gave every delegate a personal, filterable schedule with live updates and push reminders, while live translation opened sessions to an international audience.",
    quote:
      "The reaction from delegates has been brilliant. People keep telling us the app made a vast, three-week convention feel personal and easy to navigate — and the live updates took real pressure off the team on the ground.",
    author: "The Eden Events team",
    stats: [
      { value: "10,000+", label: "Delegates served" },
      { value: "3 weeks", label: "Continuous programme" },
      { value: "8 langs", label: "Live translation" },
    ],
    screen: <DayPlannerScreen />,
  },
  {
    org: "Spring Harvest Holidays",
    category: "Holiday Park",
    headline: "Personalised stays for year-round guests",
    challenge:
      "With guests arriving and departing on different days all year, a single fixed programme left visitors confused about what was on during their stay.",
    solution:
      "Arrival-date filtering tailored the programme to each booking automatically, and in-app maintenance requests took pressure off the front desk.",
    quote:
      "Guests took to arrival-date filtering straight away — nobody had to wonder what was on during their stay. The feedback we've heard about the personalised programme and in-app maintenance requests has been fantastic.",
    author: "The Eden Events team",
    stats: [
      { value: "365 days", label: "Year-round operation" },
      { value: "100%", label: "Stays personalised" },
      { value: "Faster", label: "Issue resolution" },
    ],
    screen: <ArrivalFilterScreen />,
  },
];

export default function CaseStudiesPage() {
  return (
    <main>
      <section className="border-b border-border bg-gradient-to-b from-accent/40 to-background py-14 sm:py-20">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <span className="inline-flex items-center rounded-full border border-primary/30 bg-card px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary">
            Case Studies
          </span>
          <h1 className="mt-5 text-balance font-serif text-4xl font-semibold leading-tight tracking-tight text-foreground sm:text-5xl">
            Trusted across the spectrum of Christian gatherings
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-pretty text-lg leading-relaxed text-muted-foreground">
            From three-week conventions to year-round holiday parks, see how organisers use Christian360 Events to run unforgettable gatherings.
          </p>
        </div>
      </section>

      <div className="mx-auto flex max-w-7xl flex-col gap-20 px-4 py-16 sm:py-24">
        {CASE_STUDIES.map((study, index) => {
          const reverse = index % 2 === 1;
          return (
            <article key={study.org} className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
              <div className={cn("flex justify-center", reverse ? "lg:order-2" : "lg:order-1")}>
                <PhoneMockup>{study.screen}</PhoneMockup>
              </div>

              <div className={cn(reverse ? "lg:order-1" : "lg:order-2")}>
                <div className="flex items-center gap-3">
                  <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary">
                    {study.category}
                  </span>
                  <span className="font-serif text-lg font-semibold text-foreground">{study.org}</span>
                </div>
                <h2 className="mt-4 text-balance font-serif text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                  {study.headline}
                </h2>

                <div className="mt-5 flex flex-col gap-4 text-sm leading-relaxed text-muted-foreground">
                  <p>
                    <span className="font-semibold text-foreground">The challenge. </span>
                    {study.challenge}
                  </p>
                  <p>
                    <span className="font-semibold text-foreground">The solution. </span>
                    {study.solution}
                  </p>
                </div>

                <dl className="mt-6 grid grid-cols-3 gap-4 rounded-2xl border-2 border-dashed border-primary/40 bg-card p-5">
                  {study.stats.map((stat) => (
                    <div key={stat.label}>
                      <dt className="sr-only">{stat.label}</dt>
                      <dd className="font-serif text-2xl font-semibold text-primary">{stat.value}</dd>
                      <p className="mt-1 text-xs text-muted-foreground">{stat.label}</p>
                    </div>
                  ))}
                </dl>

                <blockquote className="mt-6 border-l-2 border-primary pl-4 text-pretty text-base italic leading-relaxed text-foreground">
                  &ldquo;{study.quote}&rdquo;
                  <footer className="mt-2 text-sm font-medium not-italic text-muted-foreground">
                    {study.author}
                  </footer>
                </blockquote>
              </div>
            </article>
          );
        })}
      </div>

      <CtaSection title="Could your event be our next case study?" />
    </main>
  );
}
