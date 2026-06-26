import type { JobHit } from "@lib/algolia/jobs";

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

export function formatPostedLabel(postedTimestamp: number | null): string | null {
  if (!postedTimestamp) return null;
  const diffDays = Math.floor((Date.now() - postedTimestamp) / 86_400_000);
  if (diffDays === 0) return "Posted today";
  if (diffDays === 1) return "Posted yesterday";
  if (diffDays < 7) return `Posted ${diffDays} days ago`;
  if (diffDays < 30) {
    const weeks = Math.floor(diffDays / 7);
    return `Posted ${weeks} week${weeks === 1 ? "" : "s"} ago`;
  }
  const months = Math.floor(diffDays / 30);
  return `Posted ${months} month${months === 1 ? "" : "s"} ago`;
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

export function formatSalary(salary: string | null): string {
  return salary?.trim() ? salary : "Competitive";
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

/** Parse a minimum annual salary from free-text salary strings. */
export function parseSalaryMinimum(salary: string | null): number | null {
  if (!salary) return null;
  const normalised = salary.toLowerCase();
  if (normalised.includes("competitive") || normalised.includes("negotiable")) {
    return null;
  }
  const match = salary.match(/£?\s*([\d,]+(?:\.\d+)?)/);
  if (!match?.[1]) return null;
  const value = Number(match[1].replace(/,/g, ""));
  return Number.isFinite(value) ? value : null;
}
