export {
  ENV_NOT_CONFIGURED_MESSAGE,
  isAlgoliaEnvConfigured,
  isEdenApiEnvConfigured,
  isEdenOAuthEnvConfigured,
  isGoogleMapsEnvConfigured,
  isGtmEnvConfigured,
  isUserBeaconEnvConfigured,
} from "@eden-ecommerce/lib/env-configured";

import {
  INTEGRATION_ENV_VARS as LIB_INTEGRATION_ENV_VARS,
  INTEGRATION_LABELS as LIB_INTEGRATION_LABELS,
} from "@eden-ecommerce/lib/env-configured";

export const INTEGRATION_ENV_VARS = {
  ...LIB_INTEGRATION_ENV_VARS,
  deploy: [
    "NEXT_PUBLIC_NAMESPACE",
    "NEXT_PUBLIC_PRODUCTION_ORIGIN",
    "NEXT_PUBLIC_DEV_ORIGIN",
  ],
} as const;

export type IntegrationKey = keyof typeof INTEGRATION_ENV_VARS;

export const INTEGRATION_LABELS: Record<IntegrationKey, string> = {
  ...LIB_INTEGRATION_LABELS,
  deploy: "Deploy configuration",
};

const hasVercelPreviewOrigin = (): boolean =>
  process.env.VERCEL_ENV === "preview" && Boolean(process.env.VERCEL_URL);

/** Client-safe deploy env gate — namespace always; production origin only for production builds. */
export const isDeployEnvConfigured = (): boolean => {
  if (!process.env.NEXT_PUBLIC_NAMESPACE?.trim()) return false;

  if (process.env.NODE_ENV === "production") {
    return Boolean(
      process.env.NEXT_PUBLIC_PRODUCTION_ORIGIN || hasVercelPreviewOrigin(),
    );
  }

  return true;
};

/** Env vars to show in IntegrationEnvError for missing deploy configuration. */
export const getDeployIntegrationEnvVars = (): readonly string[] => {
  const vars: string[] = [];

  if (!process.env.NEXT_PUBLIC_NAMESPACE?.trim()) {
    vars.push("NEXT_PUBLIC_NAMESPACE");
  }

  if (
    process.env.NODE_ENV === "production" &&
    !process.env.NEXT_PUBLIC_PRODUCTION_ORIGIN &&
    !hasVercelPreviewOrigin()
  ) {
    vars.push("NEXT_PUBLIC_PRODUCTION_ORIGIN");
  }

  return vars.length > 0 ? vars : ["NEXT_PUBLIC_NAMESPACE"];
};
