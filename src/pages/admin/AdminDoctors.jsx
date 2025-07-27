import { useState, useEffect } from "react";
import { UserCheck, Search, Plus, Filter, Edit, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../services/supabaseClient";

// Button Component
const Button = ({ className = "", variant = "default", size = "default", children, ...props }) => {
  const baseStyles = "inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";
  const variants = {
    default: "bg-[#274D60] text-white hover:bg-[#1A3A4A]",
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
    className={`flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#274D60] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
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
      <div className="flex justify-center items-center h-64">
        <p className="text-red-500">Error loading doctors: {error}</p>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
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

      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Doctors</h1>
        <Button onClick={handleAddDoctor}>
          <Plus className="mr-2 h-4 w-4" /> Add Doctor
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Medical Staff</CardTitle>
          <CardDescription>Manage doctors and medical staff in your facility</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6 flex flex-col gap-4 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search doctors..."
                className="pl-9"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <Button variant="outline" className="flex gap-2">
              <Filter className="h-4 w-4" /> Filter
            </Button>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredDoctors.map((doctor) => (
              <Card key={doctor.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center">
                      <div className="rounded-full bg-[#274D60]/10 p-3 text-[#274D60] mr-3">
                        <UserCheck className="h-6 w-6" />
                      </div>
                      <div>
                        <h3 className="font-medium text-lg">{doctor.first_name} {doctor.last_name}</h3>
                        <p className="text-sm text-gray-500">{doctor.specialization}</p>
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
                  
                  <div className="space-y-2 text-sm">
                    <p><span className="font-medium">ID:</span> {doctor.doctor_number}</p>
                    <p><span className="font-medium">License:</span> {doctor.license_number}</p>
                    <p><span className="font-medium">HPCSA:</span> {doctor.hpcsa_number}</p>
                    <p><span className="font-medium">Experience:</span> {doctor.experience_years} years</p>
                    <p><span className="font-medium">Consultation Fee:</span> R{doctor.consultation_fee}</p>
                    <p><span className="font-medium">Languages:</span> {doctor.languages?.join(', ') || 'English'}</p>
                  </div>
                  
                  <div className="mt-4 flex items-center justify-between">
                    <span
                      className={doctor.is_available ? "status-active" : "status-inactive"}
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