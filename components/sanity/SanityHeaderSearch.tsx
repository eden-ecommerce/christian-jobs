"use client";

import Image from "next/image";
import { Search } from "lucide-react";
import { useState } from "react";
import { HeaderSearch } from "@eden-ecommerce/common/blocks/Search";
import { headerSearchParams } from "@eden-ecommerce/lib/algolia/constants";
import {
  buildEdenProductImageUrl,
  calculateImageDimensions,
} from "@eden-ecommerce/lib/eden/product-image";
import { buildEdenProductSearchUrl } from "@eden-ecommerce/lib/eden/build-urls";
import { useHeaderChrome } from "@/components/sanity/header-chrome-context";
import { useHeaderSearch } from "@/hooks/use-header-search";

export const SanityHeaderSearch = () => {
  const { setSearchFocused } = useHeaderChrome();
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);
  const { results, dispatchSearch, clearResults } = useHeaderSearch();

  const updateFocused = (nextFocused: boolean) => {
    setFocused(nextFocused);
    setSearchFocused(nextFocused);
  };

  const viewAllHref = buildEdenProductSearchUrl(query);

  return (
    <HeaderSearch
      query={query}
      focused={focused}
      placeholder="Search Eden.co.uk"
      minQueryLength={headerSearchParams.minQueryLength}
      viewAllHref={viewAllHref}
      buildSearchUrl={buildEdenProductSearchUrl}
      searchIconSlot={<Search className="size-5" aria-hidden />}
      onSubmit={(searchQuery) => {
        window.location.assign(buildEdenProductSearchUrl(searchQuery));
      }}
      results={{
        suggestions: results.suggestions,
        categories: results.categories,
        authors: results.authors,
        numberOfProductHits: results.numberOfProductHits,
        products: results.products.map((product) => {
          const imageResize = calculateImageDimensions({
            width: parseInt(product.imageWidth ?? "0", 10),
            height: parseInt(product.imageHeight ?? "0", 10),
            desiredHeight: 200,
            desiredWidth: 150,
          });

          return {
            objectID: product.objectID,
            product_name: product.product_name,
            author: product.author,
            format: product.format,
            price: product.price,
            url: product.url,
            imageSlot: product.image ? (
              <Image
                src={buildEdenProductImageUrl(product.image, imageResize.width)}
                alt=""
                width={imageResize.width}
                height={imageResize.height}
                unoptimized
                className="mx-auto h-auto max-h-[200px] w-full max-w-[150px] object-contain"
              />
            ) : (
              <span className="text-xs text-copy-500">No image</span>
            ),
          };
        }),
      }}
      onQueryChange={(value) => {
        setQuery(value);
        dispatchSearch(value);
      }}
      onFocus={() => updateFocused(true)}
      onClear={() => {
        setQuery("");
        clearResults();
        updateFocused(false);
      }}
      onBlur={() => updateFocused(false)}
    />
  );
};
