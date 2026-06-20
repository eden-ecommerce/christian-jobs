import { Hero } from "@components/event-manager/Hero";
import { FeatureBlock } from "@components/event-manager/FeatureBlock";
import { FeatureGrid, type FeatureItem } from "@components/event-manager/FeatureGrid";
import { SectionHeading } from "@components/event-manager/SectionHeading";
import { Testimonial } from "@components/event-manager/Testimonial";
import { LogoStrip } from "@components/event-manager/LogoStrip";
import { CtaSection } from "@components/event-manager/CtaSection";
import {
  DayPlannerScreen,
  LiveTranslationScreen,
  ClickCollectScreen,
} from "@components/event-manager/screens";
import { EM_PATH } from "@components/event-manager/em-config";
import type { Metadata } from "next";
import { Users, MapPinned, Bell, ShoppingBasket, Ticket, BarChart3 } from "lucide-react";

export const metadata: Metadata = {
  title: "Event App for Conferences & Festivals",
  description:
    "Run large-scale Christian conferences and festivals with multi-stage programmes, live translation, click & collect and push notifications. Book a demo.",
  alternates: { canonical: `https://www.eden.co.uk/christian-jobs${EM_PATH}/conferences` },
};

const FEATURES: FeatureItem[] = [
  { icon: Users, title: "Thousands of delegates", description: "Scale to tens of thousands of attendees without breaking a sweat." },
  { icon: MapPinned, title: "Multi-stage mapping", description: "Interactive site maps guide delegates between stages and venues." },
  { icon: Bell, title: "Instant announcements", description: "Push urgent updates to every phone the moment plans change." },
  { icon: ShoppingBasket, title: "Click & Collect", description: "Cut catering queues with order-ahead food and merchandise." },
  { icon: Ticket, title: "Ticketing & check-in", description: "Fast QR check-in and seamless ticket management on arrival." },
  { icon: BarChart3, title: "Live analytics", description: "Track attendance and engagement across every session in real time." },
];

export default function ConferencesPage() {
  return (
    <main>
      <Hero
        eyebrow="Conferences & Festivals"
        headline="Run your biggest event from a single app"
        subheadline="Multi-stage programmes, live translation and click-and-collect catering for thousands of delegates — all in one beautifully branded mobile experience."
        screen={<DayPlannerScreen />}
        secondaryScreen={<LiveTranslationScreen />}
      />

      <section className="border-b border-border bg-card py-12">
        <div className="mx-auto max-w-7xl px-4">
          <LogoStrip heading="Powering major UK Christian gatherings" />
        </div>
      </section>

      <section className="border-b border-border py-16 sm:py-24">
        <div className="mx-auto flex max-w-7xl flex-col gap-20 px-4">
          <FeatureBlock
            eyebrow="Day-Planner"
            title="Help every delegate build their perfect day"
            description="With dozens of seminars running across multiple stages, delegates filter the programme to their interests and save a personal agenda — so no one misses the session they travelled for."
            bullets={[
              "Filter by stage, track, speaker or theme",
              "Personal saved schedules with reminders",
              "Real-time programme updates pushed to all devices",
            ]}
            screen={<DayPlannerScreen />}
          />
          <FeatureBlock
            reverse
            eyebrow="Live Translation"
            title="Welcome an international audience"
            description="Stream live translated audio to delegates' phones in the language they choose. Ideal for global conferences, mission gatherings and multicultural festivals."
            bullets={[
              "Real-time audio in dozens of languages",
              "Listeners use their own headphones",
              "No receivers or extra hardware to manage",
            ]}
            screen={<LiveTranslationScreen />}
          />
          <FeatureBlock
            eyebrow="Click & Collect"
            title="Keep the queues short and the energy high"
            description="Delegates order food, coffee and merchandise from their seat and collect at a time that suits them. Vendors manage demand with a live order dashboard."
            bullets={[
              "Order ahead from anywhere on site",
              "Timed collection slots reduce crowding",
              "Live dashboards for caterers and stalls",
            ]}
            screen={<ClickCollectScreen />}
          />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:py-20">
        <SectionHeading
          eyebrow="Festival-ready"
          title="Everything a large event needs"
          description="Purpose-built tools for organisers managing complex, multi-day programmes."
        />
        <div className="mt-12">
          <FeatureGrid items={FEATURES} />
        </div>
      </section>

      <section className="bg-card py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4">
          <Testimonial
            quote="Coordinating a multi-site festival used to mean a dozen spreadsheets. Now our whole programme, catering and comms run through one app the delegates love."
            author="Festival Operations Lead"
            role="Multi-Site Christian Festival"
          />
        </div>
      </section>

      <CtaSection title="Ready to run your conference on Christian360 Events?" />
    </main>
  );
}
