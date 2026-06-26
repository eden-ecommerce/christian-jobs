import { redirect } from "next/navigation";

type SearchParams = Record<string, string | string[] | undefined>;

/** Legacy /search route — redirects to main browser preserving query params. */
export default async function JobSearchRedirect({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const sp = await searchParams;
  const params = new URLSearchParams();

  for (const [key, value] of Object.entries(sp)) {
    if (Array.isArray(value)) {
      for (const v of value) params.append(key, v);
    } else if (value) {
      params.set(key, value);
    }
  }

  const qs = params.toString();
  redirect(qs ? `/?${qs}` : "/");
}
