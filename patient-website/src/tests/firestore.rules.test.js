import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { afterAll, beforeAll, describe, it } from "vitest";
import {
  assertFails,
  assertSucceeds,
  initializeTestEnvironment,
} from "@firebase/rules-unit-testing";

const __dirname = dirname(fileURLToPath(import.meta.url));
const rulesPath = join(__dirname, "../../../firestore.rules");
const rules = readFileSync(rulesPath, "utf8");

/** Set by `firebase emulators:exec` or when Firestore emulator is running. */
const emulatorHost = process.env.FIRESTORE_EMULATOR_HOST;

let testEnv;

describe.skipIf(!emulatorHost)("Firestore rules (requires emulator)", () => {
  beforeAll(async () => {
    const [host, portStr] = emulatorHost.split(":");
    const port = Number(portStr);
    testEnv = await initializeTestEnvironment({
      projectId: "demo-mpilo-rules",
      firestore: { rules, host, port },
    });
  });

  afterAll(async () => {
    if (testEnv) await testEnv.cleanup();
  });

  it("denies unauthenticated read on patients", async () => {
    const db = testEnv.unauthenticatedContext().firestore();
    await assertFails(db.collection("patients").doc("x").get());
  });

  it("allows authenticated user to read own patient doc when user_id matches", async () => {
    const uid = "user-1";
    const ctx = testEnv.authenticatedContext(uid);
    const db = ctx.firestore();
    await assertSucceeds(
      db.collection("patients").doc("p1").set({ user_id: uid, name: "Test" })
    );
    await assertSucceeds(db.collection("patients").doc("p1").get());
  });

  it("fails read when user_id does not match", async () => {
    const ctx = testEnv.authenticatedContext("other");
    const db = ctx.firestore();
    await assertFails(db.collection("patients").doc("p1").get());
  });
});
