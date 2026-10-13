# Aves Assessment Portal — Work Rules

## Release Safety & Rollback Governance

These rules apply to every future UI, configuration, pricing, language, workflow, API, MCP, and AI-assistant change.

1. **Stable baseline before change**
   - Before editing, record the current stable release identifier and preserve the current `index.html` as the rollback baseline.
   - No change may overwrite the only known-good version.

2. **Incremental changes only**
   - Every release must be expressed as an explicit delta: **Added / Changed / Removed / Unchanged**.
   - Unrelated approved functions must remain untouched unless the user explicitly authorizes a broader refactor.

3. **Pre-release comparison**
   - Before publishing, compare the candidate release against the last stable baseline.
   - Check at minimum: customer assessment flow, Admin configuration mapping, language consistency, CRUD actions, estimation/completeness logic, access control, and current stable URL behavior.

4. **Rollback-first recovery**
   - If a new release is wrong or causes a regression, the default recovery action is to restore the previous stable release first.
   - Do not continue stacking fixes on a broken release unless the user explicitly chooses that path.

5. **User-selectable partial rollback**
   - If a release contains multiple independent changes, present the incremental change list and allow the user to choose:
     - keep change;
     - revert change;
     - revise and re-apply change.
   - Partial rollback should be preferred when only one isolated change is wrong and dependencies are safe.

6. **Release version identity**
   - Each published version must have a unique release/version identifier and timestamp.
   - Record the corresponding rollback target and previous stable version.

7. **Stable review URL**
   - Approved releases must publish to the same stable preview/production alias whenever possible.
   - The user should normally only need to refresh the same URL to see an approved update.

8. **No silent destructive migration**
   - Any change that deletes or restructures configured Requirements, Process Templates, Equipment mappings, Pricing Rules, Language templates, or assessment data requires an explicit migration/rollback plan before execution.

9. **Formal Quote immutability**
   - UI rollback, configuration rollback, pricing-rule rollback, or release rollback must never rewrite an already-issued Formal Quote snapshot.

10. **Configuration version compatibility**
    - Draft assessments may move to a newer configuration version according to approved rules.
    - Published/formal records retain their original configuration/pricing snapshot unless a new revision is explicitly created.

11. **Language consistency regression check**
    - Every release that changes visible UI must verify the supported language behavior and must not reintroduce unexplained English text into a selected non-English interface, except governed professional terminology.

12. **Release decision record**
    - For every published change, maintain a concise decision record containing:
      - request / reason;
      - affected module(s);
      - incremental delta;
      - validation performed;
      - stable release identifier;
      - rollback target.

## Default recovery order

1. Identify whether the issue is isolated or systemic.
2. If systemic or uncertain: rollback the stable alias to the previous stable release.
3. If isolated: present the delta list and let the user choose which increment to revert.
4. Validate the restored/revised version.
5. Publish to the same stable URL and record the new release decision.

## Product-manager orchestration addendum
- All Aves Assessment changes pass through Product Manager / Product Orchestrator intake.
- Requirements are decomposed into capability, configuration, workflow, permission, data model, API/event, reporting/AI impact before implementation.
- Before code generation, verify bidirectional Customer UI ↔ Admin configuration ↔ data model ↔ estimation/completeness ↔ quotation mapping.
- Internal QA and documentation synchronization are part of Definition of Done, not optional post-work.
- If implementation scope is uncertain, stop and ask the user rather than widening scope.
