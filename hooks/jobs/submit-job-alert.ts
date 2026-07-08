import { apiFetch } from "@lib/apiFetch";
import type {
  JobAlertSignupPayload,
  JobAlertSignupResponse,
} from "@lib/jobs/job-alert.schema";

export function submitJobAlert(
  payload: JobAlertSignupPayload,
): Promise<JobAlertSignupResponse> {
  return apiFetch<JobAlertSignupResponse>("/api/jobs/alerts", {
    method: "POST",
    body: payload as unknown as Record<string, string | number | boolean | null>,
  });
}
