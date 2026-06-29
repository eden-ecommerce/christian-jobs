# Push — ref

## Identity

```bash
git log -1 --format='author: %an <%ae> | committer: %cn <%ce>'
```

## Rebase conflict

```bash
git status
git add <resolved>
git rebase --continue
# abort: git rebase --abort
```

After app conflict resolution: `pnpm predeploy` (once).

## Package release (separate repos)

`eden-ecommerce/common` / `lib` — tag `common-vX.Y.Z` / `lib-vX.Y.Z`, then bump pins in `$APP_ROOT/package.json` and `pnpm install`.
