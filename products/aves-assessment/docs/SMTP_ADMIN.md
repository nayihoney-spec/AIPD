# Aves Assessment — SMTP & Automated Notification Administration

## Design principle
SMTP is provider-neutral and Admin-configurable. The platform does not require a specific mail vendor.

## Admin configuration
Location:
**Platform & Pricing → Integrations & AI → SMTP Email Notifications**

Fields:
- Enable SMTP
- Host
- Port
- Security mode
- Username
- Password / App Password
- From Name
- From Email
- Test Recipient

## Secret handling
- Password is encrypted before persistence using AES-256-GCM.
- Encryption key comes only from `APP_ENCRYPTION_KEY`.
- The saved password is never returned to browser/API callers.
- Updating non-secret SMTP fields with a blank password keeps the existing secret.

## Supported notification events
1. `invite`
2. `access_expiry`
3. `incomplete_reminder`
4. `quote_ready`

Templates support locale-specific subject/body rows with English fallback.

## Delivery behavior
- Invitations are queued and an immediate delivery attempt is triggered.
- Failed sends remain pending and use exponential retry.
- Cloud scheduled runner triggers expiry/incomplete reminders.
- Local deployment runs a lightweight background delivery worker.

## Production checklist
- Verify SPF/DKIM/DMARC for the sender domain when applicable.
- Use a dedicated SMTP account/app password.
- Test sender/recipient before customer invitation.
- Confirm From Email is allowed by the SMTP provider.
- Review audit logs for SMTP configuration changes.
