import { ErrorCard } from "@components/ui/cards/ErrorCard";

type HealthStatusErrorProps = {
  onRetry: () => void;
};

export function HealthStatusError({ onRetry }: HealthStatusErrorProps) {
  return (
    <ErrorCard
      title="Health check failed"
      message="The API did not respond. Ensure the dev server is running."
      actionSlot={
        <button type="button" className="underline" onClick={onRetry}>
          Retry
        </button>
      }
    />
  );
}
