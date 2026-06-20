import { SubNav } from "@components/event-manager/SubNav";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "Christian360 Events — Event Management & Mobile App",
    template: "%s | Christian360 Events",
  },
  description:
    "The flexible event management platform and mobile app for Christian conferences, churches, retreats and holiday parks. Day planners, live translation, click & collect and more.",
};

export default function EventManagerLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="bg-background">
      <SubNav />
      {children}
    </div>
  );
}
