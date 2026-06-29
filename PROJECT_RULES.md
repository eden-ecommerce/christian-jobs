# PROJECT_RULES

v0: read this first. Hidden Eden stuff AI can't guess from repo alone.

## Deploy

- Cloudflare Worker on eden.co.uk — first URL segment = this app's namespace (`christian-jobs`)
- Set `NEXT_PUBLIC_NAMESPACE=christian-jobs` and `NEXT_PUBLIC_PRODUCTION_ORIGIN` in env (`constants/app.ts`)
- User pages under `app/christian-jobs/`; `app/api/*` stays at root (Vercel-only)
- `assetPrefix` from `ASSET_BASE_URL` in production (`next.config.ts`)
- Header/footer via `components/sanity/*` + `@eden-ecommerce/common` blocks
- Shared integrations → `@eden-ecommerce/lib`; feature code → `lib/jobs/`, `lib/blog/`, `components/`
- No DB — HTTP APIs only, no Prisma or DATABASE_URL
- /api/* CORS locked to https://www.eden.co.uk (`@eden-ecommerce/lib/cors`)
- v0 build tolerates TS errors — run pnpm predeploy before deploy

## Absolute paths

- Root-relative URLs resolve to worker domain — not Vercel origin
- Static assets → @public import or assetUrl() from lib/config
- App API → apiFetch or apiUrl in lib/, hooks/fetch-*.ts, or app/api/
- No raw fetch("/api/…") or hardcoded origins in components
- @alias imports only — no ../ relative paths

## Links + images

- Internal routes include namespace prefix — e.g. `/REPLACE/example` via NAMESPACE_PATH
- Internal nav → NsLink or next/link with full path — not root-relative without namespace
- redirect → use NAMESPACE_PATH or full namespace path
- External links → full https URL
- Images → next/image with unoptimized={true} always
- Static img → @public import — CMS img → assetUrl()

## Before integrations

- Ask user: integrations, namespace, creds, deploy target — before wiring
- Eden/C360 work → curl live spec URLs below before UI or Zod schemas
- Algolia field + facet names from live index — not guesses
- Zod from discovered payloads — .passthrough() for extra fields
- Set all .env.example vars once — don't add incrementally
- Live external API on page → export const dynamic = "force-dynamic"

## Config map

- Deploy origins + namespace → `constants/app.ts` (`NEXT_PUBLIC_*`)
- URL helpers → `lib/config.ts` (`NAMESPACE_PATH`, `assetUrl`, `apiUrl`, `SITE_URL`)
- Private secrets → `getServerEnv()` from `@eden-ecommerce/lib/env-server` — server only
- Eden platform API → `@eden-ecommerce/lib/eden/fetch` — app API → `apiFetch` + `API_BASE_URL`
- Algolia fields + facets → `lib/algolia/constants.ts` from live discovery
- Secrets in .env or host env — never commit .env

## Spec URLs

Fetch with `curl` before wiring Eden or C360 — paths and response shapes come from the live spec:

```bash
curl -sS "https://www.eden.co.uk/.well-known/openid-configuration"
curl -sS "https://www.eden.co.uk/api/specs/api-endpoints.json"
curl -sS "https://fe0146ea-1dac-4d7d-89f3-127d40ababda:8ba66c2b-adcc-42d8-a772-2572937617d5@api.christian360.com/documentation/json"
```

- Eden OAuth → https://www.eden.co.uk/.well-known/openid-configuration
- Eden API index → https://www.eden.co.uk/api/specs/api-endpoints.json
- C360 OpenAPI → https://fe0146ea-1dac-4d7d-89f3-127d40ababda:8ba66c2b-adcc-42d8-a772-2572937617d5@api.christian360.com/documentation/json
- Algolia → no Eden spec — query live index or dashboard

## Sanity CMS

- Before wiring getters — curl GROQ against Sanity HTTP API to explore documents
- Never hardcode Zod schemas before exploration — shape from live GROQ JSON only
- Prefer fetchSanityDirect in lib/sanity/direct-fetch.ts — Eden proxy is legacy only
- Server creds: EDEN_SANITY_PROJECT_ID, DATASET, API_DEVELOPER_TOKEN in env-server
- Studio URL → parse project ID, dataset, _type, _id from structure links
- Header example: https://cms.eden.co.uk/dc9143c3dc8ee44506ba/next-eden/structure/global;header;a910d86a-938f-4282-89ed-271324205e51

```bash
curl -sG "https://dc9143c3dc8ee44506ba.api.sanity.io/v2021-10-21/data/query/next-eden" \
  --data-urlencode 'query=*[_type == "header"][0]' \
  -H "Authorization: Bearer $EDEN_SANITY_API_DEVELOPER_TOKEN"
```

## Eden cookies

- www.eden.co.uk apps share PHPSESSID + csrft with main shop
- Eden PHP sole csrft issuer — never set or override csrft from Next.js
- Client Eden API → edenFetchClient with credentials: "include"
- Mutating Eden API → edenFetchClient forwards csrft header from cookie
- Server Eden API → edenFetch + M2M OAuth — no session cookies
- NEXT_PUBLIC_EDEN_API_URL → https://www.eden.co.uk/api — not Vercel
- SSR Eden session → forward Cookie via lib/eden/server-session getServerHeaders
- Multi namespace on www → one shared csrft — consume only, never mint

## Data fetching

- data/ — static JSON and fixtures only, not fetch or DAL code
- API fetches live in lib/<integration>/get-*.ts — e.g. lib/sanity/get-header.ts
- No data/Header/ or entity DAL layers — do not recreate
- Extend lib/eden/fetch.ts, lib/sanity/direct-fetch.ts, lib/algolia/* — don't duplicate
- RSC → import @lib/* — wrap getters in React.cache() inside lib file
- Client Algolia → lib/algolia + components/search directly
- Other client data → React Query → apiFetch → app/api → lib fetch
- Never import server-only lib into "use client" files
- RSC can call lib getter → skip API route

## Cache

- Server lib getters → React.cache() per-request dedup in RSC
- Client data → React Query in hooks/ only
- Sanity SSR → keep next.tags + revalidate in lib/sanity/direct-fetch.ts
- Editing Sanity fetches → extend cache tags — don't strip them
- Draft/preview Sanity → preview token + draftMode — dev only (`lib/sanity/draft-preview.server.ts`); production always `published`

## Integrations

- Sentry reactComponentAnnotation.enabled must stay false with Algolia InstantSearch
- Sentry import from @sentry/nextjs only — separate SENTRY_PROJECT per app
- SENTRY_DATASET "eden-test" = dev/preview — "eden" = production
- next-design needs GitLab NPM_TOKEN in .npmrc for @christian-360 registry
- next-design subpath imports — paths under */client/* need "use client"

## Ship

- Grep prod HTML for zero root-relative src="/ or href="/_next
- Replace all REPLACE* placeholders before deploy
- Set ASSET_PRODUCTION_ORIGIN + API_PRODUCTION_ORIGIN to real domain
- Eden admin provisions OAuth client + missing secrets
- Run pnpm predeploy before deploy
- Don't invent creds or API response fields

## Live patterns

| Pattern | File |
|---------|------|
| Sanity GROQ + schema discovery | lib/sanity/direct-fetch.ts, lib/sanity/get-header.ts |
| RSC chrome + empty guard | components/common/Navbar.tsx |
| React Query hook quartet | hooks/health/ |
| Async UI guards | components/health/HealthStatusContainer.tsx |
| Algolia InstantSearch | app/REPLACE/search/ |
| Debounced search input | components/search/SearchBox.tsx |
| Sectional form + partial save | components/forms/SettingsForm/ |
| Multistep nav + step safeParse | components/forms/OnboardingForm/, MultiStepForm/ |
| assertNever | lib/assert-never.ts, PanelRenderer, SettingsForm provider |
| Internal links | components/ns-link.tsx |
| Integration env missing | components/ui/ErrorCard.tsx, components/common/IntegrationEnvError.tsx |
| Env configured checks | lib/env-configured.ts, lib/env-configured.server.ts |
| Sanity draft guard | lib/sanity/draft-preview.server.ts |
| CMS panel → UI map | components/panels/PanelRenderer.tsx |
| Settings API + hooks | app/api/settings/, hooks/settings/ |
