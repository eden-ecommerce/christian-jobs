"use client";

import { JsonBlock } from "@app/sandbox/_components/JsonBlock";
import { StatusList, StatusRow } from "@app/sandbox/_components/StatusRow";
import { IntegrationEnvError } from "@/components/common/IntegrationEnvError";
import { ErrorCard } from "@components/ui/cards/ErrorCard";
import { isUserBeaconEnvConfigured } from "@lib/env-configured";
import { getUserBeacon } from "@lib/user-beacon/get-user-beacon";
import { useSessionMetadata } from "@lib/user-beacon/use-session-metadata";
import { useUserBeaconContext } from "@providers/user-beacon-provider";
import { useState } from "react";

type BeaconRunState = {
  status: "idle" | "pending" | "success" | "error";
  httpStatus: number | null;
  errorMessage: string | null;
};

const initialBeaconRunState: BeaconRunState = {
  status: "idle",
  httpStatus: null,
  errorMessage: null,
};

export function UserBeaconSandboxSection() {
  const { beaconFinished } = useUserBeaconContext();
  const metadataQuery = useSessionMetadata({ enabled: beaconFinished });
  const [manualBeaconRun, setManualBeaconRun] = useState<BeaconRunState>(
    initialBeaconRunState,
  );

  const retryBeacon = async () => {
    setManualBeaconRun({ status: "pending", httpStatus: null, errorMessage: null });

    try {
      const response = await getUserBeacon();
      const nextState: BeaconRunState = {
        status: response.ok ? "success" : "error",
        httpStatus: response.status,
        errorMessage: response.ok ? null : `HTTP ${response.status}`,
      };
      setManualBeaconRun(nextState);

      if (response.ok) {
        await metadataQuery.refetch();
      }
    } catch (error: unknown) {
      setManualBeaconRun({
        status: "error",
        httpStatus: null,
        errorMessage: error instanceof Error ? error.message : "Network error",
      });
    }
  };

  if (!isUserBeaconEnvConfigured()) {
    return <IntegrationEnvError integration="userBeacon" />;
  }

  const cloudflareMetadata = metadataQuery.data?.data.cloudflareMetadata ?? null;

  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-foreground">Eden API — User Beacon</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The beacon call returns an empty body. Session side effects and Cloudflare metadata
          are visible via <code className="font-mono text-xs">GET /session/metadata</code> after
          the beacon completes.
        </p>
      </div>

      <StatusList>
        <StatusRow
          label="beaconFinished"
          value={beaconFinished ? "true" : "false"}
          detail="Set by UserBeaconProvider after GET /session/beacon resolves."
        />
        <StatusRow
          label="Latest manual beacon run"
          value={manualBeaconRun.status}
          detail={
            manualBeaconRun.httpStatus !== null
              ? `HTTP ${manualBeaconRun.httpStatus}`
              : manualBeaconRun.errorMessage ?? "Fires automatically on app load via layout."
          }
        />
        <StatusRow
          label="Session metadata"
          value={
            metadataQuery.isPending
              ? "loading"
              : metadataQuery.isError
                ? "error"
                : metadataQuery.isSuccess
                  ? "loaded"
                  : beaconFinished
                    ? "waiting"
                    : "blocked"
          }
          detail={
            metadataQuery.isError && metadataQuery.error instanceof Error
              ? metadataQuery.error.message
              : "Fetched after beaconFinished is true."
          }
        />
      </StatusList>

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          className="rounded-md border border-border bg-background px-4 py-2 text-sm font-medium text-foreground hover:bg-muted"
          onClick={() => void retryBeacon()}
          disabled={manualBeaconRun.status === "pending"}
        >
          Retry GET /session/beacon
        </button>
        <button
          type="button"
          className="rounded-md border border-border bg-background px-4 py-2 text-sm font-medium text-foreground hover:bg-muted"
          onClick={() => void metadataQuery.refetch()}
          disabled={!beaconFinished || metadataQuery.isFetching}
        >
          Refresh GET /session/metadata
        </button>
      </div>

      {metadataQuery.isPending ? (
        <p className="text-sm text-muted-foreground">Loading session metadata…</p>
      ) : null}

      {metadataQuery.isError ? (
        <ErrorCard
          title="Session metadata unavailable"
          message={
            metadataQuery.error instanceof Error
              ? metadataQuery.error.message
              : "Could not load session metadata."
          }
          actionSlot={
            <button
              type="button"
              className="underline"
              onClick={() => void metadataQuery.refetch()}
            >
              Retry
            </button>
          }
        />
      ) : null}

      {cloudflareMetadata ? (
        <JsonBlock label="cloudflareMetadata" value={cloudflareMetadata} />
      ) : null}

      {metadataQuery.data ? (
        <JsonBlock label="Full GET /session/metadata response" value={metadataQuery.data} />
      ) : null}
    </section>
  );
}
