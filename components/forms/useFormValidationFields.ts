"use client";

import { useFormikContext } from "formik";

export function useFormValidationFields<
  TValues extends Record<string, unknown>,
  TField extends keyof TValues & string,
>(fieldNames: readonly TField[]) {
  const formik = useFormikContext<TValues>();

  const errorsArray = fieldNames.flatMap((name) => {
    const error = formik.errors[name];
    return typeof error === "string" ? [error] : [];
  });

  const hasErrors = fieldNames.some((name) => Boolean(formik.touched[name] && formik.errors[name]));

  return { hasErrors, errorsArray };
}
