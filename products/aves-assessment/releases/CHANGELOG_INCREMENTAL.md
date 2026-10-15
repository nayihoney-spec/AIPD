# Incremental Change List

## 2026-10-12 — Requirement Library Admin CRUD

### Added
- Admin-only **Actions** column in Requirement Library.
- **Edit** action for each Requirement.
- **Delete** action for each Requirement with confirmation.
- Add/Edit reuse the same Requirement modal.
- Requirement changes persist in browser storage in the prototype.
- Work Rules / Change Safety panel under Pricing & Rule Versions.
- Stable preview-address policy and rollback rules.

### Changed
- Requirement add/edit/delete now immediately re-renders Customer Assessment Q1 and recalculates the draft estimate/completeness state.
- Requirement table action labels follow the selected interface language.

### Removed
- Nothing outside the Requirement Library workflow.

### Rollback target
- `index.pre_requirement_actions.html`
- Previous stable deployment remains available for direct rollback/redeployment.


## 2026-10-12 — Work Rules formalized

### Added
- Dedicated `WORK_RULES.md` governing stable baselines, incremental releases, rollback-first recovery, user-selectable partial rollback, release identity, stable URL behavior, migration safety, quote immutability, language-regression checks, and release decision records.

### Changed
- README now points to the dedicated Work Rules as the authoritative release-safety policy.

### Removed
- No product behavior changed.

### Rollback target
- Documentation-only change; product runtime remains the current stable release.

## 2026-10-13 — Repository baseline under AIPD

### Added
- Aves Assessment product workspace under `products/aves-assessment`.
- Current application baseline.
- PRD current state, decisions, Admin/User manuals.
- AIPD seven-role team operating model.
- QA regression plan.
- API/CRM/MCP/AI baseline.
- Version and release manifest.

### Changed
- Product development is now governed through Git version history instead of conversation-only artifacts.

### Removed
- Nothing from the running Vercel product.

### Rollback target
- The previous stable Vercel production deployment remains unchanged during repository bootstrap.


## 2026-10-14 — Q3 Process Flow mapping (development candidate)

### Added
- Site / Production Line context selector in Customer Assessment Q3.
- Line-scoped Draft Process Flow storage.
- Admin Process Template CRUD-style controls: add, edit, duplicate, enable/disable, delete.
- Template-in-use deletion guard.
- Q3 mapping card in Assessment Question Mapping.
- Eight-locale UI strings for the new Q3 controls.
- Process Flow missing-information contribution to Completeness / Confidence.

### Changed
- Customer Process Flow is no longer one global list shared by every Production Line.
- Applying a template copies steps into the selected line Draft instead of mutating the master template.

### Removed
- No approved Q1/Q2 behavior removed.

### Unchanged
- Current Production deployment and stable review URL.
- Q4 Equipment data model, Q5 Data/SCADA schema and Q6 Target Schedule schema remain separate future increments.

### Rollback target
- Branch base: `product/aves-assessment-baseline` at repository bootstrap baseline.
- Production runtime remains the previous stable Vercel deployment until this candidate is approved.


## 2026-10-14 — External Beta backend foundation

### Added
- Node/Express REST backend and Vercel function entrypoint.
- Neon PostgreSQL / MySQL-compatible database adapter.
- PostgreSQL and MySQL migration baselines.
- Invite-only login/session APIs and invitation acceptance flow.
- Assessment persistence and Formal Quote snapshot API.
- Admin configuration persistence endpoint.
- Admin-configurable SMTP with encrypted secrets and test-email action.
- Notification queue and scheduled expiry/incomplete reminders.
- Quote-ready notification enqueueing.
- Dockerfile, Docker Compose and interactive Windows/macOS/Linux installers.
- Authenticated official installer ZIP endpoint.
- Installation, SMTP, operations and authorized-distribution manuals.

### Changed
- Release candidate moves from browser-only persistence toward database-backed External Beta operation.
- Cloud data target is APAC Neon PostgreSQL; MySQL remains an application/local compatibility profile.

### Removed
- Nothing from the current approved stable Production alias.

### Unchanged
- AI Assessment Assistant remains disabled by default.
- CRM provider-specific integration remains deferred.
- Production stable alias has not been promoted.

### Rollback target
- Stable Production alias remains the previous approved deployment until the release gate passes.


## 2026-10-15 — External Beta release QA gate (Draft candidate)

### Added
- Read-only GitHub Actions source-integrity workflow for the Aves Assessment product.
- Standalone JavaScript checker supporting default static validation and explicit `--external` release-evidence checks.
- Release evidence checklist definitions and explicit Product Owner approval check.

### Changed
- Missing external-beta evidence now fails closed with a readable error rather than being treated as a passing release.
- Evidence and approval remain unverified; this is not external-beta approval.

### Removed
- Nothing from product runtime, production infrastructure, or existing data.

### Validation
- Script source parsed in an isolated JavaScript syntax check.
- QA branch deployment `dpl_Efi9HDwaiECmYztsVJL9Mq2EYXJ1` is READY. Build readiness is not acceptance testing.
- GitHub Actions has no observed passing run yet.
- Machine-readable NO-GO evidence register is now committed with 12 mandatory gates; all remain unapproved and none have been marked passed. Draft PR remains pending.

### Rollback target
- Discard this isolated feature branch; Production is still `dpl_4mtJw7zSWbnQ6SZbRckvTLqwAMGP`.


## 2026-10-16 — Release evidence gate completeness (isolated QA branch)

### Added
- `releases/external-beta-gates.json` with 12 explicitly pending/blocked evidence items, empty review approvals, and a NO-GO decision. No pass evidence was invented.
- An opt-in manual `workflow_dispatch` control named `external_beta` that invokes the fail-closed `--external` checker. Default pull-request checks remain source-only and read-only.

### Validation and limitations
- The schema has exactly E-001 through E-012; all gates currently lack independent review evidence by design.
- A successful Vercel build or database health check is NOT a product release pass.
- As of the review, Neon main held 0 business tables and the isolated schema-test branch held 13 tables; no migration was applied.
- SMTP, cross-tenant authorization, installer entitlement, initial Admin security, session revocation, server pricing and browser end-to-end tests remain blocked/pending.
- The manual evidence-gate CI execution itself is not claimed successful; once enabled, the expected outcome before clearance is FAIL/NO-GO.

### Rollback target
- Discard this isolated QA branch if needed. Do not change the stable Production alias; retain `dpl_4mtJw7zSWbnQ6SZbRckvTLqwAMGP` as the last observed stable deployment ID, subject to release provenance confirmation.
