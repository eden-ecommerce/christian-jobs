"use client";

import { DemoSectionCard } from "@app/sandbox/form/_components/shared/DemoSectionCard";
import {
  DemoSection,
  demoFormSchema,
  parseApiToDemoForm,
} from "@app/sandbox/form/_components/shared/demo.schema";
import { FormContainer } from "@components/forms/FormContainer";
import { Form, Formik } from "formik";
import { toFormikValidationSchema } from "zod-formik-adapter";

const SECTIONS = [
  DemoSection.Details,
  DemoSection.Contact,
  DemoSection.Preferences,
] as const;

export function PartialUpdateFormDemo() {
  return (
    <Formik
      initialValues={parseApiToDemoForm()}
      validationSchema={toFormikValidationSchema(demoFormSchema)}
      onSubmit={() => undefined}
    >
      <FormContainer>
        <Form className="space-y-6">
          {SECTIONS.map((section) => (
            <DemoSectionCard key={section} section={section} />
          ))}
        </Form>
      </FormContainer>
    </Formik>
  );
}
