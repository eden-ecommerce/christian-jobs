"use client";

import { LocationInitialiser } from "@components/location/LocationInitialiser";
import type { CloudflareLocation } from "@eden-ecommerce/lib/location/types";

type EventsLocationProviderProps = {
  serverLocation: CloudflareLocation;
  children: React.ReactNode;
};

export function EventsLocationProvider({
  serverLocation,
  children,
}: EventsLocationProviderProps) {
  return (
    <>
      <LocationInitialiser serverLocation={serverLocation} />
      {children}
    </>
  );
}
