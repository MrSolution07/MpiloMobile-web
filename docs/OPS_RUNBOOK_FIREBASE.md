# Operations runbook — Firebase cutover

## RPO / RTO (set per org)

- **RPO**: Maximum acceptable data loss window during migration (document the ETL snapshot time).
- **RTO**: Maximum acceptable downtime for the maintenance window.

## Backups

- Before cutover: Supabase **logical backup** / project snapshot; verify restore drill on a scratch project.
- Firestore: enable **PITR** (point-in-time recovery) if policy requires; export scheduled jobs via gcloud or third-party.

## Monitoring (post-cutover)

- Firebase console: **Firestore usage**, **Auth** error rates, **quota** alerts.
- Watch for **read spikes** (listener leaks) after shipping `onSnapshot`.

## Rollback

1. Set `VITE_USE_FIREBASE=false` in hosting env for all three apps.
2. Redeploy previous build or toggle feature flag if used.
3. Restore Supabase to **read-write** only if data drifted; otherwise keep read-only until root cause is fixed.

## Canary / flags

- Prefer deploying Firebase path to **staging** first; then **canary** a % of production traffic if infrastructure allows; else use a single maintenance window.

## Decommission Supabase

- Criteria: NFR tests pass, no Sev-1 for 72h, stakeholder sign-off, backup archived.
