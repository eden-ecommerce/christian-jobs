import { LONDON_LABEL } from "@lib/location/constants";

export function formatCloudflareLabel(city?: string | null, country?: string | null): string {
  const parts = [city, country].filter((part): part is string => Boolean(part?.trim()));

  if (parts.length === 0) {
    return LONDON_LABEL;
  }

  return parts.join(", ");
}
