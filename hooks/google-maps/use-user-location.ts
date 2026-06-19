"use client";

import {
  USER_LOCATION_CHANGE_EVENT,
  USER_LOCATION_STORAGE_KEY,
} from "@lib/location/constants";
import type { UserLocation } from "@lib/google-maps/types";
import { useCallback, useSyncExternalStore } from "react";

let cachedRaw: string | null | undefined;
let cachedLocation: UserLocation | null = null;

function readStoredLocation(): UserLocation | null {
  if (typeof window === "undefined") {
    return null;
  }

  const raw = window.localStorage.getItem(USER_LOCATION_STORAGE_KEY);
  if (raw === cachedRaw) {
    return cachedLocation;
  }

  cachedRaw = raw;
  if (!raw) {
    cachedLocation = null;
    return null;
  }

  try {
    cachedLocation = JSON.parse(raw) as UserLocation;
    return cachedLocation;
  } catch {
    cachedLocation = null;
    return null;
  }
}

function writeStoredLocation(location: UserLocation | null): void {
  if (typeof window === "undefined") {
    return;
  }

  if (location) {
    const raw = JSON.stringify(location);
    window.localStorage.setItem(USER_LOCATION_STORAGE_KEY, raw);
    cachedRaw = raw;
    cachedLocation = location;
  } else {
    window.localStorage.removeItem(USER_LOCATION_STORAGE_KEY);
    cachedRaw = null;
    cachedLocation = null;
  }

  window.dispatchEvent(new CustomEvent(USER_LOCATION_CHANGE_EVENT));
}

function subscribeToLocationChanges(onStoreChange: () => void): () => void {
  const handleChange = () => {
    onStoreChange();
  };

  window.addEventListener(USER_LOCATION_CHANGE_EVENT, handleChange);
  return () => {
    window.removeEventListener(USER_LOCATION_CHANGE_EVENT, handleChange);
  };
}

export function useUserLocation() {
  const location = useSyncExternalStore(
    subscribeToLocationChanges,
    readStoredLocation,
    () => null,
  );

  const isHydrated = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  const setLocation = useCallback((nextLocation: UserLocation) => {
    writeStoredLocation(nextLocation);
  }, []);

  const clearLocation = useCallback(() => {
    writeStoredLocation(null);
  }, []);

  return { location, setLocation, clearLocation, isHydrated };
}
