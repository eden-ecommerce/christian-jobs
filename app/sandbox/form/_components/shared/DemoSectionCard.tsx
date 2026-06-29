"use client";

import {
  DemoSectionPanel,
  getDemoSectionHeading,
} from "@app/sandbox/form/_components/shared/DemoSectionPanel";
import type { DemoSection } from "@app/sandbox/form/_components/shared/demo.schema";
import { useDemoFormSection } from "@app/sandbox/form/_components/shared/useDemoFormSection";
import { Button } from "@components/ui/button";
import { useFormValidationFields } from "@components/forms/useFormValidationFields";
import type { DemoFormValues } from "@app/sandbox/form/_components/shared/demo.schema";

type DemoSectionCardProps = {
  section: DemoSection;
};

export function DemoSectionCard({ section }: DemoSectionCardProps) {
  const { submitSection, isSubmitting, lastSavedAt, fieldNames } = useDemoFormSection(section);
  const { hasErrors, errorsArray } = useFormValidationFields<DemoFormValues, (typeof fieldNames)[number]>(
    fieldNames,
  );

  return (
    <div className="space-y-4 rounded-lg border border-border bg-background p-4">
      <h3 className="text-base font-semibold text-foreground">{getDemoSectionHeading(section)}</h3>
      <DemoSectionPanel section={section} />
      {hasErrors ? (
        <ul className="space-y-1 text-sm text-destructive">
          {errorsArray.map((error) => (
            <li key={error}>{error}</li>
          ))}
        </ul>
      ) : null}
      {lastSavedAt ? (
        <p className="text-xs text-muted-foreground">
          Section saved at {lastSavedAt.toLocaleTimeString()}
        </p>
      ) : null}
      <div className="flex justify-end border-t border-border pt-4">
        <Button
          type="button"
          disabled={isSubmitting}
          onClick={() => void submitSection()}
        >
          {isSubmitting ? "Saving…" : "Save section"}
        </Button>
      </div>
    </div>
  );
}
