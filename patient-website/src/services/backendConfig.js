/**
 * When VITE_USE_FIREBASE=true and required Firebase env vars are set,
 * the app uses Firebase Auth + Firestore (see firebaseClient, firebase/*).
 * Otherwise Supabase remains the default backend.
 */
export function isFirebaseBackend() {
  return (
    import.meta.env.VITE_USE_FIREBASE === "true" &&
    !!import.meta.env.VITE_FIREBASE_API_KEY &&
    !!import.meta.env.VITE_FIREBASE_PROJECT_ID
  );
}
