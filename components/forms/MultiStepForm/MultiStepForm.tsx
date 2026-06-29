"use client";

import {
  MultiStepFormProvider,
  type StepDefinition,
} from "@components/forms/MultiStepForm/multi-step-form-context";
import { cn } from "@lib/utils";

type MultiStepFormProps<TStep extends string> = {
  steps: StepDefinition<TStep>[];
  activeStep: TStep;
  onActiveStepChange: (step: TStep) => void;
  afterNavigate?: () => void;
  children: React.ReactNode;
};

export function MultiStepForm<TStep extends string>({
  steps,
  activeStep,
  onActiveStepChange,
  afterNavigate,
  children,
}: MultiStepFormProps<TStep>) {
  const activeIndex = steps.findIndex((step) => step.value === activeStep);

  const goToStep = (step: TStep) => {
    onActiveStepChange(step);
    afterNavigate?.();
  };

  return (
    <MultiStepFormProvider
      steps={steps}
      activeStep={activeStep}
      onActiveStepChange={goToStep}
    >
      <nav aria-label="Form steps" className="mb-6 flex gap-2">
        {steps.map((step, index) => (
          <div
            key={step.value}
            className={cn(
              "rounded-full px-3 py-1 text-xs font-medium",
              index === activeIndex
                ? "bg-primary text-primary-foreground"
                : index < activeIndex
                  ? "bg-muted text-foreground"
                  : "bg-muted/50 text-muted-foreground",
            )}
          >
            {step.label}
          </div>
        ))}
      </nav>
      {children}
    </MultiStepFormProvider>
  );
}
