# Aves Assessment — Decision Register

## APPROVED

### ASMT-ARCH-001 — Multi-tenant B2B authorization
Organization, Assessment and user access require explicit grants. Email domain is not an authorization boundary.

### ASMT-ARCH-002 — Site / Production Line structure
Site is the minimum repeatable customer form. Each Site contains one or more Production Lines.

### ASMT-ARCH-003 — Equipment ownership
Each Equipment Instance has one Primary Process Step and may be reused by multiple assessment use cases.

### ASMT-GOV-001 — Quote snapshot
Formal Quotes retain immutable pricing, rule, scope, completeness and confidence snapshots. Later Admin changes do not rewrite issued quotations.

### ASMT-GOV-002 — Rollback-first releases
Every release preserves the previous stable baseline, exposes its incremental delta, records a rollback target and defaults to rollback-first recovery when a release is wrong.

### ASMT-I18N-001 — Language governance
English is primary. Supported UI locales are English, Traditional Chinese, Simplified Chinese, French, Japanese, Spanish, Vietnamese and Thai. Professional terminology is separately governed.

### ASMT-UX-001 — Admin visual configuration
Configuration Studio is a real configuration entry point; list/table screens remain for advanced and bulk editing.

### ASMT-INTEG-001 — API / MCP / AI readiness
Standard API and CRM exchange are architectural requirements. MCP Connections are Admin governed. AI Assessment Assistant is optional and disabled by default.

### ASMT-REPO-001 — Repository placement
Aves Assessment product assets are managed under `nayihoney-spec/AIPD/products/aves-assessment`.

## OPEN
- Production database/provider and deployment topology.
- Authentication implementation for invitation, temporary password/one-time login and session lifecycle.
- Final CRM provider-specific mappings.
- Production AI model/provider and data-egress policy.
- Final commercial resource rates and estimation multipliers.
- Retention period for full audit/release history beyond quick-restore versions.

OPEN is not APPROVED. Stop and ask before implementation when an OPEN item becomes blocking.
