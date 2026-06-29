import { getSanityImage } from "@eden-ecommerce/lib/sanity/image";
import type { ImageWithAlt } from "@eden-ecommerce/lib/sanity/image";

type ImageSource = { _type: "reference"; _ref: string };

/**
 * Convert a Sanity image reference to a CDN URL (server-side).
 * Client components should use pre-resolved `_url` on rich text nodes.
 */
export function sanityImageUrl(
  source: ImageSource | ImageWithAlt | null | undefined,
  opts?: { width?: number; height?: number; fit?: "max" | "crop" | "clip" | "fill" },
): string | null {
  if (!source) return null;

  const image: ImageWithAlt =
    "_ref" in source && !("asset" in source)
      ? { asset: { _ref: source._ref, _type: "reference" } }
      : (source as ImageWithAlt);

  const ref = image.asset?._ref;
  if (!ref) return null;

  try {
    const result = getSanityImage(image, {
      width: opts?.width ?? 600,
      height: opts?.height,
      dpr: 1,
    });
    return result.url || null;
  } catch {
    return null;
  }
}
