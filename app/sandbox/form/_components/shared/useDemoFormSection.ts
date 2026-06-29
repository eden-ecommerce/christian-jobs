"use client";

import { useFormSectionSubmit } from "@components/forms/useFormSectionSubmit";
import {
  DemoSection,
  getSectionFieldNames,
  getSectionSchema,
  type DemoFormValues,
} from "@app/sandbox/form/_components/shared/demo.schema";
import { useFormikContext } from "formik";
import type { z } from "zod";

export function useDemoFormSection(section: DemoSection) {
  const formik = useFormikContext<DemoFormValues>();
  const schema = getSectionSchema(section);
  const fieldNames = getSectionFieldNames(section);

  return useFormSectionSubmit({
    formik,
    schema: schema as z.ZodType<Partial<DemoFormValues>>,
    fieldNames,
    onSave: async (values) => {
      console.info(`Partial save [${section}]`, values);
    },
  });
}
