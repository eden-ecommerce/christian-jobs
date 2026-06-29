"use client";

import { IntegrationEnvError } from "@/components/common/IntegrationEnvError";
import { isAlgoliaEnvConfigured } from "@lib/env-configured";
import { getAlgoliaSearchClient } from "@lib/algolia/client";
import type { InstantSearchNextProps } from "react-instantsearch-nextjs";
import { InstantSearchNext } from "react-instantsearch-nextjs";

type Props = {
  children: React.ReactNode;
} & Omit<InstantSearchNextProps, "searchClient">;

export function AlgoliaConfig({ children, ...props }: Props) {
  if (!isAlgoliaEnvConfigured()) {
    return <IntegrationEnvError integration="algolia" />;
  }

  const searchClient = getAlgoliaSearchClient();
  if (!searchClient) {
    return <IntegrationEnvError integration="algolia" />;
  }

  return (
    <InstantSearchNext searchClient={searchClient} {...props}>
      {children}
    </InstantSearchNext>
  );
}
