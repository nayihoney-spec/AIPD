CREATE TABLE IF NOT EXISTS organizations (
  id varchar(36) PRIMARY KEY,
  name varchar(255) NOT NULL,
  status varchar(32) NOT NULL DEFAULT 'active',
  created_at datetime NOT NULL,
  updated_at datetime NOT NULL
) ENGINE=InnoDB;
CREATE TABLE IF NOT EXISTS users (
  id varchar(36) PRIMARY KEY,
  email varchar(320) NOT NULL UNIQUE,
  password_hash varchar(255) NOT NULL,
  display_name varchar(255),
  status varchar(32) NOT NULL DEFAULT 'active',
  is_platform_admin boolean NOT NULL DEFAULT false,
  must_change_password boolean NOT NULL DEFAULT true,
  locale varchar(16) NOT NULL DEFAULT 'en',
  created_at datetime NOT NULL,
  updated_at datetime NOT NULL
) ENGINE=InnoDB;
CREATE TABLE IF NOT EXISTS organization_memberships (
  id varchar(36) PRIMARY KEY,
  organization_id varchar(36) NOT NULL,
  user_id varchar(36) NOT NULL,
  role varchar(64) NOT NULL,
  created_at datetime NOT NULL,
  UNIQUE KEY uq_membership (organization_id,user_id),
  CONSTRAINT fk_membership_org FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE,
  CONSTRAINT fk_membership_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;
CREATE TABLE IF NOT EXISTS assessments (
  id varchar(36) PRIMARY KEY,
  organization_id varchar(36) NOT NULL,
  name varchar(255) NOT NULL,
  status varchar(32) NOT NULL DEFAULT 'draft',
  config_version varchar(64) NOT NULL DEFAULT '2026.10',
  pricing_version varchar(64) NOT NULL DEFAULT '2026.10',
  payload_text longtext NOT NULL,
  completeness int NOT NULL DEFAULT 0,
  confidence varchar(32) NOT NULL DEFAULT 'low',
  created_by varchar(36) NOT NULL,
  created_at datetime NOT NULL,
  updated_at datetime NOT NULL,
  KEY idx_assessments_org (organization_id),
  CONSTRAINT fk_assessment_org FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE,
  CONSTRAINT fk_assessment_creator FOREIGN KEY (created_by) REFERENCES users(id)
) ENGINE=InnoDB;
CREATE TABLE IF NOT EXISTS assessment_access (
  id varchar(36) PRIMARY KEY,
  assessment_id varchar(36) NOT NULL,
  user_id varchar(36) NOT NULL,
  permission varchar(32) NOT NULL DEFAULT 'viewer',
  valid_from datetime,
  valid_until datetime,
  created_at datetime NOT NULL,
  UNIQUE KEY uq_assessment_access (assessment_id,user_id),
  KEY idx_access_user (user_id),
  CONSTRAINT fk_access_assessment FOREIGN KEY (assessment_id) REFERENCES assessments(id) ON DELETE CASCADE,
  CONSTRAINT fk_access_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;
CREATE TABLE IF NOT EXISTS invitations (
  id varchar(36) PRIMARY KEY,
  email varchar(320) NOT NULL,
  organization_id varchar(36) NOT NULL,
  assessment_id varchar(36),
  permission varchar(32) NOT NULL DEFAULT 'editor',
  token_hash varchar(128) NOT NULL UNIQUE,
  valid_from datetime,
  expires_at datetime NOT NULL,
  accepted_at datetime,
  created_by varchar(36) NOT NULL,
  created_at datetime NOT NULL,
  KEY idx_invitation_email (email),
  CONSTRAINT fk_invitation_org FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE,
  CONSTRAINT fk_invitation_assessment FOREIGN KEY (assessment_id) REFERENCES assessments(id) ON DELETE CASCADE,
  CONSTRAINT fk_invitation_creator FOREIGN KEY (created_by) REFERENCES users(id)
) ENGINE=InnoDB;
CREATE TABLE IF NOT EXISTS sessions (
  id varchar(64) PRIMARY KEY,
  user_id varchar(36) NOT NULL,
  expires_at datetime NOT NULL,
  created_at datetime NOT NULL,
  last_seen_at datetime NOT NULL,
  KEY idx_sessions_user (user_id),
  CONSTRAINT fk_session_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;
CREATE TABLE IF NOT EXISTS platform_settings (
  setting_key varchar(128) PRIMARY KEY,
  value_text longtext,
  secret_ciphertext longtext,
  updated_by varchar(36),
  updated_at datetime NOT NULL,
  CONSTRAINT fk_setting_user FOREIGN KEY (updated_by) REFERENCES users(id)
) ENGINE=InnoDB;
CREATE TABLE IF NOT EXISTS notification_templates (
  id varchar(36) PRIMARY KEY,
  event_key varchar(64) NOT NULL,
  locale varchar(16) NOT NULL,
  subject varchar(500) NOT NULL,
  body_text longtext NOT NULL,
  enabled boolean NOT NULL DEFAULT true,
  updated_at datetime NOT NULL,
  UNIQUE KEY uq_notification_template (event_key,locale)
) ENGINE=InnoDB;
CREATE TABLE IF NOT EXISTS notification_queue (
  id varchar(36) PRIMARY KEY,
  event_key varchar(64) NOT NULL,
  to_email varchar(320) NOT NULL,
  payload_text longtext NOT NULL,
  status varchar(32) NOT NULL DEFAULT 'pending',
  attempts int NOT NULL DEFAULT 0,
  next_attempt_at datetime NOT NULL,
  last_error longtext,
  created_at datetime NOT NULL,
  updated_at datetime NOT NULL,
  KEY idx_queue_due (status,next_attempt_at)
) ENGINE=InnoDB;
CREATE TABLE IF NOT EXISTS quote_snapshots (
  id varchar(36) PRIMARY KEY,
  assessment_id varchar(36) NOT NULL,
  quote_number varchar(64) NOT NULL UNIQUE,
  snapshot_text longtext NOT NULL,
  issued_by varchar(36) NOT NULL,
  issued_at datetime NOT NULL,
  CONSTRAINT fk_quote_assessment FOREIGN KEY (assessment_id) REFERENCES assessments(id),
  CONSTRAINT fk_quote_issuer FOREIGN KEY (issued_by) REFERENCES users(id)
) ENGINE=InnoDB;
CREATE TABLE IF NOT EXISTS audit_log (
  id varchar(36) PRIMARY KEY,
  user_id varchar(36),
  action varchar(128) NOT NULL,
  entity_type varchar(64) NOT NULL,
  entity_id varchar(64),
  details_text longtext,
  created_at datetime NOT NULL,
  KEY idx_audit_entity (entity_type,entity_id),
  CONSTRAINT fk_audit_user FOREIGN KEY (user_id) REFERENCES users(id)
) ENGINE=InnoDB;
CREATE TABLE IF NOT EXISTS api_clients (
  id varchar(36) PRIMARY KEY,
  name varchar(255) NOT NULL,
  key_hash varchar(128) NOT NULL UNIQUE,
  scopes_text longtext NOT NULL,
  status varchar(32) NOT NULL DEFAULT 'active',
  created_by varchar(36) NOT NULL,
  created_at datetime NOT NULL,
  CONSTRAINT fk_api_client_creator FOREIGN KEY (created_by) REFERENCES users(id)
) ENGINE=InnoDB;
