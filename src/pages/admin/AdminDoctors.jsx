import { useState } from "react";
import { Search, Plus } from "lucide-react";

const Button = ({ className = "", variant = "default", size = "default", children, ...props }) => {
  const baseStyles = "inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";
  const variants = {
    default: "bg-[#274D60] text-white hover:bg-[#1A3A4A]",
    outline: "border border-gray-300 bg-white hover:bg-gray-50 hover:text-gray-900",
  };
  const sizes = {
    default: "h-10 px-4 py-2",
    sm: "h-9 rounded-md px-3",
    lg: "h-11 rounded-md px-8",
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

const Input = ({ className = "", ...props }) => (
  <input
    className={`flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#274D60] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
    {...props}
  />
);

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

const AdminDoctors = () => {
  // South African doctors data
  const doctors = [
    {
      id: "DR001",
      name: "Dr. Noni Mokoena",
      specialty: "Cardiology",
      experience: "18 years",
      contact: "+27 82 123 4567",
      email: "noni.mokoena@mpilo.co.za",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Noni",
    },
    {
      id: "DR002",
      name: "Dr. Naledi Khumalo",
      specialty: "Pediatrics",
      experience: "10 years",
      contact: "+27 83 234 5678",
      email: "naledi.khumalo@mpilo.co.za",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Naledi",
    },
    {
      id: "DR003",
      name: "Dr. Pieter van der Merwe",
      specialty: "Orthopedics",
      experience: "15 years",
      contact: "+27 84 345 6789",
      email: "pieter.vdmerwe@mpilo.co.za",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Pieter",
    },
  ];

  // Modal state
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const openProfile = (doctor) => {
    setSelectedDoctor(doctor);
    setShowProfileModal(true);
  };

  const closeProfile = () => {
    setShowProfileModal(false);
    setSelectedDoctor(null);
  };

  const filteredDoctors = doctors.filter((doctor) => {
    const term = searchTerm.toLowerCase();
    return (
      doctor.name.toLowerCase().includes(term) ||
      doctor.specialty.toLowerCase().includes(term)
    );
  });

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

        .card-hover {
          transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
        }

        .card-hover:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
        }
      `}</style>

      <div className="flex justify-between items-center mb-6">
        <h1 className="font-bold text-3xl">Doctors</h1>
        <Button>
          <Plus className="mr-2 w-4 h-4" /> Add Doctor
        </Button>
      </div>

      {/* Search bar */}
      <div className="relative mb-6">
        <Search className="top-3 left-3 absolute w-4 h-4 text-gray-500" />
        <Input
          placeholder="Search doctors by name, specialty..."
          className="pl-9"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Doctors grid */}
      <div className="gap-6 grid sm:grid-cols-2 lg:grid-cols-3">
        {filteredDoctors.map((doctor) => (
          <Card key={doctor.id} className="overflow-hidden card-hover">
            <CardContent className="p-0">
              <div className="bg-[#274D60] p-4 text-white">
                <div className="flex justify-between items-center">
                  <h3 className="font-bold">{doctor.name}</h3>
                  <span className="bg-white/20 px-2 py-1 rounded-full text-xs">{doctor.id}</span>
                </div>
                <p className="text-white/80 text-sm">{doctor.specialty}</p>
              </div>
              <div className="p-4">
                <div className="flex items-center">
                  <div className="flex justify-center items-center bg-gray-100 mr-4 rounded-full w-16 h-16 overflow-hidden">
                    <img src={doctor.avatar} alt={doctor.name} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <p className="text-sm">
                      <span className="text-gray-500">Experience:</span> {doctor.experience}
                    </p>
                    <p className="text-sm">
                      <span className="text-gray-500">Contact:</span> {doctor.contact}
                    </p>
                  </div>
                </div>
                <p className="mt-3 text-sm">
                  <span className="text-gray-500">Email:</span> {doctor.email}
                </p>
                <div className="flex gap-2 mt-4">
                  <Button variant="outline" size="sm" className="flex-1" onClick={() => openProfile(doctor)}>
                    Profile
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Profile Modal */}
      {showProfileModal && selectedDoctor && (
        <div className="z-50 fixed inset-0 flex justify-center items-center bg-black/40">
          <div className="relative bg-white shadow-lg p-6 rounded-lg w-full max-w-md animate-fade-in">
            <button
              className="top-2 right-2 absolute text-gray-500 hover:text-gray-700 text-xl"
              onClick={closeProfile}
              aria-label="Close"
            >
              &times;
            </button>
            <div className="flex flex-col items-center">
              <img
                src={selectedDoctor.avatar}
                alt={selectedDoctor.name}
                className="mb-4 border-[#274D60] border-4 rounded-full w-24 h-24 object-cover"
              />
              <h2 className="mb-1 font-bold text-2xl">{selectedDoctor.name}</h2>
              <span className="bg-[#274D60]/10 mb-2 px-3 py-1 rounded-full text-[#274D60] text-xs">
                {selectedDoctor.specialty}
              </span>
              <div className="mb-2 text-gray-700 text-sm">
                <p><span className="font-medium">Experience:</span> {selectedDoctor.experience}</p>
                <p><span className="font-medium">Contact:</span> {selectedDoctor.contact}</p>
                <p><span className="font-medium">Email:</span> {selectedDoctor.email}</p>
                <p><span className="font-medium">Doctor ID:</span> {selectedDoctor.id}</p>
              </div>
              <Button onClick={closeProfile} className="mt-4 w-full">Close</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDoctors;
