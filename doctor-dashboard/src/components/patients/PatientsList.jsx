// import { useState, useEffect } from "react";
// import { Link } from "react-router-dom";
// import { Search, Plus, Filter, UserX } from "lucide-react";
// import {
//   Card,
//   CardContent,
//   Button,
//   Table,
//   Badge,
//   Avatar,
//   TableHead,
//   TableBody,
//   TableRow,
//   TableCell,
//   TableHeaderCell,
// } from "../ui";
// import { formatDate } from "../../utils";
// import { supabase } from "../../services/supabaseClient";

// const PatientsList = () => {
//   const [searchQuery, setSearchQuery] = useState("");
//   const [statusFilter, setStatusFilter] = useState("all");
//   const [filterOpen, setFilterOpen] = useState(false);
//   const [sortField, setSortField] = useState("name");
//   const [sortDirection, setSortDirection] = useState("asc");
//   const [patients, setPatients] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchPatients = async () => {
//       try {
//         setLoading(true);
//         const { data, error } = await supabase
//           .from('patients')
//           .select('*');

//         if (error) throw error;

//         // Transform data to match our expected format
//         const formattedPatients = data.map(patient => ({
//           id: patient.id,
//           name: `${patient.first_name} ${patient.last_name}`,
//           first_name: patient.first_name,
//           last_name: patient.last_name,
//           age: patient.age,
//           phone: patient.phone_number,
//           email: patient.email,
//           avatar: patient.avatar || `https://ui-avatars.com/api/?name=${patient.first_name}+${patient.last_name}&background=random`,
//           lastVisit: patient.last_visit,
//           status: patient.status || 'Moderate',
//           gender: patient.gender,
//           address: patient.address,
//           chronic_conditions: patient.chronic_conditions
//         }));

//         setPatients(formattedPatients);
//       } catch (err) {
//         setError(err.message);
//         console.error('Error fetching patients:', err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchPatients();
//   }, []);

//   const handleSort = (field) => {
//     if (sortField === field) {
//       setSortDirection(sortDirection === "asc" ? "desc" : "asc");
//     } else {
//       setSortField(field);
//       setSortDirection("asc");
//     }
//   };

//   const filteredPatients = patients.filter((patient) => {
//     const matchesSearch =
//       patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       patient.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       patient.phone.includes(searchQuery);

//     const matchesStatus =
//       statusFilter === "all" || patient.status.toLowerCase() === statusFilter.toLowerCase();

//     return matchesSearch && matchesStatus;
//   });

//   const sortedPatients = [...filteredPatients].sort((a, b) => {
//     let comparison = 0;

//     switch (sortField) {
//       case "name":
//         comparison = a.name.localeCompare(b.name);
//         break;
//       case "age":
//         comparison = a.age - b.age;
//         break;
//       case "lastVisit":
//         comparison = new Date(a.lastVisit) - new Date(b.lastVisit);
//         break;
//       default:
//         comparison = 0;
//     }

//     return sortDirection === "asc" ? comparison : -comparison;
//   });

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-64">
//         <p>Loading patients...</p>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="flex justify-center items-center h-64">
//         <p className="text-red-500">Error loading patients: {error}</p>
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-6">
//       <div className="flex sm:flex-row flex-col sm:justify-between sm:items-center space-y-2 sm:space-y-0">
//         <div>
//           <h1 className="font-bold text-gray-900 text-2xl">Patients</h1>
//           <p className="mt-1 text-gray-500 text-sm">
//             Manage and access patient information
//           </p>
//         </div>

//         <div className="flex space-x-2">
//           <Button
//             variant="secondary"
//             size="sm"
//             icon={<Filter className="w-4 h-4" />}
//             onClick={() => setFilterOpen(!filterOpen)}
//             className="mr-2"
//           >
//             Filter
//           </Button>
//           <Link to="/dashboard/patients/add">
//             <Button
//               variant="danger"
//               size="sm"
//               icon={<Plus className="w-4 h-4" />}
//               className="ml-2"
//             >
//               Add Patient
//             </Button>
//           </Link>
//         </div>
//       </div>

//       {/* Search and filters */}
//       <div className="flex flex-col space-y-4">
//         <div className="relative">
//           <div className="left-0 absolute inset-y-0 flex items-center pl-3 pointer-events-none">
//             <Search className="w-5 h-5 text-gray-400" />
//           </div>
//           <input
//             type="text"
//             placeholder="Search patients by name, email, or phone..."
//             className="bg-white py-2 pr-4 pl-10 border border-gray-300 focus:border-gray-300rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-300 w-full text-gray-700"
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//           />
//         </div>

//         {filterOpen && (
//           <div className="bg-white shadow-sm p-4 border border-gray-200 rounded-lg">
//             <div>
//               <label className="block mb-1 font-medium text-gray-700 text-sm">
//                 Status
//               </label>
//               <div className="flex flex-wrap gap-2">
//                 <button
//                   className={`px-4 py-2 rounded-md text-sm font-medium ${
//                     statusFilter === "all"
//                       ? "bg-blue-100 text-blue-800"
//                       : "bg-gray-100 text-gray-800 hover:bg-gray-200"
//                   }`}
//                   onClick={() => setStatusFilter("all")}
//                 >
//                   All
//                 </button>
//                 <button
//                   className={`px-4 py-2 rounded-md text-sm font-medium ${
//                     statusFilter === "stable"
//                       ? "bg-green-100 text-green-800"
//                       : "bg-gray-100 text-gray-800 hover:bg-gray-200"
//                   }`}
//                   onClick={() => setStatusFilter("stable")}
//                 >
//                   Stable
//                 </button>
//                 <button
//                   className={`px-4 py-2 rounded-md text-sm font-medium ${
//                     statusFilter === "moderate"
//                       ? "bg-yellow-100 text-yellow-800"
//                       : "bg-gray-100 text-gray-800 hover:bg-gray-200"
//                   }`}
//                   onClick={() => setStatusFilter("moderate")}
//                 >
//                   Moderate
//                 </button>
//                 <button
//                   className={`px-4 py-2 rounded-md text-sm font-medium ${
//                     statusFilter === "critical"
//                       ? "bg-red-100 text-red-800"
//                       : "bg-gray-100 text-gray-800 hover:bg-gray-200"
//                   }`}
//                   onClick={() => setStatusFilter("critical")}
//                 >
//                   Critical
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>

//       {/* Patients Table */}
//       <Card>
//         <CardContent className="p-0">
//           {sortedPatients.length > 0 ? (
//             <Table striped hoverable>
//               <TableHead>
//                 <TableRow>
//                   <TableHeaderCell>Patient</TableHeaderCell>
//                   <TableHeaderCell
//                     sortable
//                     sorted={sortField === "age" ? sortDirection : null}
//                     onClick={() => handleSort("age")}
//                   >
//                     Age
//                   </TableHeaderCell>
//                   <TableHeaderCell>Contact</TableHeaderCell>
//                   <TableHeaderCell
//                     sortable
//                     sorted={sortField === "lastVisit" ? sortDirection : null}
//                     onClick={() => handleSort("lastVisit")}
//                   >
//                     Last Visit
//                   </TableHeaderCell>
//                   <TableHeaderCell>Status</TableHeaderCell>
//                 </TableRow>
//               </TableHead>
//               <TableBody>
//                 {sortedPatients.map((patient) => (
//                   <TableRow key={patient.id}>
//                     <TableCell>
//                       <div className="flex items-center">
//                         <Avatar
//                           src={patient.avatar}
//                           alt={patient.name}
//                           size="sm"
//                           className="mr-3"
//                         />
//                         <div>
//                           <p className="font-medium text-gray-900">
//                             {patient.name}
//                           </p>
//                           <p className="text-gray-500 text-xs">
//                             {patient.gender}
//                           </p>
//                         </div>
//                       </div>
//                     </TableCell>
//                     <TableCell>{patient.age}</TableCell>
//                     <TableCell>
//                       <p className="text-sm">{patient.phone}</p>
//                       <p className="text-gray-500 text-xs">{patient.email}</p>
//                     </TableCell>
//                     <TableCell>{formatDate(patient.lastVisit)}</TableCell>
//                     <TableCell>
//                       <Badge
//                         text={patient.status}
//                         variant={
//                           patient.status.toLowerCase() === "stable"
//                             ? "success"
//                             : patient.status.toLowerCase() === "moderate"
//                             ? "warning"
//                             : "danger"
//                         }
//                       />
//                     </TableCell>
//                   </TableRow>
//                 ))}
//               </TableBody>
//             </Table>
//           ) : (
//             <div className="py-10 text-center">
//               <UserX className="mx-auto w-12 h-12 text-gray-300" />
//               <h3 className="mt-2 font-medium text-gray-900 text-lg">
//                 No patients found
//               </h3>
//               <p className="mt-1 text-gray-500 text-sm">
//                 Try adjusting your search or filter criteria
//               </p>
//             </div>
//           )}
//         </CardContent>
//       </Card>
//     </div>
//   );
// };

// export default PatientsList;






import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Search, Plus, Filter, UserX, Calendar } from "lucide-react";
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
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [dateRange, setDateRange] = useState({
    start: "",
    end: ""
  });
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
          .select('*')
          .order('created_at', { ascending: false });

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
          avatar: patient.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(patient.first_name)}+${encodeURIComponent(patient.last_name)}&background=random`,
          lastVisit: patient.last_visit,
          status: patient.status || 'moderate',
          gender: patient.gender,
          address: patient.address,
          chronic_conditions: patient.chronic_conditions,
          created_at: patient.created_at,
          updated_at: patient.updated_at
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
    // Safe search - handle null/undefined values
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch = 
      (patient.name?.toLowerCase() || '').includes(searchLower) ||
      (patient.email?.toLowerCase() || '').includes(searchLower) ||
      (patient.phone?.toString() || '').includes(searchQuery);

    // Safe status filter
    const patientStatus = (patient.status || 'moderate').toLowerCase();
    const matchesStatus =
      statusFilter === "all" || patientStatus === statusFilter.toLowerCase();

    // Date creation filter
    const patientCreatedAt = patient.created_at ? new Date(patient.created_at) : new Date();
    const matchesDate = (() => {
      if (dateFilter === "all") return true;
      
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const patientDate = new Date(patientCreatedAt);
      patientDate.setHours(0, 0, 0, 0);
      
      switch (dateFilter) {
        case "today":
          return patientDate.getTime() === today.getTime();
        case "week":
          const weekAgo = new Date(today);
          weekAgo.setDate(today.getDate() - 7);
          return patientDate >= weekAgo;
        case "month":
          const monthAgo = new Date(today);
          monthAgo.setMonth(today.getMonth() - 1);
          return patientDate >= monthAgo;
        case "year":
          const yearAgo = new Date(today);
          yearAgo.setFullYear(today.getFullYear() - 1);
          return patientDate >= yearAgo;
        case "custom":
          if (!dateRange.start || !dateRange.end) return true;
          const startDate = new Date(dateRange.start);
          const endDate = new Date(dateRange.end);
          endDate.setHours(23, 59, 59, 999);
          return patientCreatedAt >= startDate && patientCreatedAt <= endDate;
        default:
          return true;
      }
    })();

    return matchesSearch && matchesStatus && matchesDate;
  });

  const sortedPatients = [...filteredPatients].sort((a, b) => {
    let comparison = 0;

    switch (sortField) {
      case "name":
        comparison = (a.name || '').localeCompare(b.name || '');
        break;
      case "age":
        comparison = (a.age || 0) - (b.age || 0);
        break;
      case "lastVisit":
        const dateA = a.lastVisit ? new Date(a.lastVisit) : new Date(0);
        const dateB = b.lastVisit ? new Date(b.lastVisit) : new Date(0);
        comparison = dateA - dateB;
        break;
      case "created_at":
        const createdA = a.created_at ? new Date(a.created_at) : new Date(0);
        const createdB = b.created_at ? new Date(b.created_at) : new Date(0);
        comparison = createdA - createdB;
        break;
      default:
        comparison = 0;
    }

    return sortDirection === "asc" ? comparison : -comparison;
  });

  const clearFilters = () => {
    setSearchQuery("");
    setStatusFilter("all");
    setDateFilter("all");
    setDateRange({ start: "", end: "" });
  };

  const hasActiveFilters = searchQuery || statusFilter !== "all" || dateFilter !== "all";

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <p className="ml-3 text-gray-600">Loading patients...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-red-500">Error loading patients: {error}</p>
        <Button
          variant="primary"
          size="sm"
          onClick={() => window.location.reload()}
          className="ml-4"
        >
          Retry
        </Button>
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
          {hasActiveFilters && (
            <Button
              variant="secondary"
              size="sm"
              onClick={clearFilters}
              className="mr-2"
            >
              Clear Filters
            </Button>
          )}
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
            className="bg-white py-2 pr-4 pl-10 border border-gray-300 focus:border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-300 w-full text-gray-700"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {filterOpen && (
          <div className="bg-white shadow-sm p-4 border border-gray-200 rounded-lg space-y-4">
            {/* Status Filter */}
            <div>
              <label className="block mb-2 font-medium text-gray-700 text-sm">
                Patient Status
              </label>
              <div className="flex flex-wrap gap-2">
                {[
                  { value: "all", label: "All Statuses", color: "gray" },
                  { value: "stable", label: "Stable", color: "green" },
                  { value: "moderate", label: "Moderate", color: "yellow" },
                  { value: "critical", label: "Critical", color: "red" }
                ].map((status) => (
                  <button
                    key={status.value}
                    className={`px-4 py-2 rounded-md text-sm font-medium ${
                      statusFilter === status.value
                        ? `bg-${status.color}-100 text-${status.color}-800 border-${status.color}-300`
                        : "bg-gray-100 text-gray-800 hover:bg-gray-200 border-transparent"
                    } border`}
                    onClick={() => setStatusFilter(status.value)}
                  >
                    {status.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Date Creation Filter */}
            <div>
              <label className="block mb-2 font-medium text-gray-700 text-sm">
                Date Created
              </label>
              <div className="flex flex-col space-y-3">
                <div className="flex flex-wrap gap-2">
                  {[
                    { value: "all", label: "All Time" },
                    { value: "today", label: "Today" },
                    { value: "week", label: "Past Week" },
                    { value: "month", label: "Past Month" },
                    { value: "year", label: "Past Year" },
                    { value: "custom", label: "Custom Range" }
                  ].map((option) => (
                    <button
                      key={option.value}
                      className={`px-4 py-2 rounded-md text-sm font-medium ${
                        dateFilter === option.value
                          ? "bg-blue-100 text-blue-800 border-blue-300"
                          : "bg-gray-100 text-gray-800 hover:bg-gray-200 border-transparent"
                      } border`}
                      onClick={() => setDateFilter(option.value)}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>

                {dateFilter === "custom" && (
                  <div className="flex gap-4 p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <label className="block mb-1 text-xs font-medium text-gray-600">
                        Start Date
                      </label>
                      <input
                        type="date"
                        className="w-full p-2 border border-gray-300 rounded-md text-sm"
                        value={dateRange.start}
                        onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                      />
                    </div>
                    <div className="flex-1">
                      <label className="block mb-1 text-xs font-medium text-gray-600">
                        End Date
                      </label>
                      <input
                        type="date"
                        className="w-full p-2 border border-gray-300 rounded-md text-sm"
                        value={dateRange.end}
                        onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Results Summary */}
      <div className="flex justify-between items-center">
        <p className="text-sm text-gray-600">
          Showing {sortedPatients.length} of {patients.length} patients
          {hasActiveFilters && " (filtered)"}
        </p>
      </div>

      {/* Patients Table */}
      <Card>
        <CardContent className="p-0">
          {sortedPatients.length > 0 ? (
            <Table striped hoverable>
              <TableHead>
                <TableRow>
                  <TableHeaderCell
                    sortable
                    sorted={sortField === "name" ? sortDirection : null}
                    onClick={() => handleSort("name")}
                  >
                    Patient
                  </TableHeaderCell>
                  <TableHeaderCell
                    sortable
                    sorted={sortField === "age" ? sortDirection : null}
                    onClick={() => handleSort("age")}
                  >
                    Age
                  </TableHeaderCell>
                  <TableHeaderCell>Contact</TableHeaderCell>
                  {/* <TableHeaderCell
                    sortable
                    sorted={sortField === "lastVisit" ? sortDirection : null}
                    onClick={() => handleSort("lastVisit")}
                  >
                    Last Visit
                  </TableHeaderCell> */}
                  <TableHeaderCell
                    sortable
                    sorted={sortField === "created_at" ? sortDirection : null}
                    onClick={() => handleSort("created_at")}
                  >
                    Date Created
                  </TableHeaderCell>
                  <TableHeaderCell>Status</TableHeaderCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {sortedPatients.map((patient) => (
                  <TableRow key={patient.id} className="hover:bg-gray-50">
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
                            {patient.gender || 'Not specified'}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{patient.age || 'N/A'}</TableCell>
                    <TableCell>
                      <p className="text-sm">{patient.phone || 'No phone'}</p>
                      <p className="text-gray-500 text-xs">{patient.email || 'No email'}</p>
                    </TableCell>
                    {/* <TableCell>
                      {patient.lastVisit ? formatDate(patient.lastVisit) : 'Never'}
                    </TableCell> */}
                    <TableCell>
                      {patient.created_at ? formatDate(patient.created_at) : 'Unknown'}
                    </TableCell>
                    <TableCell>
                      <Badge
                        text={patient.status ? patient.status.charAt(0).toUpperCase() + patient.status.slice(1) : 'Unknown'}
                        variant={
                          (patient.status || '').toLowerCase() === "stable"
                            ? "success"
                            : (patient.status || '').toLowerCase() === "moderate"
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
            <div className="py-16 text-center">
              <UserX className="mx-auto w-16 h-16 text-gray-300 mb-4" />
              <h3 className="mt-2 font-medium text-gray-900 text-lg">
                No patients found
              </h3>
              <p className="mt-1 text-gray-500 text-sm mb-4">
                {hasActiveFilters 
                  ? "Try adjusting your search or filter criteria"
                  : "No patients have been added yet"
                }
              </p>
              {hasActiveFilters && (
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={clearFilters}
                >
                  Clear All Filters
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PatientsList;