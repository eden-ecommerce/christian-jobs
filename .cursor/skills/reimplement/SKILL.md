---
name: reimplement
description: Rebuild fork on fresh v0-template — no merge, port namespace behaviour only. Triggers /reimplement, fresh start, broken fork structure.
---

# Reimplement

Fork → fresh `v0-template` base. **No merge.** Port namespace route behaviour only.

## Trigger

`/reimplement`, fresh start from template, port namespace routes.

## Walls

| Layer | Where |
|-------|-------|
| Generic UI | `@eden-ecommerce/common` |
| Integrations | `@eden-ecommerce/lib` |
| Feature custom | `$APP_ROOT/components/{domain}/`, `$APP_ROOT/lib/{domain}/`, `$APP_ROOT/app/{NAMESPACE}/{route}/` |

No vendored submodules, workspace kits, or `site-chrome`. Registry pins only.

`APP_ROOT` = `.` (repo root). Flat single-app — no `apps/*` subfolders.

## Intake

`FEATURE`, `NAMESPACE_ROUTE`, `VERSION` (optional). Confirm **reimplement** not merge.

## Phases

1. **Inventory** (read-only) — routes, components, env, integrations; list cruft to delete (workspace packages, duplicate libs)
2. **Fresh base** — latest `v0-template` `main`; set namespace in `constants/app.ts`; `pnpm env:pull` after `vercel link`; `pnpm clean:install` if deps broken
3. **Classify** — generic → common/lib PR; feature-only → `$APP_ROOT`
4. **Port** — `$APP_ROOT/app/{NAMESPACE}/{NAMESPACE_ROUTE}/` + `components/{domain}/` + `lib/{domain}/`; rename vague ported symbols per `.cursor/rules/code-style.mdc` (UK English, self-describing names)
5. **Chrome** — copy template Sanity header/footer stack **and** the checklist below (do not skip)
6. **Verify** — one command:

```bash
pnpm predeploy
```

Update `docs/CONTEXT.md`, `docs/CHANGELOG.md`, `PROJECT_RULES.md` if shape changed.

## Chrome checklist (header/footer)

Copy from v0-template into `$APP_ROOT` when wiring `SanityHeader` / `SanityFooter`:

| What | Source |
|------|--------|
| Wrappers | `components/sanity/*` |
| Defaults | `data/sanity-defaults.ts` (uses `publicAssetPath`) |
| Providers / hooks | `providers/user-beacon-provider.tsx`, `hooks/use-header-search.ts` |
| Layout | `app/layout.tsx` pattern (`SanityHeader`, `SanityPreFooterSection`, `SanityFooter`) |

### CSS — Eden header tokens in `app/globals.css`

`@eden-ecommerce/common` blocks use Eden chrome colours, **not** the namespace jobs theme. After `@theme inline { … }`, include:

```css
--color-primary-700: rgb(39 128 2);
--color-primary-900: rgb(34 90 13);
--color-primary-950: rgb(12 51 0);
--color-copy-300: rgb(209 209 209);
--color-copy-500: rgb(136 136 136);
--color-copy-700: rgb(93 93 93);
--color-copy-800: rgb(79 79 79);
--color-copy-950: rgb(37 37 37);
--color-danger-600: rgb(211 47 47);
```

And the component fallback (info bar uses `bg-primary-900`):

```css
@layer components {
  .header-info-bar {
    background-color: rgb(34 90 13);
  }
}
```

Also: `@import '@eden-ecommerce/common/tailwind.css'` + `@source` scan for common (see template `globals.css`). Keep namespace-specific theme tokens separate — do not remove jobs/brand colours for page content.

### Static assets — copy `public/` chrome files

`sanity-defaults.ts` resolves icons via `publicAssetPath("/assets/sanity/…")` and `publicAssetPath("/StandardLogo.svg")`. These **must** exist under `$APP_ROOT/public/` or header/footer images 404 in dev.

Copy from v0-template `public/`:

- `StandardLogo.svg`
- `assets/sanity/*.svg` (Free, UK, Church, Trustpilot*, SocialProof*, EdenLogoSummer, Facebook, Twitter)

Do **not** point chrome at `site-chrome` or live eden.co.uk paths for these — local `public/` is the template convention.

### `next.config.ts` — image remote patterns

Match template `images.remotePatterns` for Eden CDN + chrome fallbacks:

- `cdn.sanity.io` `/images/**`
- `www.eden.co.uk` `/images/**`, `/staticimages/**`, **`/assets/**`**

Keep `unoptimized: true` on all `next/image` usage per PROJECT_RULES.

## Guidance checklist (do not remove)

Reimplement ports **feature** code only. The template **guidance layer** stays in `$APP_ROOT` as reference — not prod, not CF Worker, Vercel-origin only. Lead by example.

| What | Source in repo root | Why keep |
|------|----------|----------|
| Sandbox hub + gates | `app/sandbox/`, `lib/sandbox/is-sandbox-enabled.server.ts` | Integration health, Sanity/Algolia/beacon debug |
| InstantSearch reference | `components/search/*` | Algolia widget patterns; powers `/sandbox/search` |
| Form patterns | `components/forms/*` | MultiStep/Tab/PartialUpdate; powers `/sandbox/form` |
| Version-route gate | `app/v/layout.tsx` | Pre-promotion iteration scaffold |
| Integrations health | `app/api/integrations/health/`, `hooks/health/`, `components/health/` | API + React Query example |
| CMS panel stub | `components/panels/PanelRenderer.tsx` | Panel mapping placeholder |
| Config + env | `lib/config.ts` `SANDBOX_PATH`, `.env.example` `SANDBOX_ACCESS`, tsconfig `@components/search/*` `@components/forms/*` `@sandbox/*` | Sandbox routes compile and gate correctly |
| Docs + e2e | `docs/`, `e2e/`, `playwright.config.ts` | Onboarding + smoke tests |
| Common helpers | `components/common/IntegrationEnvError.tsx`, `components/location/LocationInitialiser.tsx` | Used by sandbox + search |

**Inventory phase:** When listing cruft to delete, **exclude** the guidance layer above. Only delete workspace packages, vendored submodules, duplicate lib forks, and fork-specific dead code.

**Port phase:** After porting namespace routes, **verify guidance files still exist** in `$APP_ROOT`. Fresh base from `v0-template main` should include them; if the fork dropped them, copy back from template before feature port.

**Package promotion is out of scope** — do not move guidance to common/lib during reimplement. That requires a separate common/lib PR + semver release.

## Verdict

`CLEAN` → run `/review`. `NOT CLEAN` → package wall breach, predeploy fail, chrome checklist incomplete (green info bar / broken header icons), or **guidance checklist incomplete** (missing `/sandbox`, `components/search/`, or `components/forms/`; missing `SANDBOX_PATH` or `lib/sandbox/` gate).

## Boundaries

No auto-commit. No merge fork onto template. After CLEAN → `/review`.
