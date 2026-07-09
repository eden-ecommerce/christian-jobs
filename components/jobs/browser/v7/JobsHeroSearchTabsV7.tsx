"use client";

import { JobsCategoryChipsV6 } from "@components/jobs/browser/v6/JobsCategoryChipsV6";
import {
  JobsLocationSearchV7,
  type JobsLocationSearchSubmit,
} from "@components/jobs/browser/v7/JobsLocationSearchV7";
import { JobsWorkTypeChipsV7 } from "@components/jobs/browser/v7/JobsWorkTypeChipsV7";
import type { CategoryFacet } from "@lib/algolia/jobs";
import { useId, useState } from "react";

type HeroSearchTab = "category" | "location" | "workType";

const TABS: { id: HeroSearchTab; label: string }[] = [
  { id: "category", label: "Category" },
  { id: "location", label: "Location" },
  { id: "workType", label: "Work Type" },
];

type Props = {
  categories: CategoryFacet[];
  resultsPath: string;
  onLocationSearch: (location: JobsLocationSearchSubmit) => void;
};

/**
 * Rightmove-style tab switcher — Category chips, Location field, or Work Type chips.
 */
export function JobsHeroSearchTabsV7({
  categories,
  resultsPath,
  onLocationSearch,
}: Props) {
  const [activeTab, setActiveTab] = useState<HeroSearchTab>("category");
  const baseId = useId();

  return (
    <div className="mx-auto w-full max-w-4xl">
      <div
        role="tablist"
        aria-label="Search by"
        className="flex items-stretch justify-start gap-1 border-b border-white/25"
      >
        {TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          const tabId = `${baseId}-tab-${tab.id}`;
          const panelId = `${baseId}-panel-${tab.id}`;
          return (
            <button
              key={tab.id}
              id={tabId}
              type="button"
              role="tab"
              aria-selected={isActive}
              aria-controls={panelId}
              tabIndex={isActive ? 0 : -1}
              onClick={() => setActiveTab(tab.id)}
              className={`relative min-h-11 cursor-pointer px-3.5 text-[15px] font-semibold transition-colors sm:min-h-12 sm:px-5 sm:text-[16px] ${
                isActive
                  ? "text-white"
                  : "text-white/65 hover:text-white/90"
              }`}
            >
              {tab.label}
              {isActive ? (
                <span
                  className="absolute inset-x-2 bottom-0 h-0.5 rounded-full bg-white sm:inset-x-3"
                  aria-hidden="true"
                />
              ) : null}
            </button>
          );
        })}
      </div>

      <div className="mt-5 min-h-[148px] sm:mt-6 sm:min-h-[160px]">
        {TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          const tabId = `${baseId}-tab-${tab.id}`;
          const panelId = `${baseId}-panel-${tab.id}`;
          return (
            <div
              key={tab.id}
              id={panelId}
              role="tabpanel"
              aria-labelledby={tabId}
              hidden={!isActive}
            >
              {tab.id === "category" ? (
                <JobsCategoryChipsV6
                  categories={categories}
                  resultsPath={resultsPath}
                  showHeading={false}
                />
              ) : null}
              {tab.id === "location" ? (
                <JobsLocationSearchV7 onSearch={onLocationSearch} />
              ) : null}
              {tab.id === "workType" ? (
                <JobsWorkTypeChipsV7 resultsPath={resultsPath} />
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}
