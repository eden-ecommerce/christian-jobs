import { cn } from "@eden-ecommerce/lib/utils";
import { useFormikContext } from "formik";
import type { ReactNode } from "react";

type FormContainerProps = {
  children: ReactNode;
  className?: string;
};

export function FormContainer({ children, className }: FormContainerProps) {
  const formik = useFormikContext();
  const hasErrors = Object.keys(formik.errors).length > 0 && formik.submitCount > 0;

  return (
    <div
      className={cn(
        "rounded-lg border p-6",
        formik.dirty && !hasErrors && "border-amber-400",
        hasErrors && "border-destructive",
        !formik.dirty && !hasErrors && "border-border",
        className,
      )}
    >
      {children}
    </div>
  );
}
