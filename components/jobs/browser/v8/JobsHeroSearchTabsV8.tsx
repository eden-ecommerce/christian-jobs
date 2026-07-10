"use client";

import { JobsCategoryChipsV6 } from "@components/jobs/browser/v6/JobsCategoryChipsV6";
import {
  JobsLocationTabV8,
  type JobsLocationTabSubmit,
} from "@components/jobs/browser/v8/JobsLocationTabV8";
import { usePrefersReducedMotion } from "@hooks/jobs/use-prefers-reduced-motion";
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
  const reduceMotion = usePrefersReducedMotion();
  const activeIndex = TABS.findIndex((tab) => tab.id === activeTab);

  return (
    <div className="mx-auto w-full max-w-4xl">
      <div
        role="tablist"
        aria-label="Search by"
        className="relative mx-auto grid w-full max-w-md grid-cols-2 gap-1 rounded-full bg-black/55 p-1 shadow-[0_2px_10px_rgba(0,0,0,0.35)] ring-1 ring-white/20 backdrop-blur-sm sm:max-w-lg"
      >
        <span
          aria-hidden="true"
          className={`pointer-events-none absolute inset-y-1 left-1 w-[calc(50%-0.375rem)] rounded-full bg-white/20 ${
            reduceMotion
              ? ""
              : "transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]"
          }`}
          style={{
            transform:
              activeIndex <= 0
                ? "translateX(0)"
                : "translateX(calc(100% + 0.25rem))",
          }}
        />

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
              className={`relative z-10 flex min-h-10 cursor-pointer items-center justify-center rounded-full px-4 text-[15px] font-semibold outline-none transition-colors [text-shadow:0_1px_2px_rgba(0,0,0,0.45)] focus-visible:ring-2 focus-visible:ring-white/40 sm:min-h-11 sm:px-5 sm:text-[16px] ${
                isActive
                  ? "text-white"
                  : "text-white/80 hover:text-white"
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/*
        Both panels always mounted in the same grid cell so height stays at the
        taller panel — no hero jump when switching tabs.
      */}
      <div className="relative mt-5 grid sm:mt-6">
        <div
          id={`${baseId}-panel-category`}
          role="tabpanel"
          aria-labelledby={`${baseId}-tab-category`}
          aria-hidden={activeTab !== "category"}
          className={`col-start-1 row-start-1 ${
            reduceMotion ? "" : "transition-opacity duration-200 ease-out"
          } ${
            activeTab === "category"
              ? "z-10 opacity-100"
              : "pointer-events-none z-0 opacity-0"
          }`}
        >
          <JobsCategoryChipsV6
            categories={categories}
            resultsPath={resultsPath}
            showHeading={false}
          />
        </div>

        <div
          id={`${baseId}-panel-location`}
          role="tabpanel"
          aria-labelledby={`${baseId}-tab-location`}
          aria-hidden={activeTab !== "location"}
          className={`col-start-1 row-start-1 ${
            reduceMotion ? "" : "transition-opacity duration-200 ease-out"
          } ${
            activeTab === "location"
              ? "z-10 opacity-100"
              : "pointer-events-none z-0 opacity-0"
          }`}
        >
          <JobsLocationTabV8
            resultsPath={resultsPath}
            onSearch={onLocationSearch}
          />
        </div>
      </div>
    </div>
  );
}
