---
name: ponytail-audit
description: Repo-wide over-engineering audit — ranked delete/simplify/stdlib/native list. Triggers audit codebase, find bloat, /ponytail-audit. Report only.
---

ponytail-review repo-wide. Scan whole tree not diff. Rank biggest cut first.

## Tags

Same as ponytail-review: `delete:`, `stdlib:`, `native:`, `yagni:`, `shrink:`

## Hunt

Deps stdlib/platform already ships; single-impl interfaces; one-product factories; delegate-only wrappers; one-export files; dead flags/config; hand-rolled stdlib.

## Output

One line ranked: `<tag> <cut>. <replacement>. [path]`

End: `net: -<N> lines, -<M> deps possible.` Nothing: `Lean already. Ship.`

## Boundaries

Over-engineering only — route bugs/security/perf to normal review. Lists, no apply. One-shot. stop ponytail-audit / normal mode → revert.
