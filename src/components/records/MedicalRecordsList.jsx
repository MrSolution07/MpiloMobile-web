import { useEffect, useState } from "react";
import {
  FileText,
  Search,
  Filter,
  Plus,
  Calendar,
  FilePlus,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardContent, Button, Badge, Avatar } from "../ui";
import {
  mockMedicalRecords as fetchMedicalRecords,
  mockPatients as fetchPatients,
} from "../../data";
import { formatDate } from "../../utils";
import { Preloader } from "../preloader";

const MedicalRecordsList = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedDiagnosis, setSelectedDiagnosis] = useState("all");

  const [records, setRecords] = useState([]);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadData() {
      setLoading(true);

      try {
        const [recordsData, patientsData] = await Promise.all([
          fetchMedicalRecords(),
          fetchPatients(),
        ]);

        setRecords(recordsData || []);
        setPatients(patientsData || []);
      } catch (err) {
        console.error("Error loading medical records:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  // Get unique diagnoses for filter
  const diagnoses = [
    "all",
    ...new Set(records.map((record) => record.diagnosis)),
  ];

  // Filter records
  const filteredRecords = records.filter((record) => {
    const matchesSearch =
      record?.patient_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record?.diagnosis?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (record.notes &&
        record.notes.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesDiagnosis =
      selectedDiagnosis === "all" || record.diagnosis === selectedDiagnosis;

    return matchesSearch && matchesDiagnosis;
  });

  // Sort records by date (newest first)
  const sortedRecords = [...filteredRecords].sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );

  // Get patient details
  const getPatientDetails = (patientId) => {
    return patients.find((patient) => patient.id === patientId);
  };

  if (loading) return <Preloader />;

  if (error) {
    return <div className="p-6 text-center text-red-600">{error}</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex sm:flex-row flex-col sm:justify-between sm:items-center space-y-2 sm:space-y-0">
        <div>
          <h1 className="font-bold text-gray-900 text-2xl">Medical Records</h1>
          <p className="mt-1 text-gray-500 text-sm">
            View and manage patient medical records
          </p>
        </div>

        <div className="flex space-x-2">
          <Button
            variant="secondary"
            size="sm"
            icon={<Filter className="w-4 h-4" />}
            onClick={() => setFilterOpen(!filterOpen)}
          >
            Filter
          </Button>

          <Link to="/dashboard/newrecord">
            <Button
              variant="primary"
              size="sm"
              icon={<Plus className="w-4 h-4" />}
            >
              New Record
            </Button>
          </Link>
        </div>
      </div>

      {/* Search and filters */}
      <div className="flex flex-col space-y-4">
        <div className="relative">
          <div className="left-0 absolute inset-y-0 flex items-center pl-3 pointer-events-none">
            <Search className="w-5 h-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search by patient, diagnosis, or notes..."
            className="bg-white py-2 pr-4 pl-10 border border-gray-300 focus:border-blue-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full text-gray-700"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {filterOpen && (
          <div className="bg-white shadow-sm p-4 border border-gray-200 rounded-lg">
            <div>
              <label className="block mb-1 font-medium text-gray-700 text-sm">
                Diagnosis
              </label>
              <select
                className="bg-white p-2 border border-gray-300 focus:border-blue-500 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full text-gray-700"
                value={selectedDiagnosis}
                onChange={(e) => setSelectedDiagnosis(e.target.value)}
              >
                {diagnoses.map((diagnosis) => (
                  <option key={diagnosis} value={diagnosis}>
                    {diagnosis === "all" ? "All Diagnoses" : diagnosis}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Records List */}
      <div className="space-y-6">
        {sortedRecords.length > 0 ? (
          sortedRecords.map((record) => {
            const patient = getPatientDetails(record.patient_id);
            return (
              <Card
                key={record.id}
                hoverable
                className="hover:border-blue-200 transition-colors"
              >
                <CardContent className="p-6">
                  <div className="flex md:flex-row flex-col md:items-start">
                    <div className="flex items-center md:mr-6 mb-4 md:mb-0">
                      <Avatar
                        src={patient?.avatar}
                        alt={record?.patient_name || "anon"}
                        size="lg"
                        className="mr-4"
                      />
                      <div>
                        <h3 className="font-medium text-gray-900 text-lg">
                          {record.patient_name}
                        </h3>
                        <p className="text-gray-500 text-sm">
                          Patient ID: {record.patient_id}
                        </p>
                        <div className="flex items-center mt-1">
                          <Calendar className="mr-1 w-4 h-4 text-gray-400" />
                          <span className="text-gray-500 text-sm">
                            {formatDate(record.date)}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex-grow">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <h4 className="font-medium text-gray-900 text-md">
                          Diagnosis:
                        </h4>
                        <Badge text={record.diagnosis} variant="primary" />
                      </div>

                      {record.symptoms.length > 0 && (
                        <div className="mb-3">
                          <h4 className="mb-1 font-medium text-gray-700 text-sm">
                            Symptoms:
                          </h4>
                          <div className="flex flex-wrap gap-1">
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
                        <div className="mb-3">
                          <h4 className="mb-1 font-medium text-gray-700 text-sm">
                            Medications:
                          </h4>
                          <ul className="space-y-1 ml-5 text-gray-700 text-sm list-disc">
                            {record.medications.map((medication, index) => (
                              <li key={index}>
                                <span className="font-medium">
                                  {medication.name}
                                </span>{" "}
                                ({medication.dosage}, {medication.frequency})
                                <span className="ml-1 text-gray-500 text-xs">
                                  started {formatDate(medication.startDate)}
                                  {medication.endDate
                                    ? `, ended ${formatDate(
                                        medication.endDate
                                      )}`
                                    : ""}
                                </span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {record.notes && (
                        <div className="mt-3">
                          <h4 className="mb-1 font-medium text-gray-700 text-sm">
                            Notes:
                          </h4>
                          <p className="bg-gray-50 p-3 rounded-md text-gray-700 text-sm">
                            {record.notes}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-between items-center mt-4 pt-3 border-gray-100 border-t">
                    <div className="text-gray-500 text-sm">
                      Recorded by: {record.doctorName}
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        variant="secondary"
                        size="sm"
                        icon={<FileText className="w-4 h-4" />}
                      >
                        View Full Record
                      </Button>
                      <Button
                        variant="primary"
                        size="sm"
                        icon={<FilePlus className="w-4 h-4" />}
                      >
                        Add Follow-up
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        ) : (
          <div className="bg-white py-10 border border-gray-200 rounded-lg text-center">
            <FileText className="mx-auto w-12 h-12 text-gray-300" />
            <h3 className="mt-2 font-medium text-gray-900 text-lg">
              No medical records found
            </h3>
            <p className="mt-1 text-gray-500 text-sm">
              Try adjusting your search or filter criteria
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MedicalRecordsList;
