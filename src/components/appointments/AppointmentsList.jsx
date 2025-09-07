import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Calendar, Filter, Search, Plus } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Button,
  Badge,
  Avatar,
} from "../ui";
import {
  mockAppointments as fetchAppointments,
  mockPatients as fetchPatients,
} from "../../data";
import {
  formatDate,
  formatTime,
  getRelativeDateLabel,
  groupAppointmentsByDate,
} from "../../utils";

function AppointmentsList() {
  const [view, setView] = useState("list");
  const [filterOpen, setFilterOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");

  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setLoading(true);

      try {
        const [apptData, patientData] = await Promise.all([
          fetchAppointments(),
          fetchPatients(),
        ]);
        setAppointments(apptData || []);
        setPatients(patientData || []);
      } catch (error) {
        console.error("Error loading appointments or patients:", error);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  // appointment types for filter
  const appointmentTypes = [
    "all",
    ...new Set(appointments.map((app) => app.type)),
  ];

  // filter appointments based on search query and filters
  const filteredAppointments = appointments.filter((appointment) => {
    const matchesSearch =
      appointment?.patientName
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      (appointment?.notes &&
        appointment?.notes.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus =
      statusFilter === "all" || appointment.status === statusFilter;
    const matchesType = typeFilter === "all" || appointment.type === typeFilter;

    return matchesSearch && matchesStatus && matchesType;
  });

  // group appointments by date
  const groupedAppointments = groupAppointmentsByDate(filteredAppointments);

  const getPatientDetails = (patientId) => {
    return patients.find((patient) => patient.id === patientId);
  };

  return (
    <div className="space-y-6">
      <div className="flex sm:flex-row flex-col sm:justify-between sm:items-center space-y-2 sm:space-y-0">
        <div>
          <h1 className="font-bold text-gray-900 text-2xl">Appointments</h1>
          <p className="mt-1 text-gray-500 text-sm">
            Manage and view all patient appointments
          </p>
        </div>

        <div className="flex space-x-2">
          <Button
            variant="secondary"
            size="sm"
            icon={<Filter className="w-4 h-4" />}
            onClick={() => setFilterOpen(!filterOpen)}
            className="mr-2"
          >
            Filter
          </Button>
          <div className="flex border border-gray-200 rounded-md overflow-hidden ml-2">
            <button
              className={`px-3 py-1.5 text-sm font-medium ${
                view === "list"
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-50"
              }`}
              onClick={() => setView("list")}
            >
              List
            </button>
            <button
              className={`px-3 py-1.5 text-sm font-medium ${
                view === "calendar"
                  ? "bg-blue-600 text-white"

                  : "bg-white text-gray-700 hover:bg-gray-50"
              }`}
              onClick={() => setView("calendar")}
            >
              Calendar
            </button>
          </div>

          <Link to="/dashboard/newappointment">
            <Button
              variant="primary"
              size="sm"
              icon={<Plus className="w-4 h-4" />}
            >
              New Appointment
            </Button>
          </Link>

        </div>
      </div>

      <div className="flex flex-col space-y-4">
        <div className="relative">
          <div className="left-0 absolute inset-y-0 flex items-center pl-3 pointer-events-none">
            <Search className="w-5 h-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search appointments..."
            className="bg-white py-2 pr-4 pl-10 border border-gray-300 focus:border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-300 w-full text-gray-700"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {filterOpen && (
          <div className="gap-4 grid grid-cols-1 sm:grid-cols-2 bg-white shadow-sm p-4 border border-gray-200 rounded-lg">
            <div>
              <label className="block mb-1 font-medium text-gray-700 text-sm">
                Status
              </label>
              <select
                className="bg-white p-2 border border-gray-300 focus:border-blue-500 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full text-gray-700"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Statuses</option>
                <option value="scheduled">Scheduled</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
                <option value="no-show">No Show</option>
              </select>
            </div>

            <div>
              <label className="block mb-1 font-medium text-gray-700 text-sm">
                Type
              </label>
              <select
                className="bg-white p-2 border border-gray-300 focus:border-blue-500 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full text-gray-700"
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
              >
                {appointmentTypes.map((type) => (
                  <option key={type} value={type}>
                    {type === "all" ? "All Types" : type}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}
      </div>

      {loading ? (
        <div className="text-center py-10 text-gray-500">
          Loading appointments...
        </div>
      ) : (
        view === "list" && (
          <div className="space-y-6">
            {Object.keys(groupedAppointments).length > 0 ? (
              Object.keys(groupedAppointments)
                .sort()
                .map((date) => (
                  <Card key={date}>
                    <CardHeader className="bg-gray-50 border-gray-100 border-b">
                      <CardTitle className="font-medium text-gray-900 text-lg">
                        {getRelativeDateLabel(date)} - {formatDate(date)}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="divide-y divide-gray-100">
                      {groupedAppointments[date]
                        .sort((a, b) => a.time.localeCompare(b.time))
                        .map((appointment) => {
                          const patient = getPatientDetails(
                            appointment.patientId
                          );
                          return (
                            <div
                              key={appointment.id}
                              className="flex items-center hover:bg-gray-50 -mx-2 px-2 py-4 first:pt-2 last:pb-2 rounded-md transition-colors"
                            >
                              <div className="flex-shrink-0 mr-4">
                                <div className="flex flex-col justify-center items-center w-16 text-center">
                                  <span className="font-semibold text-gray-900 text-sm">
                                    {formatTime(appointment.time)}
                                  </span>
                                  <span className="mt-1 text-gray-500 text-xs">
                                    {appointment.duration} min
                                  </span>
                                </div>
                              </div>

                              <div className="flex-shrink-0 mr-4">
                                <Avatar
                                  src={patient?.avatar}
                                  alt={appointment?.patientName || "anon"}
                                  size="md"
                                  status={
                                    patient?.status === "critical"
                                      ? "busy"
                                      : patient?.status === "moderate"
                                      ? "away"
                                      : "online"
                                  }
                                />
                              </div>

                              <div className="flex-grow min-w-0">
                                <p className="font-medium text-gray-900 text-sm">
                                  {appointment.patientName}
                                </p>
                                <div className="flex items-center mt-1">
                                  <Badge
                                    text={appointment.type}
                                    variant="primary"
                                    size="small"
                                  />
                                  {patient?.status === "critical" && (
                                    <Badge
                                      text="Critical"
                                      variant="danger"
                                      size="small"
                                      className="ml-2"
                                    />
                                  )}
                                </div>
                                {appointment.notes && (
                                  <p className="mt-1 text-gray-500 text-xs line-clamp-1">
                                    {appointment.notes}
                                  </p>
                                )}
                              </div>

                              <div className="flex-shrink-0 ml-4">
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
                              </div>
                            </div>
                          );
                        })}
                    </CardContent>
                  </Card>
                ))
            ) : (
              <div className="bg-white py-10 border border-gray-200 rounded-lg text-center">
                <Calendar className="mx-auto w-12 h-12 text-gray-300" />
                <h3 className="mt-2 font-medium text-gray-900 text-lg">
                  No appointments found
                </h3>
                <p className="mt-1 text-gray-500 text-sm">
                  Try adjusting your search or filter criteria
                </p>
              </div>
            )}
          </div>
        )
      )}

      {view === "calendar" && (
        <Card>
          <CardContent className="p-6">
            <div className="py-10 text-center">
              <Calendar className="mx-auto w-12 h-12 text-gray-400" />
              <h3 className="mt-2 font-medium text-gray-900 text-lg">
                Calendar View
              </h3>
              <p className="mt-1 text-gray-500 text-sm">
                Calendar view would be implemented here with a full monthly
                calendar
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default AppointmentsList;
