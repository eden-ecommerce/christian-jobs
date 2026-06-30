"use client";

import { Input } from "@components/ui/input";
import { useMapsLibrary } from "@vis.gl/react-google-maps";
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  type KeyboardEventHandler,
} from "react";

const AUTOCOMPLETE_OPTIONS: google.maps.places.AutocompleteOptions = {
  fields: ["geometry.location", "formatted_address", "address_components", "name"],
  types: ["geocode"],
};

export type LocationSearchHandle = {
  getValue: () => string;
};

type LocationSearchProps = {
  /** Seeded from URL/parent; synced to the DOM when this changes externally. */
  initialLabel?: string;
  id?: string;
  onPlaceSelect: (place: google.maps.places.PlaceResult) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  onKeyDown?: KeyboardEventHandler<HTMLInputElement>;
  onFocus?: React.FocusEventHandler<HTMLInputElement>;
  onBlur?: React.FocusEventHandler<HTMLInputElement>;
};

/** Uncontrolled input with Google Autocomplete. Parents read value via ref on submit. */
export const LocationSearch = forwardRef<LocationSearchHandle, LocationSearchProps>(
  function LocationSearch(
    {
      initialLabel = "",
      id,
      onPlaceSelect,
      placeholder = "Search for a location…",
      disabled = false,
      className,
      onKeyDown,
      onFocus,
      onBlur,
    },
    ref,
  ) {
    const inputRef = useRef<HTMLInputElement>(null);
    const placesLibrary = useMapsLibrary("places");
    const onPlaceSelectRef = useRef(onPlaceSelect);

    useEffect(() => {
      onPlaceSelectRef.current = onPlaceSelect;
    }, [onPlaceSelect]);

    useEffect(() => {
      const input = inputRef.current;
      if (!input || input.value === initialLabel) {
        return;
      }
      input.value = initialLabel;
    }, [initialLabel]);

    useImperativeHandle(ref, () => ({
      getValue: () => inputRef.current?.value ?? "",
    }));

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
        id={id}
        type="search"
        defaultValue={initialLabel}
        onKeyDown={onKeyDown}
        onFocus={onFocus}
        onBlur={onBlur}
        placeholder={placeholder}
        disabled={disabled}
        className={className}
      />
    );
  },
);
