import type { CategoryFacet } from "@lib/algolia/jobs";
import {
  browseAllCategoriesHref,
  categoryResultsHref,
} from "@lib/jobs/category-results-href";

const TOP_CATEGORY_COUNT = 8;

/** Primary category chips. */
const categoryChipClass =
  "inline-flex items-center rounded-full px-3.5 py-1.5 text-[14px] font-semibold leading-snug transition-[transform,background-color,box-shadow,opacity] active:scale-[0.98] sm:px-4 sm:text-[15px]";

/** Same size as category chips; translucent style only. */
const secondaryChipClass =
  "inline-flex items-center rounded-full px-3.5 py-1.5 text-[14px] font-semibold leading-snug transition-[transform,background-color,opacity] active:scale-[0.98] sm:px-4 sm:text-[15px]";

type Props = {
  categories: CategoryFacet[];
  resultsPath: string;
  /** When false, omit the “Browse by category” label (e.g. under a Category tab). */
  showHeading?: boolean;
};

/**
 * Hero CTAs — crawlable category links with live job counts.
 * Server-rendered so counts and hrefs ship in the initial HTML.
 */
export function JobsCategoryChipsV6({
  categories,
  resultsPath,
  showHeading = true,
}: Props) {
  const topCategories = categories.slice(0, TOP_CATEGORY_COUNT);
  const browseAllHref = browseAllCategoriesHref(resultsPath);

  if (topCategories.length === 0) return null;

  return (
    <nav aria-label="Browse jobs by category">
      {showHeading ? (
        <p className="mb-2.5 text-center text-[15px] font-bold text-white sm:mb-3 sm:text-[16px]">
          Browse by category
        </p>
      ) : null}
      <ul className="flex flex-wrap items-center justify-center gap-2 sm:gap-2.5">
        {topCategories.map((category) => (
          <li key={category.value}>
            <a
              href={categoryResultsHref(resultsPath, category.value)}
              aria-label={`${category.label}, ${category.count} jobs`}
              className={`${categoryChipClass} bg-white text-[#1d1d1f] shadow-[0_2px_8px_rgba(0,0,0,0.12)] ring-1 ring-black/[0.06] hover:bg-[#f5f5f7] hover:shadow-[0_4px_12px_rgba(0,0,0,0.16)]`}
            >
              <span>
                {category.label}
                <span className="font-medium text-[#86868b]"> · </span>
                <span className="tabular-nums text-[#235A0E]">
                  {category.count}
                </span>
              </span>
            </a>
          </li>
        ))}
        <li>
          <a
            href={browseAllHref}
            className={`${secondaryChipClass} bg-white/15 text-white ring-1 ring-white/40 hover:bg-white/25`}
          >
            Browse all categories
          </a>
        </li>
      </ul>
    </nav>
  );
}
