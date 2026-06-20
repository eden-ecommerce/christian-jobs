import { Hero } from "@components/event-manager/Hero";
import { FeatureBlock } from "@components/event-manager/FeatureBlock";
import { FeatureGrid, type FeatureItem } from "@components/event-manager/FeatureGrid";
import { SectionHeading } from "@components/event-manager/SectionHeading";
import { Testimonial } from "@components/event-manager/Testimonial";
import { CtaSection } from "@components/event-manager/CtaSection";
import {
  ArrivalFilterScreen,
  MaintenanceRequestScreen,
} from "@components/event-manager/screens";
import { EM_PATH } from "@components/event-manager/em-config";
import type { Metadata } from "next";
import { CalendarRange, Wrench, MapPin, Bell, UtensilsCrossed, Repeat } from "lucide-react";

export const metadata: Metadata = {
  title: "App for Retreats & Holiday Parks",
  description:
    "Welcome year-round guests with arrival-date filtering, on-site maintenance requests and personalised daily planners. Book a demo for your retreat or holiday park.",
  alternates: { canonical: `https://www.eden.co.uk/christian-jobs${EM_PATH}/retreats` },
};

const FEATURES: FeatureItem[] = [
  { icon: CalendarRange, title: "Arrival-date filtering", description: "Each guest only sees the activities that fall within their own stay." },
  { icon: Wrench, title: "Maintenance requests", description: "Guests report issues with a photo and location, routed to your team." },
  { icon: MapPin, title: "Site wayfinding", description: "Interactive maps help guests find lodges, venues and amenities." },
  { icon: Bell, title: "Daily updates", description: "Notify guests of weather changes, activities and meal times." },
  { icon: UtensilsCrossed, title: "Dining & booking", description: "Reserve meal slots and activities without queuing at reception." },
  { icon: Repeat, title: "Year-round programmes", description: "Continuously refresh content for back-to-back guest groups." },
];

export default function RetreatsPage() {
  return (
    <main>
      <Hero
        eyebrow="Retreats & Holiday Parks"
        headline="A personal welcome for every guest, all year round"
        subheadline="Built for continuous, year-round sites — arrival-date filtering, on-site maintenance requests and personalised daily planners that make every stay feel tailor-made."
        screen={<ArrivalFilterScreen />}
        secondaryScreen={<MaintenanceRequestScreen />}
      />

      <section className="border-b border-border py-16 sm:py-24">
        <div className="mx-auto flex max-w-7xl flex-col gap-20 px-4">
          <FeatureBlock
            eyebrow="Arrival-Date Filtering"
            title="Every guest sees only their stay"
            description="No matter when a guest arrives or leaves, the app shows just the activities, meals and worship sessions during their visit — so the programme always feels personal, never overwhelming."
            bullets={[
              "Automatic schedule tailored to each booking",
              "Past and future days clearly handled",
              "Perfect for rolling, overlapping guest groups",
            ]}
            screen={<ArrivalFilterScreen />}
          />
          <FeatureBlock
            reverse
            eyebrow="UGC Maintenance Requests"
            title="Issues reported and resolved in minutes"
            description="Guests snap a photo, tag the location and submit — and your operations team sees it instantly, with a clear status the guest can follow. Less reception desk, more peace of mind."
            bullets={[
              "Photo and location attached automatically",
              "Live status updates for the guest",
              "Routed straight to your maintenance team",
            ]}
            screen={<MaintenanceRequestScreen />}
          />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:py-20">
        <SectionHeading
          eyebrow="For continuous sites"
          title="Designed for the rhythm of a holiday park"
          description="Tools that handle constant arrivals, departures and changing programmes without manual effort."
        />
        <div className="mt-12">
          <FeatureGrid items={FEATURES} />
        </div>
      </section>

      <section className="bg-card py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4">
          <Testimonial
            quote="Arrival-date filtering was the game-changer. Guests arriving mid-week instantly see exactly what's on during their stay, and maintenance requests no longer pile up at the front desk."
            author="Site Director"
            role="Spring Harvest Holidays"
          />
        </div>
      </section>

      <CtaSection title="Make every guest stay feel personal" />
    </main>
  );
}
