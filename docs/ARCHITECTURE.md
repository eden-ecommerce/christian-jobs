# Technical Handoff Document: Eden E-commerce Architecture

This document summarises the architectural decisions and repository structures established to unite 10+ client projects under a single, un-driftable, high-speed development workflow.

---

## Core Philosophy: 100% Generic & Presentational

To maximise reusability across diverse applications, we have stripped out all domain-specific language (e.g., "product", "blog", "user").

* **Zero Business Logic:** Components are purely visual ("dumb"). They do not fetch data or read from application global state.
* **Data Flow:** All content, loading states, and event callbacks are injected from the consumer application down into the component via **props**.

---

## Repository layout (`v0-template`)

```text
v0-template/                          # Template + platform client (private Git repo)
├── README.md                         # Entry point → docs index
├── pnpm-workspace.yaml               # apps/client only
├── package.json                      # Root scripts: dev, build, lint, ts-check
├── .npmrc                            # @eden-ecommerce → GitHub Packages
├── PROJECT_RULES.md                  # Always-on traps (like .cursor/rules)
├── docs/
│   ├── SETUP.md                      # Fork, env, Vercel
│   ├── ARCHITECTURE.md               # This file
│   ├── CONTEXT.md                    # Project brief (/review)
│   ├── CHANGELOG.md                  # Release history on main
│   └── research/                     # Integration handoffs, retrospectives
└── apps/
    └── client/                       # template-project — deployable Next.js app
```

Each GitHub project (`v0-template`, `eden-ecommerce/common`, `eden-ecommerce/lib`, and every client fork) should carry the same doc skeleton: `README.md` (entry point), `docs/SETUP.md`, `docs/ARCHITECTURE.md`, `PROJECT_RULES.md`, `docs/CONTEXT.md`, `docs/CHANGELOG.md`, `docs/research/`. Package repos (`common`, `lib`) also carry local `.cursor/rules` + skills.

Shared packages are **not** vendored in this repo. They resolve from GitHub Packages:

| npm package | Source repo |
|-------------|-------------|
| `@eden-ecommerce/common` | `eden-ecommerce/common` |
| `@eden-ecommerce/lib` | `eden-ecommerce/lib` |

### Package responsibilities

| Package | Contains | Does NOT contain |
|---------|----------|------------------|
| `@eden-ecommerce/common` | `ui/`, `fields/`, `blocks/` — props-only | Fetch, env, React Query, Eden session, Formik |
| `@eden-ecommerce/lib` | `eden/`, `sanity/`, `algolia/`, `user-beacon/`, utilities | Page routes, layout wiring, namespace, React components |
| `apps/client` | `app/{NAMESPACE}/`, hooks, providers, `components/{domain}/` wrappers | Duplicated integration logic |

**Subpath exports** on `@eden-ecommerce/lib` — apps import only what they need:

```json
"exports": {
  "./eden/fetch-client": "./src/eden/fetch-client.ts",
  "./user-beacon": "./src/user-beacon/get-user-beacon.ts",
  "./sanity/get-header": "./src/sanity/get-header.ts",
  "./constants/sanity": "./src/constants/sanity.ts"
}
```

Client-only deploy config lives in `apps/client/constants/app.ts` (`NEXT_PUBLIC_PRODUCTION_ORIGIN`, `NEXT_PUBLIC_DEV_ORIGIN`, `NEXT_PUBLIC_NAMESPACE`). URL helpers live in `apps/client/lib/config.ts` (`NAMESPACE_PATH`, `apiUrl`, `assetUrl`).

### Component tiers (client project)

| Tier | Location | Examples |
|------|----------|----------|
| **common package** | `@eden-ecommerce/common` | `ErrorCard`, `Input`, `Label`, `Button` |
| **lib package** | `@eden-ecommerce/lib` | Zod schemas, Algolia/Sanity getters, `env-configured` |
| **Client wrappers** | `apps/client/components/{domain}/` | `IntegrationEnvError`, `MultiStepForm`, search stack, Sanity chrome |
| **Route biz** | `app/{route}/_components/` | Providers, sections, schemas for one route |
| **Sandbox demos** | `app/sandbox/_components/` | Hub shell, integration debug, demo forms |

Wrapper components that wire lib + common stay in `apps/client/components/`. Pure presentational primitives may eventually move to `@eden-ecommerce/common` via semver release (candidates: `FilterBadgePrimitive`, `FormField`).

---

## Component directory structure (`@eden-ecommerce/common`)

```text
node_modules/@eden-ecommerce/common/src/
├── foundations/     # Typography, Colors, Icons
├── layout/          # Grid, PageLayout
├── fields/          # Input, Select, Checkbox, Label
├── ui/              # Button, Badge, cards (Standard, Split, Overlay)
├── text/            # PortableText, MarkdownText
├── media/           # ImageLoader, VideoLoader, MapLoader (slot pattern)
└── blocks/          # Carousel, Header, Footer, DesktopMegaNav
```

### Header / footer split

```text
apps/client layout
  → @eden-ecommerce/lib/sanity/get-header + get-footer   (GROQ, Zod, edenLink resolver)
  → @eden-ecommerce/common/blocks/Header + Footer (presentational)
  → apps/client/components/sanity/SanityHeader + SanityFooter   (server fetch + static fallbacks)
```

---

## Hybrid distribution model

Three tiers: **isolated source repos** → **GitHub Packages** → **client deploys**.

| Tier | Repo / artefact | Role |
|------|-----------------|------|
| Source | `eden-ecommerce/common`, `eden-ecommerce/lib` | Git history, publish on tag |
| Registry | `@eden-ecommerce/common@x.y.z`, `@eden-ecommerce/lib@x.y.z` | Semver distribution to 20+ clients |
| Platform / template | `eden-ecommerce/v0-template` | `apps/client` + registry pins — same model as client apps |
| Client apps | One repo per product | Thin `apps/client` shell — registry pins only |

```text
common repo ──tag publish──► GitHub Packages ──pnpm install──► v0-template @ 0.2.0
lib repo    ──tag publish──► GitHub Packages ──pnpm install──► client-jobs @ 1.2.0
```

| Repo | Visibility | Purpose |
|------|------------|---------|
| `eden-ecommerce/common` | Private repo, restricted package | Design system — edit in `common` repo |
| `eden-ecommerce/lib` | Private repo, restricted package | Integrations — edit in `lib` repo |
| `eden-ecommerce/v0-template` | Private | Reference client + sandbox demos |

### Developing shared packages

Edit in `eden-ecommerce/common` or `eden-ecommerce/lib` — not in `v0-template`. For local hot reload across sibling repos:

```bash
# From v0-template root — expands workspace to ../common and ../lib
./scripts/dev-workspace.sh
pnpm dev
```

Before merging to `main` or deploying on Vercel, restore registry pins:

```bash
./scripts/use-registry-deps.sh
```

Layout on disk (dev branch):

```text
eden-ecommerce/template/
├── v0-template/     # deploy root — pnpm-workspace includes ../common, ../lib in dev
├── common/
└── lib/
```

On `main`, `pnpm-workspace.yaml` lists only `apps/client` and `package.json` pins semver from GitHub Packages — Vercel has no sibling repos.

`apps/client/next.config.ts` sets `outputFileTracingRoot` for the expanded workspace. `transpilePackages` includes `@eden-ecommerce/common` and `@eden-ecommerce/lib` so raw `.ts` exports hot-reload under `pnpm dev`.

`tsconfig.json` maps `@lib/*` and `@eden-ecommerce/*` into `node_modules/@eden-ecommerce/*/src/*`. Restart the TS server after `pnpm update` if paths look stale.

### Release and client upgrade

1. Edit in `common` or `lib` repo → update `docs/CONTEXT.md` + `docs/CHANGELOG.md`
2. Bump `version` → publish per package repo [`docs/RELEASE.md`](https://github.com/eden-ecommerce/common/blob/main/docs/RELEASE.md) → tag `common-vX.Y.Z` or `lib-vX.Y.Z`
3. GitHub Action publishes to GitHub Packages (or `pnpm release` locally)
4. Consumers bump: `pnpm update @eden-ecommerce/common@X.Y.Z` and `@eden-ecommerce/lib@X.Y.Z`

**Safety:** Push to `common`/`lib` `main` does not change live clients until they bump semver pins.

### Commit message convention

| Where | Format | Example |
|-------|--------|---------|
| `common` repo | `feat(ui):`, `fix(blocks):` | `feat(blocks): add OverlayCard badge slot` |
| `lib` repo | `feat(sanity):`, `feat(user-beacon):` | `feat(user-beacon): add session metadata fetch` |
| `apps/client` | `feat(blog):`, `chore:` | `feat: add sandbox page under namespace` |
| Client dep bump | `chore(deps):` | `chore(deps): bump lib to 0.2.0` |

---

## Git commit identity

| Field | Value |
|-------|-------|
| **Author** | `Cursor Agent` or `Vercel` — who generated the diff |
| **Committer** | User's `git.config user.name` / `user.email` — who approved the commit |
| **Trailer** | `Co-authored-by:` optional for human pairing |

Example (committer comes from your git config; never run `git config` from automation):

```bash
git commit \
  --author="Cursor Agent <cursor@cursor.com>" \
  -m "feat: add search filters"
```

Vercel bot commits on GitHub UI are separate from local push authorship.

---

## Cursor worktrees and version routes

Experimental feature work stays off `main` and off namespace routes until `/review` promotion.

1. **Cursor worktree** — agent builds on an isolated branch/worktree ([Cursor worktrees docs](https://cursor.com/docs/configuration/worktrees)).
2. **Version routes** — code lives under `app/v{n}/{feature}/` with URL `/v{n}/{feature}/subroute?params`.
3. **User review** — preview on Vercel; user merges worktree PR when satisfied.
4. **Promotion** — `/review` moves `app/v{n}/{feature}/` → `app/{NAMESPACE}/{feature}/`; updates `docs/CONTEXT.md` + `docs/CHANGELOG.md`.

Never ship experimental code under `app/{NAMESPACE}/` until promotion. Version routes are Vercel-origin only (gated like sandbox via `app/v/layout.tsx`).

---

## Deployment (Vercel — repository root)

Vercel links to the **monorepo root** (`v0-template/`). Root [`vercel.json`](../vercel.json) runs `pnpm install --frozen-lockfile` and `pnpm build` — **no git submodules on deploy**.

| Setting | Value |
|---------|-------|
| Root Directory | `.` (repository root) |
| Install Command | `pnpm install --frozen-lockfile` (via `vercel.json`) |
| Build Command | `pnpm build` (via `vercel.json`) |
| Framework | Next.js |

Set `GITHUB_TOKEN` (`read:packages`) in the Vercel project dashboard. Root [`.npmrc`](../.npmrc) resolves `@eden-ecommerce/*` from GitHub Packages.

**Why repo root:** `apps/client` depends on `@eden-ecommerce/common` and `@eden-ecommerce/lib`. Install runs from the monorepo root with workspace layout.

### v0.dev preview

* All repos and packages are **private** — v0 cannot install `@eden-ecommerce/*` without an org token.
* Edit shared UI/integrations in `common` / `lib` repos; use `./scripts/dev-workspace.sh` for local preview.

### Cloudflare Worker + namespace

`apps/client/constants/app.ts` sets origins and namespace from env; `apps/client/lib/config.ts` re-exports `NAMESPACE` / `NAMESPACE_PATH` and URL helpers. The worker proxies only `/{NAMESPACE}/*` to this deployment. Sandbox routes at `/sandbox/*` and version routes at `/v{n}/*` are served on the Vercel origin only (gated via `getSandboxAccess()`).

---

## Namespace routing

User-facing app pages live under `app/{NAMESPACE}/` (e.g. `app/REPLACE/` until renamed). Exceptions:

- `app/api/*` — route handlers
- `app/sandbox/*` — Vercel-only integration testing (not proxied through the worker)
- `app/v{n}/*` — versioned design iteration (gated like sandbox; `app/v/layout.tsx`)

`app/page.tsx` redirects to `NAMESPACE_PATH`.

### Sandbox and version routes (Vercel origin only)

Routes under `app/sandbox/`:

| Route | Purpose |
|-------|---------|
| `/sandbox` | Integration health check — Sanity, user beacon, Algolia |
| `/sandbox/form` | Form patterns: partial update, tab form, multi-step |
| `/sandbox/search` | Algolia InstantSearch example |

`app/sandbox/_components/` holds shared sandbox UI (health hub shell, debug primitives). `app/sandbox/_sections/` holds per-integration health sections. `app/sandbox/form/_components/` holds form demo wiring. Generic composition lives in `apps/client/components/{domain}/` (`forms/`, `search/`, `location/`, etc.). Field primitives come from `@eden-ecommerce/common`.
