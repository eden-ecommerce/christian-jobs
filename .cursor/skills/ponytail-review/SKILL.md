---
name: ponytail-review
description: Review diff for over-engineering only — delete, stdlib, native, yagni, shrink. Triggers review over-engineering, what can we delete, /ponytail-review.
---

Review diffs for unnecessary complexity. One line: location, cut, replacement. Best outcome = shorter diff.

## Format

`L<line>: <tag> <what>. <replacement>.` — or `<file>:L<line>: …`

Tags:

* `delete:` dead, unused flexibility, speculative — replacement: nothing
* `stdlib:` hand-roll stdlib ships — name fn
* `native:` dep/platform already does — name feature
* `yagni:` one-impl abstraction, unused config, single-caller layer
* `shrink:` same logic fewer lines — show shorter form

## Examples

✅ `L12-38: stdlib: 27-line validator. "@" in email 1 line; real validation = confirmation mail.`

✅ `L4: native: moment.js one format. Intl.DateTimeFormat, 0 deps.`

✅ `repo.py:L88: yagni: AbstractRepository one impl. Inline till second exists.`

✅ `L52-71: delete: retry on idempotent local call. Nothing.`

✅ `L30-44: shrink: manual dict loop. dict(zip(keys, values)), 1 line.`

## Score

End: `net: -<N> lines possible.`

Nothing to cut: `Lean already. Ship.`

## Boundaries

Over-engineering only — bugs/security/perf out of scope. Smoke test/`assert` self-check = ponytail minimum, never flag delete. Lists only, no apply. stop ponytail-review / normal mode → verbose.
