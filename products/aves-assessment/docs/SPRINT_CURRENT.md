# Aves Assessment — Current Sprint

Sprint ID: ASMT-SPRINT-2026-10-14-01  
Status: IN DEVELOPMENT  
Branch: `feature/aves-assessment-q3-process-mapping`  
Baseline: `product/aves-assessment-baseline`

## Sprint goal
Continue the six-step Customer Assessment ↔ Admin Platform mapping, starting with Q3 Process Flow while preserving approved Q1/Q2 behavior.

## Increment 1 — Q3 Process Flow
### Product scope
- Bind Customer Q3 to a selected Site and Production Line.
- Give each Production Line its own Draft Process Flow.
- Use Admin Process Templates as controlled starting baselines.
- Keep customer modifications line-specific.
- Add Admin template lifecycle controls and deletion protection.
- Include missing Process Flow in Completeness / Confidence.

### Explicitly out of scope
- Full Q4 Equipment line scoping.
- Q5 Data/SCADA schema redesign.
- Q6 Target Schedule schema redesign.
- Production database/authentication changes.
- Production alias promotion.

## AIPD role review
- Product Orchestrator: scope isolated to Q3 and release gates enforced.
- Senior Product Manager: Q3 maps to line context and supports template/custom flow.
- Configuration Architect: master template vs Draft instance separated.
- UI/UX: context selector + template action + editable ordered steps.
- Full Stack: prototype persistence remains browser-local; no production claim.
- QA/Validation: multi-site/multi-line, deletion guard, language and regression cases added.
- Business/Market: no pricing-rate or commercial-rule change in this increment.

## Decision gate
No blocking OPEN decision is required for this Q3 prototype increment. Production persistence/auth/API implementation remains blocked by OPEN architecture decisions.


## External Beta release workstream
Target gate: **2026-10-16 12:00 UTC+8**.

Confirmed decisions:
- Neon PostgreSQL approved; APAC/Singapore cloud project selected.
- MySQL compatibility required for local deployment.
- SMTP must be configured from Admin UI.
- Official installer download must be authorization-gated.

Current release blockers:
- Neon schema is prepared/tested on a temporary branch and requires explicit migration-apply approval before main database activation.
- Bootstrap Platform Admin email/password must be configured before external login testing.
- SMTP server credentials must be entered by Admin and test-mail must pass before customer invitation testing.
- Public AIPD repository cannot enforce source-level licensing; official package is gated through Aves authentication.
