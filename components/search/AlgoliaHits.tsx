"use client";

import { Hits, type HitsProps } from "react-instantsearch";

type HitRecord = Record<string, unknown>;

function resolveHitTitle(hit: HitRecord): string {
  const candidates = [
    hit.product_name,
    hit.title,
    hit.name,
    hit.objectID,
  ];

  for (const candidate of candidates) {
    if (typeof candidate === "string" && candidate.length > 0) {
      return candidate;
    }
  }

  return "Untitled";
}

function DefaultHit({ hit }: { hit: HitRecord }) {
  return <>{resolveHitTitle(hit)}</>;
}

/** Minimal Hits wrapper with a generic fallback hit renderer. */
export function AlgoliaHits(props: Omit<HitsProps<HitRecord>, "hitComponent">) {
  return (
    <Hits
      hitComponent={DefaultHit}
      classNames={{
        list: "flex flex-col gap-2",
        root: "mt-4",
        item: "rounded-md border border-border px-3 py-2 text-sm",
      }}
      {...props}
    />
  );
}
