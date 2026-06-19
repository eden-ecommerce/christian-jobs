"use client";

import { Configure } from "@components/search/Configure";
import { useUserLocation } from "@hooks/google-maps/use-user-location";
import { DEFAULT_LOCATION_RADIUS_METERS } from "@lib/algolia/constants";
import { formatAroundLatLng } from "@lib/google-maps/format-around-lat-lng";

export function LocationConfigure() {
  const { location, isHydrated } = useUserLocation();

  if (!isHydrated || !location) {
    return null;
  }

  return (
    <Configure
      aroundLatLng={formatAroundLatLng(location.latitude, location.longitude)}
      aroundRadius={DEFAULT_LOCATION_RADIUS_METERS}
    />
  );
}
