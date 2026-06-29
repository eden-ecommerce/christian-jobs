"use client";

import { Button } from "@components/ui/button";
import { useFormikContext } from "formik";
import type { ReactNode } from "react";

type FormFooterProps = {
  onCancel?: () => void;
  children?: ReactNode;
};

export function FormFooter({ onCancel, children }: FormFooterProps) {
  const formik = useFormikContext();

  return (
    <div className="flex items-center justify-between gap-4 border-t border-border pt-4">
      {onCancel ? (
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      ) : (
        <span />
      )}
      <div className="flex items-center gap-3">
        {formik.dirty ? (
          <span className="text-sm text-muted-foreground">Unsaved changes</span>
        ) : null}
        {children ?? (
          <Button
            type="submit"
            disabled={!formik.isValid || !formik.dirty || formik.isSubmitting}
          >
            Save
          </Button>
        )}
      </div>
    </div>
  );
}

export function FormSubmitButton({
  label = "Save",
  onBeforeSubmit,
}: {
  label?: string;
  onBeforeSubmit?: () => void | Promise<void>;
}) {
  const formik = useFormikContext();

  return (
    <Button
      type="submit"
      disabled={!formik.isValid || !formik.dirty || formik.isSubmitting}
      onClick={() => void onBeforeSubmit?.()}
    >
      {label}
    </Button>
  );
}
