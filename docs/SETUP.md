# Setup — christian-jobs

Standalone Next.js app at repo root. Forked from v0-template.

## Install

```bash
export GITHUB_TOKEN=ghp_...   # read:packages on eden-ecommerce org
pnpm install
```

Pins: `@eden-ecommerce/common@0.3.3`, `@eden-ecommerce/lib@0.2.4` from GitHub Packages.

## Environment variables

After linking the Vercel project (`vercel link` from repo root):

```bash
pnpm env:pull
```

Runs `vercel env pull .env.local` — syncs vars from Vercel into `.env.local`. See `.env.example` for the full list.

Add the same variables in the Vercel dashboard for Preview and Production.

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

## Pre-deploy

```bash
pnpm predeploy   # ts-check + lint + build
```

## Shared packages

Edit `@eden-ecommerce/common` and `@eden-ecommerce/lib` in their separate repos. Bump semver pins in `package.json` after publish.

See [`docs/ARCHITECTURE.md`](./ARCHITECTURE.md) and [`docs/CONTEXT.md`](./CONTEXT.md).
