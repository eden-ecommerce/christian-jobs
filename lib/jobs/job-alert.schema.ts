import type { JobSort } from "@lib/algolia/jobs";
import type { DatePosted, JobWorkType } from "@lib/jobs/search-params";
import { z } from "zod";

const jobWorkTypeSchema = z.enum(["onsite", "hybrid", "remote"]);
const datePostedSchema = z.enum(["any", "24h", "week", "month"]);
const jobSortSchema = z.enum(["date_desc", "relevance", "distance"]);
const jobAlertFrequencySchema = z.enum(["immediate", "daily", "weekly"]);

export const JOB_ALERT_FREQUENCY_OPTIONS = [
  { label: "Immediate", value: "immediate" },
  { label: "Daily", value: "daily" },
  { label: "Weekly", value: "weekly" },
] as const;

export type JobAlertFrequency = z.infer<typeof jobAlertFrequencySchema>;

export const jobAlertFiltersSchema = z.object({
  q: z.string(),
  location: z.string(),
  lat: z.number().optional(),
  lng: z.number().optional(),
  place: z.string().optional(),
  radius: z.number().optional(),
  category: z.string().optional(),
  uncategorised: z.boolean().optional(),
  contractTypes: z.array(z.string()),
  organisationTypes: z.array(z.string()),
  workTypes: z.array(jobWorkTypeSchema),
  denominations: z.array(z.string()),
  minSalary: z.number().optional(),
  datePosted: datePostedSchema,
  sort: jobSortSchema,
});

export type JobAlertFilters = z.infer<typeof jobAlertFiltersSchema>;

export const jobAlertSignupSchema = z.object({
  email: z.string().trim().email("Enter a valid email address"),
  frequency: jobAlertFrequencySchema.default("daily"),
  filters: jobAlertFiltersSchema,
});

export type JobAlertSignupPayload = z.infer<typeof jobAlertSignupSchema>;

export type JobAlertSignupResponse = {
  ok: true;
};

export function jobAlertFiltersFromUrlState(state: {
  q: string;
  location: string;
  lat?: number;
  lng?: number;
  place?: string;
  radius?: number;
  category?: string;
  uncategorised?: boolean;
  contractTypes: string[];
  organisationTypes: string[];
  workTypes: JobWorkType[];
  denominations: string[];
  minSalary?: number;
  datePosted: DatePosted;
  sort: JobSort;
}): JobAlertFilters {
  return {
    q: state.q,
    location: state.location,
    lat: state.lat,
    lng: state.lng,
    place: state.place,
    radius: state.radius,
    category: state.category,
    uncategorised: state.uncategorised,
    contractTypes: state.contractTypes,
    organisationTypes: state.organisationTypes,
    workTypes: state.workTypes,
    denominations: state.denominations,
    minSalary: state.minSalary,
    datePosted: state.datePosted,
    sort: state.sort,
  };
}

export function jobAlertFrequencyLabel(
  frequency: JobAlertFrequency,
): string {
  return (
    JOB_ALERT_FREQUENCY_OPTIONS.find((option) => option.value === frequency)
      ?.label.toLowerCase() ?? frequency
  );
}
