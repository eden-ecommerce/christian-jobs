"use client";

import { AdvancedFilters, type Facet } from "@components/events/AdvancedFilters";
import { CategoriesHierarchicalFilter } from "@components/events/CategoriesHierarchicalFilter";
import type { EventFacet } from "@lib/algolia/events";

type EventSearchFiltersProps = {
  categories: EventFacet[];
  categoryLvl1: EventFacet[];
  categoryLvl2: EventFacet[];
  categoryLvl3: EventFacet[];
  categoryLvl4: EventFacet[];
  organisationTypes: Facet[];
  hasGeo: boolean;
};

export function EventSearchFilters({
  categories,
  categoryLvl1,
  categoryLvl2,
  categoryLvl3,
  categoryLvl4,
  organisationTypes,
  hasGeo,
}: EventSearchFiltersProps) {
  return (
    <aside
      className="flex flex-col gap-5 rounded-xl border border-border bg-card p-5"
      aria-label="Filters"
    >
      <AdvancedFilters 
        categoryLvl0={categories}
        categoryLvl1={categoryLvl1}
        categoryLvl2={categoryLvl2}
        categoryLvl3={categoryLvl3}
        categoryLvl4={categoryLvl4}
        organisationTypes={organisationTypes} 
        hasGeo={hasGeo} 
      />
    </aside>
  );
}
