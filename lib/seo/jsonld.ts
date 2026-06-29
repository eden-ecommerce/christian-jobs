/** Build a BreadcrumbList JSON-LD from an array of { name, url } pairs. */
export function buildBreadcrumbJsonLd(
  items: { name: string; url: string }[],
): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

/** Render a JSON-LD script tag. Pass the output to <script> in a Next.js page. */
export function jsonLdScriptProps(
  data: Record<string, unknown>,
): { type: string; dangerouslySetInnerHTML: { __html: string } } {
  return {
    type: "application/ld+json",
    dangerouslySetInnerHTML: {
      __html: JSON.stringify(data),
    },
  };
}
