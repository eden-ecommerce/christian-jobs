"use client";

import { DEFAULT_LOCATION_RADIUS_METERS } from "@lib/algolia/constants";
import {
  LOCATION_RADIUS_OPTIONS,
  resolveLocationRadiusMeters,
} from "@lib/jobs/search-params";
import { ChevronDown } from "lucide-react";

type Props = {
  radius?: number;
  onChange: (radius: number | undefined) => void;
  className?: string;
  /** Borderless control inside the location search field. */
  inline?: boolean;
  /** Compact styling for the v3 hero search row. */
  compact?: boolean;
  /** Show full option labels (e.g. "Within 25 miles") in compact mode. */
  fullLabels?: boolean;
};

function compactRadiusLabel(miles: number): string {
  return `${miles} mi`;
}

/** Miles radius picker for geo job searches. */
export function JobsLocationRadiusSelect({
  radius,
  onChange,
  className = "",
  inline = false,
  compact = false,
  fullLabels = false,
}: Props) {
  const activeRadiusMeters = resolveLocationRadiusMeters(radius);

  if (inline) {
    return (
      <div className={`relative shrink-0 ${className}`}>
        <select
          value={activeRadiusMeters}
          onChange={(event) => {
            const value = Number(event.target.value);
            onChange(
              value === DEFAULT_LOCATION_RADIUS_METERS ? undefined : value,
            );
          }}
          aria-label="Search within distance of location"
          className={
            compact
              ? "h-9 cursor-pointer appearance-none rounded-lg border border-[#E5E7EB] bg-[#f5f5f7] py-0 pl-3 pr-11 text-[13px] font-medium text-[#1d1d1f] outline-none focus:border-[#235A0E] focus:ring-2 focus:ring-[#235A0E]/15"
              : "h-12 cursor-pointer appearance-none border-0 bg-transparent py-0 pl-3 pr-8 text-sm text-muted-foreground outline-none hover:text-foreground focus:text-foreground"
          }
        >
          {LOCATION_RADIUS_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {compact && fullLabels
                ? option.label
                : compact && !fullLabels
                  ? compactRadiusLabel(option.miles)
                  : option.label}
            </option>
          ))}
        </select>
        <ChevronDown
          className={`pointer-events-none absolute top-1/2 -translate-y-1/2 text-[#86868b] ${
            compact ? "right-3.5 h-3.5 w-3.5" : "right-2 h-4 w-4"
          }`}
          aria-hidden="true"
        />
      </div>
    );
  }

  return (
    <div className={className}>
      <p className="mb-1.5 text-xs font-medium text-muted-foreground">
        Search within
      </p>
      <div className="relative">
        <select
          value={activeRadiusMeters}
          onChange={(event) => {
            const value = Number(event.target.value);
            onChange(
              value === DEFAULT_LOCATION_RADIUS_METERS ? undefined : value,
            );
          }}
          aria-label="Search within distance of location"
          className="h-10 w-full appearance-none rounded-xl border border-[#E5E7EB] bg-white py-0 pl-3 pr-8 text-sm text-foreground outline-none focus:border-[#2d6a4f] focus:ring-2 focus:ring-[#2d6a4f]/15"
        >
          {LOCATION_RADIUS_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown
          className="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
          aria-hidden="true"
        />
      </div>
    </div>
  );
}
