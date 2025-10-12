import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';

// Type definition for medical record data from Supabase, well i will change this later 
interface MedicalRecordData {
  // Patient Information
  patientId?: string;
  patientName: string;
  dateOfBirth: string;
  gender: string;
  idNumber: string;
  contactNumber: string;
  address: string;
  medicalAid?: string;
  medicalAidNumber?: string;
  
  // Emergency Contact
  emergencyContactName?: string;
  emergencyContactRelation?: string;
  emergencyContactPhone?: string;
  
  // Visit Information
  visitDate?: string;
  visitTime: string;
  attendingPhysician: string;
  department?: string;
  
  // Vital Signs
  bloodPressure?: string;
  heartRate?: string;
  temperature?: string;
  weight?: string;
  height?: string;
  respiratoryRate?: string;
  
  // Medical Information
  chiefComplaint?: string;
  historyOfPresentIllness?: string;
  physicalExamination?: string;
  diagnosis?: string;
  treatmentPlan?: string;
  medications?: string;
  followUpInstructions?: string;
}

// Font registration for professional appearance
// Font.register({
//   family: 'Roboto',
//   src: 'https://fonts.gstatic.com/s/roboto/v27/KFOmCnqEu92Fr1Mu4mxKKTU1Kg.woff2',
// });

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: 'Helvetica',
    fontSize: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    paddingBottom: 15,
    borderBottom: '2px solid #2563eb',
  },
  clinicInfo: {
    flex: 1,
  },
  logo: {
    width: 80,
    height: 60,
    objectFit: 'contain',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 3,
    color: '#1e40af',
  },
  subtitle: {
    fontSize: 11,
    color: '#4b5563',
    marginBottom: 2,
  },
  recordTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 15,
    color: '#dc2626',
    textTransform: 'uppercase',
  },
  section: {
    marginBottom: 15,
    padding: 10,
    backgroundColor: '#f9fafb',
    border: '1px solid #e5e7eb',
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#1e40af',
    textTransform: 'uppercase',
  },
  row: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  label: {
    fontWeight: 'bold',
    width: '35%',
    color: '#374151',
  },
  value: {
    width: '65%',
    color: '#111827',
  },
  vitalsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  vitalsColumn: {
    width: '48%',
  },
  textArea: {
    fontSize: 9,
    lineHeight: 1.4,
    marginTop: 5,
    padding: 5,
    backgroundColor: '#ffffff',
    border: '1px solid #d1d5db',
    minHeight: 40,
  },
  emergencyContact: {
    backgroundColor: '#fef2f2',
    border: '1px solid #fecaca',
    padding: 8,
    marginBottom: 15,
  },
  footer: {
    marginTop: 20,
    paddingTop: 10,
    borderTop: '1px solid #e5e7eb',
    fontSize: 8,
    textAlign: 'center',
    color: '#6b7280',
  },
  signature: {
    marginTop: 25,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  signatureBox: {
    width: '45%',
    paddingTop: 20,
    borderTop: '1px solid #000',
    textAlign: 'center',
    fontSize: 9,
  },
  confidential: {
    position: 'absolute',
    top: 10,
    right: 10,
    fontSize: 8,
    color: '#dc2626',
    fontWeight: 'bold',
    backgroundColor: '#fef2f2',
    padding: 3,
    border: '1px solid #dc2626',
  },
});

// Clinic/Hospital details configuration
const clinicDetails = {
  name: 'Mpilo Mobile',
  address: '123 Medical Drive, Health City, HC 12345',
  phone: '+27 11 123 4567',
  email: 'records@medcare.co.za',
  practiceNumber: 'PR123456789',
  registrationNumber: 'HPCSA-12345'
};

export const RecordPdf = ({ data }: { data: MedicalRecordData }) => {
  const currentDate = new Date().toLocaleDateString();
  const patientAge = data.dateOfBirth 
    ? Math.floor((new Date().getTime() - new Date(data.dateOfBirth).getTime()) / (365.25 * 24 * 60 * 60 * 1000))
    : '';

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Confidential Watermark */}
        <Text style={styles.confidential}>CONFIDENTIAL</Text>

        {/* Header */}
        <View style={styles.header}>
          <View style={styles.clinicInfo}>
            <Text style={styles.title}>{clinicDetails.name}</Text>
            <Text style={styles.subtitle}>{clinicDetails.address}</Text>
            <Text style={styles.subtitle}>Tel: {clinicDetails.phone} | Email: {clinicDetails.email}</Text>
            <Text style={styles.subtitle}>Practice No: {clinicDetails.practiceNumber}</Text>
          </View>
          <View>
            <Image 
              src="/medical-logo.png" 
              style={styles.logo} 
            />
          </View>
        </View>

        <Text style={styles.recordTitle}>Medical Record</Text>

        {/* Patient Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Patient Information</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Patient ID:</Text>
            <Text style={styles.value}>{data.patientId || 'Auto-generated'}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Full Name:</Text>
            <Text style={styles.value}>{data.patientName}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Date of Birth:</Text>
            <Text style={styles.value}>{data.dateOfBirth} {patientAge ? `(Age: ${patientAge})` : ''}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Gender:</Text>
            <Text style={styles.value}>{data.gender}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>ID Number:</Text>
            <Text style={styles.value}>{data.idNumber}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Contact Number:</Text>
            <Text style={styles.value}>{data.contactNumber}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Address:</Text>
            <Text style={styles.value}>{data.address}</Text>
          </View>
          {data.medicalAid && (
            <View style={styles.row}>
              <Text style={styles.label}>Medical Aid:</Text>
              <Text style={styles.value}>{data.medicalAid} - {data.medicalAidNumber}</Text>
            </View>
          )}
        </View>

        {/* Emergency Contact */}
        {data.emergencyContactName && (
          <View style={[styles.section, styles.emergencyContact]}>
            <Text style={styles.sectionTitle}>Emergency Contact</Text>
            <View style={styles.row}>
              <Text style={styles.label}>Name:</Text>
              <Text style={styles.value}>{data.emergencyContactName}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Relationship:</Text>
              <Text style={styles.value}>{data.emergencyContactRelation}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Phone:</Text>
              <Text style={styles.value}>{data.emergencyContactPhone}</Text>
            </View>
          </View>
        )}

        {/* Visit Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Visit Information</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Date of Visit:</Text>
            <Text style={styles.value}>{data.visitDate || currentDate}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Time:</Text>
            <Text style={styles.value}>{data.visitTime}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Attending Physician:</Text>
            <Text style={styles.value}>{data.attendingPhysician}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Department:</Text>
            <Text style={styles.value}>{data.department || 'General Practice'}</Text>
          </View>
        </View>

        {/* Vital Signs */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Vital Signs</Text>
          <View style={styles.vitalsContainer}>
            <View style={styles.vitalsColumn}>
              <View style={styles.row}>
                <Text style={styles.label}>Blood Pressure:</Text>
                <Text style={styles.value}>{data.bloodPressure || 'N/A'}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Heart Rate:</Text>
                <Text style={styles.value}>{data.heartRate ? `${data.heartRate} bpm` : 'N/A'}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Temperature:</Text>
                <Text style={styles.value}>{data.temperature ? `${data.temperature}°C` : 'N/A'}</Text>
              </View>
            </View>
            <View style={styles.vitalsColumn}>
              <View style={styles.row}>
                <Text style={styles.label}>Weight:</Text>
                <Text style={styles.value}>{data.weight ? `${data.weight} kg` : 'N/A'}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Height:</Text>
                <Text style={styles.value}>{data.height ? `${data.height} cm` : 'N/A'}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Respiratory Rate:</Text>
                <Text style={styles.value}>{data.respiratoryRate ? `${data.respiratoryRate}/min` : 'N/A'}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Chief Complaint */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Chief Complaint</Text>
          <Text style={styles.textArea}>{data.chiefComplaint || 'No complaint recorded'}</Text>
        </View>

        {/* History of Present Illness */}
        {data.historyOfPresentIllness && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>History of Present Illness</Text>
            <Text style={styles.textArea}>{data.historyOfPresentIllness}</Text>
          </View>
        )}

        {/* Physical Examination */}
        {data.physicalExamination && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Physical Examination</Text>
            <Text style={styles.textArea}>{data.physicalExamination}</Text>
          </View>
        )}

        {/* Diagnosis */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Diagnosis</Text>
          <Text style={styles.textArea}>{data.diagnosis || 'Pending further evaluation'}</Text>
        </View>

        {/* Treatment Plan */}
        {data.treatmentPlan && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Treatment Plan</Text>
            <Text style={styles.textArea}>{data.treatmentPlan}</Text>
          </View>
        )}

        {/* Medications */}
        {data.medications && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Medications Prescribed</Text>
            <Text style={styles.textArea}>{data.medications}</Text>
          </View>
        )}

        {/* Follow-up Instructions */}
        {data.followUpInstructions && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Follow-up Instructions</Text>
            <Text style={styles.textArea}>{data.followUpInstructions}</Text>
          </View>
        )}

        {/* Signatures */}
        <View style={styles.signature}>
          <View style={styles.signatureBox}>
            <Text>Physician Signature</Text>
            <Text>{data.attendingPhysician}</Text>
            <Text>Date: {currentDate}</Text>
          </View>
          <View style={styles.signatureBox}>
            <Text>Patient/Guardian Signature</Text>
            <Text>{data.patientName}</Text>
            <Text>Date: {currentDate}</Text>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text>This medical record is confidential and protected by patient privacy laws</Text>
          <Text>For medical emergencies, call +27 10 177 or visit your nearest emergency department</Text>
        </View>
      </Page>
    </Document>
  );
};

// Dummy data for testing purposes
export const dummyMedicalData: MedicalRecordData = {
  // Patient Information
  patientId: "PAT-2025-001",
  patientName: "Sarah Johnson",
  dateOfBirth: "1990-03-15",
  gender: "Female",
  idNumber: "9003155678123",
  contactNumber: "+27 82 123 4567",
  address: "456 Oak Street, Cape Town, Western Cape, 8001",
  medicalAid: "Discovery Health",
  medicalAidNumber: "DH123456789",
  
  // Emergency Contact
  emergencyContactName: "John Johnson",
  emergencyContactRelation: "Spouse",
  emergencyContactPhone: "+27 83 987 6543",
  
  // Visit Information
  visitDate: "2025-08-04",
  visitTime: "14:30",
  attendingPhysician: "Dr. Michael Smith",
  department: "Internal Medicine",
  
  // Vital Signs
  bloodPressure: "120/80",
  heartRate: "72",
  temperature: "36.5",
  weight: "65",
  height: "165",
  respiratoryRate: "16",
  
  // Medical Information
  chiefComplaint: "Patient complains of persistent headaches for the past 3 days, accompanied by mild nausea and sensitivity to light.",
  historyOfPresentIllness: "Patient reports that headaches started gradually 3 days ago, worsening progressively. Pain is described as throbbing, located primarily in the frontal region. No recent trauma or fever. Patient has been taking paracetamol with minimal relief.",
  physicalExamination: "Patient appears alert and oriented. Vital signs stable. Neurological examination reveals no focal deficits. Pupils equal, round, and reactive to light. Neck supple, no meningeal signs. Cardiovascular and respiratory systems normal.",
  diagnosis: "Tension-type headache, likely stress-related",
  treatmentPlan: "Recommend stress management techniques, adequate sleep, and hydration. Prescribe stronger analgesics if symptoms persist. Follow-up in 1 week if no improvement.",
  medications: "1. Ibuprofen 400mg - Take twice daily with food for 5 days\n2. Rizatriptan 10mg - As needed for severe headache (max 2 tablets per day)",
  followUpInstructions: "Return if headaches worsen or if new symptoms develop (fever, vision changes, confusion). Schedule follow-up appointment in 1 week. Maintain headache diary."
};

export default RecordPdf;