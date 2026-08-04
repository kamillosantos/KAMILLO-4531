# /painel Dashboard — #KamilloSantosProtocol 2026.1.0

## Goal
Internal SaaS dashboard at `/painel`, 4 modules, real Turso/Drizzle CRUD (no mock, no Supabase, no auth for now).

## Modules
1. **B2B (Belgos AI)** — Kanban T-04 (OSINT) / T-03 (Decisores) / T-02 (Abordagem 1:1) / T-01 (Handoff). Conversion stats + SDR triage chat. Backed by `leads` (b2b entries) + stage field.
2. **B2C (Motor 101X)** — funnel map (Tripwire R$9,90, order bumps, upsells 1-click), garimpo offer mgmt, gateway webhook history (Hotmart/Kiwify/ClickBank/BuyGoods/Eduzz/Monetizze). Backed by `checkouts` + `campaigns`.
3. **Roboavaliador Pre-Flight** — checklist SPF/DKIM/DMARC/Spam/Tracking, pass/fail green-red, verdict. Backed by `campaigns` preflight fields or dedicated store.
4. **RevOps/Governança** — audit logs, compliance flags (human_in_loop, immutable logs, rls). Backed by `audit_logs`.

## DB tables (Drizzle/Turso)
- `leads` (exists) — add `stage`, `company_signal`, `decisor`, `pain`, `buy_window` optional cols for B2B.
- `checkouts` (new) — gateway, product, tier(tripwire/bump/upsell), amount, status, customer, createdAt.
- `campaigns` (new) — name, type(b2b/b2c), offer/niche, preflight JSON (spf/dkim/dmarc/spam/tracking + verdict), createdAt.
- `audit_logs` (new) — actor, action, entity, entityId, meta JSON, createdAt.

## API (oRPC routes)
- b2b: list leads by stage, move stage, create, stats
- checkouts: list, create, stats (webhook history)
- campaigns: list, create, update preflight, delete
- auditLogs: list, create (auto-log mutations)

## Progress
- [ ] schema additions + db:push
- [ ] API routes
- [ ] painel layout + sidebar
- [ ] B2B Kanban
- [ ] B2C funnel + webhooks
- [ ] Roboavaliador checklist
- [ ] RevOps logs
- [ ] seed sample data
- [ ] build + browser test + deliver
