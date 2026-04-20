# Supabase Auth → Firebase Auth

## Options

1. **Password reset window**: Create Firebase users with temporary passwords or invite links; users set new passwords (simplest when compliance restricts hash export).
2. **Bulk import**: Use Firebase Auth import APIs where supported; verify algorithm compatibility with Supabase export.
3. **OAuth**: Re-link Google/Apple in Firebase console; users may need to sign in again once.

## Session continuity

- Default expectation: **users sign in again** after cutover.
- JWT/session storage differs; do not assume Supabase refresh tokens work on Firebase.

## Environment

- `VITE_USE_FIREBASE=true` plus Firebase web config in each app enables Firebase Auth in `AuthProvider`.
- Supabase env vars remain for rollback until decommission.

## Checklist

- [ ] Export user list from Supabase (emails, provider IDs).
- [ ] Legal/compliance approval for migration method.
- [ ] Run import or reset flow in staging.
- [ ] Verify `useAuth().user.id` is Firebase `uid` everywhere (mapped in `AuthProvider`).
