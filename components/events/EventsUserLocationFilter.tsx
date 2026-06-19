"use client";

import { IntegrationEnvError } from "@components/common/IntegrationEnvError";
import { UserLocationSearch } from "@components/google-maps/UserLocationSearch";
import { useUserLocation } from "@hooks/google-maps/use-user-location";
import { NAMESPACE_PATH } from "@lib/config";
import type { UserLocation } from "@lib/google-maps/types";
import { isGoogleMapsEnvConfigured } from "@lib/env-configured";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef } from "react";

export function EventsUserLocationFilter() {
  const router = useRouter();
  const params = useSearchParams();
  const { location, setLocation, clearLocation, isHydrated } = useUserLocation();
  const seededFromUrl = useRef(false);

  const applyGeo = useCallback(
    (changes: Record<string, string | null>) => {
      const next = new URLSearchParams(params.toString());
      for (const [key, value] of Object.entries(changes)) {
        if (value === null || value === "") next.delete(key);
        else next.set(key, value);
      }
      next.delete("page");
      router.push(`${NAMESPACE_PATH}/search?${next.toString()}`);
    },
    [params, router],
  );

  useEffect(() => {
    if (!isHydrated || seededFromUrl.current || location) return;

    const latRaw = params.get("lat");
    const lngRaw = params.get("lng");
    const place = params.get("place");
    const lat = latRaw ? Number(latRaw) : Number.NaN;
    const lng = lngRaw ? Number(lngRaw) : Number.NaN;

    if (Number.isFinite(lat) && Number.isFinite(lng)) {
      seededFromUrl.current = true;
      setLocation({
        latitude: lat,
        longitude: lng,
        label: place ?? "",
      });
    }
  }, [isHydrated, location, params, setLocation]);

  const handleLocationSelect = useCallback(
    (nextLocation: UserLocation) => {
      setLocation(nextLocation);
      applyGeo({
        lat: String(nextLocation.latitude),
        lng: String(nextLocation.longitude),
        place: nextLocation.label,
        q: null,
      });
    },
    [applyGeo, setLocation],
  );

  const handleClear = useCallback(() => {
    clearLocation();
    applyGeo({ lat: null, lng: null, place: null });
  }, [applyGeo, clearLocation]);

  if (!isGoogleMapsEnvConfigured()) {
    return <IntegrationEnvError integration="googleMaps" />;
  }

  return (
    <UserLocationSearch
      value={location}
      onLocationSelect={handleLocationSelect}
      onClear={handleClear}
      placeholder="Postcode or address…"
    />
  );
}
