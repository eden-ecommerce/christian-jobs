"use client";

import { JobsCategoryChipsV6 } from "@components/jobs/browser/v6/JobsCategoryChipsV6";
import {
  JobsLocationTabV8,
  type JobsLocationTabSubmit,
} from "@components/jobs/browser/v8/JobsLocationTabV8";
import type { CategoryFacet } from "@lib/algolia/jobs";
import { useId, useState } from "react";

type HeroSearchTab = "category" | "location";

const TABS: { id: HeroSearchTab; label: string }[] = [
  { id: "category", label: "Category" },
  { id: "location", label: "Location" },
];

type Props = {
  categories: CategoryFacet[];
  resultsPath: string;
  onLocationSearch: (values: JobsLocationTabSubmit) => void;
};

/** Two-tab switcher — Category chips, or Location (with nested Work Type). */
export function JobsHeroSearchTabsV8({
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
        className="mx-auto flex w-full max-w-md items-stretch justify-center gap-1 border-b border-white/30 sm:max-w-lg"
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
              className={`relative flex min-h-11 flex-1 cursor-pointer items-center justify-center px-4 text-[16px] font-semibold outline-none transition-colors focus-visible:bg-white/10 sm:min-h-12 sm:px-6 sm:text-[17px] ${
                isActive
                  ? "text-white"
                  : "text-white/65 hover:text-white/90"
              }`}
            >
              {tab.label}
              {isActive ? (
                <span
                  className="absolute inset-x-5 bottom-0 h-[2px] rounded-full bg-white sm:inset-x-6"
                  aria-hidden="true"
                />
              ) : null}
            </button>
          );
        })}
      </div>

      <div className="mt-5 min-h-[168px] sm:mt-6 sm:min-h-[180px]">
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
                <JobsLocationTabV8
                  resultsPath={resultsPath}
                  onSearch={onLocationSearch}
                />
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}
