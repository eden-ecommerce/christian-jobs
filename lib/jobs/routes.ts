import { NAMESPACE_PATH } from "@lib/config";

/** Namespace jobs root (e.g. `/christian-jobs`). */
export function jobsNamespacePath(): string {
  return NAMESPACE_PATH ?? "/christian-jobs";
}

/** Jobs search/results route (e.g. `/christian-jobs/search`). */
export function jobsSearchPath(): string {
  return `${jobsNamespacePath()}/search`;
}

/**
 * Homepage for the current search route.
 * `/v6/search` → `/v6`, `/christian-jobs/search` → `/christian-jobs`.
 * Falls back to the production namespace root when the path is not a search route.
 */
export function jobsHomepagePathFromSearchPath(pathname: string): string {
  if (pathname.endsWith("/search")) {
    const home = pathname.slice(0, -"/search".length);
    return home || jobsNamespacePath();
  }
  return jobsNamespacePath();
}
