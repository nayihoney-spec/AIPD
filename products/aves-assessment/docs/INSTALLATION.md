# Aves Assessment — Local Installation Guide

Release target: 2026.10.16 External Beta

## 1. Supported local deployment
The supported one-click local profile uses Docker Compose.

Supported database profiles:
- **PostgreSQL 17** — default and recommended.
- **MySQL 8.4** — compatibility profile.

The application uses a database-adapter layer and keeps the Beta schema within a common SQL subset. PostgreSQL and MySQL use separate migration files because the two engines are not SQL-identical.

## 2. Minimum installation requirements
Recommended for the current <=10 customer / <=5 Admin concurrency target:
- 64-bit Windows 11 / Windows Server, macOS, or mainstream Linux.
- Docker Desktop or Docker Engine + Docker Compose v2.
- 2 CPU cores minimum; 4 recommended.
- 4 GB free RAM minimum; 8 GB recommended.
- 5 GB free disk for initial use; increase according to uploaded files, logs and database retention.
- TCP port 3000 available, or change `APP_PORT`.
- Outbound network access to an SMTP server if automated email notification is enabled.

No external AI model or token service is required for the Beta baseline.

## 3. One-click installation

### Windows
1. Extract the authorized installation ZIP.
2. Right-click PowerShell and run:
   `./install.ps1`
3. Choose `postgres` or `mysql`.
4. Enter the initial Platform Admin email.
5. Enter an initial password of at least 12 characters.
6. Wait for Docker to build/start the services.
7. Open `http://localhost:3000`.

### macOS / Linux
1. Extract the authorized installation ZIP.
2. Run:
   `chmod +x install.sh && ./install.sh`
3. Choose `postgres` or `mysql`.
4. Enter the initial Platform Admin email/password.
5. Open `http://localhost:3000`.

The installer generates unique database passwords, APP_ENCRYPTION_KEY and CRON_SECRET and writes them to local `.env`. Do not share that file.

## 4. Manual installation
Copy `.env.example` to `.env`, fill required values, then:

PostgreSQL:
`docker compose --profile postgres up -d --build`

MySQL:
`docker compose --profile mysql up -d --build`

## 5. SMTP setup
After Admin login:
Platform & Pricing → Integrations & AI → SMTP Email Notifications.

Configure:
- Enabled
- SMTP Host
- Port
- Security: STARTTLS / TLS
- Username
- Password / App Password
- From Name
- From Email

Use **Send Test Email** before inviting external users.

The SMTP password is encrypted at rest with `APP_ENCRYPTION_KEY`. The browser never receives the stored password after saving.

## 6. Notification baseline
External Beta supports:
- invitation notification;
- access-expiry reminder;
- incomplete-assessment reminder;
- quote/status notification.

The local deployment includes a notification worker. Cloud deployment uses the protected notification-runner endpoint on a schedule.

## 7. Backup and upgrade
For Beta:
- Back up the database volume before upgrade.
- Preserve the current `.env`.
- Review `releases/CHANGELOG_INCREMENTAL.md` and `releases/RELEASE_MANIFEST.md`.
- Use the recorded rollback target if regression is detected.

PostgreSQL local volume: `aves_pgdata`.
MySQL local volume: `aves_mysqldata`.

## 8. Security
- Never use the example passwords from `.env.example`.
- Change the bootstrap Admin password after first login.
- Restrict host/network access for non-demo use.
- Use TLS termination/reverse proxy for remote access.
- Do not expose database ports publicly.
- Do not store SMTP passwords, database passwords or API tokens in Git commits.

## 9. Uninstall
`docker compose down` stops services without deleting data.

To intentionally delete local data:
`docker compose down -v`

Deleting volumes is destructive and cannot be undone without a backup.
