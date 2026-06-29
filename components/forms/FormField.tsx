import { Label } from "@components/ui/label";
import { cn } from "@eden-ecommerce/lib/utils";
import type { ReactNode } from "react";

type FormFieldProps = {
  label: string;
  name: string;
  error?: string;
  touched?: boolean;
  required?: boolean;
  children: ReactNode;
};

export function FormField({
  label,
  name,
  error,
  touched,
  required,
  children,
}: FormFieldProps) {
  const showError = touched && error;

  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor={name}>
        {label}
        {required ? <span className="text-destructive"> *</span> : null}
      </Label>
      {children}
      {showError ? <p className="text-sm text-destructive">{error}</p> : null}
    </div>
  );
}
