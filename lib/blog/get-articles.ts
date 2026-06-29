import "server-only";

import { fetchSanityDirect } from "@eden-ecommerce/lib/sanity/direct-fetch";
import { sanityImageUrl } from "@lib/blog/image-url";
import { cache } from "react";
import { z } from "zod";

// ---------------------------------------------------------------------------
// Schema — confirmed against live Sanity data.
// slug is projected as a plain string via "slug": slug.current in GROQ.
// tags is string[] or null. datePublished is ISO string or null.
// ---------------------------------------------------------------------------

const portableTextBlockSchema = z.record(z.unknown());

const sanityImageAssetSchema = z.object({
  _ref: z.string(),
  _type: z.literal("reference"),
});

const thumbnailSchema = z.object({
  _type: z.string(),
  alt: z.string().nullish(),
  asset: sanityImageAssetSchema.nullish(),
}).nullish();

const authorSchema = z.object({
  _id: z.string().nullish(),
  name: z.string().nullish(),
  role: z.string().nullish(),
  photo: z
    .object({
      _type: z.string().nullish(),
      asset: sanityImageAssetSchema.nullish(),
    })
    .nullish(),
});

const articleSchema = z.object({
  _id: z.string().nullish(),
  title: z.string().nullish(),
  slug: z.string().nullish(),
  metaDescription: z.string().nullish(),
  datePublished: z.string().nullish(),
  tags: z.array(z.string()).nullish(),
  thumbnail: thumbnailSchema,
  authors: z.array(authorSchema).nullish(),
  richText: z.array(portableTextBlockSchema).nullish(),
});

// ---------------------------------------------------------------------------
// Domain type
// ---------------------------------------------------------------------------

export type ArticleThumbnail = {
  assetRef: string;
  alt: string;
} | null;

export type Author = {
  id: string;
  name: string;
  /** Role / job title, e.g. "Eden Children's Resources Specialist". */
  role: string | null;
  /** Fully resolved CDN URL for the author's photo, or null. */
  photoUrl: string | null;
};

export type Article = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  thumbnail: ArticleThumbnail;
  /** Fully resolved CDN URL — safe to use directly in client components. */
  thumbnailUrl: string | null;
  thumbnailUrlHero: string | null;
  authors: Author[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  richText: any[] | null;
  publishedAt: string | null;
  tags: string[];
};

// ---------------------------------------------------------------------------
// Recursively resolve every Sanity image reference inside richText into a CDN
// URL and attach it as `_url` on the image object. This runs server-side
// (this module is "server-only") so the PortableText client component never
// needs to read EDEN_SANITY_PROJECT_ID from process.env — which is undefined
// on the client because it has no NEXT_PUBLIC_ prefix.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function attachImageUrls(node: any): void {
  if (Array.isArray(node)) {
    for (const child of node) attachImageUrls(child);
    return;
  }
  if (!node || typeof node !== "object") return;

  const ref = node.asset?._ref;
  if (typeof ref === "string" && ref.startsWith("image-")) {
    node._url = sanityImageUrl({ _type: "reference", _ref: ref }, { width: 1200, fit: "max" });
  }

  for (const key of Object.keys(node)) {
    if (key === "_url" || key === "asset") continue;
    attachImageUrls(node[key]);
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function resolveRichTextImages(richText: any[] | null | undefined): any[] | null {
  if (!richText) return null;
  attachImageUrls(richText);
  return richText;
}

// ---------------------------------------------------------------------------
// Mapper
// ---------------------------------------------------------------------------

const mapArticle = (raw: z.infer<typeof articleSchema>): Article => {
  const assetRef = raw.thumbnail?.asset?._ref ?? null;
  const imageSource = assetRef ? { _type: "reference" as const, _ref: assetRef } : null;
  return {
    id: raw._id ?? "",
    title: raw.title ?? "",
    slug: raw.slug ?? "",
    excerpt: raw.metaDescription ?? null,
    thumbnail: assetRef
      ? { assetRef, alt: raw.thumbnail?.alt ?? "" }
      : null,
    // Resolve CDN URLs here (server-only context) so client components never
    // need to read EDEN_SANITY_PROJECT_ID from process.env.
    thumbnailUrl: sanityImageUrl(imageSource, { width: 600, height: 400, fit: "crop" }),
    thumbnailUrlHero: sanityImageUrl(imageSource, { width: 1200, height: 630, fit: "crop" }),
    authors: (raw.authors ?? [])
      .filter((a) => a?.name)
      .map((a) => {
        const photoRef = a.photo?.asset?._ref ?? null;
        return {
          id: a._id ?? "",
          name: a.name ?? "",
          role: a.role ?? null,
          photoUrl: photoRef
            ? sanityImageUrl(
                { _type: "reference", _ref: photoRef },
                { width: 96, height: 96, fit: "crop" },
              )
            : null,
        };
      }),
    richText: resolveRichTextImages(raw.richText),
    publishedAt: raw.datePublished ?? null,
    tags: raw.tags ?? [],
  };
};

// ---------------------------------------------------------------------------
// GROQ queries
// Use "slug": slug.current to project the slug string directly.
// ---------------------------------------------------------------------------

const ARTICLE_FIELDS = `
  _id,
  title,
  "slug": slug.current,
  metaDescription,
  datePublished,
  tags,
  thumbnail{ _type, alt, asset },
  authors[]->{ _id, name, "role": tag, photo{ _type, asset } }
`;

// datePublished <= now() ensures only past (published) articles are returned.
const PUBLISHED_FILTER = `_type == "article" && defined(slug.current) && datePublished <= now()`;

const ARTICLES_QUERY = `*[${PUBLISHED_FILTER}] | order(datePublished desc) [0..99] {
  ${ARTICLE_FIELDS}
}`;

const ARTICLES_BY_TAG_QUERY = `*[${PUBLISHED_FILTER} && $tag in tags] | order(datePublished desc) [0..99] {
  ${ARTICLE_FIELDS}
}`;

const ARTICLE_BY_SLUG_QUERY = `*[_type == "article" && slug.current == $slug && datePublished <= now()][0] {
  ${ARTICLE_FIELDS},
  richText[]
}`;

const ALL_SLUGS_QUERY = `*[${PUBLISHED_FILTER}]{ "slug": slug.current }`;

// Latest articles excluding the current one (for cross-promotion).
const LATEST_EXCLUDING_QUERY = `*[${PUBLISHED_FILTER} && slug.current != $slug] | order(datePublished desc) [0...$limit] {
  ${ARTICLE_FIELDS}
}`;

// Articles that share at least one tag with the current article (excluding it).
const RELATED_BY_TAGS_QUERY = `*[${PUBLISHED_FILTER} && slug.current != $slug && count((tags[])[@ in $tags]) > 0] | order(datePublished desc) [0...$limit] {
  ${ARTICLE_FIELDS}
}`;

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export const getArticles = cache(async (): Promise<Article[]> => {
  const result = await fetchSanityDirect(ARTICLES_QUERY, undefined, ["article"]);
  if (result.isErr()) return [];

  const parsed = z.array(articleSchema).safeParse(result.value);
  if (!parsed.success) return [];

  return parsed.data.map(mapArticle).filter((a) => a.slug);
});

export const getArticlesByTag = cache(async (tag: string): Promise<Article[]> => {
  const result = await fetchSanityDirect(
    ARTICLES_BY_TAG_QUERY,
    { tag },
    ["article"],
  );
  if (result.isErr()) return [];

  const parsed = z.array(articleSchema).safeParse(result.value);
  if (!parsed.success) return [];

  return parsed.data.map(mapArticle).filter((a) => a.slug);
});

export const getArticleBySlug = cache(
  async (slug: string): Promise<Article | null> => {
    const result = await fetchSanityDirect(
      ARTICLE_BY_SLUG_QUERY,
      { slug },
      ["article", `article:${slug}`],
    );
    if (result.isErr()) return null;
    if (!result.value) return null;

    const parsed = articleSchema.safeParse(result.value);
    if (!parsed.success) return null;

    return mapArticle(parsed.data);
  },
);

export type RelatedArticles = {
  latest: Article[];
  related: Article[];
};

/**
 * Fetch cross-promotion articles for a given article: the latest other
 * articles plus articles that share one of its tags. Tag-related results are
 * de-duplicated against the latest list so the same article never appears twice.
 */
export const getRelatedArticles = cache(
  async (
    slug: string,
    tags: string[],
    opts?: { latestLimit?: number; relatedLimit?: number },
  ): Promise<RelatedArticles> => {
    const latestLimit = opts?.latestLimit ?? 5;
    const relatedLimit = opts?.relatedLimit ?? 4;

    const [latestResult, relatedResult] = await Promise.all([
      fetchSanityDirect(LATEST_EXCLUDING_QUERY, { slug, limit: String(latestLimit) }, ["article"]),
      tags.length > 0
        ? fetchSanityDirect(
            RELATED_BY_TAGS_QUERY,
            { slug, tags, limit: String(relatedLimit + latestLimit) } as unknown as Record<
              string,
              string
            >,
            ["article"],
          )
        : Promise.resolve(null),
    ]);

    const parseList = (value: unknown): Article[] => {
      const parsed = z.array(articleSchema).safeParse(value);
      if (!parsed.success) return [];
      return parsed.data.map(mapArticle).filter((a) => a.slug);
    };

    const latest = latestResult.isErr() ? [] : parseList(latestResult.value);

    let related: Article[] = [];
    if (relatedResult && !relatedResult.isErr()) {
      const latestSlugs = new Set(latest.map((a) => a.slug));
      related = parseList(relatedResult.value)
        .filter((a) => !latestSlugs.has(a.slug))
        .slice(0, relatedLimit);
    }

    return { latest, related };
  },
);

export const getAllArticleSlugs = cache(async (): Promise<string[]> => {
  const result = await fetchSanityDirect(ALL_SLUGS_QUERY, undefined, ["article"]);
  if (result.isErr()) return [];

  const parsed = z.array(z.object({ slug: z.string() })).safeParse(result.value);
  if (!parsed.success) return [];

  return parsed.data.map((r) => r.slug).filter(Boolean);
});
