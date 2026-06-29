---
name: review
description: Pre-deploy gate — one pnpm predeploy, namespace route ready, docs. Triggers /review, ready to deploy, sign off.
---

# Review

Pre-deploy gate. **One shell command** by default: `pnpm predeploy`. Use Grep/Read tools for rule checks — no shell greps, no `pnpm audit`, no subagents unless user asks.

**Rules:** `PROJECT_RULES.md` · `.cursor/rules/code-style.mdc` · **Templates:** [templates/CONTEXT.md](templates/CONTEXT.md), [templates/DEPLOY_CHANGELOG.md](templates/DEPLOY_CHANGELOG.md)

## Trigger

`/review`, ready to deploy, sign off, promote version to namespace.

## Intake (BLOCK if missing)

| Field | Key | Default |
|-------|-----|---------|
| Feature | `FEATURE` | ask |
| Namespace route | `NAMESPACE_ROUTE` | ask |
| Version (optional) | `VERSION` | `""` |
| Base branch | `BASE_BRANCH` | `main` |

`APP_ROOT` = `.` (repo root). Flat single-app — no `apps/*` subfolders.

**Prod rule:** ship code lives at `$APP_ROOT/app/{NAMESPACE}/{NAMESPACE_ROUTE}/`. Eden Worker serves that namespace route only (e.g. `https://www.eden.co.uk/{route}` → Vercel `/{route}`).

## Step 1 — Build (only required command)

```bash
pnpm predeploy
```

`predeploy` = ts-check + lint + build. **Stop on fail.** Do not also run `pnpm check` or separate `pnpm build`.

Registry: root `package.json` uses semver pins for `@eden-ecommerce/common` and `@eden-ecommerce/lib` — not `workspace:*` or `file:` on `main`.

## Step 2 — Branch + rules (tools, not shell)

From `git diff` / `git log` vs `BASE_BRANCH` — summarise features, env, routes.

Grep/read (no terminal):

| Check | Block? |
|-------|--------|
| Raw `fetch("/api/` in `$APP_ROOT` | yes |
| Secrets / private creds in tree | yes |
| `app/{NAMESPACE}/.../v{n}/` version under namespace | yes |
| `next/image` without `unoptimized` | fix |
| `PROJECT_RULES.md` / `code-style.mdc` violations (UK English, vague names) | fix |

## Step 3 — Namespace route

- `$APP_ROOT/app/{NAMESPACE}/{NAMESPACE_ROUTE}/` must exist with prod-ready pages
- If `VERSION` set **and** `$APP_ROOT/app/{VERSION}/{FEATURE}/` exists: promote to namespace target; keep all `app/v{n}/` routes; strip version from prod URLs; use `NAMESPACE_PATH` / `NsLink`
- Skip promotion if no version routes in repo

## Step 4 — Docs

- Merge `docs/CONTEXT.md` (template above)
- Append `docs/CHANGELOG.md` entry — British English, themes not file paths

## Step 5 — Re-run build (only if code changed in steps 2–4)

```bash
pnpm predeploy
```

## Verdict

```
predeploy fail → NOT READY
namespace route missing/wrong → NOT READY
P0 rule breach → NOT READY
else → READY TO DEPLOY
```

## User output

```markdown
# Review — {date}

**Verdict:** READY TO DEPLOY | NOT READY — {one-line reason}

## Recommended fixes
- [ ] {theme — no file paths}
```

## Boundaries

* No commit/push — `/push`
* No extra pnpm commands unless fixing failures or user asks
* Reset deps: `pnpm clean:install` (not part of routine review)
