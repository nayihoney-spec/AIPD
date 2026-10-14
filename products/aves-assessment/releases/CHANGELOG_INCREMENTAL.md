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
