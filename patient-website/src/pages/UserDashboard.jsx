import { pdf } from "@react-pdf/renderer";
import {
  Activity,
  Bell,
  Calendar,
  Clock,
  FileText,
  Heart,
  LogOut,
  MessageSquare,
  TrendingDown,
  TrendingUp,
  User,
  UserCircle,
} from "lucide-react";
import { PDFDocument } from "pdf-lib-with-encrypt";
import { useEffect, useState } from "react";
import {
  FaCalendarAlt,
  FaClock,
  FaDownload,
  FaFileMedical,
  FaHeart,
  FaMapMarkerAlt,
  FaNotesMedical,
  FaPhone,
  FaPrescription,
  FaSearch,
  FaStar,
  FaThermometerHalf,
  FaTint,
  FaVideo,
  FaWeight,
} from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";
import profile from "../../public/assets/images/profileImg.png";
import { PatientMessages } from "../components/messages";
import { RecordPdf } from "../components/records/RecordPdf";
import { RecordPreviewModal } from "../components/records/RecordPreviewModal";
import { useAuth } from "../context/AuthProvider";
import { useAppointmentBooking } from "../hooks/useAppointmentBooking";
import { useBookings } from "../hooks/useBookings";
import { useDoctors } from "../hooks/useDoctors";
import { useSpecialties } from "../hooks/useSpecialties";
import { supabase, supabaseAnonKey } from "../services/supabaseClient";

function PatientDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState("All Specialties");
  const [sortBy, setSortBy] = useState("name");

  const navigate = useNavigate();
  const location = useLocation();

  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewRecord, setPreviewRecord] = useState(null);

  // Use custom hooks
  const {
    doctors,
    loading: doctorsLoading,
    error: doctorsError,
    fetchBySpecialty,
    searchDoctors,
  } = useDoctors();
  const { specialties, loading: specialtiesLoading } = useSpecialties();
  const {
    bookings,
    upcomingBookings,
    pastBookings,
    bookingCount,
    loading: bookingsLoading,
    error: bookingsError,
    refetch: refetchBookings,
  } = useBookings();
  const {
    bookAppointment,
    cancelAppointment,
    isLoading: bookingLoading,
    error: bookingError,
  } = useAppointmentBooking();
  const { user, logout } = useAuth();

  // State for medical records
  const [medicalRecords, setMedicalRecords] = useState([]);
  const [recordsLoading, setRecordsLoading] = useState(false);
  const [recordsError, setRecordsError] = useState(null);

  // Fetch medical records from medical_records table
  const fetchMedicalRecords = async () => {
    if (!user) return;

    try {
      setRecordsLoading(true);
      setRecordsError(null);

      const { data, error } = await supabase
        .from("medical_records")
        .select("*")
        .eq("patient_id", user.id)
        .order("date", { ascending: false });

      if (error) throw error;

      setMedicalRecords(data || []);
    } catch (err) {
      console.error("Error fetching medical records:", err);
      setRecordsError(err.message);
    } finally {
      setRecordsLoading(false);
    }
  };

  // Fetch medical records when user is available and medical history tab is active
  useEffect(() => {
    if (user && activeTab === "history") {
      fetchMedicalRecords();
    }
  }, [user, activeTab]);

  // State for filtered appointments
  const [todaysAppointments, setTodaysAppointments] = useState([]);
  const [upcomingWeekAppointments, setUpcomingWeekAppointments] = useState([]);

  // Filter appointments when bookings change
  useEffect(() => {
    if (bookings.length > 0) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const endOfWeek = new Date();
      endOfWeek.setDate(today.getDate() + 7);
      endOfWeek.setHours(23, 59, 59, 999);

      // Filter today's appointments
      const todayAppts = bookings.filter((appt) => {
        const apptDate = new Date(appt.scheduled_datetime);
        return (
          apptDate.toDateString() === today.toDateString() &&
          appt.status !== "cancelled" &&
          appt.status !== "completed"
        );
      });

      // Filter upcoming week appointments (excluding today)
      const weekAppts = bookings.filter((appt) => {
        const apptDate = new Date(appt.scheduled_datetime);
        return (
          apptDate > today &&
          apptDate <= endOfWeek &&
          appt.status !== "cancelled" &&
          appt.status !== "completed"
        );
      });

      setTodaysAppointments(todayAppts);
      setUpcomingWeekAppointments(weekAppts);
    }
  }, [bookings]);

  // Fetch doctors based on filters
  useEffect(() => {
    if (activeTab === "doctors") {
      if (searchTerm) {
        searchDoctors(searchTerm);
      } else if (selectedSpecialty !== "All Specialties") {
        fetchBySpecialty(selectedSpecialty);
      }
    }
  }, [activeTab, searchTerm, selectedSpecialty]);

  const tabs = [
    { id: "overview", label: "Overview", icon: User },
    { id: "appointments", label: "Appointments", icon: Calendar },
    { id: "doctors", label: "Find Doctors", icon: UserCircle },
    { id: "messages", label: "Messages", icon: MessageSquare },
    { id: "history", label: "Medical History", icon: Clock },
  ];
  const statsCards = [
    {
      title: "Total Appointments",
      value: "27",
      change: "+0.8%",
      isPositive: true,
      icon: Calendar,
      iconBg: "bg-[#274D60]/6",
      iconColor: "text-[#274D60]",
    },
    {
      title: "Completed Visits",
      value: "15",
      change: "+2.1%",
      isPositive: true,
      icon: Activity,
      iconBg: "bg-[#274D60]/6",
      iconColor: "text-[#274D60]",
    },
    {
      title: "Medical Records",
      value: "7",
      change: "+1.5%",
      isPositive: true,
      icon: FileText,
      iconBg: "bg-[#274D60]/6",
      iconColor: "text-[#274D60]",
    },
    {
      title: "Prescriptions",
      value: "7",
      change: "-0.2%",
      isPositive: false,
      icon: Heart,
      iconBg: "bg-[#274D60]/6",
      iconColor: "text-[#274D60]",
    },
  ];
  // Handle view doctor profile
  const handleViewDoctorProfile = (doctor) => {
    navigate("/doctor-profile", {
      state: {
        doctor: {
          id: doctor.id,
          name: doctor.name,
          specialty: doctor.specialty,
          fee: doctor.fee,
          avatar: doctor.profile_image_url,
          biography: doctor.biography,
          rating: doctor.rating,
          experience: doctor.experience,
        },
      },
    });
  };

  // Handle view appointment details
  const handleViewAppointmentDetails = (appointment) => {
    navigate("/appointment-details", {
      state: { appointment },
    });
  };

  // Handle view medical record details

  const handleViewMedicalRecord = (record) => {
    const params = new URLSearchParams(location.search);
    params.set("record", String(record.id));
    navigate(
      { pathname: location.pathname, search: params.toString() },
      { state: { record } }
    );
  };
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const idFromUrl = params.get("record");
    if (!idFromUrl) return;

    // Fast path if we navigated with state
    if (location.state && location.state.record) {
      setPreviewRecord(location.state.record);
      setPreviewOpen(true);
      return;
    }

    // Fallback: fetch record by id so direct URL works
    const fetchOne = async () => {
      try {
        setRecordsLoading(true);
        const { data, error } = await supabase
          .from("medical_records")
          .select("*")
          .eq("id", idFromUrl)
          .single();
        if (error) throw error;
        setPreviewRecord(data);
        setPreviewOpen(true);
      } catch (e) {
        console.error("Failed to load record", e);
      } finally {
        setRecordsLoading(false);
      }
    };

    fetchOne();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.search]);

  // Handle appointment booking navigation
  const handleBookAppointment = (doctor) => {
    navigate("/Userappointment", {
      state: {
        doctor: {
          id: doctor.id,
          name: doctor.name,
          specialty: doctor.specialty,
          fee: doctor.fee,
          avatar: doctor.profile_image_url,
          biography: doctor.biography,
          rating: doctor.rating,
          experience: doctor.experience,
        },
      },
    });
  };

  // Handle appointment cancellation
  const handleCancelAppointment = async (appointmentId) => {
    const result = await cancelAppointment(appointmentId);
    if (result.success) {
      refetchBookings();
    }
  };

  // Filter and sort doctors
  const filteredDoctors = doctors
    .filter((doctor) => {
      if (
        selectedSpecialty !== "All Specialties" &&
        doctor.specialty !== selectedSpecialty
      ) {
        return false;
      }
      return true;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name);
        case "experience":
          return b.experience_years - a.experience_years;
        case "rating":
          return b.rating - a.rating;
        case "price":
          return a.consultation_fee - b.consultation_fee;
        default:
          return 0;
      }
    });

  // Map appointments to UI format
  const mapAppointmentToUI = (appt) => ({
    id: appt.id,
    doctor:
      `${appt.doctors?.first_name || ""} ${
        appt.doctors?.last_name || ""
      }`.trim() || "Doctor",
    specialty: appt.doctors?.specialization || "General Medicine",
    date: new Date(appt.scheduled_datetime).toLocaleDateString(),
    time: new Date(appt.scheduled_datetime).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    }),
    type: appt.appointment_type || "In-Person",
    avatar: appt.doctors?.profile_image_url || profile,
    status: appt.status,
    rawDate: new Date(appt.scheduled_datetime),
  });

  // Map today's appointments
  const todaysAppointmentsUI = todaysAppointments.map(mapAppointmentToUI);

  // Map upcoming week appointments
  const upcomingWeekAppointmentsUI =
    upcomingWeekAppointments.map(mapAppointmentToUI);

  // Map past appointments to UI format
  const pastAppointmentsUI = pastBookings.map(mapAppointmentToUI);

  // Map medical records to UI format
  const medicalRecordsUI = medicalRecords.map((record) => ({
    id: record.id,
    date: new Date(record.date).toLocaleDateString(),
    diagnosis: record.diagnosis || "No diagnosis recorded",
    doctor:
      `${record.first_name || ""} ${record.last_name || ""}`.trim() ||
      "Unknown Doctor",
    treatment: record.treatment_plan || "No treatment plan recorded",
    medications: record.medications_prescribed || "No medications prescribed",
    notes: record.notes || "No additional notes",
    type:
      record.record_type === "clinical_note"
        ? "Clinical Visit"
        : record.record_type === "triage_followup"
        ? "Triage Follow-up"
        : "Medical Record",
    rawDate: new Date(record.date),
    raw: record,
  }));

  // Map doctors to UI format
  const availableDoctors = doctors.map((doc) => ({
    id: doc.id,
    name: doc.name,
    specialty: doc.specialty,
    nextAvailable: doc.is_available ? "Today" : "Not available",
    avatar: doc.profile_image_url || profile,
    rating: doc.rating,
    experience: doc.experience_years,
    fee: doc.consultation_fee,
    is_available: doc.is_available,
    biography: doc.biography,
  }));

  // Recent activity based on appointments and medical records
  const recentActivity = [
    ...todaysAppointmentsUI.slice(0, 2).map((appt) => ({
      date: appt.date,
      action: `Today's appointment with ${appt.doctor}`,
      type: "today",
      icon: FaCalendarAlt,
    })),
    ...upcomingWeekAppointmentsUI.slice(0, 1).map((appt) => ({
      date: appt.date,
      action: `Upcoming appointment with ${appt.doctor}`,
      type: "upcoming",
      icon: FaClock,
    })),
    ...medicalRecords.slice(0, 2).map((record) => ({
      date: new Date(record.date).toLocaleDateString(),
      action: `Medical record: ${record.diagnosis || "Visit"}`,
      type: "medical",
      icon: FaFileMedical,
    })),
  ];

  // Sample health metrics (would typically come from health metrics hook)
  const healthMetrics = [
    {
      label: "Heart Rate",
      value: "72 bpm",
      icon: FaHeart,
      color: "text-red-500",
    },
    {
      label: "Blood Pressure",
      value: "120/80",
      icon: FaTint,
      color: "text-blue-500",
    },
    {
      label: "Temperature",
      value: "37.6°C",
      icon: FaThermometerHalf,
      color: "text-orange-500",
    },
    {
      label: "Weight",
      value: "74 kg",
      icon: FaWeight,
      color: "text-green-500",
    },
  ];

  // DownloadRecordsButton component
  const DownloadRecordsButton = ({ medicalRecords }) => {
    const [loading, setLoading] = useState(false);
    const [password, setPassword] = useState("");
    const [showModal, setShowModal] = useState(false);

    // Function to format medical records data for PDF
    const formatMedicalRecordsForPdf = () => {
      if (!medicalRecords || medicalRecords.length === 0) {
        return null;
      }

      // Get the most recent record or use the first one
      const latestRecord = medicalRecords[0];

      return {
        // Patient Information
        patientId: latestRecord.patient_id || "N/A",
        patientName:
          `${latestRecord.first_name || ""} ${
            latestRecord.last_name || ""
          }`.trim() || "Patient",
        dateOfBirth: "1990-01-15", // This would ideally come from patient profile
        gender: "Unknown", // This would ideally come from patient profile
        idNumber: "N/A", // This would ideally come from patient profile
        contactNumber: "+27 82 123 4567", // This would ideally come from patient profile
        address: "123 Main Street, Johannesburg", // This would ideally come from patient profile

        // Visit Information
        visitDate: latestRecord.date || new Date().toLocaleDateString(),
        visitTime: "14:30", // Default time
        attendingPhysician:
          `${latestRecord.first_name || ""} ${
            latestRecord.last_name || ""
          }`.trim() || "Doctor",

        // Vital Signs
        bloodPressure: latestRecord.blood_pressure || "N/A",
        heartRate: latestRecord.heart_rate || "N/A",
        temperature: latestRecord.temperature || "N/A",
        weight: latestRecord.weight || "N/A",
        height: latestRecord.height || "N/A",
        respiratoryRate: "16", // Default value

        // Medical Information
        chiefComplaint: latestRecord.symptoms || "No symptoms recorded",
        diagnosis: latestRecord.diagnosis || "No diagnosis recorded",
        treatmentPlan:
          latestRecord.treatment_plan || "No treatment plan recorded",
        medications:
          latestRecord.medications_prescribed || "No medications prescribed",
        notes: latestRecord.notes || "No additional notes",
        followUpInstructions:
          latestRecord.follow_up_instructions || "No follow-up instructions",
      };
    };

    const patientRecordData = formatMedicalRecordsForPdf();

    // generate random password
    const generatePassword = (length = 12) => {
      const array = new Uint8Array(length);
      crypto.getRandomValues(array);
      return Array.from(array, (b) => (b % 36).toString(36)).join("");
    };

    const handleVerifyAndDownload = async () => {
      try {
        setLoading(true);

        // get current user
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          alert("You must be logged in to download your records.");
          setLoading(false);
          return;
        }

        const { error } = await supabase.auth.signInWithPassword({
          email: user.email,
          password,
        });

        if (error) {
          alert("Incorrect password. Please try again.");
          setLoading(false);
          return;
        }

        // verified - generate password & PDF
        const generatedPassword = generatePassword();
        const blob = await pdf(<RecordPdf data={patientRecordData} />).toBlob();
        const arrayBuffer = await blob.arrayBuffer();

        // encrypt PDF
        const pdfDoc = await PDFDocument.load(arrayBuffer);
        pdfDoc.encrypt({
          userPassword: generatedPassword,
          ownerPassword: generatedPassword,
          permissions: {
            printing: "highResolution",
            modifying: false,
            copying: false,
          },
        });
        const encryptedBytes = await pdfDoc.save();

        const fileName = `medical_record_${patientRecordData.patientName}_${
          new Date().toISOString().split("T")[0]
        }.pdf`;

        // send password email (Edge Function call)
        const res = await fetch(
          `${import.meta.env.VITE_SUPABASE_FUNCTIONS_URL}/send-password-email`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${supabaseAnonKey}`,
            },
            body: JSON.stringify({
              to: user.email,
              password: generatedPassword,
            }),
          }
        );

        if (!res.ok) {
          const err = await res.json();
          console.error("Email send failed:", err);
          alert("Failed to send password email. PDF download canceled.");
          return;
        }

        // email sent successfulyy -> trigger download
        const encryptedBlob = new Blob([encryptedBytes], {
          type: "application/pdf",
        });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(encryptedBlob);
        link.download = fileName;
        link.click();
        URL.revokeObjectURL(link.href);
        alert("PDF downloaded and password sent to your email.");

        // cleanup
        setPassword("");
        setShowModal(false);
        setLoading(false);
      } catch (err) {
        console.error(err);
        alert("Something went wrong.", err.message);
      } finally {
        setLoading(false);
      }
    };

    if (!patientRecordData) {
      return (
        <button
          className="bg-gray-400 text-white px-4 py-2 rounded-[0.8rem] font-medium cursor-not-allowed whitespace-nowrap flex items-center gap-2"
          disabled
        >
          <FaDownload className="h-4 w-4" />
          No Records Available
        </button>
      );
    }

    return (
      <>
        {/* Main Button */}
        <button
          onClick={() => setShowModal(true)}
          disabled={loading}
          className={`bg-red-500 text-white px-4 py-2 rounded-[0.8rem] font-medium hover:bg-red-600 transition whitespace-nowrap flex items-center gap-2 ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          <FaDownload className="h-4 w-4" />
          {loading ? "Preparing..." : "Download Records"}
        </button>

        {/* Password Modal */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-md">
              <h2 className="text-lg font-semibold mb-4 text-gray-800">
                Confirm Your Password
              </h2>

              <input
                type="password"
                className="w-full border border-gray-300 rounded-md p-2 mb-4 focus:outline-none focus:ring-2 focus:ring-red-400"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
              />

              <div className="flex justify-end gap-2">
                <button
                  onClick={() => {
                    if (!loading) {
                      setPassword("");
                      setShowModal(false);
                    }
                  }}
                  className="text-gray-600 hover:text-gray-800 px-3 py-1"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  onClick={handleVerifyAndDownload}
                  className="bg-red-500 hover:bg-red-600 text-white font-medium px-4 py-1 rounded-md disabled:opacity-50"
                  disabled={loading || !password}
                >
                  {loading ? "Verifying..." : "Confirm"}
                </button>
              </div>
            </div>
          </div>
        )}
      </>
    );
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Authentication Required
          </h2>
          <p className="text-gray-600 mb-6">
            Please log in to access your dashboard.
          </p>
          <button
            onClick={() => navigate("/login")}
            className="bg-red-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-red-700 transition"
          >
            Log In
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center py-4 gap-4">
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-4 mb-3 sm:mb-0">
                <img
                  src="../assets/images/mpiloLogo.png"
                  alt="Mpilo Logo"
                  className="h-8 w-auto cursor-pointer"
                  onClick={() => navigate("/")}
                />
              </div>
            </div>

            <div className="flex items-center space-x-4 w-full sm:w-auto justify-between sm:justify-end">
              <button className="relative p-2 text-gray-400 hover:text-gray-600">
                <Bell className="h-5 w-5" />
                <span className="absolute top-1 right-1 block h-2 w-2 bg-red-500 rounded-full"></span>
              </button>

              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-white font-semibold text-sm">
                  {user?.user_metadata?.full_name?.charAt(0) || "U"}
                </div>
                <span className="hidden sm:block text-sm font-medium text-gray-700">
                  {user?.user_metadata?.full_name || "User"}
                </span>
                <button className="text-gray-400 hover:text-gray-600">
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="mb-6">
          <h1 className="text-xl font-semibold text-gray-800">
            Patient Dashboard
          </h1>
        </div>

        {/* Navigation Tabs */}
        <div className="border-b border-gray-200 mb-6 overflow-x-auto">
          <div className="flex gap-8 min-w-max">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 pb-4 px-1 font-medium text-sm whitespace-nowrap transition-colors ${
                  activeTab === tab.id
                    ? "border-red-600 text-red-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <tab.icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            {/* Stats Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {statsCards.map((stat, index) => (
                <div
                  key={index}
                  className="bg-white rounded-lg border border-gray-200 p-6"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className={`w-12 h-12 rounded-lg ${stat.iconBg} flex items-center justify-center`}
                    >
                      <stat.icon className={`h-6 w-6 ${stat.iconColor}`} />
                    </div>
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm mb-1">{stat.title}</p>
                    <div className="flex items-end justify-between">
                      <p className="text-3xl font-semibold text-gray-800">
                        {stat.value}
                      </p>
                      <div className="flex items-center">
                        {stat.isPositive ? (
                          <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
                        ) : (
                          <TrendingDown className="h-4 w-4 text-red-600 mr-1" />
                        )}
                        <span
                          className={`text-sm ${
                            stat.isPositive ? "text-green-600" : "text-red-600"
                          }`}
                        >
                          {stat.change}
                        </span>
                      </div>
                    </div>
                    <p className="text-xs text-gray-400 mt-1">
                      from last month
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Health Overview */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-800">
                    Health Overview
                  </h3>
                </div>
                <div className="space-y-6">
                  {healthMetrics.map((metric, index) => (
                    <div key={index}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                            <metric.icon
                              className={`h-5 w-5 ${metric.color}`}
                            />
                          </div>
                          <span className="text-sm text-gray-600">
                            {metric.label}
                          </span>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-semibold text-gray-800">
                            {metric.value}
                          </p>
                          <p
                            className={`text-xs ${
                              metric.trendUp ? "text-green-600" : "text-red-600"
                            }`}
                          >
                            {metric.trend}
                          </p>
                        </div>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${
                            index === 0
                              ? "bg-red-500 w-[75%]"
                              : index === 1
                              ? "bg-blue-500 w-[85%]"
                              : index === 2
                              ? "bg-purple-500 w-[65%]"
                              : "bg-green-500 w-[95%]"
                          }`}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Today's Appointments */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-center mb-6">
                  <Calendar className="h-5 w-5 text-[#274D60] mr-2 sm:h-8 w-5" />
                  <h3 className="text-lg font-semibold text-gray-800">
                    Today's Appointments ({todaysAppointmentsUI.length})
                  </h3>
                </div>
                <p className="text-sm text-gray-500 mb-6">
                  Today's scheduled appointments across all doctors
                </p>

                {todaysAppointmentsUI.length > 0 ? (
                  <div className="space-y-4">
                    {todaysAppointmentsUI.map((appointment, index) => (
                      <div
                        key={index}
                        className="border-b border-gray-100 pb-4 last:border-0"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <p className="font-medium text-gray-800">
                              {user?.user_metadata?.full_name || "Patient Name"}
                            </p>
                            <p className="text-sm text-gray-500">
                              {appointment.time} -{" "}
                              {appointment.type.toLowerCase()}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium text-gray-800">
                              {appointment.doctor}
                            </p>
                            <span className="inline-block px-2 py-1 text-xs rounded bg-green-100 text-green-700 mt-1">
                              {appointment.status}
                            </span>
                          </div>
                        </div>
                        <p className="text-sm text-blue-600">
                          {appointment.specialty}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-sm">No appointments today</p>
                  </div>
                )}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-6">
                Recent Activity
              </h3>
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div
                      className={`w-2 h-2 mt-2 rounded-full flex-shrink-0 ${
                        activity.type === "completed"
                          ? "bg-green-500"
                          : activity.type === "upcoming"
                          ? "bg-blue-500"
                          : activity.type === "medical"
                          ? "bg-purple-500"
                          : "bg-yellow-500"
                      }`}
                    ></div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-800">{activity.action}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {activity.date}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Appointments Tab */}
        {activeTab === "appointments" && (
          <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-3">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
                My Appointments
              </h2>
            </div>

            {bookingsLoading ? (
              <div className="text-center py-8 text-gray-500">
                Loading appointments...
              </div>
            ) : bookingsError ? (
              <div className="text-center py-8 text-red-500">
                Error loading appointments: {bookingsError}
              </div>
            ) : (
              <div className="grid gap-4">
                {todaysAppointmentsUI.map((appointment) => (
                  <div
                    key={appointment.id}
                    className="border border-gray-200 rounded-lg p-4 sm:p-6 hover:shadow-md transition"
                  >
                    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                      <div className="flex items-center space-x-4">
                        <img
                          src={appointment.avatar}
                          alt={appointment.doctor}
                          className="w-12 h-12 rounded-full"
                        />
                        <div>
                          <h3 className="font-semibold text-gray-800">
                            {appointment.doctor}
                          </h3>
                          <p className="text-gray-600">
                            {appointment.specialty}
                          </p>
                          <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-gray-500">
                            <div className="flex items-center">
                              <FaClock className="h-4 w-4 mr-1" />
                              <span>
                                {appointment.date} at {appointment.time}
                              </span>
                            </div>
                            <div className="flex items-center">
                              {appointment.type === "Video Call" && (
                                <FaVideo className="h-4 w-4 mr-1" />
                              )}
                              {appointment.type === "Phone Call" && (
                                <FaPhone className="h-4 w-4 mr-1" />
                              )}
                              {appointment.type === "In-Person" && (
                                <FaMapMarkerAlt className="h-4 w-4 mr-1" />
                              )}
                              <span>{appointment.type}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row gap-2 w-full lg:w-auto">
                        <button
                          className="px-4 py-2 border border-[#D7261E] text-[#D7261E] rounded-lg hover:bg-red-50 transition w-full sm:w-auto"
                          onClick={() =>
                            handleViewAppointmentDetails(appointment)
                          }
                        >
                          {appointment.date === "Today"
                            ? "Join Now"
                            : "View Details"}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Find Doctors Tab */}
        {activeTab === "doctors" && (
          <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
                Available Doctors
              </h2>
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full md:w-auto">
                <select
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-full sm:w-auto"
                  value={selectedSpecialty}
                  onChange={(e) => setSelectedSpecialty(e.target.value)}
                >
                  <option value="All Specialties">All Specialties</option>
                  {specialties.map((specialty) => (
                    <option key={specialty} value={specialty}>
                      {specialty}
                    </option>
                  ))}
                </select>

                <select
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-full sm:w-auto"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="name">Sort by Name</option>
                  <option value="experience">Sort by Experience</option>
                  <option value="rating">Sort by Rating</option>
                  <option value="price">Sort by Price</option>
                </select>

                <div className="relative w-full sm:w-64">
                  <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <input
                    type="text"
                    placeholder="Search doctors..."
                    className="border border-gray-300 rounded-lg px-3 py-2 pl-10 text-sm w-full"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {doctorsLoading ? (
              <div className="text-center py-8 text-gray-500">
                Loading doctors...
              </div>
            ) : doctorsError ? (
              <div className="text-center py-8 text-red-500">
                Error loading doctors: {doctorsError}
              </div>
            ) : (
              <div className="grid gap-4">
                {filteredDoctors.map((doctor) => (
                  <div
                    key={doctor.id}
                    className="border border-gray-200 rounded-lg p-4 sm:p-6 hover:shadow-md transition"
                  >
                    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                      <div className="flex items-center space-x-4">
                        <img
                          src={doctor.profile_image_url || profile}
                          alt={doctor.name}
                          className="w-16 h-16 rounded-full object-cover"
                        />
                        <div>
                          <h3 className="text-base sm:text-lg font-semibold text-gray-800">
                            {doctor.name}
                          </h3>
                          <p className="text-gray-600">{doctor.specialty}</p>
                          <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-gray-500">
                            <span>
                              <FaStar className="inline text-yellow-400" />{" "}
                              {doctor.rating || "No rating"} (
                              {doctor.total_reviews || 0} reviews)
                            </span>
                            <span>🏥 {doctor.experience} years experience</span>
                            <span>💰 R{doctor.fee}</span>
                            <span
                              className={`px-2 py-1 rounded-full text-xs ${
                                doctor.is_available
                                  ? "bg-green-100 text-green-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
                              {doctor.is_available
                                ? "Available"
                                : "Not Available"}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row gap-2 w-full lg:w-auto">
                        <button
                          className="px-4 py-2 border border-[#274D60] text-[#274D60] rounded-lg hover:bg-blue-50 transition w-full sm:w-auto"
                          onClick={() => handleViewDoctorProfile(doctor)}
                        >
                          View Profile
                        </button>
                        <button
                          className="px-4 py-2 border border-[#D7261E] text-[#D7261E] rounded-[0.8rem] hover:bg-red-100 transition w-full sm:w-auto"
                          onClick={() => handleBookAppointment(doctor)}
                          disabled={!doctor.is_available || bookingLoading}
                        >
                          {bookingLoading ? "Booking..." : "Book Appointment"}
                        </button>
                      </div>
                    </div>

                    {doctor.biography && (
                      <div className="mt-4">
                        <p className="text-sm text-gray-600 line-clamp-2">
                          {doctor.biography}
                        </p>
                      </div>
                    )}
                  </div>
                ))}

                {filteredDoctors.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    No doctors found matching your criteria.
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Messages Tab */}
        {activeTab === "messages" && (
          <div className="h-[calc(100vh-200px)] overflow-hidden">
            <PatientMessages />
          </div>
        )}

        {/* Medical History Tab */}
        {activeTab === "history" && (
          <div className="bg-white rounded-xl shadow-sm p-6 max-w-full overflow-x-auto">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4 sm:gap-0">
              <h2 className="text-xl font-semibold text-gray-800">
                Medical History
              </h2>
              <DownloadRecordsButton medicalRecords={medicalRecords} />
            </div>

            {recordsLoading ? (
              <div className="text-center py-8 text-gray-500">
                Loading medical records...
              </div>
            ) : recordsError ? (
              <div className="text-center py-8 text-red-500">
                Error loading medical records: {recordsError}
              </div>
            ) : (
              <div className="space-y-6">
                {/* Medical Records */}
                <div>
                  <h3 className="text-lg font-medium text-gray-800 mb-4 flex items-center gap-2">
                    <FaFileMedical className="text-blue-500" />
                    Medical Records
                  </h3>
                  {medicalRecordsUI.length > 0 ? (
                    <div className="space-y-4">
                      {medicalRecordsUI.map((record, index) => (
                        <div
                          key={record.id}
                          className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition"
                        >
                          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0">
                            <div className="flex flex-col sm:flex-row items-start sm:items-center space-x-0 sm:space-x-3 mb-2 sm:mb-0">
                              <span className="font-medium text-gray-800">
                                {record.date}
                              </span>
                              <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full whitespace-nowrap">
                                {record.type}
                              </span>
                            </div>
                            <button
                              className="text-[#274D60] hover:text-[#1e3a4a] text-sm font-medium whitespace-nowrap"
                              onClick={() =>
                                handleViewMedicalRecord(record.raw)
                              }
                            >
                              View Details
                            </button>
                          </div>
                          <p className="font-medium text-gray-800 mt-2">
                            {record.doctor}
                          </p>
                          <p className="text-sm text-gray-600">
                            {record.diagnosis}
                          </p>
                          {record.treatment && (
                            <p className="text-sm text-gray-600 mt-1">
                              <span className="font-medium">Treatment:</span>{" "}
                              {record.treatment}
                            </p>
                          )}
                          {record.medications &&
                            record.medications !==
                              "No medications prescribed" && (
                              <p className="text-sm text-gray-600 mt-1">
                                <span className="font-medium">
                                  Medications:
                                </span>{" "}
                                {record.medications}
                              </p>
                            )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      No medical records found.
                    </div>
                  )}
                </div>
                <RecordPreviewModal
                  open={previewOpen}
                  record={previewRecord}
                  onClose={() => {
                    const params = new URLSearchParams(location.search);
                    params.delete("record");
                    navigate(
                      {
                        pathname: location.pathname,
                        search: params.toString(),
                      },
                      { replace: true }
                    );
                    setPreviewOpen(false);
                    setPreviewRecord(null);
                  }}
                />

                {/* Lab Results */}
                <div>
                  <h3 className="text-lg font-medium text-gray-800 mb-4 flex items-center gap-2">
                    <FaNotesMedical className="text-green-500" />
                    Lab Results
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {medicalRecordsUI
                      .filter(
                        (record) =>
                          (record.notes &&
                            record.notes.toLowerCase().includes("lab")) ||
                          (record.diagnosis &&
                            record.diagnosis.toLowerCase().includes("test"))
                      )
                      .slice(0, 3)
                      .map((result, index) => (
                        <div
                          key={index}
                          className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 border border-gray-200 rounded-lg gap-4 sm:gap-0"
                        >
                          <div>
                            <p className="font-medium text-gray-800">
                              {result.diagnosis}
                            </p>
                            <p className="text-sm text-gray-600">
                              {result.date}
                            </p>
                          </div>
                          <div className="flex items-center space-x-4">
                            <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full whitespace-nowrap">
                              Completed
                            </span>
                            <button className="text-[#274D60] hover:text-red-700 text-sm font-medium whitespace-nowrap">
                              Download
                            </button>
                          </div>
                        </div>
                      ))}

                    {medicalRecordsUI.filter(
                      (record) =>
                        (record.notes &&
                          record.notes.toLowerCase().includes("lab")) ||
                        (record.diagnosis &&
                          record.diagnosis.toLowerCase().includes("test"))
                    ).length === 0 && (
                      <div className="col-span-2 text-center py-4 text-gray-500">
                        No lab results found in your medical records.
                      </div>
                    )}
                  </div>
                </div>

                {/* Prescriptions */}
                <div>
                  <h3 className="text-lg font-medium text-gray-800 mb-4 flex items-center gap-2">
                    <FaPrescription className="text-purple-500" />
                    Prescriptions
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {medicalRecordsUI
                      .filter(
                        (record) =>
                          record.medications &&
                          record.medications !== "No medications prescribed"
                      )
                      .slice(0, 2)
                      .map((prescription, index) => (
                        <div
                          key={index}
                          className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 border border-gray-200 rounded-lg gap-4 sm:gap-0"
                        >
                          <div>
                            <p className="font-medium text-gray-800">
                              Prescription from {prescription.date}
                            </p>
                            <p className="text-sm text-gray-600">
                              {prescription.medications}
                            </p>
                            <p className="text-xs text-gray-500">
                              Prescribed by {prescription.doctor}
                            </p>
                          </div>
                          <div className="text-right sm:text-left">
                            <button className="text-[#DC2626] hover:text-red-700 text-sm font-medium mt-1 whitespace-nowrap">
                              Request Refill
                            </button>
                          </div>
                        </div>
                      ))}

                    {medicalRecordsUI.filter(
                      (record) =>
                        record.medications &&
                        record.medications !== "No medications prescribed"
                    ).length === 0 && (
                      <div className="col-span-2 text-center py-4 text-gray-500">
                        No prescriptions found in your medical records.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default PatientDashboard;
