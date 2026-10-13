# Aves Assessment — Internal Test Plan

## Release gate
A release candidate must pass relevant tests before stable publication.

## Core regression matrix

### Customer flow
- Q1 Requirement choices match Admin Requirement Library.
- Q2 supports one Site/one Line, one Site/many Lines and many Sites/many Lines.
- Q3 Process Flow binds to the correct Site/Line.
- Equipment ownership remains tied to one Primary Process Step.
- Data/Automation/SCADA and Target Schedule inputs affect the intended downstream logic.

### Admin mapping
- Requirement CRUD is Admin-only.
- Site Form Schema and Production Line Form Schema changes re-render Draft Q2 correctly.
- Process/equipment templates retain references.
- Pricing and completeness rules use the published configuration version.

### Access and tenant isolation
- Same email domain does not grant organization access.
- Unauthorized assessments are not visible.
- Valid-from / valid-until rules are enforced in production implementation.

### Language
For all supported locales:
- selected locale remains consistent across Customer and Admin screens;
- professional terms appear only according to policy;
- customer-entered proper names are not machine-translated;
- configurable guidance uses the correct locale template;
- untranslated system text is reported before production publication.

### Estimation
- Completeness and Confidence remain separate.
- Missing information widens risk/uncertainty rather than silently fabricating values.
- Timeline/complexity/resource changes recalculate Draft estimates.
- Formal Quote snapshots remain unchanged after later configuration changes.

### Release safety
- Candidate delta is recorded.
- Previous stable version remains recoverable.
- Stable review alias points only to an approved version.
- Rollback target is documented.

## Current prototype validation
- Static HTML executable baseline.
- Inline JavaScript syntax check required after every visible/logic change.
- No production-readiness claim until persistence, authentication, authorization enforcement and API/data services are implemented and tested.


## Q3 Process Flow mapping regression — 2026.10.14.1
- One Site / one Line: apply template and verify expected ordered steps.
- One Site / multiple Lines: verify each line retains an independent Process Flow.
- Multiple Sites / multiple Lines: switch context and verify no cross-line step leakage.
- Add/edit/delete a customer Process Step and verify the Admin template remains unchanged.
- Duplicate an Admin template and verify a distinct template ID / independent steps.
- Disable a template and verify it is not offered for new application while existing Draft references remain visible.
- Attempt to delete an in-use template and verify deletion is blocked.
- Delete an unused template and verify it disappears from Customer Q3 choices.
- Verify missing Process Flow adds a completeness/confidence gap.
- Run locale checks for English, Traditional Chinese, Simplified Chinese, French, Japanese, Spanish, Vietnamese and Thai on all new Q3 labels/actions.
- Confirm Q4 Equipment behavior is unchanged except that its legacy default process-step reference may reflect the active Q3 flow; full Q4 line scoping remains out of scope for this increment.
