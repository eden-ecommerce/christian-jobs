"use client";

import { assertNever } from "@lib/assert-never";
import {
  DemoSection,
  getSectionLabel,
} from "@app/sandbox/form/_components/shared/demo.schema";
import { ContactSection } from "@app/sandbox/form/_components/shared/sections/ContactSection";
import { DetailsSection } from "@app/sandbox/form/_components/shared/sections/DetailsSection";
import { PreferencesSection } from "@app/sandbox/form/_components/shared/sections/PreferencesSection";

export function DemoSectionPanel({ section }: { section: DemoSection }) {
  switch (section) {
    case DemoSection.Details:
      return <DetailsSection />;
    case DemoSection.Contact:
      return <ContactSection />;
    case DemoSection.Preferences:
      return <PreferencesSection />;
    default:
      return assertNever(section);
  }
}

export function getDemoSectionHeading(section: DemoSection): string {
  return getSectionLabel(section);
}
