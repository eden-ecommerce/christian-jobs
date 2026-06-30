"use client";

import { JobsMobileSearchBar } from "@components/jobs/browser/JobsMobileSearchBar";
import { JobsMobileSearchSheet } from "@components/jobs/browser/JobsMobileSearchSheet";
import { useState } from "react";

type Props = {
  query: string;
  location: string;
  lat?: number;
  lng?: number;
  radius?: number;
  onSearch: (
    query: string,
    location: { label: string; lat?: number; lng?: number },
  ) => void;
  onRadiusChange: (radius: number | undefined) => void;
  elevated?: boolean;
};

/** Mobile search: compact bar on results + full-page sheet to edit. */
export function JobsMobileSearch({
  query,
  location,
  lat,
  lng,
  radius,
  onSearch,
  onRadiusChange,
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
        lat={lat}
        lng={lng}
        radius={radius}
        onClose={() => setSheetOpen(false)}
        onSearch={onSearch}
        onRadiusChange={onRadiusChange}
      />
    </>
  );
}
