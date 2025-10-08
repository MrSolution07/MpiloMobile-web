import { useState, useEffect } from "react";
import { Search, Plus, Filter, Edit, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../services/supabaseClient";

// Button Component
const Button = ({ className = "", variant = "default", size = "default", children, ...props }) => {
  const baseStyles = "inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";
  const variants = {
    default: "bg-red-600 text-white hover:bg-red-700",
    outline: "border border-gray-300 bg-white hover:bg-gray-50 hover:text-gray-900",
    ghost: "hover:bg-gray-100 hover:text-gray-900",
    destructive: "bg-red-600 text-white hover:bg-red-700",
  };
  const sizes = {
    default: "h-10 px-4 py-2",
    sm: "h-9 rounded-md px-3",
    lg: "h-11 rounded-md px-8",
    icon: "h-10 w-10",
  };
  
  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

// Input Component
const Input = ({ className = "", ...props }) => (
  <input
    className={`flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
    {...props}
  />
);

// Card Components
const Card = ({ className = "", children, ...props }) => (
  <div className={`rounded-lg border bg-white text-gray-900 shadow-sm ${className}`} {...props}>
    {children}
  </div>
);

const CardContent = ({ className = "", children, ...props }) => (
  <div className={`p-6 ${className}`} {...props}>
    {children}
  </div>
);

// Table Components
const Table = ({ className = "", children, ...props }) => (
  <div className="relative w-full overflow-auto">
    <table className={`w-full caption-bottom text-sm ${className}`} {...props}>
      {children}
    </table>
  </div>
);

const TableHeader = ({ className = "", children, ...props }) => (
  <thead className={`[&_tr]:border-b ${className}`} {...props}>
    {children}
  </thead>
);

const TableBody = ({ className = "", children, ...props }) => (
  <tbody className={`[&_tr:last-child]:border-0 ${className}`} {...props}>
    {children}
  </tbody>
);

const TableRow = ({ className = "", children, ...props }) => (
  <tr className={`border-b transition-colors hover:bg-gray-50 data-[state=selected]:bg-gray-50 ${className}`} {...props}>
    {children}
  </tr>
);

const TableHead = ({ className = "", children, ...props }) => (
  <th className={`h-12 px-4 text-left align-middle font-medium text-gray-500 [&:has([role=checkbox])]:pr-0 ${className}`} {...props}>
    {children}
  </th>
);

const TableCell = ({ className = "", children, ...props }) => (
  <td className={`p-4 align-middle [&:has([role=checkbox])]:pr-0 ${className}`} {...props}>
    {children}
  </td>
);

const Patients = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPatients();

    // Set up realtime subscription
    const subscription = supabase
      .channel('patients_changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'patients'
      }, () => {
        fetchPatients();
      })
      .subscribe();

    return () => supabase.removeChannel(subscription);
  }, []);

  const fetchPatients = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('patients')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPatients(data || []);
    } catch (err) {
      setError(err.message);
      console.error("Error fetching patients:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (patientId) => {
    if (window.confirm("Are you sure you want to delete this patient?")) {
      try {
        const { error } = await supabase
          .from('patients')
          .delete()
          .eq('id', patientId);
        
        if (error) throw error;
      } catch (err) {
        alert("Error deleting patient: " + err.message);
      }
    }
  };

  const handleEdit = (patientId) => {
    navigate(`/admin/editpatient/${patientId}`);
  };

  // Filter patients based on search
  const filteredPatients = search
    ? patients.filter(
        (patient) =>
          `${patient.first_name} ${patient.last_name}`.toLowerCase().includes(search.toLowerCase()) ||
          patient.id.toLowerCase().includes(search.toLowerCase()) ||
          patient.phone?.includes(search) ||
          patient.email?.toLowerCase().includes(search.toLowerCase())
      )
    : patients;

  const handleAddPatient = () => {
    navigate('/admin/adminaddpatient');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
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
    <div className="animate-fade-in px-2 py-2 sm:px-4 md:px-8 lg:px-16 xl:px-32 w-full max-w-screen-2xl mx-auto">
      <style jsx>{`
        .animate-fade-in {
          animation: fade-in 0.3s ease-in-out;
        }
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .status-active {
          display: inline-flex;
          align-items: center;
          border-radius: 9999px;
          padding: 0.25rem 0.5rem;
          font-size: 0.75rem;
          font-weight: 500;
          background-color: #dcfce7;
          color: #166534;
        }
        .status-inactive {
          display: inline-flex;
          align-items: center;
          border-radius: 9999px;
          padding: 0.25rem 0.5rem;
          font-size: 0.75rem;
          font-weight: 500;
          background-color: #fee2e2;
          color: #991b1b;
        }
        .status-pending {
          display: inline-flex;
          align-items: center;
          border-radius: 9999px;
          padding: 0.25rem 0.5rem;
          font-size: 0.75rem;
          font-weight: 500;
          background-color: #fef3c7;
          color: #92400e;
        }
      `}</style>

      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <span className="text-3xl sm:text-3xl text-black font-bold">Patients</span>
        {/* <Button onClick={handleAddPatient} className="w-full sm:w-auto">
          <Plus className="mr-2 h-4 w-4" /> Add Patient
        </Button> */}
      </div>

      <Card className="w-full">
        <CardContent className="p-2 sm:p-4 md:p-6">
          {/* Search and filter bar */}
          <div className="mb-4 flex flex-col gap-2 sm:flex-row">
            <div className="relative flex-1 min-w-0">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search patients..."
                className="pl-9 w-full"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <Button variant="outline" className="flex gap-2 w-full sm:w-auto">
              <Filter className="h-4 w-4" /> Filter
            </Button>
          </div>

          {/* Patients table */}
          <div className="overflow-x-auto rounded-md border">
            <Table className="min-w-[600px]">
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-[80px] whitespace-nowrap align-middle text-left">ID</TableHead>
                  <TableHead className="min-w-[120px] whitespace-nowrap align-middle text-left">Name</TableHead>
                  <TableHead className="min-w-[60px] whitespace-nowrap align-middle text-left">Age</TableHead>
                  <TableHead className="min-w-[80px] whitespace-nowrap align-middle text-left">Gender</TableHead>
                  <TableHead className="min-w-[120px] whitespace-nowrap align-middle text-left">Contact</TableHead>
                  <TableHead className="min-w-[160px] whitespace-nowrap align-middle text-left">Email</TableHead>
                  <TableHead className="min-w-[80px] whitespace-nowrap align-middle text-left">Status</TableHead>
                  <TableHead className="min-w-[100px] whitespace-nowrap align-middle text-center">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPatients.length > 0 ? (
                  filteredPatients.map((patient) => {
                    // Calculate age from date of birth if available
                    const age = patient.date_of_birth 
                      ? new Date().getFullYear() - new Date(patient.date_of_birth).getFullYear()
                      : 'N/A';

                    return (
                      <TableRow key={patient.id} className="cursor-pointer hover:bg-gray-50">
                        <TableCell className="font-medium whitespace-nowrap align-middle text-left">{patient.id}</TableCell>
                        <TableCell className="whitespace-nowrap align-middle text-left">{patient.first_name} {patient.last_name}</TableCell>
                        <TableCell className="whitespace-nowrap align-middle text-left">{age}</TableCell>
                        <TableCell className="whitespace-nowrap align-middle text-left">{patient.gender || 'N/A'}</TableCell>
                        <TableCell className="whitespace-nowrap align-middle text-left">{patient.phone_number || 'N/A'}</TableCell>
                        <TableCell className="whitespace-nowrap align-middle text-left">{patient.email || 'N/A'}</TableCell>
                        <TableCell className="whitespace-nowrap align-middle text-left">
                          <span
                            className={
                              (patient.active === "active"
                                ? "status-active"
                                : patient.active === "inactive"
                                ? "status-inactive"
                                : "status-pending") +
                              " px-2 py-1 text-xs font-semibold whitespace-nowrap"
                            }
                          >
                            {patient.active || 'Active'}
                          </span>
                        </TableCell>
                        <TableCell className="text-center whitespace-nowrap align-middle">
                          <div className="flex justify-end gap-1">
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => handleEdit(patient.id)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => handleDelete(patient.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-4 text-gray-500">
                      {patients.length === 0 ? "No patients found" : "No matching patients found"}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Patients;