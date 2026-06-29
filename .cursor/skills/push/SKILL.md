---
name: push
description: Git ship to main — fetch, commit, rebase, push. Triggers /push, commit and push, sync remote. Never without explicit user ask.
---

# Push

## Trigger

`/push`, push to main, commit and push.

## Commit identity

| Field | Value |
|-------|-------|
| Author | `Cursor Agent` or `Vercel` |
| Committer | Human (`git config`) |

Never `git config`. Agent commits: `--author="Cursor Agent <cursor@cursor.com>"`. Verify committer after: `git log -1 --format='%cn <%ce>'`. Block if committer ≠ user.

## Workflow (repo root)

1. `git status` + `git diff` — summarise; exit if clean and up to date
2. `git fetch origin`
3. Commit if needed — stage no secrets; Conventional Commits; user confirms message unless given
4. `git pull --rebase origin main` (or named branch)
5. Conflicts → resolve → `git rebase --continue`; if app code touched → `pnpm predeploy` once before push
6. `git push origin main`

## Guards

No force-push `main`. No `--no-verify` unless user asks. No amend unless user rules allow.

## Ref

[reference.md](reference.md)
