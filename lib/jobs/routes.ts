import { NAMESPACE_PATH } from "@lib/config";

/** Namespace jobs root (e.g. `/christian-jobs`). */
export function jobsNamespacePath(): string {
  return NAMESPACE_PATH ?? "/christian-jobs";
}

/** Jobs search/results route (e.g. `/christian-jobs/search`). */
export function jobsSearchPath(): string {
  return `${jobsNamespacePath()}/search`;
}
