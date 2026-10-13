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
