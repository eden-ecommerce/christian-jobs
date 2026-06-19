"use client";

import { Input } from "@components/ui/input";
import { useMapsLibrary } from "@vis.gl/react-google-maps";
import { useEffect, useRef } from "react";

const AUTOCOMPLETE_OPTIONS: google.maps.places.AutocompleteOptions = {
  fields: ["geometry.location", "formatted_address", "address_components", "name"],
  types: ["geocode"],
};

type LocationSearchProps = {
  defaultValue?: string;
  onPlaceSelect: (place: google.maps.places.PlaceResult) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
};

export function LocationSearch({
  defaultValue = "",
  onPlaceSelect,
  placeholder = "Search for a location…",
  disabled = false,
  className,
}: LocationSearchProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const placesLibrary = useMapsLibrary("places");
  const onPlaceSelectRef = useRef(onPlaceSelect);

  useEffect(() => {
    onPlaceSelectRef.current = onPlaceSelect;
  }, [onPlaceSelect]);

  useEffect(() => {
    if (!placesLibrary || !inputRef.current) {
      return;
    }

    const autocomplete = new placesLibrary.Autocomplete(inputRef.current, AUTOCOMPLETE_OPTIONS);
    const listener = autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace();
      if (place) {
        onPlaceSelectRef.current(place);
      }
    });

    return () => {
      listener.remove();
      google.maps.event.clearInstanceListeners(autocomplete);
    };
  }, [placesLibrary]);

  return (
    <Input
      ref={inputRef}
      type="search"
      defaultValue={defaultValue}
      placeholder={placeholder}
      disabled={disabled}
      aria-label="Location search"
      className={className}
    />
  );
}
