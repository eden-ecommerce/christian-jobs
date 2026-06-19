"use client";

import { GoogleMapsProvider } from "@components/google-maps/GoogleMapsProvider";
import { LocationSearch } from "@components/google-maps/LocationSearch";
import { useUserLocation } from "@hooks/google-maps/use-user-location";
import { useRouter } from "next/navigation";
import {
  userLocationFromPlace,
  formatLocationLabelFromPlace,
} from "@lib/google-maps/location-labels";
import { isGoogleMapsEnvConfigured } from "@lib/env-configured";
import { NAMESPACE_PATH } from "@lib/config";
import { MapPin, Search } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

function HomeLocationSearchInner() {
  const router = useRouter();
  const { location, setLocation } = useUserLocation();
  const [inputKey, setInputKey] = useState(0);

  // When location is set from CF/browser fallback, seed the input label.
  // Re-mount the LocationSearch via key when the pre-populated value changes.
  const defaultValue = location?.label ?? "";

  const handlePlaceSelect = useCallback(
    (place: google.maps.places.PlaceResult) => {
      const resolved = userLocationFromPlace(place);
      if (!resolved) return;

      // Clear the stored location so the input resets, then set the new one.
      setLocation(resolved);
      // Force re-mount so the input shows the new label cleanly.
      setInputKey((k) => k + 1);

      const params = new URLSearchParams({
        lat: String(resolved.latitude),
        lng: String(resolved.longitude),
        place: resolved.label,
      });
      router.push(`${NAMESPACE_PATH}/search?${params.toString()}`);
    },
    [router, setLocation],
  );

  return (
    <div className="flex flex-col gap-2 sm:flex-row">
      <div className="relative flex-1">
        <MapPin className="pointer-events-none absolute left-4 top-1/2 z-10 h-5 w-5 -translate-y-1/2 text-primary" />
        <LocationSearch
          key={inputKey}
          defaultValue={defaultValue}
          onPlaceSelect={handlePlaceSelect}
          placeholder="Enter a town, city or postcode…"
          className="h-14 w-full rounded-full border-border bg-card pl-12 pr-4 text-base focus:border-primary focus:ring-2 focus:ring-ring/30"
        />
      </div>
      <button
        type="button"
        onClick={() => {
          if (location) {
            const params = new URLSearchParams({
              lat: String(location.latitude),
              lng: String(location.longitude),
              place: location.label,
            });
            router.push(`${NAMESPACE_PATH}/search?${params.toString()}`);
          } else {
            router.push(`${NAMESPACE_PATH}/search`);
          }
        }}
        className="inline-flex h-14 shrink-0 items-center justify-center gap-2 rounded-full bg-primary px-6 text-base font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
      >
        <Search className="h-5 w-5" />
        Search
      </button>
    </div>
  );
}

/** Home hero search box using Google Maps autocomplete with CF/browser location pre-fill. */
export function HomeLocationSearch() {
  if (!isGoogleMapsEnvConfigured()) {
    // Fall back to a plain router-push form when Maps is not configured.
    return <HomePlainSearch />;
  }

  return (
    <GoogleMapsProvider>
      <HomeLocationSearchInner />
    </GoogleMapsProvider>
  );
}

function HomePlainSearch() {
  const router = useRouter();
  const [value, setValue] = useState("");

  function submit() {
    if (value.trim()) {
      router.push(`${NAMESPACE_PATH}/search?q=${encodeURIComponent(value.trim())}`);
    } else {
      router.push(`${NAMESPACE_PATH}/search`);
    }
  }

  return (
    <div className="flex flex-col gap-2 sm:flex-row">
      <div className="relative flex-1">
        <MapPin className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-primary" />
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && submit()}
          placeholder="Enter a town, city or postcode…"
          aria-label="Search events by location"
          className="h-14 w-full rounded-full border border-border bg-card pl-12 pr-4 text-base text-foreground outline-none placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-ring/30"
        />
      </div>
      <button
        type="button"
        onClick={submit}
        className="inline-flex h-14 shrink-0 items-center justify-center gap-2 rounded-full bg-primary px-6 text-base font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
      >
        <Search className="h-5 w-5" />
        Search
      </button>
    </div>
  );
}
