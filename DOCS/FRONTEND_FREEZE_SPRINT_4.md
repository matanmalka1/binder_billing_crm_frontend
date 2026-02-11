# Sprint 4 Frontend Freeze

- Status: FROZEN
- Date: 2026-02-11
- Commit Hash: `9350883`

## Scope Locked

Sprint 4 frontend scope is locked to:
- Global Search screen (`/search`) with backend-driven filters (`work_state`, `sla_state`, `signal_type`)
- Client Timeline viewer (`/clients/:clientId/timeline`) rendered directly from backend events
- Dashboard Attention panel powered by `GET /dashboard/attention` (render-only)
- Filters integration on Binders (`work_state`, `sla_state`) and Clients (`has_signals`) via API calls only
- Hebrew-only UI with RTL layout and no client-side business logic
