"use client";

import { Button } from "@components/ui/button";
import { cn } from "@lib/utils";
import { X } from "lucide-react";

type FilterBadgePrimitiveProps = {
  label: string;
  prefix?: string;
  onRemove: () => void;
  className?: string;
};

export function FilterBadgePrimitive({
  label,
  prefix,
  onRemove,
  className,
}: FilterBadgePrimitiveProps) {
  const displayLabel = prefix ? `${prefix} ${label}` : label;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full bg-muted px-2.5 py-1 text-xs",
        className,
      )}
    >
      <span>{displayLabel}</span>
      <Button
        type="button"
        variant="ghost"
        size="icon-xs"
        aria-label={`Remove ${displayLabel}`}
        onClick={onRemove}
        className="size-5 text-muted-foreground hover:text-foreground"
      >
        <X />
      </Button>
    </span>
  );
}
