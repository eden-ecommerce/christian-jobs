# Setup — christian-jobs

Flat Next app @ repo root. Forked from v0-template. No submodules.

## Layout

| Path | Role |
|------|------|
| root `package.json` | Scripts: dev, build, check, env:pull |
| `app/`, `components/`, `lib/` | Deployable Next.js app |
| `constants/app.ts` | Origins + namespace |
| `lib/config.ts` | URL helpers |
| `.env.local` | via `pnpm env:pull` |
| `vercel.json` | Root install + build |

Shared package dev in `eden-ecommerce/common` and `eden-ecommerce/lib` repos. Bump semver pins here after release.

Fleet shared packages → [v0-template `docs/SHARED_PACKAGES.md`](https://github.com/eden-ecommerce/v0-template/blob/main/docs/SHARED_PACKAGES.md).

## Install

```bash
export GITHUB_TOKEN=ghp_...   # read:packages on eden-ecommerce org
pnpm install                  # @ repo root
```

Pins: `@eden-ecommerce/common@0.3.3`, `@eden-ecommerce/lib@0.2.4` from GitHub Packages.

## Vercel + env

```bash
vercel link                   # @ repo root
pnpm env:pull                 # → .env.local @ root
```

See `.env.example` for full var list. Mirror in Vercel Preview + Production.

| Variable | Required for |
| --- | --- |
| `GITHUB_TOKEN` | `read:packages` on Vercel install |
| `NEXT_PUBLIC_NAMESPACE` | `christian-jobs` |
| `NEXT_PUBLIC_PRODUCTION_ORIGIN` | `https://www.eden.co.uk` |
| Sanity / Algolia / Eden API | Per integration — see `.env.example` |
| `SANDBOX_ACCESS` | Optional — expose `/sandbox` on Vercel production |

## Develop

```bash
pnpm dev
```

Open [http://localhost:3000/christian-jobs](http://localhost:3000/christian-jobs).

Sandbox (dev reference): `/sandbox`, `/sandbox/search`, `/sandbox/form`.

## Shared packages

Develop `common`/`lib` in their standalone repos. After release, bump pins in `package.json` → `pnpm install`.

## Pre-deploy

```bash
pnpm predeploy   # ts-check + lint + build
```

See [`docs/ARCHITECTURE.md`](./ARCHITECTURE.md) and [`docs/CONTEXT.md`](./CONTEXT.md).

## Vercel

| Setting | Value |
|---------|-------|
| Root Directory | **empty** (repo root) |
