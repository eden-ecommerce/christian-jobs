import { HERO_WORK_TYPE_OPTIONS } from "@lib/jobs/search-params";
import { workTypeResultsHref } from "@lib/jobs/category-results-href";

const chipClass =
  "inline-flex min-h-11 items-center rounded-full bg-white px-3.5 py-2.5 text-[14px] font-semibold text-[#1d1d1f] shadow-[0_2px_8px_rgba(0,0,0,0.12)] ring-1 ring-black/[0.06] transition-[transform,background-color,box-shadow] hover:bg-[#f5f5f7] hover:shadow-[0_4px_12px_rgba(0,0,0,0.16)] active:scale-[0.98] sm:min-h-10 sm:px-4 sm:text-[15px]";

type Props = {
  resultsPath: string;
};

/** One-click Remote / Hybrid / Onsite links for the v7 Work Type tab. */
export function JobsWorkTypeChipsV7({ resultsPath }: Props) {
  return (
    <nav aria-label="Browse jobs by work type">
      <ul className="flex flex-wrap items-center justify-center gap-2 sm:gap-2.5">
        {HERO_WORK_TYPE_OPTIONS.map((option) => (
          <li key={option.value}>
            <a
              href={workTypeResultsHref(resultsPath, option.value)}
              className={chipClass}
            >
              {option.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
