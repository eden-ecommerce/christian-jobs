import { LONDON_COORDINATES } from "@lib/location/constants";

export type GeoCoordinates = {
  latitude: number;
  longitude: number;
};

type ResolveGeoCoordinatesInput = {
  latitude?: string | number | null;
  longitude?: string | number | null;
};

function parseCoordinate(value: string | number | null | undefined): number | null {
  if (value === null || value === undefined || value === "") {
    return null;
  }

  const parsed = typeof value === "number" ? value : Number.parseFloat(value);
  return Number.isFinite(parsed) ? parsed : null;
}

export function resolveGeoCoordinates(input: ResolveGeoCoordinatesInput): GeoCoordinates {
  const latitude = parseCoordinate(input.latitude);
  const longitude = parseCoordinate(input.longitude);

  if (latitude === null || longitude === null) {
    return LONDON_COORDINATES;
  }

  if (latitude === 0 && longitude === 0) {
    return LONDON_COORDINATES;
  }

  return { latitude, longitude };
}
