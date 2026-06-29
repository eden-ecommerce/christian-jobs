import { assertNever } from "@eden-ecommerce/lib/assert-never";
import { z } from "zod";

export enum OnboardingStep {
  Details = "details",
  Contact = "contact",
  Review = "review",
}

export const onboardingDetailsSchema = z.object({
  name: z.string().min(1, "Name is required"),
  summary: z.string().optional(),
});

export const onboardingContactSchema = z.object({
  email: z.string().email("Valid email required"),
  phone: z.string().optional(),
});

export const onboardingReviewSchema = z.object({
  acceptedTerms: z.boolean().refine((value) => value, "You must accept the terms"),
});

export const onboardingFormSchema = onboardingDetailsSchema
  .merge(onboardingContactSchema)
  .merge(onboardingReviewSchema);

export type OnboardingFormValues = z.infer<typeof onboardingFormSchema>;

export const onboardingDetailsFormFields = ["name", "summary"] as const satisfies Array<
  keyof OnboardingFormValues
>;

export const onboardingContactFormFields = ["email", "phone"] as const satisfies Array<
  keyof OnboardingFormValues
>;

export const onboardingReviewFormFields = ["acceptedTerms"] as const satisfies Array<
  keyof OnboardingFormValues
>;

export const getOnboardingStepSchema = (step: OnboardingStep) => {
  switch (step) {
    case OnboardingStep.Details:
      return onboardingDetailsSchema;
    case OnboardingStep.Contact:
      return onboardingContactSchema;
    case OnboardingStep.Review:
      return onboardingReviewSchema;
    default:
      return assertNever(step);
  }
};

export const getOnboardingStepFieldNames = (
  step: OnboardingStep,
): readonly (keyof OnboardingFormValues)[] => {
  switch (step) {
    case OnboardingStep.Details:
      return onboardingDetailsFormFields;
    case OnboardingStep.Contact:
      return onboardingContactFormFields;
    case OnboardingStep.Review:
      return onboardingReviewFormFields;
    default:
      return assertNever(step);
  }
};

export const ONBOARDING_STEP_DEFINITIONS = [
  { value: OnboardingStep.Details, label: "Details" },
  { value: OnboardingStep.Contact, label: "Contact" },
  { value: OnboardingStep.Review, label: "Review" },
] as const;

export const parseApiToOnboardingForm = (): OnboardingFormValues => ({
  name: "",
  summary: "",
  email: "",
  phone: "",
  acceptedTerms: false,
});
