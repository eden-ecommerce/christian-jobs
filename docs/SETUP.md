# Setup — fork template and run locally

## 1. Fork and clone

1. Fork `eden-ecommerce/v0-template` (or use **Use this template**) into your org.
2. Clone the new repo and open it in Cursor.

## 2. What you get

| Path | Purpose |
| --- | --- |
| `apps/client/` | Deployable Next.js app |
| Root `package.json` | Scripts (`dev`, `build`, `lint`, `ts-check`, `predeploy`) |
| `pnpm-workspace.yaml` | `packages: ["apps/client"]` |
| `.npmrc` | GitHub Packages auth for `@eden-ecommerce/*` |
| `vercel.json` | Registry install + build |

Shared packages are **not** in this repo — they install from GitHub Packages:

```json
"@eden-ecommerce/common": "0.2.0",
"@eden-ecommerce/lib": "0.2.0"
```

## 3. Quick setup (recommended)

After cloning your fork:

```bash
corepack enable
pnpm setup
```

`pnpm setup` will:

1. Prompt for your GitHub PAT (`repo` + `write:packages`) and append `export GITHUB_TOKEN=…` to `~/.zshrc` or `~/.bashrc`
2. Run `pnpm install` (resolves `@eden-ecommerce/common` and `@eden-ecommerce/lib` from GitHub Packages)
3. Run `vercel pull --yes` (or `vercel login` first if needed)

### Manual prerequisites (before `pnpm setup`)

1. GitHub account added to the **eden-ecommerce** organisation
2. GitHub PAT (classic): note `v0-project`, scopes **repo** + **write:packages**
3. Vercel account (Google sign-in) with GitHub connected in Vercel settings
4. Invited to **eden-christian-360** team (Developer / v0 Builder) via `vercel-login@eden.co.uk`

Merges to `main` auto-deploy production on Vercel.

### Clean reinstall

```bash
pnpm clean   # removes node_modules, .next, .pnpm-store; reinstalls
```

## 4. GitHub Packages auth (manual fallback)

```bash
export GITHUB_TOKEN=ghp_...   # read:packages on eden-ecommerce org
cp .npmrc.example .npmrc      # if needed
pnpm install
```

See [`docs/ARCHITECTURE.md`](./ARCHITECTURE.md) for the registry model and package upgrade loop.

## 5. Environment variables

```bash
cp apps/client/.env.example apps/client/.env
```

Fill values for integrations you need (Sanity, Algolia, Eden API, etc.). See `apps/client/.env.example` for the full list.

### Vercel project

1. Link the repo: `vercel link` (from repo root).
2. Pull env vars into local `.env`:

```bash
cd apps/client
vercel env pull .env
```

3. **Add the same variables in the Vercel dashboard** (Settings → Environment Variables) for Preview and Production. `vercel env pull` only syncs to your machine — deploys need vars on the Vercel project.

| Variable | Required for |
| --- | --- |
| `GITHUB_TOKEN` | `read:packages` — install `@eden-ecommerce/common` and `@eden-ecommerce/lib` on Vercel |
| Integration vars | Per feature — see `.env.example` |

Remove `VERCEL_GIT_SUBMODULE_STRATEGY` if previously set — deploy uses registry pins only.

## 6. Project customisation

Before first deploy:

1. Set `NEXT_PUBLIC_NAMESPACE`, `NEXT_PUBLIC_PRODUCTION_ORIGIN`, and `NEXT_PUBLIC_DEV_ORIGIN` in env (see `apps/client/constants/app.ts` and `.env.example`).
2. Rename `apps/client/app/REPLACE/` → `apps/client/app/{NAMESPACE}/`.
4. Fill [`docs/CONTEXT.md`](./CONTEXT.md) with project brief, terminology, and integrations.

## 7. Run locally

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) — redirects to your namespace (`/REPLACE` until renamed).

## 8. Pre-deploy check

```bash
pnpm predeploy   # ts-check + lint + build
```

## 9. Git commit identity

Agent-generated commits use **author** = Cursor Agent (or Vercel) and **committer** = your git identity. See [`docs/ARCHITECTURE.md`](./ARCHITECTURE.md) § Git commit identity.

## 10. Developing shared packages

Edit `@eden-ecommerce/common` and `@eden-ecommerce/lib` in their **separate repos** — not in this template. For local hot reload, run `./scripts/dev-workspace.sh` (expands the pnpm workspace to sibling `common`/`lib` and sets `workspace:*`); restore registry pins with `./scripts/use-registry-deps.sh` before merge/deploy. Forked clients (e.g. `eden-blog`) use the same scripts — see that repo's `docs/SETUP.md`. Full release loop in [`docs/ARCHITECTURE.md`](./ARCHITECTURE.md) § Release and client upgrade.
