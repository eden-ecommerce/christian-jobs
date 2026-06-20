import { NAMESPACE_PATH } from "@lib/config";
import { EM_PATH } from "@components/event-manager/em-config";

/** Absolute path to the Ticketing microsite root, e.g. "/events/ticketing". */
export const TK_PATH = `${NAMESPACE_PATH}/ticketing`;

/** Build an internal href within the Ticketing microsite. */
export function tkHref(path: string): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${TK_PATH}${normalized}`;
}

/** Primary conversion target — "Get started". */
export const GET_STARTED_HREF = tkHref("/pricing");

/** Cross-link target into the Event Manager microsite. */
export const EVENT_MANAGER_HREF = EM_PATH;

export type TkNavItem = { label: string; href: string; exact?: boolean };

/** Navigation items for the Ticketing sub-nav. */
export const TK_NAV: TkNavItem[] = [
  { label: "Overview", href: TK_PATH, exact: true },
  { label: "Features", href: tkHref("/features") },
  { label: "Reserved Seating", href: tkHref("/seating") },
  { label: "Check-in", href: tkHref("/check-in") },
  { label: "Pricing", href: tkHref("/pricing") },
];
