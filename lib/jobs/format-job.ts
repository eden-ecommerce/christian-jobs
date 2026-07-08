import type { JobHit } from "@lib/algolia/jobs";

const HTML_TAG_PATTERN = /<\/?[a-z][\s\S]*>/i;

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/** Convert plain-text line breaks to paragraph markup; pass through existing HTML. */
export function formatJobDescriptionHtml(description: string): string {
  const trimmed = description.trim();
  if (!trimmed) return "";
  if (HTML_TAG_PATTERN.test(trimmed)) return trimmed;

  return trimmed
    .split(/\n{2,}/)
    .map((paragraph) => {
      const lines = paragraph
        .split(/\n/)
        .map((line) => escapeHtml(line))
        .join("<br />");
      return `<p>${lines}</p>`;
    })
    .join("");
}

/** Compose a short location line for job cards and detail views. */
export function jobLocationLine(job: Pick<
  JobHit,
  "online" | "locationName" | "locationCity" | "locationState"
>): string {
  if (job.online) return "Remote";
  const segments = [job.locationCity, job.locationState].filter(
    (s): s is string => Boolean(s),
  );
  if (segments.length > 0) return segments.join(", ");
  return job.locationName ?? "Location to be confirmed";
}

const RECENT_POSTED_WINDOW_DAYS = 7;
const IMMINENT_CLOSING_WINDOW_DAYS = 3;

export function formatPostedLabel(
  postedTimestamp: number | null,
  now = Date.now(),
): string | null {
  if (!postedTimestamp) return null;
  const diffDays = Math.floor((now - postedTimestamp) / 86_400_000);
  if (diffDays >= RECENT_POSTED_WINDOW_DAYS) return null;
  if (diffDays === 0) return "Added Today";
  if (diffDays === 1) return "Added Yesterday";
  if (diffDays < RECENT_POSTED_WINDOW_DAYS) return "Added This Week";
  return null;
}

export type ClosingUrgency = {
  label: string;
  daysRemaining: number;
  isImminent: boolean;
};

export function getClosingUrgency(
  job: Pick<JobHit, "closingDate" | "closingDateTimestamp">,
  now = Date.now(),
): ClosingUrgency | null {
  const timestamp =
    job.closingDateTimestamp ??
    (job.closingDate ? new Date(job.closingDate).getTime() : null);
  if (timestamp === null || Number.isNaN(timestamp)) return null;

  const daysRemaining = Math.ceil((timestamp - now) / 86_400_000);
  if (daysRemaining < 0) return null;

  const label =
    daysRemaining === 0
      ? "Closes today"
      : daysRemaining === 1
        ? "Closes tomorrow"
        : `Closes in ${daysRemaining} days`;

  return {
    label,
    daysRemaining,
    isImminent: daysRemaining <= IMMINENT_CLOSING_WINDOW_DAYS,
  };
}

/** Closing label for cards — only when the deadline is within a few days. */
export function formatImminentClosingLabel(
  job: Pick<JobHit, "closingDate" | "closingDateTimestamp">,
  now = Date.now(),
): string | null {
  const urgency = getClosingUrgency(job, now);
  if (!urgency?.isImminent) return null;
  return urgency.label;
}

export function formatClosingLabel(closingDate: string | null): string | null {
  if (!closingDate) return null;
  const d = new Date(closingDate);
  if (Number.isNaN(d.getTime())) return null;
  return `Closes ${d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "Europe/London",
  })}`;
}

/** Whether salary should be shown in the UI (excludes empty, zero, and placeholder values). */
export function hasDisplayableSalary(salary: string | null): boolean {
  if (!salary?.trim()) return false;

  const normalised = salary.trim().toLowerCase();
  if (
    normalised === "0" ||
    normalised === "£0" ||
    normalised === "£0.00" ||
    normalised === "0.00" ||
    /^£?\s*0(\.0+)?$/.test(normalised)
  ) {
    return false;
  }

  const minimum = parseSalaryMinimum(salary);
  if (minimum === 0) return false;

  return true;
}

export function formatSalary(salary: string | null): string {
  if (!hasDisplayableSalary(salary)) return "";
  return salary!.trim();
}

/** Split camelCase/PascalCase into spaced words: "partTime" -> "Part Time" */
export function humaniseJobType(value: string): string {
  return value
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/^./, (c) => c.toUpperCase());
}

/** Detect hybrid/flexible working from job text when no structured work-type field exists. */
export function isHybridWork(
  job: Pick<JobHit, "title" | "description" | "schedule">,
): boolean {
  const text = [job.title, job.description, job.schedule]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
  return /\bhybrid\b/.test(text) || /\bflexible (?:working|work)\b/.test(text);
}

/** Parse min and max annual salary from free-text salary strings. */
export function parseSalaryRange(salary: string | null): {
  min: number | null;
  max: number | null;
} {
  if (!salary) return { min: null, max: null };

  const normalised = salary.toLowerCase();
  if (normalised.includes("competitive") || normalised.includes("negotiable")) {
    return { min: null, max: null };
  }

  const matches = [...salary.matchAll(/£?\s*([\d,]+(?:\.\d+)?)/g)];
  if (matches.length === 0) return { min: null, max: null };

  const amounts = matches
    .map((match) => Number(match[1].replace(/,/g, "")))
    .filter((value) => Number.isFinite(value));

  if (amounts.length === 0) return { min: null, max: null };

  const min = amounts[0];
  const hasPlus = normalised.includes("+");
  const max =
    amounts.length >= 2 ? amounts[amounts.length - 1] : hasPlus ? null : min;

  return { min, max };
}

/** Parse a minimum annual salary from free-text salary strings. */
export function parseSalaryMinimum(salary: string | null): number | null {
  return parseSalaryRange(salary).min;
}

/** Whether a job salary overlaps the requested from/to range. */
export function salaryMatchesRange(
  salary: string | null,
  minSalary?: number,
  maxSalary?: number,
): boolean {
  const hasMin = typeof minSalary === "number" && minSalary > 0;
  const hasMax = typeof maxSalary === "number" && maxSalary > 0;
  if (!hasMin && !hasMax) return true;

  const { min: jobMin, max: jobMax } = parseSalaryRange(salary);
  if (jobMin === null && jobMax === null) return true;

  if (hasMin && jobMax !== null && jobMax < minSalary!) return false;
  if (hasMax && jobMin !== null && jobMin > maxSalary!) return false;
  return true;
}
