"use client";

import { useFormSectionValidation } from "@components/forms/useFormSectionValidation";
import type { FormikContextType } from "formik";
import { useCallback, useState } from "react";
import type { z } from "zod";

type UseFormSectionSubmitOptions<
  TValues extends Record<string, unknown>,
  TPartial extends Partial<TValues>,
> = {
  formik: FormikContextType<TValues>;
  schema: z.ZodType<TPartial>;
  fieldNames: readonly (keyof TValues & string)[];
  onSave: (values: TPartial) => Promise<void> | void;
};

export function useFormSectionSubmit<
  TValues extends Record<string, unknown>,
  TPartial extends Partial<TValues>,
>({
  formik,
  schema,
  fieldNames,
  onSave,
}: UseFormSectionSubmitOptions<TValues, TPartial>) {
  const { validateSection } = useFormSectionValidation({ formik, schema, fieldNames });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null);

  const submitSection = useCallback(async (): Promise<boolean> => {
    if (!(await validateSection())) {
      return false;
    }

    const parsed = schema.safeParse(formik.values);
    if (!parsed.success) {
      return false;
    }

    setIsSubmitting(true);
    try {
      await onSave(parsed.data);
      formik.resetForm({ values: formik.values });
      setLastSavedAt(new Date());
      return true;
    } finally {
      setIsSubmitting(false);
    }
  }, [formik, onSave, schema, validateSection]);

  return { validateSection, submitSection, isSubmitting, lastSavedAt, fieldNames, schema };
}
