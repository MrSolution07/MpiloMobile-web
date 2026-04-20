# Testing strategy — performance and Firebase migration

## Performance

- **Lighthouse CI**: See `.github/workflows/perf-ci.yml` and `docs/PERF_BUDGETS.md`.
- **Bundle**: Run `npm run analyze` in each app (`ANALYZE=1`) and compare `dist/stats.html` across PRs.

## Firebase / Firestore

- **Rules**: `patient-website/src/tests/firestore.rules.test.js` runs against the **Firestore emulator** when `FIRESTORE_EMULATOR_HOST` is set (e.g. wrap with `firebase emulators:exec --only firestore "cd patient-website && npm run test:rules"` from repo root). Without the emulator, the suite is **skipped** so CI stays green.
- **Contract tests**: Add tests for `services/firebase/*` helpers against emulator fixtures.
- **E2E (manual / Playwright later)**: Booking flow, login, messaging, triage, admin patient/doctor — must pass before Supabase decommission.

## Non-negotiable flows before decommission

- Patient: register/login, view bookings (`useBookings` with Firebase path).
- Doctor: login, appointments list, messages (still Supabase until migrated).
- Admin: login, patient list (still Supabase until migrated).
