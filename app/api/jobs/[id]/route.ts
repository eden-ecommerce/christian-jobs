import { NextRequest, NextResponse } from "next/server";
import {
  getJobById,
  getOrganisationById,
  searchJobs,
} from "@lib/algolia/jobs";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, context: RouteContext) {
  const { id } = await context.params;

  try {
    const job = await getJobById(id);
    if (!job) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }

    const org = job.organisationId
      ? await getOrganisationById(job.organisationId)
      : null;

    let similar: Awaited<ReturnType<typeof searchJobs>>["hits"] = [];
    if (typeof job.lat === "number" && typeof job.lng === "number") {
      const res = await searchJobs({
        lat: job.lat,
        lng: job.lng,
        radiusMeters: 80_000,
        hitsPerPage: 6,
      });
      similar = res.hits.filter((j) => j.objectID !== job.objectID).slice(0, 5);
    } else if (job.categoryLvl0) {
      const res = await searchJobs({
        category: job.categoryLvl0,
        hitsPerPage: 6,
      });
      similar = res.hits.filter((j) => j.objectID !== job.objectID).slice(0, 5);
    }

    return NextResponse.json({ job, organisation: org, similarJobs: similar });
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch job" },
      { status: 500 },
    );
  }
}
