# Aves Assessment — External Beta Operations Runbook

## Capacity target
- Customer concurrent sessions: <=10.
- Admin concurrent sessions: <=5.

## Cloud database
External Beta target: Neon PostgreSQL 17, APAC/Singapore project.
Application database abstraction also supports MySQL for local deployment.

## Health check
`GET /healthz`

Expected:
`{"ok":true,"service":"aves-assessment","dbDialect":"postgres"}`

## Authentication
- Invite-only customer onboarding.
- Explicit Organization / Assessment / User authorization.
- Email domain is never an authorization boundary.
- Session state is persisted in database.
- Passwords use bcrypt.
- Admin SMTP secrets use application-layer encryption.

## Incident response
1. Identify candidate vs stable release.
2. Do not modify Formal Quote snapshots.
3. If systemic/uncertain, rollback stable alias first.
4. If isolated, use Incremental Change List and partial rollback.
5. Re-run smoke tests and language consistency checks.

## Daily external-beta checks
- healthz is OK;
- login works;
- Admin configuration loads;
- customer assessment saves/reloads;
- notification queue is not accumulating errors;
- SMTP test succeeds after configuration;
- installer endpoint requires authentication;
- stable alias matches approved release manifest.
