## {YYYY-MM-DD} — {Feature} ({VERSION} → prod)

**Promoted:** `/{VERSION}/{FEATURE}/…` → `/{NAMESPACE}/{NAMESPACE_ROUTE}/…`

**Version routes kept:** yes — all `app/v{n}/{feature}/` for comparison

### Summary

- 

### Integrations / env

- 

### Deploy checklist

- [ ] `pnpm predeploy` green
- [ ] no version under `app/{NAMESPACE}/`
- [ ] prod origins `constants/app.ts`
- [ ] `REPLACE` resolved
- [ ] Vercel env synced
- [ ] security P0/P1 clear

### Notes

<!-- handoff, Worker tickets -->
