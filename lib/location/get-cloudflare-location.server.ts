import "server-only";

import { cache } from "react";
import { headers } from "next/headers";
import { formatCloudflareLabel } from "@lib/location/format-cloudflare-label";
import { LONDON_LABEL } from "@lib/location/constants";
import { resolveGeoCoordinates } from "@lib/location/resolve-geo-coordinates";
import type { CloudflareLocation } from "@lib/location/types";

export type { CloudflareLocation } from "@lib/location/types";

function getHeaderValue(headerList: Headers, names: readonly string[]): string | null {
  for (const name of names) {
    const value = headerList.get(name);
    if (value) {
      return value;
    }
  }

  return null;
}

async function readCloudflareLocation(): Promise<CloudflareLocation> {
  const headerList = await headers();

  const latitudeHeader = getHeaderValue(headerList, ["cf-iplatitude", "CF-IPLatitude"]);
  const longitudeHeader = getHeaderValue(headerList, ["cf-iplongitude", "CF-IPLongitude"]);
  const city = getHeaderValue(headerList, ["cf-ipcity", "CF-IPCity"]) ?? undefined;
  const country = getHeaderValue(headerList, ["cf-ipcountry", "CF-IPCountry"]) ?? undefined;

  const hasCloudflareHeaders = Boolean(latitudeHeader && longitudeHeader);
  const coordinates = resolveGeoCoordinates({
    latitude: latitudeHeader,
    longitude: longitudeHeader,
  });

  return {
    ...coordinates,
    label: hasCloudflareHeaders ? formatCloudflareLabel(city, country) : LONDON_LABEL,
    source: hasCloudflareHeaders ? "cloudflare" : "default",
    city,
    country,
  };
}

export const getCloudflareLocation = cache(readCloudflareLocation);
