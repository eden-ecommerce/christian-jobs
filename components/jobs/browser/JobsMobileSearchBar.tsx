"use client";

import { MapPin, Search } from "lucide-react";

type Props = {
  query: string;
  location: string;
  onOpenSheet: (step: "what" | "where") => void;
  elevated?: boolean;
};

/** Compact amendable search summary shown on mobile results (Indeed-style). */
export function JobsMobileSearchBar({
  query,
  location,
  onOpenSheet,
  elevated = false,
}: Props) {
  const keywordPlaceholder = "Job title, keywords, or company";
  const locationPlaceholder = 'City, postcode or "remote"';

  return (
    <div
      className={`mx-auto max-w-[1600px] px-4 lg:hidden ${elevated ? "py-3" : "py-3"}`}
    >
      <div
        className={`overflow-hidden border border-[#E5E7EB] bg-white ${
          elevated ? "rounded-2xl shadow-soft-sm" : "rounded-xl shadow-soft-sm"
        }`}
      >
        <button
          type="button"
          onClick={() => onOpenSheet("what")}
          className="flex w-full items-center gap-3 border-b border-[#E5E7EB] px-4 py-3 text-left active:bg-[#F9FAFB]"
        >
          <Search className="mt-0.5 h-5 w-5 shrink-0 text-muted-foreground" aria-hidden="true" />
          <span className="min-w-0 flex-1">
            <span className="block text-xs font-medium text-muted-foreground">Job Title</span>
            <span
              className={`mt-0.5 block truncate text-base ${
                query ? "font-medium text-foreground" : "text-muted-foreground"
              }`}
            >
              {query || keywordPlaceholder}
            </span>
          </span>
        </button>
        <button
          type="button"
          onClick={() => onOpenSheet("where")}
          className="flex w-full items-center gap-3 px-4 py-3 text-left active:bg-[#F9FAFB]"
        >
          <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-muted-foreground" aria-hidden="true" />
          <span className="min-w-0 flex-1">
            <span className="block text-xs font-medium text-muted-foreground">Location</span>
            <span
              className={`mt-0.5 block truncate text-base ${
                location ? "font-medium text-foreground" : "text-muted-foreground"
              }`}
            >
              {location || locationPlaceholder}
            </span>
          </span>
        </button>
      </div>
    </div>
  );
}
