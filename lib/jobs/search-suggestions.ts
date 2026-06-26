import { searchTowns } from "@lib/locations/search-towns";

export type KeywordSuggestion = {
  id: string;
  label: string;
};

export type LocationSuggestion = {
  id: string;
  label: string;
  lat?: number;
  lng?: number;
};

/** Shown before the user types in the "What" field. */
export const KEYWORD_DEFAULT_SUGGESTIONS: KeywordSuggestion[] = [
  { id: "part-time", label: "Part-time" },
  { id: "full-time", label: "Full-time" },
  { id: "remote", label: "Remote" },
  { id: "voluntary", label: "Voluntary" },
  { id: "youth worker", label: "Youth worker" },
  { id: "pastor", label: "Pastor" },
];

/** Pool used to filter keyword suggestions as the user types. */
const KEYWORD_SEARCH_POOL: KeywordSuggestion[] = [
  ...KEYWORD_DEFAULT_SUGGESTIONS,
  { id: "church", label: "Church" },
  { id: "charity", label: "Charity" },
  { id: "worship leader", label: "Worship leader" },
  { id: "administrator", label: "Administrator" },
  { id: "fundraising", label: "Fundraising" },
  { id: "children's worker", label: "Children's worker" },
  { id: "ministry", label: "Ministry" },
  { id: "internship", label: "Internship" },
  { id: "trustee", label: "Trustee" },
  { id: "counsellor", label: "Counsellor" },
  { id: "teacher", label: "Teacher" },
  { id: "marketing", label: "Marketing" },
  { id: "finance", label: "Finance" },
  { id: "software engineer", label: "Software engineer" },
  { id: "software developer", label: "Software developer" },
];

/** Quick-select locations shown before the user types in the "Where" field. */
export const LOCATION_DEFAULT_SUGGESTIONS: LocationSuggestion[] = [
  { id: "remote", label: "Remote" },
  { id: "london", label: "London", lat: 51.5074, lng: -0.1278 },
  { id: "manchester", label: "Manchester", lat: 53.4808, lng: -2.2426 },
  { id: "birmingham", label: "Birmingham", lat: 52.4862, lng: -1.8904 },
  { id: "leeds", label: "Leeds", lat: 53.8008, lng: -1.5491 },
  { id: "bristol", label: "Bristol", lat: 51.4545, lng: -2.5879 },
  { id: "edinburgh", label: "Edinburgh", lat: 55.9533, lng: -3.1883 },
  { id: "cardiff", label: "Cardiff", lat: 51.4816, lng: -3.1791 },
];

export function filterKeywordSuggestions(query: string): KeywordSuggestion[] {
  const trimmed = query.trim().toLowerCase();
  if (!trimmed) return KEYWORD_DEFAULT_SUGGESTIONS;

  const seen = new Set<string>();
  const matches: KeywordSuggestion[] = [];

  for (const item of KEYWORD_SEARCH_POOL) {
    if (!item.label.toLowerCase().includes(trimmed)) continue;
    const key = item.label.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    matches.push(item);
  }

  if (matches.length === 0) {
    return [{ id: `custom-${trimmed}`, label: query.trim() }];
  }

  return matches.slice(0, 8);
}

export function filterLocationSuggestions(query: string): LocationSuggestion[] {
  const trimmed = query.trim().toLowerCase();
  if (!trimmed) return LOCATION_DEFAULT_SUGGESTIONS;

  const townMatches = searchTowns(trimmed, 6).map((town) => ({
    id: town.slug,
    label: `${town.name}, ${town.countyName}`,
    lat: town.lat,
    lng: town.lng,
  }));

  const defaultMatches = LOCATION_DEFAULT_SUGGESTIONS.filter((item) =>
    item.label.toLowerCase().includes(trimmed),
  );

  const seen = new Set<string>();
  const merged: LocationSuggestion[] = [];

  for (const item of [...defaultMatches, ...townMatches]) {
    const key = item.label.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    merged.push(item);
  }

  if (merged.length === 0) {
    return [{ id: `custom-${trimmed}`, label: query.trim() }];
  }

  return merged.slice(0, 8);
}
