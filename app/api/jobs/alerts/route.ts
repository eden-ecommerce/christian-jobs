import { jobAlertSignupSchema } from "@lib/jobs/job-alert.schema";
import { submitJobAlertSignup } from "@lib/jobs/submit-job-alert.server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  let json: unknown;

  try {
    json = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = jobAlertSignupSchema.safeParse(json);

  if (!parsed.success) {
    const emailIssue = parsed.error.flatten().fieldErrors.email?.[0];
    return NextResponse.json(
      { error: emailIssue ?? "Invalid job alert signup" },
      { status: 400 },
    );
  }

  try {
    await submitJobAlertSignup(parsed.data);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { error: "Unable to save your job alert. Please try again." },
      { status: 502 },
    );
  }
}
