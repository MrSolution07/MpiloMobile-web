import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
} from "firebase/firestore";
import { getFirestoreDb } from "../firebaseClient";

/**
 * Mirrors useBookings Supabase flow: resolve patient by auth user_id, then list appointments.
 * Expects Firestore collections: `patients`, `appointments`, `doctors` with same field names as Postgres.
 */
export async function fetchBookingsForUser(userId) {
  const firestoreDb = getFirestoreDb();
  const patientsQ = query(
    collection(firestoreDb, "patients"),
    where("user_id", "==", userId)
  );
  const patientSnap = await getDocs(patientsQ);
  if (patientSnap.empty) {
    throw new Error("Patient profile not found");
  }
  const patientDoc = patientSnap.docs[0];
  const patientId = patientDoc.id;

  const apptQ = query(
    collection(firestoreDb, "appointments"),
    where("patient_id", "==", patientId),
    orderBy("scheduled_datetime", "asc")
  );
  const apptSnap = await getDocs(apptQ);
  const bookings = [];

  for (const d of apptSnap.docs) {
    const data = d.data();
    let doctors = null;
    const doctorId = data.doctor_id;
    if (doctorId) {
      const ref = doc(firestoreDb, "doctors", doctorId);
      const ds = await getDoc(ref);
      if (ds.exists()) {
        const dr = ds.data();
        doctors = {
          first_name: dr.first_name,
          last_name: dr.last_name,
          specialization: dr.specialization,
          profile_image_url: dr.profile_image_url,
        };
      }
    }
    bookings.push({
      id: d.id,
      ...data,
      doctors,
    });
  }

  return bookings;
}
