"use client";

import type { CloudflareLocation } from "@lib/location/types";
import { useResolveInitialLocation } from "@hooks/location/use-resolve-initial-location";

type LocationInitialiserProps = {
  serverLocation: CloudflareLocation;
};

export function LocationInitialiser({ serverLocation }: LocationInitialiserProps) {
  useResolveInitialLocation({ serverLocation });
  return null;
}
