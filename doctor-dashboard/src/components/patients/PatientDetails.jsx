import { useParams, Link } from "react-router-dom";
import {
  ChevronLeft,
  Calendar,
  FileText,
  AlertTriangle,
  Mail,
  Phone,
  MapPin,
  CreditCard,
  Edit,
  Heart,
} from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Button,
  Badge,
  Avatar,
} from "../ui";
import { mockPatients, mockAppointments, mockMedicalRecords } from "../../data";
import { formatDate } from "../../utils";

function PatientDetails() {
  const { id } = useParams();
  const patient = mockPatients.find((p) => p.id === id);

  if (!patient) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="text-center">
          <AlertTriangle className="mx-auto w-12 h-12 text-yellow-500" />
          <h3 className="mt-2 font-medium text-gray-900 text-lg">
            Patient Not Found
          </h3>
          <p className="mt-1 text-gray-500 text-sm">
            The patient you are looking for does not exist or has been removed.
          </p>
          <div className="mt-6">
            <Link to="/dashboard/patients">
              <Button variant="primary">Back to Patients</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Get patient's appointments and records
  const patientAppointments = mockAppointments
    .filter((a) => a.patientId === id)
    .sort(
      (a, b) =>
        new Date(b.date + "T" + b.time) - new Date(a.date + "T" + a.time)
    );

  const patientRecords = mockMedicalRecords
    .filter((r) => r.patientId === id)
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  return (
    <div className="space-y-6">
      <div>
        <Link
          to="/dashboard/patients"
          className="inline-flex items-center text-blue-600 hover:text-blue-800"
        >
          <ChevronLeft className="mr-1 w-4 h-4" />
          Back to Patients
        </Link>
      </div>

      {/* Patient Overview */}
      <div className="gap-6 grid grid-cols-1 lg:grid-cols-3">
        {/* Profile Card */}
        <Card className="lg:col-span-1">
          <CardContent className="p-6">
            <div className="flex flex-col items-center text-center">
              <Avatar
                src={patient.avatar}
                alt={patient.name}
                size="xl"
                status={
                  patient.status === "critical"
                    ? "busy"
                    : patient.status === "moderate"
                    ? "away"
                    : "online"
                }
                className="mb-4"
              />
              <h2 className="font-bold text-gray-900 text-xl">
                {patient.name}
              </h2>
              <p className="text-gray-500 text-sm">
                {patient.age} years • {patient.gender}
              </p>
              <div className="mt-2">
                <Badge
                  text={patient.status}
                  variant={
                    patient.status === "stable"
                      ? "success"
                      : patient.status === "moderate"
                      ? "warning"
                      : "danger"
                  }
                />
              </div>

              <div className="space-y-4 mt-6 w-full">
                <div className="flex items-center">
                  <Mail className="mr-3 w-5 h-5 text-gray-400" />
                  <div className="text-left">
                    <p className="text-gray-500 text-xs">Email</p>
                    <p className="text-gray-900 text-sm">{patient.email}</p>
                  </div>
                </div>

                <div className="flex items-center">
                  <Phone className="mr-3 w-5 h-5 text-gray-400" />
                  <div className="text-left">
                    <p className="text-gray-500 text-xs">Phone</p>
                    <p className="text-gray-900 text-sm">{patient.phone}</p>
                  </div>
                </div>

                <div className="flex items-center">
                  <MapPin className="mr-3 w-5 h-5 text-gray-400" />
                  <div className="text-left">
                    <p className="text-gray-500 text-xs">Address</p>
                    <p className="text-gray-900 text-sm">{patient.address}</p>
                  </div>
                </div>

                <div className="flex items-center">
                  <CreditCard className="mr-3 w-5 h-5 text-gray-400" />
                  <div className="text-left">
                    <p className="text-gray-500 text-xs">Insurance</p>
                    <p className="text-gray-900 text-sm">
                      {patient.insuranceProvider}
                    </p>
                    <p className="text-gray-500 text-xs">
                      {patient.insuranceNumber}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6 w-full">
                <Button
                  variant="primary"
                  size="sm"
                  fullWidth
                  icon={<Edit className="w-4 h-4" />}
                >
                  Edit Patient Info
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Medical Records */}
        <Card className="lg:col-span-2">
          <CardHeader className="border-gray-100 border-b">
            <div className="flex justify-between items-center">
              <CardTitle className="flex items-center font-medium text-lg">
                <Heart className="mr-2 w-5 h-5 text-red-500" />
                Medical Records
              </CardTitle>
              <Link to="/dashboard/records">
                <Button variant="ghost" size="sm">
                  View All Records
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {patientRecords.length > 0 ? (
              <div className="divide-y divide-gray-100">
                {patientRecords.map((record) => (
                  <div key={record.id} className="hover:bg-gray-50 p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-gray-900">
                          {record.diagnosis}
                        </p>
                        <p className="mt-1 text-gray-500 text-sm">
                          {formatDate(record.date)}
                        </p>
                      </div>
                      <Badge
                        text="View Details"
                        variant="primary"
                        size="small"
                      />
                    </div>

                    {record.symptoms.length > 0 && (
                      <div className="mt-2">
                        <p className="font-medium text-gray-500 text-xs">
                          Symptoms:
                        </p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {record.symptoms.map((symptom, index) => (
                            <Badge
                              key={index}
                              text={symptom}
                              variant="neutral"
                              size="small"
                            />
                          ))}
                        </div>
                      </div>
                    )}

                    {record.medications.length > 0 && (
                      <div className="mt-2">
                        <p className="font-medium text-gray-500 text-xs">
                          Medications:
                        </p>
                        <ul className="space-y-1 mt-1 text-gray-700 text-sm">
                          {record.medications.map((medication, index) => (
                            <li key={index}>
                              {medication.name} ({medication.dosage},{" "}
                              {medication.frequency})
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {record.notes && (
                      <div className="bg-gray-50 mt-2 p-2 rounded-md">
                        <p className="font-medium text-gray-500 text-xs">
                          Notes:
                        </p>
                        <p className="mt-1 text-gray-700 text-sm">
                          {record.notes}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-8 text-center">
                <FileText className="mx-auto w-10 h-10 text-gray-300" />
                <p className="mt-2 font-medium text-gray-900 text-sm">
                  No medical records
                </p>
                <p className="text-gray-500 text-xs">
                  This patient has no medical records yet
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Appointments */}
      <Card>
        <CardHeader className="border-gray-100 border-b">
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center font-medium text-lg">
              <Calendar className="mr-2 w-5 h-5 text-blue-600" />
              Appointments
            </CardTitle>
            <Button
              variant="primary"
              size="sm"
              icon={<Plus className="w-4 h-4" />}
            >
              Schedule Appointment
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {patientAppointments.length > 0 ? (
            <div className="divide-y divide-gray-100">
              {patientAppointments.map((appointment) => (
                <div
                  key={appointment.id}
                  className="flex justify-between items-center hover:bg-gray-50 p-4"
                >
                  <div className="flex items-center">
                    <div className="flex flex-col justify-center items-center bg-blue-100 mr-4 p-2 rounded-lg w-12 h-12 text-blue-800 text-center">
                      <span className="font-medium text-xs">
                        {formatDate(appointment.date).split(" ")[1]}
                      </span>
                      <span className="text-xs">
                        {formatDate(appointment.date).split(" ")[0]}
                      </span>
                    </div>

                    <div>
                      <p className="font-medium text-gray-900">
                        {appointment.type} ({appointment.duration} min)
                      </p>
                      <p className="text-gray-500 text-sm">
                        {formatDate(appointment.date)}, {appointment.time}
                      </p>
                      {appointment.notes && (
                        <p className="mt-1 text-gray-500 text-xs">
                          {appointment.notes}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center">
                    <Badge
                      text={appointment.status}
                      variant={
                        appointment.status === "scheduled"
                          ? "primary"
                          : appointment.status === "completed"
                          ? "success"
                          : appointment.status === "cancelled"
                          ? "danger"
                          : "warning"
                      }
                    />
                    <button className="ml-4 text-gray-400 hover:text-gray-600">
                      <Edit className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-8 text-center">
              <Calendar className="mx-auto w-10 h-10 text-gray-300" />
              <p className="mt-2 font-medium text-gray-900 text-sm">
                No appointments
              </p>
              <p className="text-gray-500 text-xs">
                This patient has no scheduled appointments
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default PatientDetails;
