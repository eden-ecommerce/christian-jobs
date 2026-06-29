import { assertNever } from "@lib/assert-never";
import { z } from "zod";

export enum DemoSection {
  Details = "details",
  Contact = "contact",
  Preferences = "preferences",
}

export const detailsSchema = z.object({
  name: z.string().min(1, "Name is required"),
  summary: z.string().optional(),
});

export const contactSchema = z.object({
  email: z.string().email("Valid email required"),
  phone: z.string().optional(),
});

export const preferencesSchema = z.object({
  acceptedTerms: z.boolean().refine((value) => value, "You must accept the terms"),
});

export const demoFormSchema = detailsSchema.merge(contactSchema).merge(preferencesSchema);

export type DemoFormValues = z.infer<typeof demoFormSchema>;

export const detailsFormFields = ["name", "summary"] as const satisfies Array<
  keyof DemoFormValues
>;

export const contactFormFields = ["email", "phone"] as const satisfies Array<
  keyof DemoFormValues
>;

export const preferencesFormFields = ["acceptedTerms"] as const satisfies Array<
  keyof DemoFormValues
>;

export const getSectionSchema = (section: DemoSection) => {
  switch (section) {
    case DemoSection.Details:
      return detailsSchema;
    case DemoSection.Contact:
      return contactSchema;
    case DemoSection.Preferences:
      return preferencesSchema;
    default:
      return assertNever(section);
  }
};

export const getSectionFieldNames = (
  section: DemoSection,
): readonly (keyof DemoFormValues)[] => {
  switch (section) {
    case DemoSection.Details:
      return detailsFormFields;
    case DemoSection.Contact:
      return contactFormFields;
    case DemoSection.Preferences:
      return preferencesFormFields;
    default:
      return assertNever(section);
  }
};

export const getSectionLabel = (section: DemoSection): string => {
  switch (section) {
    case DemoSection.Details:
      return "Details";
    case DemoSection.Contact:
      return "Contact";
    case DemoSection.Preferences:
      return "Preferences";
    default:
      return assertNever(section);
  }
};

export const SECTION_DEFINITIONS = [
  { value: DemoSection.Details, label: "Details" },
  { value: DemoSection.Contact, label: "Contact" },
  { value: DemoSection.Preferences, label: "Preferences" },
] as const;

export const parseApiToDemoForm = (): DemoFormValues => ({
  name: "",
  summary: "",
  email: "",
  phone: "",
  acceptedTerms: false,
});
