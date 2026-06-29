"use client";

import { DemoSectionCard } from "@app/sandbox/form/_components/shared/DemoSectionCard";
import {
  DemoSection,
  SECTION_DEFINITIONS,
  demoFormSchema,
  parseApiToDemoForm,
} from "@app/sandbox/form/_components/shared/demo.schema";
import { useDemoFormSection } from "@app/sandbox/form/_components/shared/useDemoFormSection";
import { FormContainer } from "@components/forms/FormContainer";
import { TabForm } from "@components/forms/TabForm/TabForm";
import { Form, Formik } from "formik";
import { useState } from "react";
import { toFormikValidationSchema } from "zod-formik-adapter";

function TabFormContent() {
  const [activeTab, setActiveTab] = useState<DemoSection>(DemoSection.Details);
  const detailsSection = useDemoFormSection(DemoSection.Details);
  const contactSection = useDemoFormSection(DemoSection.Contact);
  const preferencesSection = useDemoFormSection(DemoSection.Preferences);

  const sectionHooks = {
    [DemoSection.Details]: detailsSection,
    [DemoSection.Contact]: contactSection,
    [DemoSection.Preferences]: preferencesSection,
  } as const;

  const handleBeforeTabChange = async (from: DemoSection, _to: DemoSection) => {
    return sectionHooks[from].validateSection();
  };

  return (
    <TabForm
      tabs={[...SECTION_DEFINITIONS]}
      activeTab={activeTab}
      onTabChange={setActiveTab}
      onBeforeTabChange={handleBeforeTabChange}
    >
      <DemoSectionCard section={activeTab} />
    </TabForm>
  );
}

export function TabFormDemo() {
  return (
    <Formik
      initialValues={parseApiToDemoForm()}
      validationSchema={toFormikValidationSchema(demoFormSchema)}
      onSubmit={() => undefined}
    >
      <FormContainer>
        <Form>
          <TabFormContent />
        </Form>
      </FormContainer>
    </Formik>
  );
}
