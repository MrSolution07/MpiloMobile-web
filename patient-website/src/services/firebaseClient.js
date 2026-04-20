import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { isFirebaseBackend } from "./backendConfig";

function ensureApp() {
  if (!isFirebaseBackend()) {
    throw new Error("Firebase is not configured (set VITE_USE_FIREBASE and env vars).");
  }
  if (getApps().length) return getApps()[0];
  return initializeApp({
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
  });
}

/** @returns {import('firebase/auth').Auth} */
export function getFirebaseAuth() {
  return getAuth(ensureApp());
}

/** @returns {import('firebase/firestore').Firestore} */
export function getFirestoreDb() {
  return getFirestore(ensureApp());
}
