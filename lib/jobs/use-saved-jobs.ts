"use client";

import { useCallback, useEffect, useState, useSyncExternalStore } from "react";

export const STORAGE_KEY = "eden_saved_jobs";

export function readSavedJobIds(): string[] {
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

const EMPTY: string[] = [];
let store: string[] = EMPTY;
let initialized = false;
const listeners = new Set<() => void>();

function emit() {
  for (const listener of listeners) listener();
}

function ensureInitialized() {
  if (initialized || typeof window === "undefined") return;
  store = readSavedJobIds();
  initialized = true;
  window.addEventListener("storage", (event) => {
    if (event.key === STORAGE_KEY) {
      store = readSavedJobIds();
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

function setSavedJobs(next: string[]) {
  store = next;
  if (typeof window !== "undefined") {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      // ignore write failures
    }
  }
  emit();
}

export function useSavedJobs() {
  const ids = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);

  const toggle = useCallback((jobId: string) => {
    const current = getSnapshot();
    const next = current.includes(jobId)
      ? current.filter((id) => id !== jobId)
      : [...current, jobId];
    setSavedJobs(next);
  }, []);

  const isSaved = useCallback(
    (jobId: string) => ids.includes(jobId),
    [ids],
  );

  return { ids, hydrated, toggle, isSaved };
}
