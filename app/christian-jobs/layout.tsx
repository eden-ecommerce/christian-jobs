import { EventsLocationProvider } from "@components/events/EventsLocationProvider";
import { getCloudflareLocation } from "@eden-ecommerce/lib/location/get-cloudflare-location.server";

export const dynamic = "force-dynamic";

export default async function SiteLayout({
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
