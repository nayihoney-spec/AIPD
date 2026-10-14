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


## 2026-10-14 — External Beta P0 pre-release QA additions

These checks are required for the external-beta GO decision, and must be supported by repeatable, timestamped evidence before promotion:

- First Platform Admin provisioning: confirm initial registration is restricted to an authorized operator before allowing any external reachability; validate single-initialization behavior and concurrent-request handling. Page availability alone is not sufficient proof of authorization.
- Formal Quote issuance: verify read-only/viewer accounts cannot issue, modify or set the payable estimate of a Formal Quote. Issuance must be restricted to authorized roles, use server-controlled pricing/rules, and persist an immutable complete configuration/rules/scope snapshot.
- Explicit tenant/assessment authorization: verify no cross-organization or cross-assessment access can be gained from email domain, URL changes, or a valid but irrelevant membership.
- Invitation/access periods: confirm not-before, expiry, one-time acceptance, and active assessment grants are honored by both UI and server endpoints.
- Credential safety: verify initial provisioning, email configuration and recovery controls do not reveal credentials or permit unauthorized privilege escalation.
- Session controls: independently verify expiry, account-disable behavior, CSRF protection on state-changing requests, and login abuse/rate limiting.
- Installer entitlement: download must require a current, in-scope authorized grant, and package contents plus Windows/macOS/Linux local install must pass a fresh test.
- SMTP: confirm test delivery, queue processing, failure handling and administrative audit evidence.
- Release traceability: reconcile the actual stable-domain target with the approved release-manifest baseline and capture a reproducible rollback target before external cutover.

Any P0 authorization failure is a NO-GO. Recording a QA deployment as READY does not imply these gates have passed. Keep security-sensitive reproduction details in restricted QA evidence rather than the public source repository.


## 2026-10-14 evening — Source-review follow-up (not an executed penetration test)

Source inspection of the External Beta release candidate identified unresolved release guards requiring negative-test evidence. Track these as **P0 / NO-GO** until fixed and independently retested:

- First Platform Admin enrollment must be operator-restricted and concurrency-safe; do not expose this action to external visitors.
- Formal Quote issuance must require the approved issuer role and a server-owned, versioned pricing/rule calculation. An API-persisted snapshot alone is not commercial approval.
- Invitation not-before times and reassigned access windows must be applied consistently.
- Deactivated accounts must lose existing application sessions; installer entitlement must honor both start and end of an active grant.
- Confirm consistent tenant/assessment scoping, replay controls, and audit evidence across all writes.

**Evidence boundary:** These findings are based on source review, not live security testing. Do not publish sensitive reproduction instructions or attempt unrestricted external onboarding. The current QA deployment remains an internal, access-protected candidate; no production alias or database migration approval is implied.
