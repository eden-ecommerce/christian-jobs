import { apiFetch } from "@lib/apiFetch";
import type { SettingsApiResponse } from "@lib/settings.schema";

export function fetchSettings(): Promise<SettingsApiResponse> {
  return apiFetch<SettingsApiResponse>("/api/settings");
}

export function updateSettings(body: SettingsApiResponse): Promise<SettingsApiResponse> {
  return apiFetch<SettingsApiResponse>("/api/settings", {
    method: "PATCH",
    body,
  });
}
