import { SandboxPageShell } from "@app/sandbox/_components/SandboxPageShell";
import { SearchPage } from "@components/search/SearchPage";
import { IntegrationEnvError } from "@/components/common/IntegrationEnvError";
import { isAlgoliaEnvConfigured } from "@lib/env-configured";
import { algoliaIndexPresets } from "@lib/algolia/constants";
import { getCloudflareLocation } from "@eden-ecommerce/lib/location/get-cloudflare-location.server";

export const dynamic = "force-dynamic";

export default async function SandboxSearchPage() {
  const credentialsConfigured = isAlgoliaEnvConfigured();
  const serverLocation = await getCloudflareLocation();

  return (
    <SandboxPageShell
      title="Algolia search"
      description="Config-driven InstantSearch with hierarchical facets, location filtering, and active filter badges."
    >
      {credentialsConfigured ? (
        <SearchPage
          preset={algoliaIndexPresets.organisationHubJobs}
          serverLocation={serverLocation}
          searchPlaceholder="Search jobs…"
        />
      ) : (
        <IntegrationEnvError integration="algolia" />
      )}
    </SandboxPageShell>
  );
}
