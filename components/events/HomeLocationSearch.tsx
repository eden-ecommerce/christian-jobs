"use client";

import { GoogleMapsProvider } from "@components/google-maps/GoogleMapsProvider";
import { LocationSearch } from "@components/google-maps/LocationSearch";
import { useUserLocation } from "@hooks/google-maps/use-user-location";
import { useRouter } from "next/navigation";
import { userLocationFromPlace } from "@lib/google-maps/location-labels";
import { isGoogleMapsEnvConfigured } from "@lib/env-configured";
import { NAMESPACE_PATH } from "@lib/config";
import { MapPin, Search } from "lucide-react";
import { useCallback, useState } from "react";

function HomeLocationSearchInner() {
  const router = useRouter();
  const { location, setLocation } = useUserLocation();

  const handlePlaceSelect = useCallback(
    (place: google.maps.places.PlaceResult) => {
      const resolved = userLocationFromPlace(place);
      if (!resolved) return;

      setLocation(resolved);

      const params = new URLSearchParams({
        lat: String(resolved.latitude),
        lng: String(resolved.longitude),
        place: resolved.label,
      });
      router.push(`${NAMESPACE_PATH}/?${params.toString()}`);
    },
    [router, setLocation],
  );

  return (
    <div className="flex flex-col gap-2 sm:flex-row">
      <div className="relative flex-1">
        <MapPin className="pointer-events-none absolute left-4 top-1/2 z-10 h-5 w-5 -translate-y-1/2 text-primary" />
        <LocationSearch
          initialLabel={location?.label ?? ""}
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
            router.push(`${NAMESPACE_PATH}/?${params.toString()}`);
          } else {
            router.push(`${NAMESPACE_PATH}/`);
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
      router.push(`${NAMESPACE_PATH}/?q=${encodeURIComponent(value.trim())}`);
    } else {
      router.push(`${NAMESPACE_PATH}/`);
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
          aria-label="Search jobs by location"
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
