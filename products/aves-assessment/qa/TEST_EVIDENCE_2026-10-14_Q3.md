# Test Evidence — Q3 Process Flow Mapping

Candidate: 2026.10.14.1-dev  
Branch: `feature/aves-assessment-q3-process-mapping`  
Preview deployment: `dpl_EKEXmDuuBgbHL1pz3D6SauQKWw73`  
Preview URL: `https://aves-assessment-portal-preview-6i8a7tx0c.vercel.app/`

## Automated/static checks completed
- All inline JavaScript blocks compiled successfully during candidate generation.
- Required feature markers present:
  - q3ContextPanel
  - q3ApplyTemplate
  - q3ProcessMissing
  - q3MappingCard
  - process-template-steps
- Preview deployment state: READY.
- Preview HTTP response retrieved successfully.
- Traditional Chinese Q3 language strings present in deployed artifact.
- Stable production alias checked separately and confirmed not promoted to this Q3 candidate.
- Existing Requirement Library Admin CRUD remains present on the stable alias.

## Functional checks still required before promotion
- Apply each standard template to a selected line.
- Verify one Site / many Lines isolation.
- Verify many Sites / many Lines isolation.
- Add/edit/delete custom Process Steps.
- Verify Admin master template remains unchanged after customer edits.
- Verify template disable behavior.
- Verify in-use delete guard.
- Verify Completeness / Confidence delta.
- Check all eight supported locales visually.
- Check mobile responsive layout.
- Check Q4 Equipment regression.

## Result
Candidate is suitable for internal interactive review only. It is not yet approved for the stable production alias.


## External Beta backend preview evidence
- Old temporary Neon migration was discarded without applying changes.
- Consolidated PostgreSQL migration rebuilt from the release branch and applied successfully to a new temporary Neon branch.
- Temporary branch table count: 13.
- Invitations schema verified to contain `valid_from` and `expires_at`.
- Foreign key / unique constraints inspected for assessment_access, invitations and quote_snapshots.
- Vercel QA project: `aves-assessment-beta-qa`.
- QA deployment: `dpl_BeTmERNWJVq3XSjm9Xe81yPH7K64` — READY.
- `GET /healthz` returned HTTP 200 with `dbDialect=postgres` against the temporary Neon migration branch.
- `/setup` first-run Platform Admin page is reachable.
- `/login` page is reachable.
- Stable Production alias remains unchanged.

### Remaining gate
Do not apply the consolidated migration to Neon main until explicit Product Owner approval. Do not promote the stable external URL until main migration, admin initialization, SMTP test and end-to-end regression pass.
