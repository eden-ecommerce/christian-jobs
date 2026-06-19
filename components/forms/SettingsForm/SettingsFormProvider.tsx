"use client";

import { ErrorCard } from "@components/ui/ErrorCard";
import { assertNever } from "@lib/assert-never";
import { FormContainer } from "@components/forms/FormContainer";
import { FormFooter, FormSubmitButton } from "@components/forms/FormFooter";
import { useFormValidationFields } from "@components/forms/useFormValidationFields";
import { GeneralSection } from "@components/forms/SettingsForm/sections/GeneralSection";
import { PreferencesSection } from "@components/forms/SettingsForm/sections/PreferencesSection";
import {
  parseApiToSettingsForm,
  settingsFormSchema,
  settingsGeneralFormFields,
  settingsPreferencesFormFields,
  type SettingsFormValues,
  type SettingsSaveMode,
} from "@components/forms/SettingsForm/settings.schema";
import { useSettings, useUpdateSettings } from "@hooks/settings/use-settings";
import { Form, Formik, useFormikContext } from "formik";
import { useState } from "react";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { cn } from "@lib/utils";

type SettingsFormPresenterProps = {
  initialValues: SettingsFormValues;
};

function SaveAllButton() {
  const formik = useFormikContext<SettingsFormValues>();

  return (
    <FormSubmitButton
      onBeforeSubmit={async () => {
        await formik.setFieldValue("saveMode", "full");
      }}
    />
  );
}

function SettingsFormContent() {
  const [activeTab, setActiveTab] = useState<"general" | "preferences">("general");

  const generalValidation = useFormValidationFields<
    SettingsFormValues,
    (typeof settingsGeneralFormFields)[number]
  >(settingsGeneralFormFields);

  const preferencesValidation = useFormValidationFields<
    SettingsFormValues,
    (typeof settingsPreferencesFormFields)[number]
  >(settingsPreferencesFormFields);

  const tabClass = (hasErrors: boolean, isActive: boolean) =>
    cn(
      "rounded-md px-3 py-1.5 text-sm font-medium",
      isActive ? "bg-muted text-foreground" : "text-muted-foreground hover:text-foreground",
      hasErrors && "text-destructive",
    );

  return (
    <FormContainer>
      <Form className="space-y-6">
        <div className="flex gap-2">
          <button
            type="button"
            className={tabClass(generalValidation.hasErrors, activeTab === "general")}
            onClick={() => setActiveTab("general")}
          >
            General
          </button>
          <button
            type="button"
            className={tabClass(
              preferencesValidation.hasErrors,
              activeTab === "preferences",
            )}
            onClick={() => setActiveTab("preferences")}
          >
            Preferences
          </button>
        </div>

        {activeTab === "general" ? <GeneralSection /> : <PreferencesSection />}

        <FormFooter>
          <SaveAllButton />
        </FormFooter>
      </Form>
    </FormContainer>
  );
}

function SettingsFormPresenter({ initialValues }: SettingsFormPresenterProps) {
  const updateMutation = useUpdateSettings();

  const handleSubmit = async (values: SettingsFormValues) => {
    const saveMode: SettingsSaveMode = values.saveMode;

    switch (saveMode) {
      case "full":
        await updateMutation.mutateAsync({
          title: values.title,
          description: values.description ?? "",
          notificationsEnabled: values.notificationsEnabled,
        });
        break;
      case "preferences":
        await updateMutation.mutateAsync({
          title: initialValues.title,
          description: initialValues.description ?? "",
          notificationsEnabled: values.notificationsEnabled,
        });
        break;
      default:
        return assertNever(saveMode);
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={toFormikValidationSchema(settingsFormSchema)}
      onSubmit={handleSubmit}
      enableReinitialize
      validateOnMount
    >
      <SettingsFormContent />
    </Formik>
  );
}

function FormSkeleton() {
  return <div className="h-48 animate-pulse rounded-lg bg-muted" />;
}

function FormError({ onRetry }: { onRetry: () => void }) {
  return (
    <ErrorCard
      title="Settings unavailable"
      message="Could not load settings from the API."
      onRetry={onRetry}
    />
  );
}

function FormEmpty() {
  return <p className="text-sm text-muted-foreground">No settings found.</p>;
}

export function SettingsFormProvider() {
  const { data, isPending, isError, refetch } = useSettings();

  if (isPending) return <FormSkeleton />;
  if (isError) return <FormError onRetry={() => void refetch()} />;
  if (!data) return <FormEmpty />;

  return <SettingsFormPresenter initialValues={parseApiToSettingsForm(data)} />;
}
