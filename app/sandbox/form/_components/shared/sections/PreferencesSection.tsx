"use client";

import { FormField } from "@components/forms/FormField";
import { useFormFieldStyles } from "@components/forms/useFormFieldStyles";
import type { DemoFormValues } from "@app/sandbox/form/_components/shared/demo.schema";
import { useFormikContext } from "formik";

export function PreferencesSection() {
  const formik = useFormikContext<DemoFormValues>();
  const { getFieldClassName } = useFormFieldStyles<DemoFormValues>();

  return (
    <div className="space-y-4">
      <dl className="space-y-2 text-sm">
        <div>
          <dt className="text-muted-foreground">Name</dt>
          <dd>{formik.values.name}</dd>
        </div>
        <div>
          <dt className="text-muted-foreground">Email</dt>
          <dd>{formik.values.email}</dd>
        </div>
      </dl>
      <FormField
        label="Terms"
        name="acceptedTerms"
        error={
          typeof formik.errors.acceptedTerms === "string"
            ? formik.errors.acceptedTerms
            : undefined
        }
        touched={formik.touched.acceptedTerms}
      >
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={formik.values.acceptedTerms}
            onChange={(event) =>
              void formik.setFieldValue("acceptedTerms", event.target.checked)
            }
            className={getFieldClassName("acceptedTerms")}
          />
          I accept the terms
        </label>
      </FormField>
    </div>
  );
}
