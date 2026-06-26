import { getAllTowns, type TownSearchEntry } from "@lib/locations/index";

/** Filter UK towns by name or county for location autocomplete. */
export function searchTowns(query: string, limit = 8): TownSearchEntry[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];

  const matches = getAllTowns().filter(
    (town) =>
      town.name.toLowerCase().includes(q) ||
      town.countyName.toLowerCase().includes(q) ||
      town.regionName.toLowerCase().includes(q),
  );

  return matches.sort((a, b) => b.population - a.population).slice(0, limit);
}
