"use client";

import { FormField } from "@components/forms/FormField";
import { useFormFieldStyles } from "@components/forms/useFormFieldStyles";
import type { DemoFormValues } from "@app/sandbox/form/_components/shared/demo.schema";
import { Input } from "@components/fields/input";
import { useFormikContext } from "formik";

export function DetailsSection() {
  const formik = useFormikContext<DemoFormValues>();
  const { getFieldClassName } = useFormFieldStyles<DemoFormValues>();

  return (
    <div className="space-y-4">
      <FormField
        label="Name"
        name="name"
        error={formik.errors.name}
        touched={formik.touched.name}
        required
      >
        <Input
          id="name"
          {...formik.getFieldProps("name")}
          className={getFieldClassName("name")}
        />
      </FormField>
      <FormField
        label="Summary"
        name="summary"
        error={formik.errors.summary}
        touched={formik.touched.summary}
      >
        <Input
          id="summary"
          {...formik.getFieldProps("summary")}
          className={getFieldClassName("summary")}
        />
      </FormField>
    </div>
  );
}
