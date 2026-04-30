import type { PortalRole } from './auth'

export const PORTAL_WEBHOOK_CONTRACT_VERSION = 1 as const

// ---------------------------------------------------------------------------
// Email entry types (spec-06 dual-email auth)
// ---------------------------------------------------------------------------

export const USER_EMAIL_KINDS = ['workspace', 'personal'] as const
export type UserEmailKind = (typeof USER_EMAIL_KINDS)[number]

export const USER_EMAIL_ADDED_BY = [
  'admin',
  'self',
  'csv_import',
  'sheet_sync',
  'backfill',
  'bootstrap',
] as const
export type UserEmailAddedBy = (typeof USER_EMAIL_ADDED_BY)[number]

/** A single email address entry on a user, as surfaced in webhook payloads. */
export interface UserEmailEntry {
  address: string
  kind: UserEmailKind
  isPrimary: boolean
  verified: boolean
  addedBy: UserEmailAddedBy
}

export const PORTAL_WEBHOOK_EVENTS = [
  'alias.deleted',
  'alias.resolved',
  'alias.updated',
  'app_config.updated',
  'session.revoked',
  'user.provisioned',
  'user.updated',
  'user.offboarded',
] as const

export type PortalWebhookEvent = (typeof PORTAL_WEBHOOK_EVENTS)[number]

export interface PortalWebhookEnvelope<TPayload = unknown> {
  contractVersion: typeof PORTAL_WEBHOOK_CONTRACT_VERSION
  event: PortalWebhookEvent
  /** uuid — apps use this for idempotency */
  eventId: string
  /** ISO timestamp */
  occurredAt: string
  /** The recipient app's slug (handy for multi-tenant receivers) */
  appSlug: string
  payload: TPayload
}

// Payload shapes — tight, no internal fields leaked

export interface SessionRevokedPayload {
  userId: string
  gipUid: string
  email: string
  reason: 'logout' | 'status_change' | 'offboarded' | 'admin'
  /** ISO — sessions issued at or before this instant are revoked */
  notBefore: string
}

export interface UserProvisionedPayload {
  userId: string
  gipUid: string | null
  email: string
  name: string
  portalRole: PortalRole
  teamIds: string[]
  apps: string[]
  /** The resolved app-local role for the recipient app. NULL if the app has no declared roles. */
  appRole: string | null
  /** The employee's office/country branch label (e.g. "Indonesia", "Thailand"). NULL if not set. */
  branch?: string | null
  /** Per-recipient app-config slice. Each recipient receives only its own slice. */
  appConfig?: { config: Record<string, unknown>; schemaVersion: number } | null
  /**
   * All email addresses associated with this user (spec-06 dual-email auth).
   * Additive — existing consumers that do not read this field are unaffected.
   * The scalar `email` field above is preserved and equals the primary address
   * per Q8a precedence (workspace if present, else personal).
   */
  emails?: UserEmailEntry[]
}

export interface UserUpdatedPayload {
  userId: string
  gipUid: string | null
  email: string
  name: string
  portalRole: PortalRole
  teamIds: string[]
  apps: string[]
  /** e.g. ['email', 'portalRole'] */
  changedFields: string[]
  /** The current resolved app-local role for the recipient app. NULL if unchanged or no declared roles. */
  appRole: string | null
  /** The employee's office/country branch label (e.g. "Indonesia", "Thailand"). NULL if not set. */
  branch?: string | null
  /**
   * All email addresses associated with this user (spec-06 dual-email auth).
   * Additive — existing consumers that do not read this field are unaffected.
   * The scalar `email` field above is preserved and equals the primary address
   * per Q8a precedence (workspace if present, else personal).
   */
  emails?: UserEmailEntry[]
}

export interface UserOffboardedPayload {
  userId: string
  gipUid: string | null
  email: string
  /** ISO */
  offboardedAt: string
}

export interface AliasResolvedPayload {
  aliasId: string
  aliasNormalized: string
  portalSub: string
  isPrimary: boolean
}

export interface AliasUpdatedPayload {
  aliasId: string
  aliasNormalized: string
  portalSub: string
  isPrimary: boolean
  previousIsPrimary?: boolean
  previousIdentityUserId?: string
}

export interface AliasDeletedPayload {
  aliasId: string
  aliasNormalized: string
  portalSub: string
}

export interface AppConfigUpdatedPayload {
  portalSub: string
  config: Record<string, unknown>
  previousConfig: Record<string, unknown>
  schemaVersion: number
  batchId: string | null
}

export const PORTAL_WEBHOOK_SIGNATURE_HEADER = 'X-Portal-Signature'
export const PORTAL_WEBHOOK_EVENT_HEADER = 'X-Portal-Event'
export const PORTAL_WEBHOOK_EVENT_ID_HEADER = 'X-Portal-Event-Id'
export const PORTAL_WEBHOOK_TIMESTAMP_HEADER = 'X-Portal-Timestamp'
