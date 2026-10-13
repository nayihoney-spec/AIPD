# Aves Assessment — Admin Manual Baseline

## Admin responsibilities
Admin governs configuration; customer users enter only authorized assessment data.

## Platform & Pricing
Use Platform & Pricing to manage:
- Requirements.
- Site and Production Line form schemas.
- Process templates.
- Equipment library.
- Resource/work-unit rates.
- Estimation and complexity rules.
- Completeness weights and confidence logic.
- Pricing versions.
- Language packs, terminology and guidance templates.
- Branding and theme.
- API / CRM / MCP / AI readiness settings.

## Requirement Library
Admin may add, edit, enable/disable and delete configurable Requirements. Customer users may select Requirements but never receive Requirement CRUD controls.

Deleting a Requirement is a consequential configuration change. Before production use, show impact on Draft Assessments and preserve rollback/migration behavior.

## Site & Production Line forms
Site Form Schema and Production Line Form Schema are separate.
Admin can configure field label, key, type, options, required state, enabled state and ordering.

Customer Q2 re-renders from the published configuration. Site remains the minimum repeatable unit.

## Language templates
Default configurable guidance templates:
- English.
- Traditional Chinese.

Admin may edit both and add other supported locales. Missing translations must be detected before production publication; fallback to English is a controlled fallback, not a substitute for language QA.

## Pricing versions
Do not overwrite historical pricing baselines. Publish new effective versions. Formal Quotes keep their original version snapshot.

## Release safety
See `../governance/WORK_RULES.md`.
