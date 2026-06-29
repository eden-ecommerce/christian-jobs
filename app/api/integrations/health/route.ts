import { NextResponse } from "next/server";
import { z } from "zod";
import { probeAlgoliaIndex } from "@eden-ecommerce/lib/algolia/probe-index";
import { CORS_HEADERS, corsPreflight } from "@lib/cors";
import { edenFetch } from "@lib/eden/fetch";
import { getServerEnv } from "@lib/env-server";
import { getFooter } from "@lib/sanity/get-footer";
import { getHeader } from "@lib/sanity/get-header";
import { calculateBeaconParams } from "@lib/user-beacon/calculate-beacon-params";

export const dynamic = "force-dynamic";

const integrationCheckSchema = z.object({
  ok: z.boolean(),
  detail: z.string().optional(),
});

const beaconCheckSchema = integrationCheckSchema.extend({
  status: z.number(),
});

const algoliaCheckSchema = integrationCheckSchema.extend({
  hitCount: z.number().optional(),
});

const integrationsHealthResponseSchema = z.object({
  status: z.enum(["ok", "degraded"]),
  timestamp: z.string(),
  sanityProjectId: z.string().optional(),
  sanityDataset: z.string().optional(),
  checks: z.object({
    sanityHeader: integrationCheckSchema,
    sanityFooter: integrationCheckSchema,
    edenUserBeacon: beaconCheckSchema,
    algoliaProducts: algoliaCheckSchema,
    algoliaOrganisationHub: algoliaCheckSchema,
  }),
});

export type IntegrationsHealthResponse = z.infer<typeof integrationsHealthResponseSchema>;

export function OPTIONS() {
  return corsPreflight();
}

export async function GET() {
  const serverEnv = getServerEnv();
  const timestamp = new Date().toISOString();

  const [header, footer, beaconResponse, productsProbe, organisationHubProbe] =
    await Promise.all([
      getHeader(),
      getFooter(),
      edenFetch(`/session/beacon?${calculateBeaconParams(false)}`),
      probeAlgoliaIndex("products"),
      probeAlgoliaIndex("organisationHub"),
    ]);

  const checks: IntegrationsHealthResponse["checks"] = {
    sanityHeader: header
      ? { ok: true }
      : { ok: false, detail: "getHeader() returned null" },
    sanityFooter: footer
      ? { ok: true }
      : { ok: false, detail: "getFooter() returned null" },
    edenUserBeacon: {
      ok: beaconResponse.ok,
      status: beaconResponse.status,
      ...(beaconResponse.ok
        ? {}
        : { detail: `GET /session/beacon returned HTTP ${beaconResponse.status}` }),
    },
    algoliaProducts: {
      ok: productsProbe.ok,
      ...(productsProbe.hitCount !== undefined
        ? { hitCount: productsProbe.hitCount }
        : {}),
      ...(productsProbe.detail ? { detail: productsProbe.detail } : {}),
    },
    algoliaOrganisationHub: {
      ok: organisationHubProbe.ok,
      ...(organisationHubProbe.hitCount !== undefined
        ? { hitCount: organisationHubProbe.hitCount }
        : {}),
      ...(organisationHubProbe.detail ? { detail: organisationHubProbe.detail } : {}),
    },
  };

  const allChecksPass = Object.values(checks).every((check) => check.ok);

  const payload: IntegrationsHealthResponse = {
    status: allChecksPass ? "ok" : "degraded",
    timestamp,
    ...(serverEnv.EDEN_SANITY_PROJECT_ID
      ? { sanityProjectId: serverEnv.EDEN_SANITY_PROJECT_ID }
      : {}),
    ...(serverEnv.EDEN_SANITY_DATASET
      ? { sanityDataset: serverEnv.EDEN_SANITY_DATASET }
      : {}),
    checks,
  };

  return NextResponse.json(integrationsHealthResponseSchema.parse(payload), {
    headers: CORS_HEADERS,
  });
}
