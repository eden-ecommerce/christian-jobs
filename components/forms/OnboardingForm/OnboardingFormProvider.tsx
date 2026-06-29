"use client";

import { assertNever } from "@eden-ecommerce/lib/assert-never";
import { Button } from "@components/ui/button";
import { FormContainer } from "@components/forms/FormContainer";
import { MultiStepForm } from "@components/forms/MultiStepForm/MultiStepForm";
import { useMultiStepForm } from "@components/forms/MultiStepForm/multi-step-form-context";
import { ContactSection } from "@components/forms/OnboardingForm/sections/ContactSection";
import { DetailsSection } from "@components/forms/OnboardingForm/sections/DetailsSection";
import { ReviewSection } from "@components/forms/OnboardingForm/sections/ReviewSection";
import {
  ONBOARDING_STEP_DEFINITIONS,
  OnboardingStep,
  getOnboardingStepFieldNames,
  getOnboardingStepSchema,
  onboardingFormSchema,
  parseApiToOnboardingForm,
  type OnboardingFormValues,
} from "@components/forms/OnboardingForm/onboarding.schema";
import { Form, Formik, useFormikContext } from "formik";
import { useState } from "react";
import { toFormikValidationSchema } from "zod-formik-adapter";

function OnboardingStepPanels() {
  const { activeStep } = useMultiStepForm<OnboardingStep>();

  switch (activeStep) {
    case OnboardingStep.Details:
      return <DetailsSection />;
    case OnboardingStep.Contact:
      return <ContactSection />;
    case OnboardingStep.Review:
      return <ReviewSection />;
    default:
      return assertNever(activeStep);
  }
}

function OnboardingStepNav() {
  const formik = useFormikContext<OnboardingFormValues>();
  const { activeStep, goToStep, isFirstStep, isLastStep, steps } =
    useMultiStepForm<OnboardingStep>();
  const [showStepErrors, setShowStepErrors] = useState(false);

  const stepIndex = steps.findIndex((step) => step.value === activeStep);
  const nextStep = steps[stepIndex + 1]?.value;
  const prevStep = steps[stepIndex - 1]?.value;

  const validateCurrentStep = async () => {
    const stepSchema = getOnboardingStepSchema(activeStep);
    const fieldNames = getOnboardingStepFieldNames(activeStep);

    fieldNames.forEach((field) => {
      void formik.setFieldTouched(field, true, false);
    });
    await formik.validateForm();

    if (!stepSchema.safeParse(formik.values).success) {
      setShowStepErrors(true);
      return false;
    }

    setShowStepErrors(false);
    return true;
  };

  const handleNext = async () => {
    if (!(await validateCurrentStep()) || !nextStep) return;
    goToStep(nextStep);
  };

  const handleSubmit = async () => {
    if (!(await validateCurrentStep())) return;
    await formik.submitForm();
  };

  return (
    <div className="flex justify-between gap-4 border-t border-border pt-4">
      <Button
        type="button"
        variant="outline"
        disabled={isFirstStep || !prevStep}
        onClick={() => prevStep && goToStep(prevStep)}
      >
        Back
      </Button>
      {showStepErrors ? (
        <p className="self-center text-sm text-destructive">Fix errors on this step.</p>
      ) : null}
      {isLastStep ? (
        <Button type="button" onClick={() => void handleSubmit()}>
          Submit
        </Button>
      ) : (
        <Button type="button" onClick={() => void handleNext()}>
          Next
        </Button>
      )}
    </div>
  );
}

function OnboardingFormContent() {
  const [activeStep, setActiveStep] = useState(OnboardingStep.Details);

  const handleSubmit = async (values: OnboardingFormValues) => {
    console.info("Onboarding submitted", values);
  };

  return (
    <Formik
      initialValues={parseApiToOnboardingForm()}
      validationSchema={toFormikValidationSchema(onboardingFormSchema)}
      onSubmit={handleSubmit}
    >
      <MultiStepForm
        steps={[...ONBOARDING_STEP_DEFINITIONS]}
        activeStep={activeStep}
        onActiveStepChange={setActiveStep}
      >
        <FormContainer>
          <Form className="space-y-6">
            <OnboardingStepPanels />
            <OnboardingStepNav />
          </Form>
        </FormContainer>
      </MultiStepForm>
    </Formik>
  );
}

export function OnboardingFormProvider() {
  return <OnboardingFormContent />;
}
