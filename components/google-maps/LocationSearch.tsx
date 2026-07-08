"use client";

import { Input } from "@components/ui/input";
import { useMapsLibrary } from "@vis.gl/react-google-maps";
import { X } from "lucide-react";
import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
  type KeyboardEventHandler,
} from "react";

const AUTOCOMPLETE_OPTIONS: google.maps.places.AutocompleteOptions = {
  fields: ["geometry.location", "formatted_address", "address_components", "name"],
  types: ["geocode"],
};

export type LocationSearchHandle = {
  getValue: () => string;
  clear: () => void;
};

type LocationSearchProps = {
  /** Seeded from URL/parent; synced to the DOM when this changes externally. */
  initialLabel?: string;
  id?: string;
  onPlaceSelect: (place: google.maps.places.PlaceResult) => void;
  onClear?: () => void;
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
      onClear,
      placeholder = "Search for a location…",
      disabled = false,
      className = "",
      onKeyDown,
      onFocus,
      onBlur,
    },
    ref,
  ) {
    const inputRef = useRef<HTMLInputElement>(null);
    const placesLibrary = useMapsLibrary("places");
    const onPlaceSelectRef = useRef(onPlaceSelect);
    const onClearRef = useRef(onClear);
    const isFocusedRef = useRef(false);
    const [hasValue, setHasValue] = useState(Boolean(initialLabel));

    useEffect(() => {
      onPlaceSelectRef.current = onPlaceSelect;
    }, [onPlaceSelect]);

    useEffect(() => {
      onClearRef.current = onClear;
    }, [onClear]);

    const clearInput = useCallback(() => {
      if (inputRef.current) {
        inputRef.current.value = "";
      }
      setHasValue(false);
      onClearRef.current?.();
    }, []);

    useEffect(() => {
      const input = inputRef.current;
      if (!input || isFocusedRef.current || input.value === initialLabel) {
        return;
      }
      input.value = initialLabel;
      setHasValue(Boolean(initialLabel));
    }, [initialLabel]);

    useImperativeHandle(ref, () => ({
      getValue: () => inputRef.current?.value ?? "",
      clear: clearInput,
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

    const showClearButton = Boolean(onClear) && hasValue && !disabled;

    return (
      <div className="relative min-w-0 w-full">
        <Input
          ref={inputRef}
          id={id}
          type="search"
          defaultValue={initialLabel}
          onKeyDown={onKeyDown}
          onInput={(event) => {
            setHasValue(event.currentTarget.value.trim() !== "");
          }}
          onFocus={(event) => {
            isFocusedRef.current = true;
            onFocus?.(event);
          }}
          onBlur={(event) => {
            isFocusedRef.current = false;
            setHasValue(event.currentTarget.value.trim() !== "");
            onBlur?.(event);
          }}
          placeholder={placeholder}
          disabled={disabled}
          className={`${className}${showClearButton ? " pr-10" : ""}`}
        />

        {showClearButton ? (
          <button
            type="button"
            onMouseDown={(event) => event.preventDefault()}
            onClick={clearInput}
            className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full text-[#86868b] hover:bg-[#f5f5f7] hover:text-[#1d1d1f]"
            aria-label="Clear location"
          >
            <X className="h-3.5 w-3.5" aria-hidden="true" />
          </button>
        ) : null}
      </div>
    );
  },
);
