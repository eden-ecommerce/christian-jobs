import { Hero } from "@components/event-manager/Hero";
import { FeatureBlock } from "@components/event-manager/FeatureBlock";
import { FeatureGrid, type FeatureItem } from "@components/event-manager/FeatureGrid";
import { SectionHeading } from "@components/event-manager/SectionHeading";
import { Testimonial } from "@components/event-manager/Testimonial";
import { CtaSection } from "@components/event-manager/CtaSection";
import {
  TalksArchiveScreen,
  LockNotificationScreen,
} from "@components/event-manager/screens";
import { EM_PATH } from "@components/event-manager/em-config";
import type { Metadata } from "next";
import { Library, CalendarHeart, Bell, Users2, HandCoins, Megaphone } from "lucide-react";

export const metadata: Metadata = {
  title: "Church App for Weekly Life & Talks Archive",
  description:
    "An affordable, easy-to-manage church app with a searchable talks archive, service planner, small groups and push notifications. Book a demo for your church.",
  alternates: { canonical: `https://www.eden.co.uk/christian-jobs${EM_PATH}/churches` },
};

const FEATURES: FeatureItem[] = [
  { icon: CalendarHeart, title: "Weekly planner", description: "Publish services, small groups and events your church can follow at a glance." },
  { icon: Library, title: "Talks archive", description: "A searchable library of sermons and series your congregation can revisit any time." },
  { icon: Bell, title: "Push notifications", description: "Share prayer needs, reminders and last-minute changes instantly." },
  { icon: Users2, title: "Small groups", description: "Help members find and join the right group for their season of life." },
  { icon: HandCoins, title: "Giving made simple", description: "Let members give securely in a couple of taps, any time." },
  { icon: Megaphone, title: "Announcements", description: "Replace the notice sheet with a feed everyone actually reads." },
];

export default function ChurchesPage() {
  return (
    <main>
      <Hero
        eyebrow="Churches"
        headline="Church life, gathered in one friendly app"
        subheadline="Affordable, easy-to-run tools for busy administrators — a searchable talks archive, weekly planner and push notifications that keep your whole church connected."
        screen={<TalksArchiveScreen />}
        secondaryScreen={<LockNotificationScreen />}
      />

      <section className="border-b border-border py-16 sm:py-24">
        <div className="mx-auto flex max-w-7xl flex-col gap-20 px-4">
          <FeatureBlock
            eyebrow="Talks Archive"
            title="Every sermon, searchable forever"
            description="Members who miss a Sunday — or want to revisit a series — find talks by speaker, series or topic in seconds. Publishing a new talk takes a couple of clicks in the CMS."
            bullets={[
              "Search by speaker, series and theme",
              "Resume listening where you left off",
              "Simple CMS — no developer needed to publish",
            ]}
            screen={<TalksArchiveScreen />}
          />
          <FeatureBlock
            reverse
            eyebrow="Stay connected"
            title="Reach your church when it matters"
            description="Send a prayer request, a weather cancellation or a warm welcome straight to the lock screen. No more relying on email no one opens or notices no one reads."
            bullets={[
              "Targeted notifications to groups or everyone",
              "Schedule reminders for services and events",
              "Gentle nudges for prayer and giving",
            ]}
            screen={<LockNotificationScreen />}
          />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:py-20">
        <SectionHeading
          eyebrow="Built for church admins"
          title="Powerful, but refreshingly simple"
          description="Everything your church needs to gather and grow — at a price that works for smaller congregations."
        />
        <div className="mt-12">
          <FeatureGrid items={FEATURES} />
        </div>
      </section>

      <section className="bg-card py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4">
          <Testimonial
            quote="Our talks archive alone has been worth it — people are catching up on series all week. And our admin team finally has one place to manage church life."
            author="Church Administrator"
            role="Local Church, Cumbria"
          />
        </div>
      </section>

      <CtaSection title="Bring your church together on one app" />
    </main>
  );
}
