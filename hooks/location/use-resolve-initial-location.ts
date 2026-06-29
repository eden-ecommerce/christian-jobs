"use client";

import { LONDON_COORDINATES, LONDON_LABEL } from "@eden-ecommerce/lib/location/constants";
import type { CloudflareLocation } from "@eden-ecommerce/lib/location/types";
import {
  formatCoordinatesLabel,
  formatLocationLabelFromPlace,
} from "@lib/google-maps/location-labels";
import type { UserLocation } from "@lib/google-maps/types";
import { isGoogleMapsEnvConfigured } from "@lib/env-configured";
import { useUserLocation } from "@hooks/google-maps/use-user-location";
import { useEffect, useRef } from "react";

type UseResolveInitialLocationArgs = {
  serverLocation: CloudflareLocation;
};

function toUserLocation(serverLocation: CloudflareLocation): UserLocation {
  return {
    latitude: serverLocation.latitude,
    longitude: serverLocation.longitude,
    label: serverLocation.label,
    city: serverLocation.city,
    country: serverLocation.country,
  };
}

function reverseGeocode(latitude: number, longitude: number): Promise<UserLocation> {
  return new Promise((resolve) => {
    if (!isGoogleMapsEnvConfigured() || typeof google === "undefined") {
      resolve({
        latitude,
        longitude,
        label: formatCoordinatesLabel(latitude, longitude),
      });
      return;
    }

    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ location: { lat: latitude, lng: longitude } }, (results, status) => {
      if (status === google.maps.GeocoderStatus.OK && results?.[0]) {
        resolve({
          latitude,
          longitude,
          label: formatLocationLabelFromPlace(results[0]),
        });
        return;
      }

      resolve({
        latitude,
        longitude,
        label: formatCoordinatesLabel(latitude, longitude),
      });
    });
  });
}

function requestBrowserLocation(): Promise<GeolocationPosition | null> {
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      resolve(null);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => resolve(position),
      () => resolve(null),
      { enableHighAccuracy: true, timeout: 10_000 },
    );
  });
}

export function useResolveInitialLocation({ serverLocation }: UseResolveInitialLocationArgs) {
  const { location, setLocation, isHydrated } = useUserLocation();
  const hasResolvedRef = useRef(false);

  useEffect(() => {
    if (!isHydrated || hasResolvedRef.current || location) {
      return;
    }

    let cancelled = false;
    hasResolvedRef.current = true;

    const resolveInitialLocation = async () => {
      // Per handoff doc: Cloudflare IP-based location should NOT auto-populate
      // the search filter. Priority is: localStorage (already checked above) →
      // browser geolocation → London default.
      const position = await requestBrowserLocation();
      if (cancelled) {
        return;
      }

      if (position) {
        const { latitude, longitude } = position.coords;
        const resolved = await reverseGeocode(latitude, longitude);
        if (!cancelled) {
          setLocation(resolved);
        }
        return;
      }

      if (!cancelled) {
        setLocation({
          latitude: LONDON_COORDINATES.latitude,
          longitude: LONDON_COORDINATES.longitude,
          label: LONDON_LABEL,
        });
      }
    };

    void resolveInitialLocation();

    return () => {
      cancelled = true;
    };
  }, [isHydrated, location, serverLocation, setLocation]);
}
