"use client";

import { GoogleMapsProvider } from "@components/google-maps/GoogleMapsProvider";
import { LocationSearch } from "@components/google-maps/LocationSearch";
import { Button } from "@components/ui/button";
import { isGoogleMapsEnvConfigured } from "@lib/env-configured";
import {
  formatCoordinatesLabel,
  formatLocationLabelFromPlace,
  userLocationFromPlace,
} from "@lib/google-maps/location-labels";
import type { UserLocation } from "@lib/google-maps/types";
import { useMapsLibrary } from "@vis.gl/react-google-maps";
import { useCallback, useState } from "react";

type UserLocationSearchProps = {
  value?: UserLocation | null;
  onLocationSelect: (location: UserLocation) => void;
  onClear?: () => void;
  placeholder?: string;
};

function UserLocationSearchInner({
  value,
  onLocationSelect,
  onClear,
  placeholder,
}: UserLocationSearchProps) {
  const geocodingLibrary = useMapsLibrary("geocoding");
  const [isLocating, setIsLocating] = useState(false);

  const handlePlaceSelect = useCallback(
    (place: google.maps.places.PlaceResult) => {
      const location = userLocationFromPlace(place);
      if (location) {
        onLocationSelect(location);
      }
    },
    [onLocationSelect],
  );

  const handleUseCurrentLocation = useCallback(() => {
    if (!navigator.geolocation) {
      return;
    }

    setIsLocating(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;

        if (!geocodingLibrary) {
          onLocationSelect({
            latitude,
            longitude,
            label: formatCoordinatesLabel(latitude, longitude),
          });
          setIsLocating(false);
          return;
        }

        const geocoder = new geocodingLibrary.Geocoder();
        geocoder.geocode({ location: { lat: latitude, lng: longitude } }, (results, status) => {
          if (status === geocodingLibrary.GeocoderStatus.OK && results?.[0]) {
            onLocationSelect({
              latitude,
              longitude,
              label: formatLocationLabelFromPlace(results[0]),
            });
          } else {
            onLocationSelect({
              latitude,
              longitude,
              label: formatCoordinatesLabel(latitude, longitude),
            });
          }
          setIsLocating(false);
        });
      },
      () => {
        setIsLocating(false);
      },
      { enableHighAccuracy: true, timeout: 10_000 },
    );
  }, [geocodingLibrary, onLocationSelect]);

  return (
    <div className="flex flex-col gap-2">
      {value ? (
        <p className="text-sm text-foreground">
          <span className="text-muted-foreground">Location: </span>
          {value.label}
        </p>
      ) : null}
      <LocationSearch
        defaultValue={value?.label ?? ""}
        onPlaceSelect={handlePlaceSelect}
        placeholder={placeholder}
        disabled={isLocating}
      />
      <div className="flex flex-wrap gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleUseCurrentLocation}
          disabled={isLocating}
        >
          {isLocating ? "Locating…" : "Use my current location"}
        </Button>
        {value && onClear ? (
          <Button type="button" variant="ghost" size="sm" onClick={onClear}>
            Clear
          </Button>
        ) : null}
      </div>
    </div>
  );
}

export function UserLocationSearch(props: UserLocationSearchProps) {
  if (!isGoogleMapsEnvConfigured()) {
    return null;
  }

  return (
    <GoogleMapsProvider>
      <UserLocationSearchInner {...props} />
    </GoogleMapsProvider>
  );
}
