import type { Metadata } from "next";
import { SectionHeading } from "@components/event-manager/SectionHeading";
import { FeatureGrid } from "@components/event-manager/FeatureGrid";
import { PhoneMockup } from "@components/event-manager/PhoneMockup";
import { PageHeader } from "@components/ticketing/PageHeader";
import { SplitSection } from "@components/ticketing/SplitSection";
import { BrowserMockup } from "@components/ticketing/BrowserMockup";
import { TicketCtaSection } from "@components/ticketing/TicketCtaSection";
import { SeatingDesignerScreen, SeatMapScreen } from "@components/ticketing/screens";
import { tkHref } from "@components/ticketing/tk-config";
import { Library, Ban, Split, MapPinned, Rows3, Circle } from "lucide-react";

export const metadata: Metadata = {
  title: "Reserved Seating",
  description:
    "A full reserved-seating system — visual venue designer, rows, tables and general admission, seat blocking, orphan-seat prevention and a reusable venue library.",
  alternates: { canonical: `https://www.eden.co.uk${tkHref("/seating")}` },
};

const SEATING_FEATURES = [
  { icon: Library, title: "Venue library", description: "Build a library of your venues and layouts. Run a new event at the same place by attaching an existing plan." },
  { icon: Ban, title: "Seat blocking", description: "Block individual seats for reserved rows, stage extensions, equipment or accessibility provisions." },
  { icon: Split, title: "Orphan-seat prevention", description: "Optionally warn or stop buyers leaving an awkward single empty seat at the end of a row — configurable per occasion." },
  { icon: MapPinned, title: "Per-occasion snapshots", description: "Adjust a plan for one event — blocking rows or reserving accessible seating — without changing the saved template." },
  { icon: Rows3, title: "Section-to-type mapping", description: "Set which ticket type covers which part of the venue, so pricing follows the seat map automatically." },
  { icon: Circle, title: "Reusable templates", description: "Your second event at the same venue takes no set-up time — the layout is already drawn and saved." },
];

const SECTION_TYPES = [
  { type: "Rows", how: "Individual numbered seats in rows", ideal: "Theatre layouts, concerts, ceremonies" },
  { type: "Tables", how: "Groups of seats around a table", ideal: "Gala dinners, banquets, awards evenings" },
  { type: "General admission", how: "Unassigned capacity within a section", ideal: "Standing areas, soft-seat zones, children's areas" },
];

export default function SeatingPage() {
  return (
    <main>
      <PageHeader
        eyebrow="Reserved Seating"
        title="Reserved seating your team can set up in an afternoon"
        description="A full seating system that distinguishes Christian360 from most ticketing tools in the faith sector — from a Christmas carol service to a fundraising gala."
      />

      <section className="mx-auto flex max-w-7xl flex-col gap-20 px-4 py-16 sm:py-24">
        <SplitSection
          eyebrow="The seating designer"
          title="Draw your floor plan, visually"
          description="Drag and drop rows, tables and general admission areas onto a canvas. Label your sections, number your seats, and decide which ticket type covers which part of the venue. Save it as a reusable template."
          bullets={[
            "Drag-and-drop canvas — no code, no spreadsheets",
            "Rows, tables and general admission in one plan",
            "Map sections to ticket types",
            "Save straight to your venue library",
          ]}
          media={
            <BrowserMockup url="admin.christian360.com/seating">
              <SeatingDesignerScreen />
            </BrowserMockup>
          }
        />

        <SplitSection
          reverse
          eyebrow="How buyers choose"
          title="An interactive seat map at checkout"
          description="When an occasion has a seating plan, buyers see an interactive map instead of a quantity box. They click the seats they want; the system holds them for 15 minutes so no one else can take them while they pay."
          bullets={[
            "Tap to select available seats",
            "Sold and blocked seats clearly marked",
            "Selected seats held for 15 minutes",
            "Released automatically if checkout is abandoned",
          ]}
          media={<PhoneMockup>{<SeatMapScreen />}</PhoneMockup>}
        />
      </section>

      <section className="border-y border-border bg-card py-16 sm:py-24">
        <div className="mx-auto max-w-5xl px-4">
          <SectionHeading eyebrow="Section types" title="Three ways to lay out a venue" />
          <div className="mt-10 overflow-hidden rounded-2xl border border-border">
            <table className="w-full text-left text-sm">
              <thead className="bg-muted/50 text-muted-foreground">
                <tr>
                  <th className="px-5 py-3 font-semibold">Section type</th>
                  <th className="px-5 py-3 font-semibold">How it works</th>
                  <th className="hidden px-5 py-3 font-semibold sm:table-cell">Ideal for</th>
                </tr>
              </thead>
              <tbody>
                {SECTION_TYPES.map((row) => (
                  <tr key={row.type} className="border-t border-border">
                    <td className="px-5 py-4 font-serif font-semibold text-foreground">{row.type}</td>
                    <td className="px-5 py-4 text-muted-foreground">{row.how}</td>
                    <td className="hidden px-5 py-4 text-muted-foreground sm:table-cell">{row.ideal}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:py-24">
        <SectionHeading
          eyebrow="The detail"
          title="Built for real venues and real edge cases"
        />
        <div className="mt-12">
          <FeatureGrid items={SEATING_FEATURES} />
        </div>
      </section>

      <TicketCtaSection />
    </main>
  );
}
