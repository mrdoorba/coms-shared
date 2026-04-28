/**
 * APP_LAUNCHER — slug → { label, url } map for the suite app switcher.
 *
 * Consumed by the host application (portal `apps/web`, Heroes' header) to
 * derive the `appSwitcher` prop on `<AccountWidget>`. Each entry maps a
 * portal-side app slug (matching `app_registry.slug` and the `apps` claim on
 * the OIDC ID token) to the label + canonical landing URL the widget renders.
 *
 * ## Why a constant, not an endpoint?
 *
 * Per Rev 3 Spec 01 §Open Question 2: a constant is sufficient while N-apps
 * remains small (today: portal + heroes = 2). When N-apps reaches 3+, this
 * map should be served from `GET /api/me/apps` (portal-side) so onboarding a
 * new app is a server-only edit instead of a coordinated package release.
 *
 * ## Subdomain status
 *
 * Both `coms.ahacommerce.net` (portal) and `heroes.ahacommerce.net` (Heroes)
 * are **planned but not yet provisioned**. Production today runs on Cloud Run
 * URLs. When the subdomains land, this constant is the single edit point
 * — no other consumer in the suite holds these URLs.
 */
export const APP_LAUNCHER: Readonly<Record<string, { label: string; url: string }>> = {
  portal: {
    label: 'COMS',
    url: 'https://coms.ahacommerce.net',
  },
  heroes: {
    label: 'Heroes',
    url: 'https://heroes.ahacommerce.net',
  },
}

export type AppLauncherEntry = (typeof APP_LAUNCHER)[keyof typeof APP_LAUNCHER]
export type AppLauncherSlug = keyof typeof APP_LAUNCHER
