import { MultiStepFormDemo } from "@app/sandbox/form/_components/MultiStepForm/MultiStepFormDemo";
import { PartialUpdateFormDemo } from "@app/sandbox/form/_components/PartialUpdateForm/PartialUpdateFormDemo";
import { TabFormDemo } from "@app/sandbox/form/_components/TabForm/TabFormDemo";

export function SandboxFormPageContent() {
  return (
    <div className="flex flex-col gap-12">
      <section className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold text-foreground">1. Partial update</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            All sections visible. Each section has its own schema, validation hook, and Save
            button for independent partial submissions.
          </p>
        </div>
        <PartialUpdateFormDemo />
      </section>

      <section className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold text-foreground">2. Tab form</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Tabs toggle the active section. Leaving a tab validates the outgoing section. Each
            tab supports partial save via the same section hook.
          </p>
        </div>
        <TabFormDemo />
      </section>

      <section className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold text-foreground">3. Multi-step form</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Incremental wizard with Back / Next navigation. Each step validates before
            advancing; the last step submits the full form once.
          </p>
        </div>
        <MultiStepFormDemo />
      </section>
    </div>
  );
}
