import { supabase } from "../services";

export const currentUser = async () => {
  const { data, error } = await supabase
    .from("mock_users")
    .select("*")
    .eq("id", "u1")
    .single();

  if (error) {
    console.error("Error fetching current user:", error);
    return null;
  }
  return data;
};

export const mockPatients = async () => {
  const { data, error } = await supabase.from("mock_patients").select("*");

  if (error) {
    console.error("Error fetching patients:", error);
    return [];
  }
  return data;
};

export const mockAppointments = async () => {
  const { data, error } = await supabase.from("mock_appointments").select("*");

  if (error) {
    console.error("Error fetching appointments:", error);
    return [];
  }
  return data;
};

export const mockMessages = async (userId = "u1") => {
  const { data, error } = await supabase
    .from("mock_messages")
    .select("*")
    .or(`sender_id.eq.${userId},recipient_id.eq.${userId}`);

  if (error) {
    console.error("Error fetching messages:", error);
    return [];
  }
  return data;
};

export const mockMedicalRecords = async () => {
  const { data, error } = await supabase
    .from("mock_medical_records")
    .select("*");

  if (error) {
    console.error("Error fetching medical records:", error);
    return [];
  }
  return data;
};

export const mockTriageCases = async () => {
  const { data, error } = await supabase.from("mock_triage_cases").select("*");

  if (error) {
    console.error("Error fetching triage cases:", error);
    return [];
  }
  return data;
};

export const mockTasks = async () => {
  const { data, error } = await supabase.from("mock_tasks").select("*");

  if (error) {
    console.error("Error fetching tasks:", error);
    return [];
  }
  return data;
};

export const getDashboardStats = async (userId = "u1") => {
  const today = new Date().toISOString().split("T")[0];

  const { data: appointments, error: appError } = await supabase
    .from("mock_appointments")
    .select("*")
    .eq("date", today);

  const { data: messages, error: msgError } = await supabase
    .from("mock_messages")
    .select("*")
    .eq("recipient_id", userId)
    .eq("read", false);

  const { data: patients, error: patError } = await supabase
    .from("mock_patients")
    .select("*")
    .eq("status", "critical");

  const { data: triage, error: triageError } = await supabase
    .from("mock_triage_cases")
    .select("*")
    .in("status", ["waiting", "in-progress"]);

  return {
    appointmentsToday: appError ? 0 : appointments.length,
    pendingMessages: msgError ? 0 : messages.length,
    criticalPatients: patError ? 0 : patients.length,
    triageCases: triageError ? 0 : triage.length,
  };
};
