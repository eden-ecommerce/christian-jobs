"use client";

import { useState } from "react";
import { Globe, Building2 } from "lucide-react";
import type { OrganisationHit } from "@lib/algolia/organisations";
import { pickOrgAccentColor, contrastForeground } from "@lib/org-color";

type Props = {
  /** Label shown above the org name. Defaults to "Hosted by". */
  byLabel?: string;
  organisationName: string;
  organisationType?: string | null;
  organiserLogo?: string | null;
  orgHref?: string | null;
  org: OrganisationHit | null;
};

export function HostedByCard({
  byLabel = "Hosted by",
  organisationName,
  organisationType,
  organiserLogo,
  orgHref,
  org,
}: Props) {
  const [expanded, setExpanded] = useState(false);

  const logoUrl = org?.logoUrl ?? organiserLogo ?? null;
  const bio = org?.mission ?? org?.description ?? null;
  const type = org?.organisationType ?? organisationType ?? null;

  // Derive accent colour from the logo palette (falls back to banner palette).
  const accentHex = org
    ? pickOrgAccentColor(org.logoPalette, org.bannerPalette)
    : null;
  const accentFg = accentHex ? contrastForeground(accentHex) : null;

  // Prefer the structured categories array; fall back to _tags, skipping
  // tags that merely repeat the org name or its type.
  const badgeLabels: string[] = (() => {
    if (org?.categories && org.categories.length > 0) {
      return org.categories.map((c) => c.name).slice(0, 8);
    }
    if (org?.tags && org.tags.length > 0) {
      const skip = new Set([
        organisationName.toLowerCase(),
        (type ?? "").toLowerCase(),
      ]);
      return org.tags.filter((t) => !skip.has(t.toLowerCase())).slice(0, 8);
    }
    return [];
  })();

  // Only the long bio sits behind a toggle; tags and links stay visible.
  const isLongBio = !!bio && bio.length > 180;

  return (
    <div
      className="mt-4 overflow-hidden rounded-lg border border-border bg-card"
      style={
        accentHex
          ? { borderTopColor: accentHex, borderTopWidth: "3px" }
          : undefined
      }
    >
      <div className="p-4">
        {/* Header row */}
        <div className="flex items-center gap-3">
          {logoUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={logoUrl}
              alt={organisationName}
              className="h-12 w-12 shrink-0 rounded-lg border border-border bg-white object-contain p-1"
            />
          )}

          <div className="min-w-0 flex-1">
            <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
              {byLabel}
            </p>
            <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
              <span className="text-sm font-semibold text-foreground">
                {organisationName}
              </span>
              {type && (
                <span className="inline-flex items-center rounded-full bg-muted px-2 py-0.5 text-[11px] font-medium capitalize text-muted-foreground">
                  {type}
                </span>
              )}
              {org?.yearFounded && (
                <span className="text-xs text-muted-foreground">
                  Est. {org.yearFounded}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Category badges — coloured with the org accent if available */}
        {badgeLabels.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {badgeLabels.map((label) => (
              <span
                key={label}
                className="inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium"
                style={
                  accentHex && accentFg
                    ? { backgroundColor: accentHex + "20", color: accentHex }
                    : { backgroundColor: "hsl(var(--primary) / 0.1)", color: "hsl(var(--primary))" }
                }
              >
                {label}
              </span>
            ))}
          </div>
        )}

        {/* Bio — collapsed to a clamp with a Read more toggle when long */}
        {bio && (
          <div className="mt-3">
            <p
              className={`text-sm leading-relaxed text-muted-foreground${
                isLongBio && !expanded ? " line-clamp-3" : ""
              }`}
            >
              {bio}
            </p>
            {isLongBio && (
              <button
                type="button"
                onClick={() => setExpanded((v) => !v)}
                aria-expanded={expanded}
                className="mt-1 text-xs font-medium underline-offset-2 hover:underline"
                style={accentHex ? { color: accentHex } : undefined}
              >
                {expanded ? "Read less" : "Read more"}
              </button>
            )}
          </div>
        )}

        {/* Links — always visible */}
        {(org?.website || orgHref) && (
          <div className="mt-3 flex flex-wrap items-center gap-3">
            {org?.website && (
              <a
                href={org.website}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs font-medium underline-offset-2 hover:underline"
                style={accentHex ? { color: accentHex } : undefined}
              >
                <Globe className="h-3.5 w-3.5" aria-hidden="true" />
                Website
              </a>
            )}
            {orgHref && (
              <a
                href={orgHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground underline-offset-2 hover:text-primary hover:underline"
              >
                <Building2 className="h-3.5 w-3.5" aria-hidden="true" />
                View profile on Eden
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
