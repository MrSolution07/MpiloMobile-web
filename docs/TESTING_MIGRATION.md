# Testing strategy — performance and Firebase migration

## Performance

- **Lighthouse CI**: See `.github/workflows/perf-ci.yml` and `docs/PERF_BUDGETS.md`.
- **Bundle**: Run `npm run analyze` in each app (`ANALYZE=1`) and compare `dist/stats.html` across PRs.

## Firebase / Firestore

- **Rules**: Use Firebase Emulator + `@firebase/rules-unit-testing` (see `patient-website/src/tests/firestore.rules.test.ts`). Run: `npm run test:rules` from `patient-website` (requires Java for emulator or in-memory test env).
- **Contract tests**: Add tests for `services/firebase/*` helpers against emulator fixtures.
- **E2E (manual / Playwright later)**: Booking flow, login, messaging, triage, admin patient/doctor — must pass before Supabase decommission.

## Non-negotiable flows before decommission

- Patient: register/login, view bookings (`useBookings` with Firebase path).
- Doctor: login, appointments list, messages (still Supabase until migrated).
- Admin: login, patient list (still Supabase until migrated).
