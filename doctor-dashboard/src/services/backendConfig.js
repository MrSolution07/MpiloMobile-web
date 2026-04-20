export function isFirebaseBackend() {
  return (
    import.meta.env.VITE_USE_FIREBASE === "true" &&
    !!import.meta.env.VITE_FIREBASE_API_KEY &&
    !!import.meta.env.VITE_FIREBASE_PROJECT_ID
  );
}
