# External Beta Release Gate — 2026-10-16 12:00 UTC+8

**Product:** Aves Assessment  
**Repository:** `nayihoney-spec/AIPD`  
**Baseline:** `product/aves-assessment-baseline`  
**Candidate:** `feature/aves-assessment-q3-process-mapping`  
**Status:** NOT READY — release cannot be declared until all P0 gates pass.

## Release acceptance standard

A site returning HTTP 200 is **not** operational readiness. A runnable HTML prototype with browser-local storage is **not** a multi-tenant production system.

| Gate | Evidence to collect | Current status |
|---|---|---|
| G01 External access | Anonymous visitor sees login/invitation entry; protected Admin and assessment data do not leak | BLOCKED — authentication and access enforcement not implemented |
| G02 Account authorization | Cross-tenant negative tests, role, Assessment grant and expiry, deny-by-default behavior | BLOCKED — no production session/RBAC boundary |
| G03 Durable storage | Persist/reload across users/devices, migrations, backup/restore and tenant scoping | BLOCKED — browser-local prototype state |
| G04 Customer workflow | Six steps Q1–Q6 save/reopen with Admin config bidirectional mapping | PARTIAL — Q1–Q3 prototype mapped; Q4–Q6 incomplete |
| G05 Admin configuration | Requirement, forms, process, equipment, rules, pricing, languages and branding versioned and auditable | PARTIAL — prototype controls only |
| G06 Quotation governance | Approved pricing/rule/scope snapshot immutable after issuance and config updates | BLOCKED — current quote snapshot is page-only |
| G07 Notification delivery | Send invitation, access expiry, reminder and quote status using confirmed transport; retry and audit | BLOCKED — provider/credentials not configured; no backend worker |
| G08 Local installation | Clean environment install, first Admin enrollment, migration, service health, restart, backup and recovery | BLOCKED — package not built or tested |
| G09 Manuals | Installation requirements, first run, customer use, Admin configuration and troubleshooting | PARTIAL — preliminary manuals only |
| G10 QA evidence | Automated regression, negative security tests, responsive/browser and i18n testing | PARTIAL — syntax/static checks; interactive security tests outstanding |
| G11 Deployment | Stable alias stays unchanged until sign-off; production smoke + documented rollback | NOT APPROVED |
| G12 Authorized distribution | Define whether GitHub installer is public or private; no embedded secrets/customer data | BLOCKED — distribution policy unresolved |

## Blocking decisions — user authorization required

1. **Cloud persistence and authentication:** database/provider choice, tenant-aware session implementation and production hosting.
2. **Email delivery:** SMTP/provider and sender identity verified for outbound notifications.
3. **Installer distribution:** Public AIPD repo is accessible to everyone. Authorized-only downloads require an approved private distribution mechanism.

Do not silently implement a different production database, authentication policy, email provider, or distribution policy to bypass these gates.

## Minimum QA scenarios

- User A of Organization A cannot read Organization B's assessments, Admin data, exports or quotes even with guessed identifiers or email-domain match.
- Expired, revoked and viewer-only grants cannot write; API and UI both reject unauthorized operations.
- A disabled locale/template does not overwrite existing Formal Quote snapshots or Draft references.
- Multi-site/multi-line Q2–Q4 references remain isolated; test site and line switching explicitly.
- Create/update/reload across browsers persists, with migration and rollback evidence.
- Repeat notification event does not send duplicate emails; retry failures are auditable.
- Local installer re-run is idempotent and preserves existing data/secrets.
- Deployment freeze passes critical-path end-to-end tests before stable alias promotion.

## Go/no-go rule

**NO-GO** if any security, persistence, notification, formal quote, installation, or six-step workflow P0 gate is missing. If time is insufficient for all requirements, report a scope reduction as a new decision request rather than relabeling a static prototype as an operational release.

## Rollback

Last approved Vercel baseline at repository bootstrap: `dpl_CfjTWnxWzppLPWVVuA6Kw34zjbhq`. This remains a documented reference, **not** a guarantee the currently mapped production alias still points to it. Confirm current alias and live deployment immediately before release.

All candidate changes are isolated in a feature branch and Draft PR; do not merge or re-alias without completed test evidence and approval.
