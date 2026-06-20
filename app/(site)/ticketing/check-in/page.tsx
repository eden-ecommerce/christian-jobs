import type { Metadata } from "next";
import { SectionHeading } from "@components/event-manager/SectionHeading";
import { FeatureGrid } from "@components/event-manager/FeatureGrid";
import { PhoneMockup } from "@components/event-manager/PhoneMockup";
import { PageHeader } from "@components/ticketing/PageHeader";
import { SplitSection } from "@components/ticketing/SplitSection";
import { TicketCtaSection } from "@components/ticketing/TicketCtaSection";
import { DoorCheckinScreen } from "@components/ticketing/screens";
import { tkHref } from "@components/ticketing/tk-config";
import {
  KeyRound,
  ScanQrCode,
  Keyboard,
  WifiOff,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Smartphone,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Check-in",
  description:
    "Check people in without the chaos — QR scanning for staff, a door PIN for volunteers with no login, manual entry, offline support and real-time attendance.",
  alternates: { canonical: `https://www.eden.co.uk${tkHref("/check-in")}` },
};

const CHECKIN_WAYS = [
  { icon: ScanQrCode, title: "Staff QR scanning", description: "Admins and staff scan QR codes from the admin panel or the mobile app, or search by name or order number." },
  { icon: KeyRound, title: "Volunteer door PIN", description: "Generate a PIN, send volunteers to /tickets/door on any phone, and they have a full scanner — no login, no admin access." },
  { icon: Keyboard, title: "Manual entry", description: "Camera not cooperating? Enter the 8-character code by hand, or find the attendee in the list and mark them in." },
];

const RESULTS = [
  { icon: CheckCircle2, tone: "text-primary", title: "Valid, not checked in", body: "Green confirmation with the attendee's name and ticket type." },
  { icon: AlertTriangle, tone: "text-chart-4", title: "Already checked in", body: "A clear alert that prevents duplicate scans of the same ticket." },
  { icon: XCircle, tone: "text-destructive", title: "Invalid code", body: "An alert for wrong-event, fraudulent or voided tickets that can't be admitted." },
];

const RESILIENCE = [
  { icon: WifiOff, title: "Works offline", description: "The door app keeps scanning without a connection and syncs to the check-in record once connectivity returns." },
  { icon: Smartphone, title: "Multiple doors at once", description: "For large events, volunteers on every entrance can use the same PIN simultaneously, all syncing to one record." },
  { icon: ScanQrCode, title: "Mobile app scanning", description: "Staff with the right role use the app's built-in scanner — no separate scanning app to download or manage." },
];

export default function CheckInPage() {
  return (
    <main>
      <PageHeader
        eyebrow="Check-in"
        title="On the door, without the chaos"
        description="No spreadsheets, no clipboards. Check-in that any volunteer can operate in minutes — designed for the way churches and charities actually staff their events."
      />

      <section className="mx-auto max-w-7xl px-4 py-16 sm:py-24">
        <SplitSection
          eyebrow="The door PIN"
          title="Volunteers up and running in minutes"
          description="Not every volunteer needs full admin access. An admin generates a short PIN for the occasion; volunteers enter it on any smartphone and immediately have a fully functional QR check-in tool — and nothing else."
          bullets={[
            "No accounts or training for door volunteers",
            "Scan, manual entry and live attendee list",
            "Real-time checked-in and expected counts",
            "Voided tickets are refused automatically",
          ]}
          media={<PhoneMockup>{<DoorCheckinScreen />}</PhoneMockup>}
        />
      </section>

      <section className="border-y border-border bg-card py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4">
          <SectionHeading eyebrow="Three ways to check in" title="Whatever suits your team and your door" />
          <div className="mt-12">
            <FeatureGrid items={CHECKIN_WAYS} />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:py-24">
        <SectionHeading
          eyebrow="What a scan tells you"
          title="Clear answers in a fraction of a second"
        />
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {RESULTS.map(({ icon: Icon, tone, title, body }) => (
            <div key={title} className="rounded-2xl border border-border bg-card p-6">
              <Icon className={`size-7 ${tone}`} />
              <h3 className="mt-4 font-serif text-lg font-semibold text-foreground">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-t border-border bg-accent/30 py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4">
          <SectionHeading
            eyebrow="Resilient by design"
            title="Built for the realities of event day"
          />
          <div className="mt-12">
            <FeatureGrid items={RESILIENCE} />
          </div>
        </div>
      </section>

      <TicketCtaSection />
    </main>
  );
}
