"use client";

import type { FormikContextType } from "formik";
import type { z } from "zod";

type UseFormSectionValidationOptions<TValues extends Record<string, unknown>> = {
  formik: FormikContextType<TValues>;
  schema: z.ZodType;
  fieldNames: readonly (keyof TValues & string)[];
};

export function useFormSectionValidation<TValues extends Record<string, unknown>>({
  formik,
  schema,
  fieldNames,
}: UseFormSectionValidationOptions<TValues>) {
  const validateSection = async (): Promise<boolean> => {
    fieldNames.forEach((field) => {
      void formik.setFieldTouched(field, true, false);
    });
    await formik.validateForm();
    return schema.safeParse(formik.values).success;
  };

  return { validateSection };
}
