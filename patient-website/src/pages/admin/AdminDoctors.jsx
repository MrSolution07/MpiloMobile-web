import { useState, useEffect } from "react";
import { UserCheck, Search, Plus, Filter, Edit, Trash2 } from "lucide-react";
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

const CardHeader = ({ className = "", children, ...props }) => (
  <div className={`flex flex-col space-y-1.5 p-6 ${className}`} {...props}>
    {children}
  </div>
);

const CardTitle = ({ className = "", children, ...props }) => (
  <h3 className={`text-2xl font-semibold leading-none tracking-tight ${className}`} {...props}>
    {children}
  </h3>
);

const CardDescription = ({ className = "", children, ...props }) => (
  <p className={`text-sm text-gray-500 ${className}`} {...props}>
    {children}
  </p>
);

const Doctors = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDoctors();

    // Set up realtime subscription
    const subscription = supabase
      .channel('doctors_changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'doctors'
      }, () => {
        fetchDoctors();
      })
      .subscribe();

    return () => supabase.removeChannel(subscription);
  }, []);

  const fetchDoctors = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('doctors')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setDoctors(data || []);
    } catch (err) {
      setError(err.message);
      console.error("Error fetching doctors:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (doctorId) => {
    if (window.confirm("Are you sure you want to delete this doctor?")) {
      try {
        const { error } = await supabase
          .from('doctors')
          .delete()
          .eq('id', doctorId);
        
        if (error) throw error;
      } catch (err) {
        alert("Error deleting doctor: " + err.message);
      }
    }
  };

  const handleEdit = (doctorId) => {
    navigate(`/admin/editdoctor/${doctorId}`);
  };

  const filteredDoctors = search
    ? doctors.filter(
        (doctor) =>
          `${doctor.first_name} ${doctor.last_name}`.toLowerCase().includes(search.toLowerCase()) ||
          doctor.specialization?.toLowerCase().includes(search.toLowerCase()) ||
          doctor.doctor_number?.toLowerCase().includes(search.toLowerCase()) ||
          doctor.email?.toLowerCase().includes(search.toLowerCase())
      )
    : doctors;

  const handleAddDoctor = () => {
    navigate('/admin/adminadddoctor');
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
      <div className="flex justify-center items-center h-64 px-4">
        <p className="text-red-500 text-center">Error loading doctors: {error}</p>
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
        
        .status-leave {
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
        <span className="text-3xl sm:text-3xl text-black font-bold">Doctors</span>
        <Button onClick={handleAddDoctor} className="w-full sm:w-auto">
          <Plus className="mr-2 h-4 w-4" /> Add Doctor
        </Button>
      </div>

      <Card className="w-full">
        <CardHeader className="pb-3">
          <CardTitle>Medical Staff</CardTitle>
          <CardDescription>Manage doctors and medical staff in your facility</CardDescription>
        </CardHeader>
        <CardContent className="p-2 sm:p-4 md:p-6">
          <div className="mb-4 flex flex-col gap-2 sm:flex-row">
            <div className="relative flex-1 min-w-0">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search doctors..."
                className="pl-9 w-full"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <Button variant="outline" className="flex gap-2 w-full sm:w-auto">
              <Filter className="h-4 w-4" /> Filter
            </Button>
          </div>

          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {filteredDoctors.map((doctor) => (
              <Card key={doctor.id} className="hover:shadow-md transition-shadow w-full">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row items-start justify-between mb-4 gap-2">
                    <div className="flex items-center w-full sm:w-auto">
                      <div className="rounded-full bg-red-100 p-3 text-red-600 mr-3">
                        <UserCheck className="h-6 w-6" />
                      </div>
                      <div>
                        <h3 className="font-medium text-base sm:text-lg">{doctor.first_name} {doctor.last_name}</h3>
                        <p className="text-xs sm:text-sm text-gray-500">{doctor.specialization}</p>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => handleEdit(doctor.id)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => handleDelete(doctor.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-1 text-xs sm:text-sm">
                    <p><span className="font-medium">ID:</span> <span className="break-all">{doctor.doctor_number}</span></p>
                    <p><span className="font-medium">License:</span> <span className="break-all">{doctor.license_number}</span></p>
                    <p><span className="font-medium">HPCSA:</span> <span className="break-all">{doctor.hpcsa_number}</span></p>
                    <p><span className="font-medium">Experience:</span> {doctor.experience_years} years</p>
                    <p><span className="font-medium">Consultation Fee:</span> R{doctor.consultation_fee}</p>
                    <p><span className="font-medium">Languages:</span> {doctor.languages?.join(', ') || 'English'}</p>
                  </div>
                  <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-2">
                    <span
                      className={(doctor.is_available ? "status-active" : "status-inactive") + " px-2 py-1 text-xs font-semibold whitespace-nowrap"}
                    >
                      {doctor.is_available ? "Available" : "Not Available"}
                    </span>
                    <span className="text-xs text-gray-500">Rating: {doctor.rating || '0'}/5 ({doctor.total_reviews || '0'} reviews)</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredDoctors.length === 0 && (
            <div className="py-8 text-center text-gray-500">
              {doctors.length === 0 ? "No doctors found" : "No doctors match the current search"}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Doctors;