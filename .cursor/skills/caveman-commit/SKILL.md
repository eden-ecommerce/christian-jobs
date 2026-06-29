---
name: caveman-commit
description: Ultra-compressed Conventional Commits. Subject ≤50 chars; body only when why non-obvious. Triggers write commit, /commit, /caveman-commit.
---

Commit messages terse exact. Conventional Commits. Why > what.

## Subject

* `<type>(<scope>): <imperative>` — scope optional
* Types: feat, fix, refactor, perf, docs, test, chore, build, ci, style, revert
* Imperative: add, fix, remove — not added/adds/adding
* ≤50 chars preferred, cap 72
* No trailing period
* Match project colon caps

## Body (if needed)

Skip when subject self-explanatory.

Add for: non-obvious why; breaking; migration; linked issues.

Wrap 72. Bullets `-`. Issues end: `Closes #42`, `Refs #17`

## Never

* "This commit…", I/we, now, currently
* "As requested…" — use Co-authored-by trailer
* AI attribution unless user rule requires Assisted-by trailer
* Emoji unless project convention
* Restate filename when scope covers it

## Examples

❌ `feat: add a new endpoint to get user profile information from the database`

✅
```
feat(api): add GET /users/:id/profile

Mobile needs profile w/o full user payload — less LTE on cold launch.

Closes #128
```

Breaking:
```
feat(api)!: rename /v1/orders to /v1/checkout

BREAKING CHANGE: /v1/orders → /v1/checkout before 2026-06-01. 410 after.
```

## Auto-Clarity

Always body: breaking; security; data migration; revert.

## Boundaries

Message only — no git commit, no stage, no amend. Code block paste-ready. stop caveman-commit / normal mode → verbose.
