import { EventsLocationProvider } from "@components/events/EventsLocationProvider";
import { getCloudflareLocation } from "@lib/location/get-cloudflare-location.server";

export const dynamic = "force-dynamic";

export default async function EventsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const serverLocation = await getCloudflareLocation();

  return (
    <EventsLocationProvider serverLocation={serverLocation}>
      {children}
    </EventsLocationProvider>
  );
}
