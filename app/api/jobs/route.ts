import { NextRequest, NextResponse } from "next/server";
import {
  searchJobs,
  type JobSort,
  type DatePostedFilter,
} from "@lib/algolia/jobs";

function one(value: string | null): string | undefined {
  return value ?? undefined;
}

function multi(searchParams: URLSearchParams, key: string): string[] {
  return searchParams.getAll(key);
}

export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams;

  const latRaw = one(sp.get("lat"));
  const lngRaw = one(sp.get("lng"));
  const lat = latRaw ? Number(latRaw) : undefined;
  const lng = lngRaw ? Number(lngRaw) : undefined;
  const hasGeo =
    typeof lat === "number" &&
    Number.isFinite(lat) &&
    typeof lng === "number" &&
    Number.isFinite(lng);

  const pageRaw = one(sp.get("page"));
  const sortRaw = one(sp.get("sort")) as JobSort | undefined;
  const datePostedRaw = one(sp.get("datePosted")) as DatePostedFilter | undefined;
  const minSalaryRaw = one(sp.get("minSalary"));
  const onlineRaw = one(sp.get("online"));
  const workTypeRaw = one(sp.get("workType")) as
    | "onsite"
    | "hybrid"
    | "remote"
    | undefined;

  let online: boolean | undefined;
  if (onlineRaw === "true") online = true;
  else if (onlineRaw === "false") online = false;

  const workType =
    workTypeRaw ??
    (online === true ? "remote" : online === false ? "onsite" : undefined);

  const query = [one(sp.get("q")), one(sp.get("location"))]
    .filter(Boolean)
    .join(" ")
    .trim();

  try {
    const result = await searchJobs({
      query,
      lat: hasGeo ? lat : undefined,
      lng: hasGeo ? lng : undefined,
      radiusMeters: one(sp.get("radius"))
        ? Number(one(sp.get("radius")))
        : undefined,
      category: one(sp.get("category")),
      uncategorised: one(sp.get("uncategorised")) === "true" ? true : undefined,
      organisationType: one(sp.get("org")),
      organisationTypes: multi(sp, "organisationType").length
        ? multi(sp, "organisationType")
        : one(sp.get("org"))
          ? [one(sp.get("org"))!]
          : undefined,
      contractTypes: multi(sp, "contractType").length
        ? multi(sp, "contractType")
        : undefined,
      denominations: multi(sp, "denomination").length
        ? multi(sp, "denomination")
        : undefined,
      minSalary: minSalaryRaw ? Number(minSalaryRaw) : undefined,
      datePosted: datePostedRaw,
      workType,
      sort: sortRaw ?? (hasGeo ? "distance" : "date_desc"),
      page: pageRaw ? Math.max(0, Number(pageRaw) - 1) : 0,
      hitsPerPage: one(sp.get("pageSize"))
        ? Number(one(sp.get("pageSize")))
        : 20,
    });

    return NextResponse.json(result);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch jobs", configured: false },
      { status: 500 },
    );
  }
}
