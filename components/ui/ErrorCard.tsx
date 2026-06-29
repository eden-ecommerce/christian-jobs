import { cn } from "@eden-ecommerce/lib/utils";

export type ErrorCardProps = {
  title?: string;
  message?: string;
  envVars?: readonly string[];
  onRetry?: () => void;
  className?: string;
};

export function ErrorCard({
  title = "Content unavailable",
  message = "Something went wrong loading this section.",
  envVars,
  onRetry,
  className,
}: ErrorCardProps) {
  return (
    <div
      className={cn(
        "rounded-lg border border-amber-500/40 bg-amber-500/5 px-4 py-3 text-sm",
        className,
      )}
      role="alert"
    >
      <p className="font-medium text-foreground">{title}</p>
      <p className="mt-1 text-muted-foreground">{message}</p>
      {envVars && envVars.length > 0 ? (
        <ul className="mt-2 space-y-0.5 font-mono text-xs text-muted-foreground">
          {envVars.map((name) => (
            <li key={name}>{name}</li>
          ))}
        </ul>
      ) : null}
      {onRetry ? (
        <button type="button" className="mt-3 underline" onClick={onRetry}>
          Retry
        </button>
      ) : null}
    </div>
  );
}
