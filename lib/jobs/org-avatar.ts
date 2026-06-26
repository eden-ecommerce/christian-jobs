/** Two-letter initials for organisation avatar circles. */
export function getOrgInitials(name: string): string {
  const words = name.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return "?";
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return (words[0][0] + words[1][0]).toUpperCase();
}

/** Deterministic accent when org branding colour is unavailable. */
const AVATAR_PALETTE = [
  "#2d6a4f",
  "#2563eb",
  "#dc2626",
  "#ea580c",
  "#7c3aed",
  "#0891b2",
  "#be185d",
];

export function getAvatarColor(name: string, brandingHex: string | null): string {
  if (brandingHex) return brandingHex;
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return AVATAR_PALETTE[Math.abs(hash) % AVATAR_PALETTE.length];
}
