import "server-only";

import { getAlgoliaSearchClient } from "@eden-ecommerce/lib/algolia/client";
import { organisationHubIndex } from "@lib/algolia/constants";

type RawHit = Record<string, unknown>;

function str(value: unknown): string | null {
  return typeof value === "string" && value.length > 0 ? value : null;
}

export type OrgCategory = {
  id: number;
  slug: string;
  name: string;
  parentId: number | null;
};

export type RgbColor = { r: number; g: number; b: number };

export type OrganisationHit = {
  objectID: string;
  id: string;
  name: string;
  slug: string | null;
  description: string | null;
  mission: string | null;
  website: string | null;
  organisationType: string | null;
  yearFounded: number | null;
  logoUrl: string | null;
  bannerUrl: string | null;
  logoPalette: RgbColor[];
  bannerPalette: RgbColor[];
  tags: string[];
  categories: OrgCategory[];
};

function parseJsonField(value: unknown): Record<string, unknown> {
  if (!value) return {};
  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);
      if (parsed && typeof parsed === "object" && !Array.isArray(parsed))
        return parsed as Record<string, unknown>;
    } catch {
      // not valid JSON — ignore
    }
    return {};
  }
  if (typeof value === "object" && !Array.isArray(value))
    return value as Record<string, unknown>;
  return {};
}

function parsePalette(field: Record<string, unknown>): RgbColor[] {
  if (!Array.isArray(field.palette)) return [];
  return (field.palette as unknown[]).reduce<RgbColor[]>((acc, item) => {
    if (item && typeof item === "object") {
      const c = item as Record<string, unknown>;
      if (
        typeof c.r === "number" &&
        typeof c.g === "number" &&
        typeof c.b === "number"
      ) {
        acc.push({ r: c.r, g: c.g, b: c.b });
      }
    }
    return acc;
  }, []);
}

function mapOrgHit(raw: RawHit): OrganisationHit {
  const logo = parseJsonField(raw.logo);
  const banner = parseJsonField(raw.banner);

  const tags: string[] = Array.isArray(raw._tags)
    ? (raw._tags as unknown[]).filter((t): t is string => typeof t === "string")
    : [];

  const categories: OrgCategory[] = Array.isArray(raw.categories)
    ? (raw.categories as unknown[]).reduce<OrgCategory[]>((acc, c) => {
        if (c && typeof c === "object") {
          const cat = c as Record<string, unknown>;
          if (typeof cat.name === "string") {
            acc.push({
              id: typeof cat.id === "number" ? cat.id : 0,
              slug: typeof cat.slug === "string" ? cat.slug : "",
              name: cat.name,
              parentId:
                typeof cat.parentId === "number" ? cat.parentId : null,
            });
          }
        }
        return acc;
      }, [])
    : [];

  return {
    objectID: String(raw.objectID ?? ""),
    id: String(raw.id ?? ""),
    name: str(raw.title) ?? str(raw.name) ?? "Unknown organisation",
    slug: str(raw.slug),
    description: str(raw.description),
    mission: str(raw.mission),
    website: str(raw.website),
    organisationType: str(raw.organisationType),
    yearFounded: typeof raw.yearFounded === "number" ? raw.yearFounded : null,
    logoUrl: str(logo.url),
    bannerUrl: str(banner.url),
    logoPalette: parsePalette(logo),
    bannerPalette: parsePalette(banner),
    tags,
    categories,
  };
}

/** Fetch an organisation record from organisationHub. Returns null when not found. */
export async function getOrganisationById(
  organisationId: string,
): Promise<OrganisationHit | null> {
  const client = getAlgoliaSearchClient();
  if (!client) return null;

  try {
    const raw = await client.getObject({
      indexName: organisationHubIndex,
      objectID: `organisation:${organisationId}`,
    });
    return mapOrgHit(raw as RawHit);
  } catch {
    return null;
  }
}
