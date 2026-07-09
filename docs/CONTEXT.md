# Project context

> Maintained by `/review`. Merge updates — do not wipe prior sections.

## Project scope

**christian-jobs** — Eden jobs search and discovery on `www.eden.co.uk/christian-jobs`. Flat Next app @ repo root; forked from v0-template.

| Layer | Path | Purpose |
|-------|------|---------|
| Production namespace | `app/christian-jobs/` | Jobs browser, job detail, saved jobs, blog |
| App API | `app/api/` | Jobs search, saved IDs, settings, health, preview, revalidate |
| Feature code | `components/jobs/`, `lib/jobs/`, `lib/algolia/jobs.ts` | URL-driven Algolia jobs search (not InstantSearch) |
| Blog | `app/christian-jobs/blog/`, `lib/blog/` | Sanity GROQ articles + PortableText |
| Site chrome | `components/sanity/` | Header (static defaults), footer + pre-footer (live Sanity when configured) |
| Template guidance | `app/sandbox/`, `components/search/`, `components/forms/` | Dev reference on Vercel origin only — not prod features |

## Namespace and deploy

| Key | Value |
|-----|-------|
| Namespace | `christian-jobs` (`NEXT_PUBLIC_NAMESPACE`) |
| Public path | `/christian-jobs` (`NAMESPACE_PATH`) |
| Production origin | `https://www.eden.co.uk` (`NEXT_PUBLIC_PRODUCTION_ORIGIN`) |
| Hosting | Vercel (repo root); assets via Cloudflare Worker `assetPrefix` in production |
| Registry | `@eden-ecommerce/common@0.3.3`, `@eden-ecommerce/lib@0.2.4` (semver pins in root `package.json`) |

Local env: `pnpm env:pull` → `.env.local` (after `vercel link` @ repo root).

Vercel Root Directory = empty. Needs `GITHUB_TOKEN` with `read:packages` for `@eden-ecommerce/*`. See [`docs/SETUP.md`](./SETUP.md).

## Production routes

| Route | Feature |
|-------|---------|
| `/christian-jobs` | Homepage (v8) — Category/Location hero tabs, Latest + Featured carousels |
| `/christian-jobs/search` | Results browser (split-pane, URL-driven filters, infinite scroll) |
| `/christian-jobs/job/[id]` | Job detail |
| `/christian-jobs/saved` | Saved jobs (localStorage + API) |
| `/christian-jobs/blog` | Blog index |
| `/christian-jobs/blog/[...slug]` | Article detail |

## Integrations

| Integration | Status | Notes |
|-------------|--------|-------|
| Algolia | **Production** | `organisationHub` index, `entityType:job`; server search via `lib/algolia/jobs.ts` + `/api/jobs/*` |
| Algolia (header) | Wired | Eden product search in `SanityHeaderSearch` — separate from jobs browser |
| Sanity CMS | **Partial** | Footer + blog live when env set; header uses static defaults (`getHeader()` disabled pending CMS nav) |
| Eden API / user beacon | Optional | `UserBeaconProvider` in root layout; gated by env |
| Google Maps | Jobs UI | Location filter in jobs browser |
| GTM / Sentry / Termly | Optional | Root layout; env-gated |
| Sanity preview | Dev | `/api/preview` + `SANITY_PREVIEW_TOKEN` |

Default Sanity project/dataset: `dc9143c3dc8ee44506ba` / `next-eden` (override via env).

## Sandbox (Vercel origin only)

| Demo | URL | Purpose |
|------|-----|---------|
| Hub | `/sandbox` | Integration health (Sanity payloads, Algolia probe, user beacon) |
| Search | `/sandbox/search` | InstantSearch reference (`components/search/`) — jobs preset |
| Form | `/sandbox/form` | Form patterns: partial update, tabs, multi-step |

Access: always on in dev; production requires `SANDBOX_ACCESS=public|eden-user`. Gate: `lib/sandbox/is-sandbox-enabled.server.ts`. Links use `SANDBOX_PATH` from `lib/config.ts`.

## Version routes

Scaffold at `app/v/layout.tsx` (same gate as sandbox). Iterate under `app/v{n}/` before `/review` promotion to `app/christian-jobs/`.

| Feature | Version | Version URL | Promoted | Date |
|---------|---------|-------------|----------|------|
| Homepage | v8 | `/v8`, `/v8/search` | `/christian-jobs`, `/christian-jobs/search` | 2026-07-09 |
| Homepage (prior) | v5 | `/v5`, `/v5/search` | was prod until 2026-07-09 | — |
| Homepage experiments | v6–v7 | `/v6`, `/v7` | kept for comparison | — |

## Key conventions

- Jobs search: **server Algolia + URL params + React Query** — not InstantSearch (see `components/jobs/browser/README.md`).
- InstantSearch stack in `components/search/` is **guidance only** (`/sandbox/search`).
- Internal links: `NsLink` or full `NAMESPACE_PATH` prefix.
- Shared integrations: `@eden-ecommerce/lib`; feature logic: `lib/jobs/`, `lib/blog/`.
- Run `pnpm predeploy` before deploy.

## Open items

| Item | Notes |
|------|-------|
| Live CMS header | Re-enable `getHeader()` in `SanityHeader.tsx` when navigationBar is ready |
| `PROJECT_HANDOFF.md` | Superseded — events-era doc; use this file + `PROJECT_RULES.md` |

## Registry pins

| Package | Pin (root `package.json`) |
|---------|----------------------|
| `@eden-ecommerce/common` | `0.3.3` |
| `@eden-ecommerce/lib` | `0.2.4` |

Bump pins after publishing new common/lib versions; run `pnpm install` + `pnpm predeploy`.
