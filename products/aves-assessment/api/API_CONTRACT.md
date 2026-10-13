# Aves Assessment — Standard API Baseline

Target base path: `/api/v1`  
Target format: REST / JSON  
Documentation target: OpenAPI 3.1

## Core resources
- organizations
- users / contacts
- assessments
- assessment-access
- sites
- production-lines
- process-flows / process-steps
- equipment-instances
- requirements
- estimates
- quotes
- configuration-versions
- pricing-versions

## Governance
- Explicit tenant scope on every business request.
- Service authentication is configurable and must not rely on email domain.
- Audit consequential writes.
- Idempotency for retried create/update operations where applicable.
- Version contracts; avoid silent breaking changes.

## CRM exchange
Potential bidirectional:
- Organization.
- Contact.
- Opportunity / Assessment reference.

Potential platform → CRM:
- Assessment progress.
- Completeness / Confidence.
- Estimate / Quote status and metadata.

Provider-specific field mappings remain configurable and are currently OPEN.

## MCP
MCP Connections require:
- Enable / Disable.
- Tool allow-list.
- Tenant scope.
- Audit.
- Credential ownership and masked references.
- No plaintext secrets in product documentation.

## AI Assessment Assistant
Disabled by default. AI may identify missing information, explain terminology and suggest follow-up questions. It may not silently alter controlled scope, pricing rules, completeness rules or Formal Quotes.
