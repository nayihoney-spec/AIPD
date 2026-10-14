CREATE TABLE IF NOT EXISTS organizations (
  id varchar(36) PRIMARY KEY,
  name varchar(255) NOT NULL,
  status varchar(32) NOT NULL DEFAULT 'active',
  created_at timestamp NOT NULL,
  updated_at timestamp NOT NULL
);
CREATE TABLE IF NOT EXISTS users (
  id varchar(36) PRIMARY KEY,
  email varchar(320) NOT NULL UNIQUE,
  password_hash varchar(255) NOT NULL,
  display_name varchar(255),
  status varchar(32) NOT NULL DEFAULT 'active',
  is_platform_admin boolean NOT NULL DEFAULT false,
  must_change_password boolean NOT NULL DEFAULT true,
  locale varchar(16) NOT NULL DEFAULT 'en',
  created_at timestamp NOT NULL,
  updated_at timestamp NOT NULL
);
CREATE TABLE IF NOT EXISTS organization_memberships (
  id varchar(36) PRIMARY KEY,
  organization_id varchar(36) NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  user_id varchar(36) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role varchar(64) NOT NULL,
  created_at timestamp NOT NULL,
  UNIQUE (organization_id,user_id)
);
CREATE TABLE IF NOT EXISTS assessments (
  id varchar(36) PRIMARY KEY,
  organization_id varchar(36) NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  name varchar(255) NOT NULL,
  status varchar(32) NOT NULL DEFAULT 'draft',
  config_version varchar(64) NOT NULL DEFAULT '2026.10',
  pricing_version varchar(64) NOT NULL DEFAULT '2026.10',
  payload_text text NOT NULL,
  completeness integer NOT NULL DEFAULT 0,
  confidence varchar(32) NOT NULL DEFAULT 'low',
  created_by varchar(36) NOT NULL REFERENCES users(id),
  created_at timestamp NOT NULL,
  updated_at timestamp NOT NULL
);
CREATE TABLE IF NOT EXISTS assessment_access (
  id varchar(36) PRIMARY KEY,
  assessment_id varchar(36) NOT NULL REFERENCES assessments(id) ON DELETE CASCADE,
  user_id varchar(36) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  permission varchar(32) NOT NULL DEFAULT 'viewer',
  valid_from timestamp,
  valid_until timestamp,
  created_at timestamp NOT NULL,
  UNIQUE (assessment_id,user_id)
);
CREATE TABLE IF NOT EXISTS invitations (
  id varchar(36) PRIMARY KEY,
  email varchar(320) NOT NULL,
  organization_id varchar(36) NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  assessment_id varchar(36) REFERENCES assessments(id) ON DELETE CASCADE,
  permission varchar(32) NOT NULL DEFAULT 'editor',
  token_hash varchar(128) NOT NULL UNIQUE,
  valid_from timestamp,
  expires_at timestamp NOT NULL,
  accepted_at timestamp,
  created_by varchar(36) NOT NULL REFERENCES users(id),
  created_at timestamp NOT NULL
);
CREATE TABLE IF NOT EXISTS sessions (
  id varchar(64) PRIMARY KEY,
  user_id varchar(36) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  expires_at timestamp NOT NULL,
  created_at timestamp NOT NULL,
  last_seen_at timestamp NOT NULL
);
CREATE TABLE IF NOT EXISTS platform_settings (
  setting_key varchar(128) PRIMARY KEY,
  value_text text,
  secret_ciphertext text,
  updated_by varchar(36) REFERENCES users(id),
  updated_at timestamp NOT NULL
);
CREATE TABLE IF NOT EXISTS notification_templates (
  id varchar(36) PRIMARY KEY,
  event_key varchar(64) NOT NULL,
  locale varchar(16) NOT NULL,
  subject varchar(500) NOT NULL,
  body_text text NOT NULL,
  enabled boolean NOT NULL DEFAULT true,
  updated_at timestamp NOT NULL,
  UNIQUE(event_key,locale)
);
CREATE TABLE IF NOT EXISTS notification_queue (
  id varchar(36) PRIMARY KEY,
  event_key varchar(64) NOT NULL,
  to_email varchar(320) NOT NULL,
  payload_text text NOT NULL,
  status varchar(32) NOT NULL DEFAULT 'pending',
  attempts integer NOT NULL DEFAULT 0,
  next_attempt_at timestamp NOT NULL,
  last_error text,
  created_at timestamp NOT NULL,
  updated_at timestamp NOT NULL
);
CREATE TABLE IF NOT EXISTS quote_snapshots (
  id varchar(36) PRIMARY KEY,
  assessment_id varchar(36) NOT NULL REFERENCES assessments(id),
  quote_number varchar(64) NOT NULL UNIQUE,
  snapshot_text text NOT NULL,
  issued_by varchar(36) NOT NULL REFERENCES users(id),
  issued_at timestamp NOT NULL
);
CREATE TABLE IF NOT EXISTS audit_log (
  id varchar(36) PRIMARY KEY,
  user_id varchar(36) REFERENCES users(id),
  action varchar(128) NOT NULL,
  entity_type varchar(64) NOT NULL,
  entity_id varchar(64),
  details_text text,
  created_at timestamp NOT NULL
);
CREATE TABLE IF NOT EXISTS api_clients (
  id varchar(36) PRIMARY KEY,
  name varchar(255) NOT NULL,
  key_hash varchar(128) NOT NULL UNIQUE,
  scopes_text text NOT NULL,
  status varchar(32) NOT NULL DEFAULT 'active',
  created_by varchar(36) NOT NULL REFERENCES users(id),
  created_at timestamp NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_assessments_org ON assessments(organization_id);
CREATE INDEX IF NOT EXISTS idx_access_user ON assessment_access(user_id);
CREATE INDEX IF NOT EXISTS idx_invitation_email ON invitations(email);
CREATE INDEX IF NOT EXISTS idx_sessions_user ON sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_queue_due ON notification_queue(status,next_attempt_at);
CREATE INDEX IF NOT EXISTS idx_audit_entity ON audit_log(entity_type,entity_id);
