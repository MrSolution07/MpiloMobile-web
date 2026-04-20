/**
 * Template ETL: Postgres (via Supabase) → Firestore.
 * Set env vars; use --dry-run to log counts without writing.
 *
 * Required env:
 *   SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY
 *   GOOGLE_APPLICATION_CREDENTIALS (path to service account JSON)
 *
 * Usage: node migrate-supabase-to-firestore.mjs [--dry-run]
 */
import { randomUUID } from "node:crypto";
import { createClient } from "@supabase/supabase-js";
import admin from "firebase-admin";

const dryRun = process.argv.includes("--dry-run");

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

if (!admin.apps.length) {
  admin.initializeApp();
}

const db = admin.firestore();

async function migrateCollection(tableName, collectionName = tableName) {
  const { data, error } = await supabase.from(tableName).select("*");
  if (error) throw error;
  const rows = data || [];
  console.log(`${tableName}: ${rows.length} rows`);

  if (dryRun || rows.length === 0) return;

  let batch = db.batch();
  let n = 0;
  for (const row of rows) {
    const id = String(row.id ?? randomUUID());
    const ref = db.collection(collectionName).doc(id);
    const { id: _omit, ...rest } = row;
    batch.set(ref, rest);
    n++;
    if (n % 400 === 0) {
      await batch.commit();
      batch = db.batch();
    }
  }
  await batch.commit();
}

async function main() {
  const tables = [
    "patients",
    "doctors",
    "appointments",
    "conversations",
    "messages",
    "triage_cases",
    "medical_records",
    "calls",
    "admins",
    "places",
    "routes",
  ];

  for (const t of tables) {
    await migrateCollection(t);
  }

  console.log(dryRun ? "Dry run complete." : "Migration complete.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
