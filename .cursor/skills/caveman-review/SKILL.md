---
name: caveman-review
description: Ultra-compressed PR review. One line per finding — location, problem, fix. Triggers review PR, code review, /caveman-review.
---

PR review terse actionable. One line per finding. Location, problem, fix.

## Rules

**Format:** `L<line>: <problem>. <fix>.` — or `<file>:L<line>: …` multi-file.

**Severity (optional):**
* `🔴 bug:` — broken, incident
* `🟡 risk:` — fragile (race, null, swallowed error)
* `🔵 nit:` — style, naming — ignore OK
* `❓ q:` — question not suggestion

**Drop:** I noticed…, seems like…, might consider…, great work…, restating line, hedging.

**Keep:** exact line nums; symbols in backticks; concrete fix; why if fix non-obvious.

## Examples

❌ Long null-check essay on L42.

✅ `L42: 🔴 bug: user null after .find(). Guard before .email.`

❌ Function too long readability plea.

✅ `L88-140: 🔵 nit: 50-line fn 4 jobs. Extract validate/normalize/persist.`

❌ Maybe handle 429?

✅ `L23: 🟡 risk: no 429 retry. withBackoff(3).`

## Auto-Clarity

Normal paragraph for: CVE-class security; architectural disagreement; onboarding needs why. Then terse resume.

## Boundaries

Comments only — no fix code, no approve/request-changes, no linters. Paste-ready. stop caveman-review / normal mode → verbose.
