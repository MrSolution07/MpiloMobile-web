import React, { useEffect, useCallback, useRef } from "react";
import {
  FaTimes,
  FaUserMd,
  FaNotesMedical,
  FaPills,
  FaCalendarAlt,
  FaUser,
  FaPhone,
  FaMapMarkerAlt,
  FaIdCard,
  FaClinicMedical,
  FaHeartbeat,
  FaWeight,
  FaRuler,
  FaTemperatureHigh,
} from "react-icons/fa";
import profile from "../../../public/assets/images/profileImg.png";

// Very loose type so you can pass the raw Supabase row
type SupabaseMedicalRecord = Record<string, any>;

type Props = {
  open: boolean;
  record: SupabaseMedicalRecord | null; // raw supabase row
  onClose: () => void;
};

const prettyDate = (d?: string | Date) => {
  if (!d) return "—";
  try {
    return new Date(d).toLocaleDateString();
  } catch {
    return String(d);
  }
};

export const RecordPreviewModal: React.FC<Props> = ({ open, record, onClose }) => {
  const dlgRef = useRef<HTMLDivElement | null>(null);

  const onEsc = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose]
  );

  useEffect(() => {
    if (!open) return;
    document.addEventListener("keydown", onEsc);
    return () => document.removeEventListener("keydown", onEsc);
  }, [open, onEsc]);

  if (!open || !record) return null;

  // Map raw record to the same labels/sections you show in the PDF
  const fullName =
    `${record?.first_name ?? ""} ${record?.last_name ?? ""}`.trim() || "Patient";

  const badge =
    record?.record_type === "clinical_note"
      ? "Clinical Visit"
      : record?.record_type === "triage_followup"
      ? "Triage Follow-up"
      : "Medical Record";

  const visitDate =
    typeof record?.date === "string"
      ? record.date
      : record?.date instanceof Date
      ? record.date.toISOString().slice(0, 10)
      : undefined;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center"
      aria-modal="true"
      role="dialog"
      aria-labelledby="record-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Panel */}
      <div
        ref={dlgRef}
        className="relative z-[101] w-[95vw] max-w-4xl rounded-2xl bg-white shadow-xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b px-5 py-4">
          <div className="flex items-center gap-3">
            <img src={profile} alt="" className="h-9 w-9 rounded-full object-cover" />
            <div>
              <h2 id="record-title" className="text-base font-semibold text-gray-900">
                Medical Record Preview
              </h2>
              <p className="text-xs text-gray-500 flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 text-[11px]">
                  {badge}
                </span>
                <span className="text-gray-300">•</span>
                <span>#{String(record?.id ?? "—")}</span>
              </p>
            </div>
          </div>

          <button
            aria-label="Close"
            onClick={onClose}
            className="rounded-full p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition"
          >
            <FaTimes className="h-4 w-4" />
          </button>
        </div>

        {/* Body */}
        <div className="max-h-[75vh] overflow-y-auto px-5 py-5 space-y-6 text-[13px]">
          {/* Top line */}
          <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600">
            <span className="inline-flex items-center gap-2">
              <FaCalendarAlt />
              {prettyDate(visitDate)}
            </span>
            <span className="text-gray-300">•</span>
            <span className="inline-flex items-center gap-2">
              <FaUserMd />
              {`${record?.attending_first_name ?? record?.first_name ?? ""} ${
                record?.attending_last_name ?? record?.last_name ?? ""
              }`.trim() || "Doctor"}
            </span>
            {record?.department && (
              <>
                <span className="text-gray-300">•</span>
                <span className="inline-flex items-center gap-2">
                  <FaClinicMedical />
                  {record.department}
                </span>
              </>
            )}
          </div>

          {/* Patient Information */}
          <Section title="Patient Information" tone="blue">
            <GridField label="Patient ID" icon={<FaIdCard />} value={record?.patient_id || "Auto-generated"} />
            <GridField label="Full Name" icon={<FaUser />} value={fullName} />
            <GridField label="Date of Birth" value={record?.date_of_birth || "—"} />
            <GridField label="Gender" value={record?.gender || "Unknown"} />
            <GridField label="ID Number" value={record?.id_number || "—"} />
            <GridField label="Contact Number" icon={<FaPhone />} value={record?.contact_number || "—"} />
            <GridField label="Address" icon={<FaMapMarkerAlt />} value={record?.address || "—"} full />
            {(record?.medical_aid || record?.medical_aid_number) && (
              <GridField
                label="Medical Aid"
                value={`${record?.medical_aid || ""}${
                  record?.medical_aid && record?.medical_aid_number ? " - " : ""
                }${record?.medical_aid_number || ""}`}
                full
              />
            )}
          </Section>

          {/* Emergency Contact */}
          {(record?.emergency_contact_name || record?.emergency_contact_phone) && (
            <Section title="Emergency Contact" tone="red">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <GridField label="Name" value={record?.emergency_contact_name || "—"} />
                <GridField label="Relationship" value={record?.emergency_contact_relation || "—"} />
                <GridField label="Phone" value={record?.emergency_contact_phone || "—"} />
              </div>
            </Section>
          )}

          {/* Visit Information */}
          <Section title="Visit Information" tone="blue">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <GridField label="Date of Visit" value={prettyDate(visitDate)} />
              <GridField label="Time" value={record?.visit_time || "14:30"} />
              <GridField
                label="Attending Physician"
                icon={<FaUserMd />}
                value={
                  `${record?.attending_first_name ?? record?.first_name ?? ""} ${
                    record?.attending_last_name ?? record?.last_name ?? ""
                  }`.trim() || "Doctor"
                }
              />
              <GridField label="Department" value={record?.department || "General Practice"} />
            </div>
          </Section>

          {/* Vital Signs */}
          <Section title="Vital Signs" tone="blue">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <GridField label="Blood Pressure" icon={<FaHeartbeat />} value={record?.blood_pressure || "N/A"} />
              <GridField label="Heart Rate" value={record?.heart_rate ? `${record.heart_rate} bpm` : "N/A"} />
              <GridField
                label="Temperature"
                icon={<FaTemperatureHigh />}
                value={record?.temperature ? `${record.temperature}°C` : "N/A"}
              />
              <GridField label="Weight" icon={<FaWeight />} value={record?.weight ? `${record.weight} kg` : "N/A"} />
              <GridField label="Height" icon={<FaRuler />} value={record?.height ? `${record.height} cm` : "N/A"} />
              <GridField
                label="Respiratory Rate"
                value={record?.respiratory_rate ? `${record.respiratory_rate}/min` : "N/A"}
              />
            </div>
          </Section>

          {/* Narrative Blocks (match PDF sections/labels) */}
          <Block title="Chief Complaint" value={record?.chief_complaint || record?.symptoms || "No complaint recorded"} />
          {record?.history_of_present_illness && (
            <Block title="History of Present Illness" value={record.history_of_present_illness} />
          )}
          {record?.physical_examination && (
            <Block title="Physical Examination" value={record.physical_examination} />
          )}
          <Block
            title="Diagnosis"
            value={record?.diagnosis || "Pending further evaluation"}
            icon={<FaNotesMedical />}
          />
          {record?.treatment_plan && <Block title="Treatment Plan" value={record.treatment_plan} />}
          {(record?.medications || record?.medications_prescribed) && (
            <Block
              title="Medications Prescribed"
              value={record?.medications || record?.medications_prescribed}
              icon={<FaPills />}
            />
          )}
          {record?.follow_up_instructions && (
            <Block title="Follow-up Instructions" value={record.follow_up_instructions} />
          )}
        </div>
      </div>
    </div>
  );
};

/** UI helpers */
const Section: React.FC<{ title: string; tone?: "blue" | "red"; children: React.ReactNode }> = ({
  title,
  tone = "blue",
  children,
}) => {
  const color =
    tone === "red"
      ? "bg-red-50 border-red-200 text-red-700"
      : "bg-gray-50 border-gray-200 text-blue-800";
  return (
    <section className={`rounded-xl border p-4 ${tone === "red" ? "bg-red-50 border-red-200" : "bg-gray-50"}`}>
      <h3 className={`mb-3 text-sm font-semibold uppercase tracking-wide ${tone === "red" ? "text-red-700" : "text-blue-800"}`}>
        {title}
      </h3>
      {children}
    </section>
  );
};

const GridField: React.FC<{
  label: string;
  value: string;
  icon?: React.ReactNode;
  full?: boolean;
}> = ({ label, value, icon, full }) => (
  <div className={`flex items-start gap-2 ${full ? "md:col-span-2" : ""}`}>
    {icon ? <span className="mt-0.5 text-gray-500">{icon}</span> : null}
    <div className="w-full">
      <div className="text-[12px] font-semibold text-gray-600">{label}</div>
      <div className="text-[13px] text-gray-900">{value || "—"}</div>
    </div>
  </div>
);

const Block: React.FC<{ title: string; value: string; icon?: React.ReactNode }> = ({ title, value, icon }) => (
  <section className="rounded-xl border p-4 bg-white">
    <h3 className="mb-2 flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-blue-800">
      {icon} {title}
    </h3>
    <div className="min-h-[48px] whitespace-pre-wrap rounded border border-gray-200 bg-gray-50 p-3 text-[13px] leading-5 text-gray-800">
      {value || "—"}
    </div>
  </section>
);

export default RecordPreviewModal;