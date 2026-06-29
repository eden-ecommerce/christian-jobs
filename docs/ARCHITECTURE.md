# Architecture — christian-jobs

Flat single-app @ repo root. Shared package pattern → [v0-template ARCHITECTURE](https://github.com/eden-ecommerce/v0-template/blob/main/docs/ARCHITECTURE.md). Fleet workflow → [SHARED_PACKAGES.md](https://github.com/eden-ecommerce/v0-template/blob/main/docs/SHARED_PACKAGES.md).

## Layout

```text
christian-jobs/
├── package.json              # root scripts
├── vercel.json               # root install + build
├── constants/app.ts          # origins + namespace
├── lib/config.ts             # URL helpers
├── app/christian-jobs/       # prod namespace routes
├── app/api/                  # Vercel-only API
├── app/sandbox/              # Vercel-only guidance
├── components/jobs/          # jobs UI composition
├── lib/jobs/                 # jobs DAL
├── lib/algolia/jobs.ts       # Algolia jobs index
└── lib/blog/                 # blog DAL
```

## Package roles

| Layer | Path | Notes |
|-------|------|-------|
| Deploy app | repo root | Routes, hooks, providers, feature wrappers |
| Jobs feature | `components/jobs/`, `lib/jobs/` | URL-driven Algolia browser — not InstantSearch |
| Blog feature | `app/christian-jobs/blog/`, `lib/blog/` | Sanity GROQ + PortableText |
| Shared UI | `@eden-ecommerce/common` | Props-only — no fetch/env |
| Shared integrations | `@eden-ecommerce/lib` | Eden API, Sanity, Algolia, env guards |

## Deploy

| Setting | Value |
|---------|-------|
| Vercel root | **empty** (repo root) |
| Namespace | `christian-jobs` on CF Worker → `www.eden.co.uk/christian-jobs` |
| Registry | Semver pins in root `package.json` |

Develop shared packages on v0-template. Bump pins here after release.

## Domain traps

| Trap | Rule |
|------|------|
| Jobs search | Server Algolia + URL params + React Query — not InstantSearch (`components/search/` = sandbox guidance only) |
| Blog vs jobs | `lib/blog/` ≠ `lib/jobs/` — don't cross-wire |
| Sandbox/version | Vercel origin only — gated via `lib/sandbox/is-sandbox-enabled.server.ts` |
| API routes | `app/api/*` at root — not under namespace |
