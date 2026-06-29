/**
 * Utilities for deriving a usable accent colour from an organisation's
 * Algolia logo/banner palette.
 *
 * The palette is an ordered array of dominant RGB colours extracted from the
 * image.  We walk the array and pick the first colour whose relative luminance
 * falls in a "mid-range" band (not too dark, not washed-out) and whose
 * contrast ratio against white is at least 2.5:1 so it reads on light
 * backgrounds.  If no candidate passes those constraints we fall back to the
 * first palette entry that isn't near-white, and finally to null (caller
 * should use the default theme primary).
 */

import type { RgbColor } from "@lib/algolia/organisations";

/** Relative luminance per WCAG 2.x */
function relativeLuminance({ r, g, b }: RgbColor): number {
  const chan = [r, g, b].map((c) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * chan[0] + 0.7152 * chan[1] + 0.0722 * chan[2];
}

/** WCAG contrast ratio between two colours. */
function contrastRatio(a: RgbColor, b: RgbColor): number {
  const la = relativeLuminance(a);
  const lb = relativeLuminance(b);
  const lighter = Math.max(la, lb);
  const darker = Math.min(la, lb);
  return (lighter + 0.05) / (darker + 0.05);
}

const WHITE: RgbColor = { r: 255, g: 255, b: 255 };

/** Convert an {r,g,b} to a CSS hex string. */
export function rgbToHex({ r, g, b }: RgbColor): string {
  return (
    "#" +
    [r, g, b]
      .map((c) => Math.round(c).toString(16).padStart(2, "0"))
      .join("")
  );
}

/**
 * Pick the best accent colour from an org's logo palette.
 * Returns a hex string, or null if no suitable colour is found.
 *
 * Strategy:
 * 1. Walk palette entries looking for one that:
 *    - Has a relative luminance between 0.03 and 0.55 (not near-black, not near-white)
 *    - Has a contrast ratio against white >= 2.5:1
 * 2. Fall back to the first non-near-white palette entry.
 * 3. Return null if palette is empty.
 */
export function pickOrgAccentColor(
  logoPalette: RgbColor[],
  bannerPalette: RgbColor[] = []
): string | null {
  const candidates = [...logoPalette, ...bannerPalette];
  if (candidates.length === 0) return null;

  // Pass 1: mid-luminance with enough contrast on white
  for (const color of candidates) {
    const lum = relativeLuminance(color);
    const contrast = contrastRatio(color, WHITE);
    if (lum >= 0.03 && lum <= 0.55 && contrast >= 2.5) {
      return rgbToHex(color);
    }
  }

  // Pass 2: anything that isn't near-white (lum < 0.80)
  for (const color of candidates) {
    if (relativeLuminance(color) < 0.80) {
      return rgbToHex(color);
    }
  }

  return null;
}

/**
 * Validates a pre-existing hex branding colour from Algolia (e.g.
 * `organisationBrandingColour`) and returns it only if it has enough
 * contrast against white (i.e., is dark enough to be visible on a light
 * card background).  Returns null for near-white / very light colours.
 */
export function validateBrandingColor(hex: string | null | undefined): string | null {
  if (!hex || !/^#[0-9a-fA-F]{6}$/.test(hex.trim())) return null;
  const h = hex.trim();
  const r = parseInt(h.slice(1, 3), 16);
  const g = parseInt(h.slice(3, 5), 16);
  const b = parseInt(h.slice(5, 7), 16);
  const color: RgbColor = { r, g, b };
  const contrast = contrastRatio(color, WHITE);
  // Require at least 2.5:1 contrast against white to be usable as an accent.
  return contrast >= 2.5 ? h : null;
}

/**
 * Returns the foreground colour (black or white) that gives the best contrast
 * against the given hex background.
 */
export function contrastForeground(hex: string): "#ffffff" | "#000000" {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const lum = relativeLuminance({ r, g, b });
  // White text needs contrast >= 3:1 against the bg (lighter bg → use black)
  return lum > 0.179 ? "#000000" : "#ffffff";
}
