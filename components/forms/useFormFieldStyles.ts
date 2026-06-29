"use client";

import { cn } from "@lib/utils";
import { useFormikContext } from "formik";
import { isEqual } from "lodash";

export function useFormFieldStyles<T extends Record<string, unknown>>() {
  const formik = useFormikContext<T>();

  const getFieldClassName = (fieldName: keyof T & string) => {
    const current = formik.values[fieldName];
    const initial = formik.initialValues[fieldName];
    const isUnsaved = !isEqual(current, initial);

    return cn(isUnsaved && "ring-1 ring-amber-400/60");
  };

  return { getFieldClassName };
}
