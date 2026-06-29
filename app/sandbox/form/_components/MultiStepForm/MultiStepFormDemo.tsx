"use client";

import { DemoSectionPanel } from "@app/sandbox/form/_components/shared/DemoSectionPanel";
import {
  DemoSection,
  SECTION_DEFINITIONS,
  demoFormSchema,
  parseApiToDemoForm,
  type DemoFormValues,
} from "@app/sandbox/form/_components/shared/demo.schema";
import { useDemoFormSection } from "@app/sandbox/form/_components/shared/useDemoFormSection";
import { Button } from "@components/ui/button";
import { FormContainer } from "@components/forms/FormContainer";
import { MultiStepForm } from "@components/forms/MultiStepForm/MultiStepForm";
import { useMultiStepForm } from "@components/forms/MultiStepForm/multi-step-form-context";
import { Form, Formik, useFormikContext } from "formik";
import { useState } from "react";
import { toFormikValidationSchema } from "zod-formik-adapter";

function MultiStepPanels() {
  const { activeStep } = useMultiStepForm<DemoSection>();

  return <DemoSectionPanel section={activeStep} />;
}

function MultiStepNav() {
  const { activeStep, goToStep, isFirstStep, isLastStep, steps } =
    useMultiStepForm<DemoSection>();
  const { validateSection } = useDemoFormSection(activeStep);
  const formik = useFormikContext<DemoFormValues>();
  const [showStepErrors, setShowStepErrors] = useState(false);

  const stepIndex = steps.findIndex((step) => step.value === activeStep);
  const nextStep = steps[stepIndex + 1]?.value;
  const prevStep = steps[stepIndex - 1]?.value;

  const handleNext = async () => {
    if (!(await validateSection())) {
      setShowStepErrors(true);
      return;
    }
    setShowStepErrors(false);
    if (nextStep) goToStep(nextStep);
  };

  const handleSubmit = async () => {
    if (!(await validateSection())) {
      setShowStepErrors(true);
      return;
    }
    setShowStepErrors(false);
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

function MultiStepFormContent() {
  const [activeStep, setActiveStep] = useState(DemoSection.Details);

  const handleSubmit = async (values: DemoFormValues) => {
    console.info("Multi-step form submitted", values);
  };

  return (
    <Formik
      initialValues={parseApiToDemoForm()}
      validationSchema={toFormikValidationSchema(demoFormSchema)}
      onSubmit={handleSubmit}
    >
      <MultiStepForm
        steps={[...SECTION_DEFINITIONS]}
        activeStep={activeStep}
        onActiveStepChange={setActiveStep}
      >
        <FormContainer>
          <Form className="space-y-6">
            <MultiStepPanels />
            <MultiStepNav />
          </Form>
        </FormContainer>
      </MultiStepForm>
    </Formik>
  );
}

export function MultiStepFormDemo() {
  return <MultiStepFormContent />;
}
