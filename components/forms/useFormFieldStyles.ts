import { cn } from "@eden-ecommerce/lib/utils";
import { isEqual } from "lodash";
import { useFormikContext } from "formik";

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
