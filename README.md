# Eden christian-jobs

Next.js App Router app for Eden jobs search on `eden.co.uk/christian-jobs`. Flat single-app @ repo root.

**Read [`PROJECT_RULES.md`](./PROJECT_RULES.md) first** — single source of truth.

## Docs

| Doc | Purpose |
| --- | --- |
| [`docs/SETUP.md`](./docs/SETUP.md) | Install, env, Vercel |
| [`docs/ARCHITECTURE.md`](./docs/ARCHITECTURE.md) | Flat layout, packages, deploy |
| [`docs/CONTEXT.md`](./docs/CONTEXT.md) | Project brief |
| [`docs/CHANGELOG.md`](./docs/CHANGELOG.md) | Release history |

Fleet shared packages → [v0-template `docs/SHARED_PACKAGES.md`](https://github.com/eden-ecommerce/v0-template/blob/main/docs/SHARED_PACKAGES.md).

## Quick start

```bash
corepack enable
pnpm install
pnpm dev
```

Open [http://localhost:3000/christian-jobs](http://localhost:3000/christian-jobs).

## Scripts

| Command | Purpose |
| ------- | ------- |
| `pnpm dev` | Local development |
| `pnpm build` | Production build (tolerates TS errors during v0 dev) |
| `pnpm ts-check` | Strict TypeScript check |
| `pnpm lint` | ESLint |
| `pnpm predeploy` | **Before deploy** — ts-check + lint + build |
| `pnpm env:pull` | Pull Vercel env → `.env.local` |

## Deployment

Production ships under `app/christian-jobs/`. Eden Worker maps `https://www.eden.co.uk/christian-jobs` → Vercel `/christian-jobs`.

Vercel **Root Directory** = empty (repo root). On failure check dashboard — was monorepo subfolder, now flat.

### Cursor skills

| Skill | When |
| ----- | ---- |
| `/review` | Pre-deploy — build gate + namespace route + docs |
| `/push` | Ship to `main` after review passes |
| `/reimplement` | Rebuild on fresh v0-template if fork structure is broken |
