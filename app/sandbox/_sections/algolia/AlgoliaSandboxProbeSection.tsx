import { StatusList, StatusRow } from "@app/sandbox/_components/StatusRow";
import { isAlgoliaEnvConfigured } from "@lib/env-configured";
import { probeAlgoliaIndex } from "@eden-ecommerce/lib/algolia/probe-index";

export async function AlgoliaSandboxProbeSection() {
  if (!isAlgoliaEnvConfigured()) {
    return null;
  }

  const [productsProbe, organisationHubProbe] = await Promise.all([
    probeAlgoliaIndex("products"),
    probeAlgoliaIndex("organisationHub"),
  ]);

  return (
    <StatusList>
      <StatusRow
        label="products index"
        value={productsProbe.ok ? "reachable" : "unreachable"}
        detail={
          productsProbe.detail ??
          (productsProbe.hitCount !== undefined
            ? `${productsProbe.hitCount} hit(s) with stores:eden filter`
            : undefined)
        }
      />
      <StatusRow
        label="organisationHub index"
        value={organisationHubProbe.ok ? "reachable" : "unreachable"}
        detail={
          organisationHubProbe.detail ??
          (organisationHubProbe.hitCount !== undefined
            ? `${organisationHubProbe.hitCount} hit(s) with published:true filter`
            : undefined)
        }
      />
    </StatusList>
  );
}
