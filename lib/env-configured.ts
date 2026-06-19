/** Shown when an integration's required env vars are missing. */
export const ENV_NOT_CONFIGURED_MESSAGE =
  "Contact the IT team to set your environment variables.";

export const INTEGRATION_ENV_VARS = {
  sanity: [
    "EDEN_SANITY_PROJECT_ID",
    "EDEN_SANITY_DATASET",
    "EDEN_SANITY_API_DEVELOPER_TOKEN",
  ],
  algolia: ["NEXT_PUBLIC_ALGOLIA_APP_ID", "NEXT_PUBLIC_ALGOLIA_SEARCH_KEY"],
  edenApi: ["NEXT_PUBLIC_EDEN_API_URL"],
  edenOAuth: [
    "NEXT_PUBLIC_EDEN_OAUTH_URL",
    "EDEN_PAYMENT_CLIENT_ID",
    "EDEN_PAYMENT_CLIENT_SECRET",
  ],
  googleMaps: ["NEXT_PUBLIC_GOOGLE_MAPS_API_KEY"],
} as const satisfies Record<string, readonly string[]>;

export type IntegrationKey = keyof typeof INTEGRATION_ENV_VARS;
/** @deprecated Use IntegrationKey */
export type PublicIntegration = IntegrationKey;

export const INTEGRATION_LABELS: Record<IntegrationKey, string> = {
  sanity: "Sanity CMS",
  algolia: "Algolia Search",
  edenApi: "Eden API",
  edenOAuth: "Eden OAuth",
  googleMaps: "Google Maps",
};

export function isAlgoliaEnvConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_ALGOLIA_APP_ID && process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_KEY,
  );
}

export function isEdenApiEnvConfigured(): boolean {
  return Boolean(process.env.NEXT_PUBLIC_EDEN_API_URL);
}

export function isEdenOAuthEnvConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_EDEN_OAUTH_URL &&
      process.env.EDEN_PAYMENT_CLIENT_ID &&
      process.env.EDEN_PAYMENT_CLIENT_SECRET,
  );
}

export function isGoogleMapsEnvConfigured(): boolean {
  return Boolean(process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY);
}
