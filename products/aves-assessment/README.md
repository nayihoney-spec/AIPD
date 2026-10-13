# Aves Assessment — Product Workspace

Aves Assessment is a configurable multi-tenant B2B digitalization assessment and preliminary quotation platform for regulated life-sciences manufacturing.

## Product operating model
This workspace is governed by the repository-level AIPD v4.0 skill and its seven-role virtual product team. The user-facing collaboration model is a single Product Manager / Product Orchestrator who coordinates Product, Configuration Architecture, UX, Engineering, QA/Validation, and Business/Market review.

## Current scope
- Invite-only multi-tenant customer access.
- Customer assessment flow: requirement → site/production line → process flow → equipment/control → data/automation/SCADA → target schedule.
- Site is the minimum repeatable form unit; each Site owns one or more Production Lines.
- Admin-driven schemas and configuration instead of hard-coded customer forms.
- Requirement Library with Admin-only CRUD.
- Estimation Engine, Completeness Score, Estimate Confidence, and Formal Quote snapshot governance.
- English primary plus Traditional Chinese, Simplified Chinese, French, Japanese, Spanish, Vietnamese and Thai.
- Professional-term display governance and editable language templates.
- Standard API / CRM exchange / MCP readiness; AI Assessment Assistant optional and disabled by default.
- Stable review URL and rollback-first release governance.

## Branch and release model
- `main`: approved stable baselines.
- `develop`: integration and internal QA target once established.
- `feature/*`: isolated increments.
- `release/*`: release candidates.
- Current bootstrap branch: `product/aves-assessment-baseline`.

## Product source of truth
- `docs/PRD_CURRENT_STATE.md`: current approved product baseline and gaps.
- `docs/DECISIONS.md`: decision register; OPEN is not APPROVED.
- `governance/WORK_RULES.md`: release and rollback rules.
- `qa/TEST_PLAN.md`: internal regression plan.
- `releases/CHANGELOG_INCREMENTAL.md`: Added / Changed / Removed history.
- `releases/RELEASE_MANIFEST.md`: version ↔ deployment ↔ rollback mapping.
- `app/index.html`: current executable prototype baseline.

## Deployment baseline
Vercel project: `aves-assessment-portal-preview`

Stable review domain:
`https://aves-assessment-portal-preview-honeys-projects-99c9e78b.vercel.app/`

Do not put credentials, customer-confidential information, production secrets, or plaintext tokens in this public repository.
