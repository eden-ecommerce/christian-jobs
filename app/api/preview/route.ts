import { getServerEnv } from "@lib/env-server";
import { isSanityDraftPreviewAllowed } from "@lib/sanity/draft-preview.server";
import { draftMode } from "next/headers";
import { redirect } from "next/navigation";

// Paths are namespace-relative; Next.js `basePath` prepends /christian-jobs.
const PREVIEW_TYPE_PATHS: Record<string, (slug: string | null) => string | null> = {
  home: () => "/",
  page: (slug) => (slug ? `/${slug}` : null),
};

export const GET = async (request: Request) => {
  if (!isSanityDraftPreviewAllowed()) {
    redirect("/");
  }

  const { searchParams } = new URL(request.url);
  const token = searchParams.get("token");
  const env = getServerEnv();

  if (!token || token !== env.SANITY_PREVIEW_TOKEN) {
    redirect("/");
  }

  const type = searchParams.get("type");
  const slug = searchParams.get("slug");

  if (!type) {
    redirect("/");
  }

  const resolvePath = PREVIEW_TYPE_PATHS[type];
  const url = resolvePath ? resolvePath(slug) : null;

  if (!url) {
    redirect("/");
  }

  const draft = await draftMode();
  draft.enable();

  redirect(url);
};
