import { assetUrl, NAMESPACE_PATH } from "@lib/config";

/** Namespace-relative path to the Event Manager microsite root, e.g. "/event-manager". */
export const EM_PATH = `${NAMESPACE_PATH}/event-manager`;

/** Build an internal href within the microsite. */
export function emHref(path: string): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${EM_PATH}${normalized}`;
}

/** Build an asset URL for an image stored in `/public/event-manager`. */
export function emAsset(path: string): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return assetUrl(`/event-manager${normalized}`);
}

/** Primary conversion target — "Book a demo". */
export const DEMO_HREF = emHref("/pricing");

export type EmNavItem = { label: string; href: string; exact?: boolean };

/** Navigation items for the microsite sub-nav. */
export const EM_NAV: EmNavItem[] = [
  { label: "Overview", href: EM_PATH, exact: true },
  { label: "Conferences", href: emHref("/conferences") },
  { label: "Churches", href: emHref("/churches") },
  { label: "Retreats", href: emHref("/retreats") },
  { label: "Case Studies", href: emHref("/case-studies") },
  { label: "Pricing", href: emHref("/pricing") },
];
