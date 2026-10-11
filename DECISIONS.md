# AIPD v4.0 Decision and Conflict Register

| ID | Status | Decision / conflict | Safe interim behavior |
|---|---|---|---|
| ARCH-001 | APPROVED | Shared Core, Dual Product Editions | Design common domain contracts; no application code generation without separate authorization |
| VERS-001 | OPEN | Unlimited templates/drafts/history vs five-version restore rule | Preserve all audit/release records; no destructive cleanup |
| ACCESS-001 | OPEN | Cross-org summaries vs tenant isolation and PMO visibility | Explicit authorization only; no cross-tenant disclosure |
| SIGN-001 | OPEN | PM release signature, delegation and system-admin powers | No automatic signoff or bypass |
| EDITION-001 | OPEN | Shared vs edition-specific capabilities and offline acceptance | Keep feature flags unimplemented pending definition |

## Role arbitration
PM owns what and why; Configuration Architect owns semantics and reuse; UX owns user journeys; Engineer owns feasibility; QA owns verification evidence; Business owns commercial analysis; Orchestrator owns coordination and escalates conflicts. None can independently approve production release or user-reserved decisions.
