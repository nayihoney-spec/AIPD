# Aves Assessment — PRD Current State

Version: 2026.10.14.1-dev  
Status: internal development baseline

## 1. Product objective
Provide a guided customer assessment that converts factory digitalization requirements into a structured scope, information-completeness signal, resource estimate and preliminary quotation range, while allowing Admin users to control forms, rules, pricing, translations and access without code.

## 2. Personas
- Customer contributor: enters authorized assessment information.
- Customer viewer: reads only explicitly granted assessments.
- Sales / Pre-sales: creates opportunities, monitors completion and supports customers.
- Platform Admin: governs schemas, requirements, pricing, rules, language packs, branding and integrations.
- Internal reviewer: validates scope, confidence and quotation readiness.

## 3. Multi-tenant access
Organization, Assessment and User access are explicit authorization objects. Email domain must never grant organization membership, assessment visibility or permissions. Each user grant may define role, section permissions, valid-from and valid-until.

## 4. Customer assessment baseline
1. Requirement — Admin Requirement Library.
2. Site & Production Line — Assessment → Site [1..N] → Production Line [1..N per Site].
3. Process Flow — each Production Line owns its own Process Flow; Admin process templates provide the controlled baseline and customer-specific steps may be added where allowed.
4. Equipment & Control — Equipment instance, controller, interface, protocol and relevant ISA-95 / ISA-88 role.
5. Data / Automation / SCADA — current state, desired state and integration gaps.
6. Target Schedule — target go-live / delivery timing and its estimation impact.

All six sections must map to Admin Platform & Pricing configuration. No customer-facing field should be treated as a permanently hard-coded business rule if it belongs to the configurable assessment schema.

## 5. Admin Platform & Pricing
Admin-governed objects include:
- Requirement Library.
- Site Form Schema.
- Production Line Form Schema.
- Process Template Library.
- Equipment Library.
- Resource Library and Work Units.
- Estimation Rules and Complexity Factors.
- Completeness Rules and Estimate Confidence logic.
- Pricing versions.
- Dashboard and pipeline views.
- User and Access Management.
- Branding, logo and theme.
- Language Packs and Professional Terminology.
- Standard API, CRM mapping, MCP Connections and optional AI Assessment Assistant.

## 6. Data model rules
- Site is the minimum repeatable customer form unit.
- A Production Line belongs to one Site.
- An Equipment Instance has one Primary Process Step.
- The same Equipment Instance may be referenced by multiple use cases such as Data Capturing, Automation, SCADA, Historian, Digital Twin or AI/Model Training.
- Draft assessments may recalculate under a newly published configuration according to approved rules.
- Formal Quotes keep immutable pricing/rule/scope/completeness/confidence snapshots.

## 7. Estimation
Quotation must not be a simple equipment-count × price calculation.

Conceptual model:
Base Project + Site Complexity + Equipment Integration + Automation Engineering + Data Infrastructure + Interfaces + Validation + Deployment + PM + Risk + Timeline Factor.

Admin configures resource rates, work units, rule triggers, multipliers and version effective dates.

## 8. Completeness and confidence
Information Completeness and Estimate Confidence are separate measures.
- Completeness: how much required information is present.
- Confidence: completeness plus technical risk, known/unknown architecture, protocol uncertainty and other estimation risk.

Insufficient information must widen the quotation range and offer Light Consulting rather than blocking all progress.

## 9. Language governance
Supported locales:
English (primary), Traditional Chinese, Simplified Chinese, French, Japanese, Spanish, Vietnamese and Thai.

Selected interface language should remain consistent across the screen. Customer-entered proper names remain as entered. Professional terms may be shown in parentheses according to Platform Default → Organization Override. English and Traditional Chinese templates exist by default for configurable guidance areas; Admin may add supported locales.

## 10. Integrations
Target architecture:
- Standard versioned REST/JSON API; OpenAPI 3.1 target.
- CRM exchange for Organization, Contact, Opportunity/Assessment references, progress, confidence and quote metadata.
- MCP connection governance with enable/disable, allow-list, tenant scope, audit and credential ownership.
- AI Assessment Assistant optional and disabled by default; AI may suggest but must not silently alter controlled scope, pricing or Formal Quotes.

## 11. Capacity baseline
Current target operating profile:
- Customer concurrent sessions: <= 10.
- Internal Admin concurrent sessions: <= 5.

Do not over-engineer V1 for high concurrency without a confirmed requirement.

## 12. Current release governance
Every change must:
- start from a stable baseline;
- be expressed as Added / Changed / Removed / Unchanged;
- pass regression checks;
- preserve a rollback target;
- keep the stable review URL when possible;
- synchronize PRD, manuals, QA evidence, changelog and release manifest.

## 13. Open product backlog
- Continue six-step bidirectional Admin mapping review. Q1, Q2 and Q3 are now explicitly mapped; Q4–Q6 remain the next mapping increments.
- Continue strict language consistency regression across Customer and Admin screens.
- Replace prototype browser storage with production data services before production use.
- Define authentication/session implementation beyond prototype behavior.
- Define persistent configuration version storage and migration model.
- Complete API contract and CRM mapping details.
- Complete internal persona-based QA before any production claim.


## 14. Development increment 2026.10.14.1 — Q3 Process Flow mapping
- Customer Q3 is now scoped to a selected Site and Production Line.
- Each Production Line has its own Draft Process Flow instance.
- Admin Process Template Library provides the starting baseline; applying a template copies its ordered steps into the selected line flow.
- Customer-added/edited/deleted steps modify only that line's Draft flow and do not mutate the Admin template.
- Admin can add, edit, duplicate, enable/disable and delete Process Templates.
- A Process Template referenced by a Draft flow cannot be deleted; it may be disabled instead.
- A missing Process Flow contributes to Information Completeness / Estimate Confidence gaps.
- Current limitation: Q4 Equipment is not yet fully line-scoped; that is the next mapped increment and must not be silently inferred from Q3.


## 15. External Beta backend baseline — 2026-10-14
- Cloud persistence target: Neon PostgreSQL 17 in APAC/Singapore.
- Local database profiles: PostgreSQL 17 (recommended) and MySQL 8.4 compatibility.
- Invite-only authentication, database-backed sessions and explicit Assessment access are implemented in the release branch.
- Platform configuration and Assessment Draft data have REST persistence endpoints.
- Admin-configurable SMTP is implemented with encrypted secret storage.
- Notification queue supports invitation, access-expiry, incomplete-assessment and quote/status events.
- Official local installation package is exposed through an authenticated download endpoint.
- Docker Compose one-click installers are provided for Windows and macOS/Linux.
- Current production alias is not yet promoted; External Beta remains subject to database migration approval, admin bootstrap, SMTP configuration and release QA.
