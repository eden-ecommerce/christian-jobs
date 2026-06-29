import { SandboxPageShell } from "@app/sandbox/_components/SandboxPageShell";
import { SandboxFormPageContent } from "@app/sandbox/form/_components/SandboxFormPageContent";

export default function SandboxFormPage() {
  return (
    <SandboxPageShell
      title="Form patterns"
      description="Partial update, tab form, and multi-step examples sharing per-section schemas and hooks."
    >
      <SandboxFormPageContent />
    </SandboxPageShell>
  );
}
