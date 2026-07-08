"use client";

import { Input } from "@components/ui/input";
import { ApiError } from "@lib/apiFetch";
import { buildJobAlertCriteriaPills } from "@lib/jobs/job-alert-criteria";
import {
  JOB_ALERT_FREQUENCY_OPTIONS,
  jobAlertFiltersFromUrlState,
  jobAlertFrequencyLabel,
  jobAlertSignupSchema,
  type JobAlertFrequency,
} from "@lib/jobs/job-alert.schema";
import type { JobFacet } from "@lib/algolia/jobs";
import type { JobsUrlState } from "@lib/jobs/search-params";
import { submitJobAlert } from "@hooks/jobs/submit-job-alert";
import { Bell, Check, Loader2 } from "lucide-react";
import { useMemo, useState, type FormEvent } from "react";

type Props = {
  filterState: JobsUrlState;
  facets: {
    categories: JobFacet[];
    contractTypes: JobFacet[];
    organisationTypes: JobFacet[];
    denominations: JobFacet[];
  };
};

const criteriaPillClassName =
  "inline-flex items-center rounded-full bg-[#f5f5f7] px-2.5 py-1 text-xs font-medium text-[#1d1d1f]";

const frequencyPillClass = (active: boolean) =>
  `cursor-pointer rounded-full px-3 py-1.5 text-[13px] font-medium transition-colors ${
    active
      ? "bg-[#235A0E] text-white"
      : "bg-[#f5f5f7] text-[#1d1d1f] hover:bg-[#ececf0]"
  }`;

/** Job alert signup shown in the detail pane when a filtered search returns no results. */
export function JobsJobAlertSignup({ filterState, facets }: Props) {
  const [email, setEmail] = useState("");
  const [frequency, setFrequency] = useState<JobAlertFrequency>("daily");
  const [submittedFrequency, setSubmittedFrequency] =
    useState<JobAlertFrequency>("daily");
  const [validationError, setValidationError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const criteriaPills = useMemo(
    () => buildJobAlertCriteriaPills(filterState, facets),
    [filterState, facets],
  );

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setValidationError(null);
    setSubmitError(null);

    const payload = {
      email,
      frequency,
      filters: jobAlertFiltersFromUrlState(filterState),
    };
    const parsed = jobAlertSignupSchema.safeParse(payload);

    if (!parsed.success) {
      setValidationError(
        parsed.error.flatten().fieldErrors.email?.[0] ??
          "Enter a valid email address",
      );
      return;
    }

    setIsSubmitting(true);

    try {
      await submitJobAlert(parsed.data);
      setSubmittedFrequency(frequency);
      setIsSuccess(true);
    } catch (error) {
      if (error instanceof ApiError) {
        const body = error.body;
        setSubmitError(
          typeof body === "object" && body && "error" in body && body.error
            ? String(body.error)
            : "Unable to create your job alert. Please try again.",
        );
      } else {
        setSubmitError("Unable to create your job alert. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-[280px] flex-col justify-center rounded-2xl bg-white p-6 shadow-soft sm:p-8">
      {isSuccess ? (
        <div className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#235A0E]/10">
            <Check className="h-6 w-6 text-[#235A0E]" aria-hidden="true" />
          </div>
          <h2 className="mt-4 text-lg font-semibold text-foreground">
            You&apos;re set
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            We&apos;ll email you {jobAlertFrequencyLabel(submittedFrequency)} when
            a matching job is posted.
          </p>
        </div>
      ) : (
        <>
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#235A0E]/10">
              <Bell className="h-5 w-5 text-[#235A0E]" aria-hidden="true" />
            </div>
            <div className="min-w-0">
              <h2 className="text-lg font-semibold text-foreground">
                No jobs match right now — get notified when one does
              </h2>
            </div>
          </div>

          {criteriaPills.length > 0 ? (
            <div className="mt-4 flex flex-wrap gap-2">
              {criteriaPills.map((pill) => (
                <span key={pill.key} className={criteriaPillClassName}>
                  {pill.prefix ? `${pill.prefix}: ${pill.label}` : pill.label}
                </span>
              ))}
            </div>
          ) : null}

          <form onSubmit={handleSubmit} className="mt-6 space-y-4" noValidate>
            <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end">
              <div>
                <label
                  htmlFor="job-alert-email"
                  className="mb-1.5 block text-xs font-medium text-muted-foreground"
                >
                  Email
                </label>
                <Input
                  id="job-alert-email"
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(event) => {
                    setEmail(event.target.value);
                    if (validationError) setValidationError(null);
                    if (submitError) setSubmitError(null);
                  }}
                  aria-invalid={Boolean(validationError)}
                  aria-describedby={
                    validationError || submitError
                      ? "job-alert-form-error"
                      : undefined
                  }
                  disabled={isSubmitting}
                  className="h-11 rounded-xl border-[#E5E7EB] bg-[#F9FAFB] px-4"
                />
              </div>

              <fieldset>
                <legend className="mb-1.5 block text-xs font-medium text-muted-foreground">
                  Frequency
                </legend>
                <div
                  className="flex flex-wrap gap-1.5"
                  role="radiogroup"
                  aria-label="Alert frequency"
                >
                  {JOB_ALERT_FREQUENCY_OPTIONS.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      role="radio"
                      aria-checked={frequency === option.value}
                      disabled={isSubmitting}
                      onClick={() => setFrequency(option.value)}
                      className={frequencyPillClass(frequency === option.value)}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </fieldset>
            </div>

            {validationError || submitError ? (
              <p
                id="job-alert-form-error"
                className="text-sm text-destructive"
                role="alert"
              >
                {validationError ?? submitError}
              </p>
            ) : null}

            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#235A0E] px-4 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                  Creating…
                </>
              ) : (
                "Create Alert"
              )}
            </button>
          </form>
        </>
      )}
    </div>
  );
}
