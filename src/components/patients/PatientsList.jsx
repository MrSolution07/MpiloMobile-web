import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Search, Plus, Filter, UserX } from "lucide-react";
import {
  Card,
  CardContent,
  Button,
  Table,
  Badge,
  Avatar,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableHeaderCell,
} from "../ui";
import { formatDate } from "../../utils";
import { supabase } from "../../services/supabaseClient";

const PatientsList = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [filterOpen, setFilterOpen] = useState(false);
  const [sortField, setSortField] = useState("name");
  const [sortDirection, setSortDirection] = useState("asc");
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('patients')
          .select('*');

        if (error) throw error;

        // Transform data to match our expected format
        const formattedPatients = data.map(patient => ({
          id: patient.id,
          name: `${patient.first_name} ${patient.last_name}`,
          first_name: patient.first_name,
          last_name: patient.last_name,
          age: patient.age,
          phone: patient.phone_number,
          email: patient.email,
          avatar: patient.avatar || `https://ui-avatars.com/api/?name=${patient.first_name}+${patient.last_name}&background=random`,
          lastVisit: patient.last_visit,
          status: patient.status || 'Moderate',
          gender: patient.gender, // Add gender if available in your database
          address: patient.address,
          chronic_conditions: patient.chronic_conditions
        }));

        setPatients(formattedPatients);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching patients:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
  }, []);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const filteredPatients = patients.filter((patient) => {
    const matchesSearch =
      patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.phone.includes(searchQuery);

    const matchesStatus =
      statusFilter === "all" || patient.status.toLowerCase() === statusFilter.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  const sortedPatients = [...filteredPatients].sort((a, b) => {
    let comparison = 0;

    switch (sortField) {
      case "name":
        comparison = a.name.localeCompare(b.name);
        break;
      case "age":
        comparison = a.age - b.age;
        break;
      case "lastVisit":
        comparison = new Date(a.lastVisit) - new Date(b.lastVisit);
        break;
      default:
        comparison = 0;
    }

    return sortDirection === "asc" ? comparison : -comparison;
  });

  const handlePatientClick = (patientId) => {
    navigate(`/patients/${patientId}`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p>Loading patients...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-red-500">Error loading patients: {error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex sm:flex-row flex-col sm:justify-between sm:items-center space-y-2 sm:space-y-0">
        <div>
          <h1 className="font-bold text-gray-900 text-2xl">Patients</h1>
          <p className="mt-1 text-gray-500 text-sm">
            Manage and access patient information
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
          <Link to="/dashboard/patients/add">
            <Button
              variant="danger"
              size="sm"
              icon={<Plus className="w-4 h-4" />}
              className="ml-2"
            >
              Add Patient
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
            placeholder="Search patients by name, email, or phone..."
            className="bg-white py-2 pr-4 pl-10 border border-gray-300 focus:border-gray-300rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-300 w-full text-gray-700"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {filterOpen && (
          <div className="bg-white shadow-sm p-4 border border-gray-200 rounded-lg">
            <div>
              <label className="block mb-1 font-medium text-gray-700 text-sm">
                Status
              </label>
              <div className="flex flex-wrap gap-2">
                <button
                  className={`px-4 py-2 rounded-md text-sm font-medium ${
                    statusFilter === "all"
                      ? "bg-blue-100 text-blue-800"
                      : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                  }`}
                  onClick={() => setStatusFilter("all")}
                >
                  All
                </button>
                <button
                  className={`px-4 py-2 rounded-md text-sm font-medium ${
                    statusFilter === "stable"
                      ? "bg-green-100 text-green-800"
                      : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                  }`}
                  onClick={() => setStatusFilter("stable")}
                >
                  Stable
                </button>
                <button
                  className={`px-4 py-2 rounded-md text-sm font-medium ${
                    statusFilter === "moderate"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                  }`}
                  onClick={() => setStatusFilter("moderate")}
                >
                  Moderate
                </button>
                <button
                  className={`px-4 py-2 rounded-md text-sm font-medium ${
                    statusFilter === "critical"
                      ? "bg-red-100 text-red-800"
                      : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                  }`}
                  onClick={() => setStatusFilter("critical")}
                >
                  Critical
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Patients Table */}
      <Card>
        <CardContent className="p-0">
          {sortedPatients.length > 0 ? (
            <Table striped hoverable>
              <TableHead>
                <TableRow>
                  <TableHeaderCell>Patient</TableHeaderCell>
                  <TableHeaderCell
                    sortable
                    sorted={sortField === "age" ? sortDirection : null}
                    onClick={() => handleSort("age")}
                  >
                    Age
                  </TableHeaderCell>
                  <TableHeaderCell>Contact</TableHeaderCell>
                  <TableHeaderCell
                    sortable
                    sorted={sortField === "lastVisit" ? sortDirection : null}
                    onClick={() => handleSort("lastVisit")}
                  >
                    Last Visit
                  </TableHeaderCell>
                  <TableHeaderCell>Status</TableHeaderCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {sortedPatients.map((patient) => (
                  <TableRow
                    key={patient.id}
                    onClick={() => handlePatientClick(patient.id)}
                    className="cursor-pointer"
                  >
                    <TableCell>
                      <div className="flex items-center">
                        <Avatar
                          src={patient.avatar}
                          alt={patient.name}
                          size="sm"
                          className="mr-3"
                        />
                        <div>
                          <p className="font-medium text-gray-900">
                            {patient.name}
                          </p>
                          <p className="text-gray-500 text-xs">
                            {patient.gender}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{patient.age}</TableCell>
                    <TableCell>
                      <p className="text-sm">{patient.phone}</p>
                      <p className="text-gray-500 text-xs">{patient.email}</p>
                    </TableCell>
                    <TableCell>{formatDate(patient.lastVisit)}</TableCell>
                    <TableCell>
                      <Badge
                        text={patient.status}
                        variant={
                          patient.status.toLowerCase() === "stable"
                            ? "success"
                            : patient.status.toLowerCase() === "moderate"
                            ? "warning"
                            : "danger"
                        }
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="py-10 text-center">
              <UserX className="mx-auto w-12 h-12 text-gray-300" />
              <h3 className="mt-2 font-medium text-gray-900 text-lg">
                No patients found
              </h3>
              <p className="mt-1 text-gray-500 text-sm">
                Try adjusting your search or filter criteria
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PatientsList;
