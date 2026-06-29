# Changelog

Release history for **christian-jobs** on `main` — feature work, promotions, and deploy notes.

Maintained by `/review` for promotions. Use [`.cursor/skills/review/templates/DEPLOY_CHANGELOG.md`](../.cursor/skills/review/templates/DEPLOY_CHANGELOG.md) for new entries.

---

<!-- Entries appended below, newest first -->

## 2026-06-29 — Restore v0-template guidance layer

**Scope:** Re-align fork with v0-template dev reference after reimplement dropped sandbox/search/forms.

### Summary

- Restored `app/sandbox/` (hub, search, form demos) + `lib/sandbox/is-sandbox-enabled.server.ts`
- Restored `components/search/` (InstantSearch reference) and `components/forms/` (form patterns)
- Restored `app/v/layout.tsx`, `app/api/integrations/health/`, `hooks/health/`, `components/health/`, `components/panels/PanelRenderer.tsx`
- Added `e2e/`, `playwright.config.ts`, `docs/`, `.cursor/rules/` + review/push skills
- Config: `SANDBOX_PATH`, tsconfig path aliases, `SANDBOX_ACCESS` in `.env.example`
- Sandbox search uses `organisationHubJobs` preset; e2e Sanity IDs match fork defaults
- `PROJECT_RULES.md` — sandbox + version-route sections; `PROJECT_HANDOFF.md` marked superseded
- v0-template `reimplement` skill — guidance checklist so future ports keep reference layer

### Deploy checklist

- [x] `pnpm ts-check` green
- [x] `/sandbox`, `/sandbox/search`, `/sandbox/form` load in dev
- [ ] `pnpm predeploy` before next deploy

## 2026-06-29 — Project docs reset

**Scope:** Replace v0-template changelog/context copied during guidance restore.

### Summary

- `docs/CONTEXT.md` — christian-jobs scope, routes, integrations, sandbox
- `docs/CHANGELOG.md` — fresh history starting from this fork (this entry)

## Baseline — christian-jobs production app

**Scope:** Jobs browser + blog feature fork (pre-guidance-restore baseline).

### Summary

- **Namespace** `christian-jobs` under Cloudflare Worker on eden.co.uk
- **Jobs browser** — server-side Algolia (`lib/algolia/jobs.ts`), URL-driven UI (`components/jobs/browser/`), APIs under `/api/jobs/*`
- **Blog** — Sanity GROQ (`lib/blog/`), routes under `app/christian-jobs/blog/`
- **Chrome** — `components/sanity/*`; footer live from Sanity; header static defaults
- **Saved jobs** — `app/christian-jobs/saved/`, `/api/saved`
- Registry pins: `@eden-ecommerce/common@0.3.3`, `@eden-ecommerce/lib@0.2.4`
