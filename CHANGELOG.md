# Changelog

## [1.4.0] - 2026-04-28

### Added
- `alias.resolved`, `alias.updated`, `alias.deleted`, `app_config.updated` to `PORTAL_WEBHOOK_EVENTS`
- `AliasResolvedPayload` interface
- `AliasUpdatedPayload` interface (includes optional `previousIsPrimary` and `previousIdentityUserId`)
- `AliasDeletedPayload` interface
- `AppConfigUpdatedPayload` interface
- Optional `appConfig` field on `UserProvisionedPayload` — per-recipient app-config slice; existing consumers unaffected
