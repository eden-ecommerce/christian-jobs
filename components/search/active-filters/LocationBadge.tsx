"use client";

import { FilterBadgePrimitive } from "@components/search/active-filters/FilterBadgePrimitive";
import { useUserLocation } from "@hooks/google-maps/use-user-location";

function formatLocationLabel(
  location: NonNullable<ReturnType<typeof useUserLocation>["location"]>,
): string {
  return (
    location.label ||
    location.placeName ||
    location.postalCode ||
    location.city ||
    "your location"
  );
}

export function LocationBadge() {
  const { location, clearLocation, isHydrated } = useUserLocation();

  if (!isHydrated || !location) {
    return null;
  }

  return (
    <FilterBadgePrimitive
      prefix="Near"
      label={formatLocationLabel(location)}
      onRemove={clearLocation}
    />
  );
}
