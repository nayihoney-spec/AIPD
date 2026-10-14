# Aves Assessment — Release Manifest

## 2026.10.13.1-baseline
Status: repository bootstrap / internal baseline  
Repository: `nayihoney-spec/AIPD`  
Path: `products/aves-assessment`  
Branch: `product/aves-assessment-baseline`

### Vercel baseline
Project: `aves-assessment-portal-preview`  
Project ID: `prj_UaBLvSG3r1cJjDKaZTfY2tZ6yj5C`  
Current stable deployment at bootstrap: `dpl_CfjTWnxWzppLPWVVuA6Kw34zjbhq`  
Stable review URL: `https://aves-assessment-portal-preview-honeys-projects-99c9e78b.vercel.app/`

### Validation
- Current HTML imported from the latest approved conversation baseline.
- Repository bootstrap does not change production deployment.
- Formal Quote snapshot behavior remains governed by Work Rules.

### Rollback
Product runtime rollback target remains the previous approved Vercel deployment until a Git-linked release pipeline is explicitly approved.


## 2026.10.14.1-dev
Status: internal development candidate  
Branch: `feature/aves-assessment-q3-process-mapping`  
Scope: Q3 Process Flow ↔ Admin Process Template mapping

### Runtime impact
No Production alias change during development.

### Validation performed
- Incremental-code marker validation.
- JavaScript syntax compilation for all inline script blocks.
- Q3 mapping functions and eight-locale label set present.

### Required before stable release
- Interactive browser regression across site/line combinations.
- Language consistency review.
- Confirm Q4 has no regression.
- Product-owner review of Q3 behavior.

### Rollback target
`product/aves-assessment-baseline`


## 2026.10.14.2-dev — External Beta backend QA
Status: internal QA candidate  
Branch: `release/aves-assessment-2026-10-16-beta`

### QA deployment
Vercel project: `aves-assessment-beta-qa`  
Deployment: `dpl_BeTmERNWJVq3XSjm9Xe81yPH7K64`  
Health check: PASS

### Database
Neon project: Aves Assessment Beta APAC / Singapore  
Main migration: NOT YET APPLIED  
Consolidated temporary migration branch: tested with 13 expected tables and invitation access-start field.

### Rollback / isolation
- Stable external Production alias has not been changed.
- QA deployment points to a temporary Neon migration branch.
- Rejecting the migration can discard the temporary branch without touching Neon main.
