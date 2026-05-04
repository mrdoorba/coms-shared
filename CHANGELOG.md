# Changelog

## [1.6.0] - 2026-05-04

### Added
- `taxonomy.upserted`, `taxonomy.deleted`, `employment.updated` to `PORTAL_WEBHOOK_EVENTS` (Spec 07).
- `TaxonomyRef` interface — `{ taxonomyId, key, value }` reference to one entry inside an org taxonomy.
- `EmploymentBlock` interface — the HR-shaped block carried alongside `user`/`appConfig` on `user.provisioned` and `employment.updated`. Fields: `branch`, `team`, `department` (taxonomy refs); `position`, `phone`, `employmentStatus`, `talentaId`, `attendanceName`, `leaderName`, `birthDate` (free-form scalars). Every field nullable.
- `TaxonomyUpsertedPayload` / `TaxonomyDeletedPayload` — payload shapes for the new taxonomy events. One envelope per `(taxonomyId, batchId)` per Spec 07 §Race window — never one event per entry.
- `TaxonomyEvent` — discriminated union over the upserted + deleted variants for handlers that dispatch on `kind`.
- `EmploymentUpdatedPayload` — payload for `employment.updated` carrying `user.portalSub`, post-update `employment`, pre-update `previousEmployment`. Fired only on real HR-field deltas; portal suppresses on no-op writes.
- `ContactEmail` typedef (alias for `string`) — the address an H-app should use to contact this user, resolved per Spec 06 §Q8a precedence (workspace > personal-primary > first-personal).
- `WebhookUserEnvelope` — the Spec 07 envelope shape carried by `user.provisioned`: `user{portalSub,name,primaryAliasId|null}`, `contactEmail`, `employment`, `appConfig`. Heroes Deploy A reads from this shape; portal dual-emits legacy top-level fields (`email`, `appRole`, `branch`) alongside this envelope until PR 07-5.
- `AppConfigEvent` — Spec 07 finalised name for the per-recipient app-config webhook payload. Alias of `AppConfigUpdatedPayload`; both names point to the same shape so Heroes-side handlers can spell the type by its spec-mandated name without breaking existing consumers.
- Optional `taxonomies?: string[]` field on `PortalIntegrationManifest` — IDs of the org taxonomies this app cares about. Portal filters `GET /api/taxonomies/sync` and `taxonomy.*` fan-out by this list. Omit for apps that don't consume taxonomies.

### Compatibility
- All v1.5.0 names, fields, and event constants preserved. `PORTAL_WEBHOOK_EVENTS` only widens (additive). Existing v1.5.0 consumers (Heroes pre-Deploy-A) compile unchanged. Locked by `src/__tests__/v1_5_0-backcompat.test.ts`.

## [1.5.0] - 2026-04-30

### Added
- `UserEmailEntry` interface — wire shape for a single email address entry (`address`, `kind`, `isPrimary`, `verified`, `addedBy`).
- `USER_EMAIL_KINDS` const array and `UserEmailKind` type (`'workspace' | 'personal'`).
- `USER_EMAIL_ADDED_BY` const array and `UserEmailAddedBy` type (`'admin' | 'self' | 'csv_import' | 'sheet_sync' | 'backfill' | 'bootstrap'`).
- Optional `emails?: UserEmailEntry[]` field on `UserProvisionedPayload` — additive; existing consumers unaffected.
- Optional `emails?: UserEmailEntry[]` field on `UserUpdatedPayload` — additive; existing consumers unaffected.

Add additive `emails[]` array on user-provisioning / user-update webhook payloads to support spec-06 dual-email auth. Existing scalar `email` field unchanged.

## [1.4.1] - 2026-04-29

### Deprecated
- `APP_LAUNCHER` — now emits a `console.warn` on first access: `[@coms-portal/shared] APP_LAUNCHER is deprecated — fetch /api/userinfo instead. Will be removed in v1.5.0.` Use `GET /api/userinfo` from the portal API instead. The portal chrome already serves app data dynamically; static constants are no longer necessary.

## [1.4.0] - 2026-04-29

### Added
- `alias.resolved`, `alias.updated`, `alias.deleted`, `app_config.updated` to `PORTAL_WEBHOOK_EVENTS`
- `AliasResolvedPayload` interface
- `AliasUpdatedPayload` interface (includes optional `previousIsPrimary` and `previousIdentityUserId`)
- `AliasDeletedPayload` interface
- `AppConfigUpdatedPayload` interface
- Optional `appConfig` field on `UserProvisionedPayload` — per-recipient app-config slice; existing consumers unaffected
