# Changelog

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
