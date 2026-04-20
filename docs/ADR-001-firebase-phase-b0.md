# ADR-001: Firebase Phase B0 — IDs, cutover, and auth

## Status

Proposed defaults for implementation; product/legal must sign off before production cutover.

## Document IDs

- **Decision**: Use **Firebase Auth `uid`** as the canonical `user_id` on profile documents (`patients`, `doctors`, etc.) for all new writes after migration.
- **Migration**: ETL copies Supabase `auth.users.id` / profile `user_id` into Firestore; where historical IDs differ from Firebase UIDs, store `legacy_supabase_user_id` on the document for one migration window only.

## Cutover model

- **Default**: **Maintenance window + single cutover** (stop writes on Supabase, run ETL, point apps at Firebase with `VITE_USE_FIREBASE=true`, smoke-test, enable traffic).
- **Dual-write** is out of scope unless zero-downtime is contractually required; if adopted later, require idempotent writes and reconciliation tests.

## Auth

- **Passwords**: Prefer **controlled password reset** for users where hash export/import is not approved; otherwise use provider-supported bulk import.
- **Sessions**: Expect **full re-login** at cutover unless a separate token bridge is built (not default).
- **OAuth / MFA**: Map OAuth providers explicitly; document MFA roadmap before enforcing in Firebase.

## Sign-off

- [ ] Engineering
- [ ] Security / compliance
- [ ] Product owner
