"use client";

import { UserLocationSearch } from "@components/google-maps/UserLocationSearch";
import { DropdownPrimitive } from "@components/search/filters/DropdownPrimitive";
import { useUserLocation } from "@hooks/google-maps/use-user-location";
import { isGoogleMapsEnvConfigured } from "@lib/env-configured";

export function UserLocationFilter() {
  const { location, setLocation, clearLocation } = useUserLocation();

  if (!isGoogleMapsEnvConfigured()) {
    return null;
  }

  return (
    <DropdownPrimitive label="Location">
      <UserLocationSearch
        value={location}
        onLocationSelect={setLocation}
        onClear={clearLocation}
        placeholder="Postcode or address…"
      />
    </DropdownPrimitive>
  );
}
