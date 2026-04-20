# Firestore query map (from Supabase usage)

Map each **screen / hook** to today’s Postgres/Supabase access pattern and the **Firestore strategy**. Extend this table during migration.

| Feature | Supabase tables / pattern | Firestore approach |
|--------|---------------------------|--------------------|
| Patient bookings | `patients` by `user_id`; `appointments` by `patient_id` + join `doctors` | Query `patients` where `user_id == uid`; query `appointments` where `patient_id == patientDocId` + `orderBy(scheduled_datetime)`; fetch `doctors/{doctor_id}` per row or denormalize doctor fields on appointment |
| Doctor appointments | `doctors` by user; `appointments` + `patients` | Same with role-scoped rules; indexes on `doctor_id` + `scheduled_datetime` |
| Messaging | `conversations`, `messages`, realtime channels | `conversations/{id}` + subcollection `messages`; `onSnapshot` per conversation; optional collectionGroup for inbox |
| Triage | `triage_cases` + filters | Collection `triage_cases` with composite indexes on status, dates |
| Medical records | `medical_records` + joins | Collection with `patient_id`; rules restrict by role |
| Admin lists | `patients`, `doctors`, aggregates | Pagination with cursors; Cloud Function for heavy counts if needed |
| Calls | `calls` + realtime | Collection + snapshot listeners or RTDB if latency-critical |
| Routes / places | `places`, `routes` | Collections as-is; geo queries may need different design |

**Realtime → Firestore**: Replace `supabase.channel` with `onSnapshot` queries; unsubscribe in `useEffect` cleanup.
