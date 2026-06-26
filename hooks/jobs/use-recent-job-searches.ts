"use client";

import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "christian-jobs-recent-searches";
const MAX_RECENTS = 5;

export type RecentJobSearch = {
  query: string;
  location: string;
};

function readRecents(): RecentJobSearch[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as RecentJobSearch[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeRecents(recents: RecentJobSearch[]) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(recents));
  } catch {
    // Storage unavailable.
  }
}

/** Persist recent job searches in localStorage for mobile suggestions. */
export function useRecentJobSearches() {
  const [recents, setRecents] = useState<RecentJobSearch[]>([]);

  useEffect(() => {
    setRecents(readRecents());
  }, []);

  const addRecent = useCallback((search: RecentJobSearch) => {
    const query = search.query.trim();
    const location = search.location.trim();
    if (!query && !location) return;

    setRecents((current) => {
      const next = [
        { query, location },
        ...current.filter(
          (item) => item.query !== query || item.location !== location,
        ),
      ].slice(0, MAX_RECENTS);

      writeRecents(next);
      return next;
    });
  }, []);

  const removeRecent = useCallback((search: RecentJobSearch) => {
    setRecents((current) => {
      const next = current.filter(
        (item) => item.query !== search.query || item.location !== search.location,
      );
      writeRecents(next);
      return next;
    });
  }, []);

  return { recents, addRecent, removeRecent };
}
