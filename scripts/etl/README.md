# ETL: Supabase → Firestore

## Prerequisites

- Service role key for Supabase (server-side only; never commit).
- Firebase **Admin** SDK credentials (`GOOGLE_APPLICATION_CREDENTIALS` or inline JSON for one-off scripts).

## Flow

1. Export rows from Postgres (via Supabase SQL or API) per table: `patients`, `doctors`, `appointments`, `messages`, `conversations`, `triage_cases`, `medical_records`, `calls`, `admins`, `places`, `routes`, `users`, `roles`, `user_roles`.
2. Transform IDs: preserve primary keys as Firestore document IDs where possible.
3. Write in **batches** of ≤500 operations.
4. Create **composite indexes** before large imports if needed (`firestore.indexes.json`).

## Script

`migrate-supabase-to-firestore.mjs` is a **template**: fill in credentials and table mappings before running. Do not run against production without a dry-run on a dev project.

```bash
cd scripts/etl
npm install
node migrate-supabase-to-firestore.mjs --dry-run
```
