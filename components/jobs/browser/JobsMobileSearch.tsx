"use client";

import { JobsMobileSearchBar } from "@components/jobs/browser/JobsMobileSearchBar";
import { JobsMobileSearchSheet } from "@components/jobs/browser/JobsMobileSearchSheet";
import { useState } from "react";

type Props = {
  query: string;
  location: string;
  onSearch: (
    query: string,
    location: { label: string; lat?: number; lng?: number },
  ) => void;
  elevated?: boolean;
};

/** Mobile search: compact bar on results + full-page sheet to edit. */
export function JobsMobileSearch({
  query,
  location,
  onSearch,
  elevated = false,
}: Props) {
  const [sheetOpen, setSheetOpen] = useState(false);
  const [initialMode, setInitialMode] = useState<"what" | "where">("what");

  function openSheet(mode: "what" | "where") {
    setInitialMode(mode);
    setSheetOpen(true);
  }

  return (
    <>
      <JobsMobileSearchBar
        query={query}
        location={location}
        onOpenSheet={openSheet}
        elevated={elevated}
      />
      <JobsMobileSearchSheet
        open={sheetOpen}
        initialMode={initialMode}
        query={query}
        location={location}
        onClose={() => setSheetOpen(false)}
        onSearch={onSearch}
      />
    </>
  );
}
