"use client";

import { useCallback, useEffect, useState, useSyncExternalStore } from "react";

export const STORAGE_KEY = "eden_favourite_events";

export function readFavouriteIds(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as string[]) : [];
  } catch {
    return [];
  }
}

/* ------------------------------------------------------------------ *
 * Shared module-level store.
 *
 * A single source of truth shared by every component that calls
 * useFavourites(). Toggling a favourite anywhere (an event card heart,
 * the detail page) notifies ALL subscribers, so counts and lists update
 * in real time across the whole page. Also syncs across browser tabs via
 * the native `storage` event.
 * ------------------------------------------------------------------ */

const EMPTY: string[] = [];
let store: string[] = EMPTY;
let initialized = false;
const listeners = new Set<() => void>();

function emit() {
  for (const listener of listeners) listener();
}

function ensureInitialized() {
  if (initialized || typeof window === "undefined") return;
  store = readFavouriteIds();
  initialized = true;
  window.addEventListener("storage", (event) => {
    if (event.key === STORAGE_KEY) {
      store = readFavouriteIds();
      emit();
    }
  });
}

function subscribe(callback: () => void) {
  ensureInitialized();
  listeners.add(callback);
  return () => {
    listeners.delete(callback);
  };
}

function getSnapshot(): string[] {
  return store;
}

function getServerSnapshot(): string[] {
  return EMPTY;
}

function setFavourites(next: string[]) {
  store = next;
  if (typeof window !== "undefined") {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      // ignore write failures (e.g. storage disabled)
    }
  }
  emit();
}

export function useFavourites() {
  const ids = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  // `hydrated` flips true after mount so consumers can distinguish the
  // server/first-paint state (empty) from a genuinely empty favourites list.
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);

  const toggle = useCallback((eventId: string) => {
    const current = getSnapshot();
    const next = current.includes(eventId)
      ? current.filter((id) => id !== eventId)
      : [...current, eventId];
    setFavourites(next);
  }, []);

  const isFav = useCallback(
    (eventId: string) => ids.includes(eventId),
    [ids],
  );

  return { ids, hydrated, toggle, isFav };
}
