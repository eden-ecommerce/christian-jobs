"use client";

import { StatusList, StatusRow } from "@app/sandbox/_components/StatusRow";
import { IntegrationEnvError } from "@/components/common/IntegrationEnvError";
import { NsLink } from "@components/ns-link";
import { buttonVariants } from "@components/ui/button";
import { isAlgoliaEnvConfigured } from "@lib/env-configured";
import { getAlgoliaSearchClient } from "@lib/algolia/client";
import { SANDBOX_PATH } from "@/lib/config";

export function AlgoliaSandboxSection() {
  if (!isAlgoliaEnvConfigured()) {
    return (
      <section className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold text-foreground">Algolia — Search</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            InstantSearch demo at{" "}
            <code className="font-mono text-xs">{SANDBOX_PATH}/search</code>. Configure Algolia
            env vars to enable the client and run the full demo.
          </p>
        </div>
        <IntegrationEnvError integration="algolia" />
      </section>
    );
  }

  const searchClient = getAlgoliaSearchClient();

  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-foreground">Algolia — Search</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Env credentials are present. Open the search demo for InstantSearch with hierarchical
          facets and geo filters.
        </p>
      </div>

      <StatusList>
        <StatusRow
          label="Env configured"
          value="yes"
          detail="Required Algolia env vars are set."
        />
        <StatusRow
          label="Search client"
          value={searchClient ? "ready" : "unavailable"}
          detail={
            searchClient
              ? "getAlgoliaSearchClient() returned a client."
              : "Client could not be initialised — check app ID and search key."
          }
        />
      </StatusList>

      <NsLink
        href={`${SANDBOX_PATH}/search`}
        className={buttonVariants({ variant: "outline" })}
      >
        Open search demo
      </NsLink>
    </section>
  );
}
