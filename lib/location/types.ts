export type CloudflareLocation = {
  latitude: number;
  longitude: number;
  label: string;
  source: "cloudflare" | "default";
  city?: string;
  country?: string;
};
