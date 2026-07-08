import type { JobAlertSignupPayload } from "@lib/jobs/job-alert.schema";

/**
 * Persists a job alert signup. No Eden platform endpoint exists yet — forwards to
 * `JOB_ALERTS_WEBHOOK_URL` when configured, otherwise logs structured payload server-side.
 */
export async function submitJobAlertSignup(
  payload: JobAlertSignupPayload,
): Promise<void> {
  const webhookUrl = process.env.JOB_ALERTS_WEBHOOK_URL?.trim();

  if (webhookUrl) {
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        source: "christian-jobs",
        subscribedAt: new Date().toISOString(),
        ...payload,
      }),
    });

    if (!response.ok) {
      throw new Error(`Job alert webhook failed (${response.status})`);
    }

    return;
  }

  console.info("[job-alerts] signup captured", {
    email: payload.email,
    frequency: payload.frequency,
    filters: payload.filters,
  });
}
