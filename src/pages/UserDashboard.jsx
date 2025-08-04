// Updated PatientDashboard.jsx with PDF download functionality

import { useState } from "react";
import { 
  FaCalendarAlt, 
  FaUserMd, 
  FaHistory, 
  FaBell, 
  FaUser, 
  FaSignOutAlt,
  FaVideo,
  FaPhone,
  FaMapMarkerAlt,
  FaClock,
  FaHeart,
  FaThermometerHalf,
  FaWeight,
  FaTint,
  FaDownload
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { RecordPdf } from "../components/records/RecordPdf"; // Make sure this path is correct

function PatientDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const navigate = useNavigate();

  // Sample patient data for PDF generation
  const patientRecordData = {
    // Patient Information
    patientName: "Major Tech",
    dateOfBirth: "1990-01-15",
    gender: "Male",
    idNumber: "9001155555083",
    contactNumber: "+27 82 123 4567",
    address: "123 Main Street, Johannesburg, Gauteng, 2000",
    medicalAid: "Discovery Health",
    medicalAidNumber: "DH123456789",
    
    // Emergency Contact
    emergencyContactName: "Jane Tech",
    emergencyContactRelation: "Spouse",
    emergencyContactPhone: "+27 83 987 6543",
    
    // Visit Information
    visitDate: "2025-07-25",
    visitTime: "14:30",
    attendingPhysician: "Dr. Sarah Johnson",
    department: "General Medicine",
    
    // Vital Signs
    bloodPressure: "120/80",
    heartRate: "72",
    temperature: "36.5",
    weight: "75",
    height: "175",
    respiratoryRate: "16",
    
    // Medical Information
    chiefComplaint: "Annual check-up and routine health assessment",
    historyOfPresentIllness: "Patient presents for routine annual physical examination. No acute complaints. Reports feeling well overall with good energy levels and no significant changes in health status since last visit.",
    physicalExamination: "General appearance: Well-appearing, alert, oriented. Vital signs stable. Cardiovascular: Regular rate and rhythm, no murmurs. Respiratory: Clear to auscultation bilaterally. Abdomen: Soft, non-tender. Neurological: Grossly intact.",
    diagnosis: "Z00.00 - Encounter for general adult medical examination without abnormal findings",
    treatmentPlan: "Continue current healthy lifestyle. Regular exercise and balanced diet. Annual follow-up recommended.",
    medications: "Vitamin D3 1000 IU daily, Multivitamin daily",
    followUpInstructions: "Continue current medications. Return for annual physical examination in 12 months or sooner if any health concerns arise. Maintain healthy diet and regular exercise routine."
  };

  const upcomingAppointments = [
    {
      id: 1,
      doctor: "Dr. Sarah Johnson",
      specialty: "General Medicine",
      date: "Today",
      time: "2:30 PM",
      type: "Video Call",
      avatar: "https://www.gravatar.com/avatar/?d=mp"
    },
    {
      id: 2,
      doctor: "Dr. Michael Chen",
      specialty: "Cardiology",
      date: "Tomorrow",
      time: "10:00 AM",
      type: "In-Person",
      avatar: "https://www.gravatar.com/avatar/?d=mp"
    },
    {
      id: 3,
      doctor: "Dr. Emily Davis",
      specialty: "Dermatology",
      date: "Aug 2",
      time: "3:15 PM",
      type: "Phone Call",
      avatar: "https://www.gravatar.com/avatar/?d=mp"
    }
  ];

  const availableDoctors = [
    {
      id: 1,
      name: "Dr. Robert Wilson",
      specialty: "Orthopedic Surgery",
      nextAvailable: "Today 4:00 PM",
      avatar: "https://www.gravatar.com/avatar/?d=mp"
    },
    {
      id: 2,
      name: "Dr. Lisa Anderson",
      specialty: "Pediatrics",
      nextAvailable: "Tomorrow 9:00 AM",
      avatar: "https://www.gravatar.com/avatar/?d=mp"
    },
    {
      id: 3,
      name: "Dr. James Taylor",
      specialty: "Psychiatry",
      nextAvailable: "Aug 1 11:30 AM",
      avatar: "https://www.gravatar.com/avatar/?d=mp"
    }
  ];

  const recentActivity = [
    { date: "July 25", action: "Consultation completed with Dr. Sarah Johnson", type: "completed" },
    { date: "July 23", action: "Prescription refilled - Vitamin D supplements", type: "prescription" },
    { date: "July 20", action: "Lab results uploaded - Blood work", type: "results" },
    { date: "July 18", action: "Appointment scheduled with Dr. Michael Chen", type: "scheduled" }
  ];

  const healthMetrics = [
    { label: "Heart Rate", value: "72 bpm", icon: FaHeart, color: "text-red-500" },
    { label: "Blood Pressure", value: "120/80", icon: FaTint, color: "text-blue-500" },
    { label: "Temperature", value: "98.6°F", icon: FaThermometerHalf, color: "text-orange-500" },
    { label: "Weight", value: "165 lbs", icon: FaWeight, color: "text-green-500" }
  ];

  // PDF Download Component
  const DownloadRecordsButton = () => (
    <PDFDownloadLink 
      document={<RecordPdf data={patientRecordData} />}
      fileName={`medical_record_${patientRecordData.patientName}_${new Date().toISOString().split('T')[0]}.pdf`}
    >
      {({ loading }) => (
        <button 
          className={`bg-red-500 text-white px-4 py-2 rounded-[0.8rem] font-medium hover:bg-red-600 transition whitespace-nowrap flex items-center gap-2 ${
            loading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          disabled={loading}
        >
          <FaDownload className="h-4 w-4" />
          {loading ? 'Preparing...' : 'Download Records'}
        </button>
      )}
    </PDFDownloadLink>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center py-4">
            <div className="flex items-center space-x-4 mb-3 sm:mb-0">
              <img
                src="../assets/images/mpiloLogo.png"
                alt="Mpilo Logo"
                className="h-8 w-auto"
                onClick={() => navigate("/")}
              />
            </div>

            <div className="flex items-center space-x-4">
              <button className="relative p-2 text-gray-400 hover:text-gray-500">
                <FaBell className="h-5 w-5" />
                <span className="absolute top-0 right-0 block h-2 w-2 bg-red-400 rounded-full"></span>
              </button>

              <div className="flex items-center space-x-3">
                <img
                  className="h-8 w-8 rounded-full"
                  src="https://www.gravatar.com/avatar/?d=mp"
                  alt="User avatar"
                />
                <span className="hidden sm:block text-sm font-medium text-gray-700">Major Tech</span>
                <button className="text-gray-400 hover:text-gray-500" onClick={() => navigate("/Login")}>
                  <FaSignOutAlt className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 mt-4">
        <h1 className="text-sm sm:text-sm md:text-sm lg:text-lg font-semibold text-gray-800">
          Patient Dashboard
        </h1>
        
        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-6 sm:gap-8 lg:gap-12 mb-8 border-b overflow-x-auto">
          {[
            { id: 'overview', label: 'Overview', icon: FaUser },
            { id: 'appointments', label: 'Appointments', icon: FaCalendarAlt },
            { id: 'doctors', label: 'Find Doctors', icon: FaUserMd },
            { id: 'history', label: 'Medical History', icon: FaHistory }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 pb-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                activeTab === tab.id
                  ? 'border-red-500 text-red-500'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <tab.icon className="h-4 w-4" />
              <span className="hidden sm:inline">{tab.label}</span>
              <span className="sm:hidden">{tab.label.split(' ')[0]}</span>
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Welcome Card */}
            <div className="lg:col-span-2">
              <div className="bg-gradient-to-r from-[#274D60] to-[#1e3a4a] rounded-xl p-6 text-white mb-6">
                <h2 className="text-2xl font-bold mb-2">Welcome back, Major Tech!</h2>
                <p className="text-blue-100">You have 1 appointment today and 2 upcoming this week.</p>
                <button className="mt-4 bg-white text-red-500 px-4 py-2 rounded-[0.8rem] font-medium hover:bg-gray-100 transition">
                  Book New Appointment
                </button>
              </div>

              {/* Health Metrics */}
              <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Health Overview</h3>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  {healthMetrics.map((metric, index) => (
                    <div key={index} className="text-center p-4 bg-gray-50 rounded-lg">
                      <metric.icon className={`h-6 w-6 mx-auto mb-2 ${metric.color}`} />
                      <p className="text-sm text-gray-600">{metric.label}</p>
                      <p className="font-semibold text-gray-800">{metric.value}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Activity</h3>
                <div className="space-y-4">
                  {recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className={`w-2 h-2 mt-2 rounded-full ${
                        activity.type === 'completed' ? 'bg-green-400' :
                        activity.type === 'prescription' ? 'bg-blue-400' :
                        activity.type === 'results' ? 'bg-yellow-400' : 'bg-purple-400'
                      }`}></div>
                      <div>
                        <p className="text-sm text-gray-800">{activity.action}</p>
                        <p className="text-xs text-gray-500">{activity.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Next Appointment */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Next Appointment</h3>
                {upcomingAppointments[0] && (
                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center space-x-3 mb-3">
                      <img
                        src={upcomingAppointments[0].avatar}
                        alt={upcomingAppointments[0].doctor}
                        className="w-10 h-10 rounded-full"
                      />
                      <div>
                        <p className="font-medium text-gray-800">{upcomingAppointments[0].doctor}</p>
                        <p className="text-sm text-gray-600">{upcomingAppointments[0].specialty}</p>
                      </div>
                    </div>
                    <div className="flex items-center text-sm text-gray-600 mb-2">
                      <FaClock className="h-4 w-4 mr-2" />
                      <span>{upcomingAppointments[0].date} at {upcomingAppointments[0].time}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600 mb-3">
                      {upcomingAppointments[0].type === 'Video Call' && <FaVideo className="h-4 w-4 mr-2" />}
                      {upcomingAppointments[0].type === 'Phone Call' && <FaPhone className="h-4 w-4 mr-2" />}
                      {upcomingAppointments[0].type === 'In-Person' && <FaMapMarkerAlt className="h-4 w-4 mr-2" />}
                      <span>{upcomingAppointments[0].type}</span>
                    </div>
                    <button className="w-full bg-[#DC2626] text-white py-2 rounded-lg font-medium hover:bg-red-700 transition">
                      Join Now
                    </button>
                  </div>
                )}
              </div>

              {/* Quick Actions */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h3>
                <div className="space-y-4">
                  <button className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition">
                    <div className="flex items-center space-x-3">
                      <FaCalendarAlt className="h-5 w-5 text-red-600" />
                      <span className="font-medium">Book Appointment</span>
                    </div>
                  </button>
                  <button className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition">
                    <div className="flex items-center space-x-3">
                      <FaUserMd className="h-5 w-5 text-red-600" />
                      <span className="font-medium">Find a Doctor</span>
                    </div>
                  </button>
                  <button className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition">
                    <div className="flex items-center space-x-3">
                      <FaHistory className="h-5 w-5 text-red-600" />
                      <span className="font-medium">View Records</span>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Appointments Tab */}
        {activeTab === 'appointments' && (
          <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-3">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-800">My Appointments</h2>
              <button className="bg-red-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-700 transition w-full md:w-auto">
                Book New Appointment
              </button>
            </div>

            <div className="grid gap-4">
              {upcomingAppointments.map((appointment) => (
                <div key={appointment.id} className="border border-gray-200 rounded-lg p-4 sm:p-6 hover:shadow-md transition">
                  <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                    <div className="flex items-center space-x-4">
                      <img src={appointment.avatar} alt={appointment.doctor} className="w-12 h-12 rounded-full" />
                      <div>
                        <h3 className="font-semibold text-gray-800">{appointment.doctor}</h3>
                        <p className="text-gray-600">{appointment.specialty}</p>
                        <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-gray-500">
                          <div className="flex items-center">
                            <FaClock className="h-4 w-4 mr-1" />
                            <span>{appointment.date} at {appointment.time}</span>
                          </div>
                          <div className="flex items-center">
                            {appointment.type === 'Video Call' && <FaVideo className="h-4 w-4 mr-1" />}
                            {appointment.type === 'Phone Call' && <FaPhone className="h-4 w-4 mr-1" />}
                            {appointment.type === 'In-Person' && <FaMapMarkerAlt className="h-4 w-4 mr-1" />}
                            <span>{appointment.type}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-2 w-full lg:w-auto">
                      <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition w-full sm:w-auto">
                        Reschedule
                      </button>
                      <button className="px-4 py-2 border border-[#D7261E] text-[#D7261E] rounded-lg hover:bg-red-50 transition w-full sm:w-auto">
                        {appointment.date === 'Today' ? 'Join Now' : 'View Details'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Find Doctors Tab */}
        {activeTab === 'doctors' && (
          <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-800">Available Doctors</h2>
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full md:w-auto">
                <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-full sm:w-auto">
                  <option>All Specialties</option>
                  <option>General Medicine</option>
                  <option>Cardiology</option>
                  <option>Dermatology</option>
                  <option>Orthopedics</option>
                </select>
                <input
                  type="text"
                  placeholder="Search doctors..."
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-full sm:w-64"
                />
              </div>
            </div>

            <div className="grid gap-4">
              {availableDoctors.map((doctor) => (
                <div key={doctor.id} className="border border-gray-200 rounded-lg p-4 sm:p-6 hover:shadow-md transition">
                  <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                    <div className="flex items-center space-x-4">
                      <img src={doctor.avatar} alt={doctor.name} className="w-16 h-16 rounded-full" />
                      <div>
                        <h3 className="text-base sm:text-lg font-semibold text-gray-800">{doctor.name}</h3>
                        <p className="text-gray-600">{doctor.specialty}</p>
                        <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-gray-500">
                          <span>Next: {doctor.nextAvailable}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-2 w-full lg:w-auto">
                      <button className="px-4 py-2 border border-[#274D60] text-[#274D60] rounded-lg hover:bg-blue-50 transition w-full sm:w-auto">
                        View Profile
                      </button>
                      <button className="px-4 py-2 border border-[#D7261E] text-[#D7261E] rounded-[0.8rem] hover:bg-red-100 transition w-full sm:w-auto">
                        Book Appointment
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Medical History Tab */}
        {activeTab === "history" && (
          <div className="bg-white rounded-xl shadow-sm p-6 max-w-full overflow-x-auto">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4 sm:gap-0">
              <h2 className="text-xl font-semibold text-gray-800">Medical History</h2>
              <DownloadRecordsButton />
            </div>
            
            <div className="space-y-6">
              {/* Recent Consultations */}
              <div>
                <h3 className="text-lg font-medium text-gray-800 mb-4">Recent Consultations</h3>
                <div className="space-y-4">
                  {[
                    {
                      date: "July 25, 2025",
                      doctor: "Dr. Sarah Johnson",
                      specialty: "General Medicine",
                      diagnosis: "Annual check-up - All vitals normal",
                      status: "Completed",
                    },
                    {
                      date: "June 15, 2025",
                      doctor: "Dr. Michael Chen",
                      specialty: "Cardiology",
                      diagnosis: "Blood pressure monitoring - Stable",
                      status: "Completed",
                    },
                    {
                      date: "May 8, 2025",
                      doctor: "Dr. Emily Davis",
                      specialty: "Dermatology",
                      diagnosis: "Skin examination - Minor concern addressed",
                      status: "Completed",
                    },
                  ].map((record, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center space-x-0 sm:space-x-3 mb-2 sm:mb-0">
                          <span className="font-medium text-gray-800">{record.date}</span>
                          <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full whitespace-nowrap">
                            {record.status}
                          </span>
                        </div>
                        <button className="text-[#274D60] hover:text-[#1e3a4a] text-sm font-medium whitespace-nowrap">
                          View Details
                        </button>
                      </div>
                      <p className="font-medium text-gray-800 mt-2">{record.doctor}</p>
                      <p className="text-sm text-gray-600">{record.specialty}</p>
                      <p className="text-sm text-gray-700 mt-2">{record.diagnosis}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Lab Results */}
              <div>
                <h3 className="text-lg font-medium text-gray-800 mb-4">Lab Results</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { test: "Complete Blood Count", date: "July 20, 2025", status: "Normal", file: "CBC_July2025.pdf" },
                    { test: "Lipid Panel", date: "June 10, 2025", status: "Normal", file: "Lipid_June2025.pdf" },
                    { test: "Thyroid Function", date: "May 15, 2025", status: "Normal", file: "Thyroid_May2025.pdf" },
                  ].map((result, index) => (
                    <div key={index} className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 border border-gray-200 rounded-lg gap-4 sm:gap-0">
                      <div>
                        <p className="font-medium text-gray-800">{result.test}</p>
                        <p className="text-sm text-gray-600">{result.date}</p>
                      </div>
                      <div className="flex items-center space-x-4">
                        <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full whitespace-nowrap">
                          {result.status}
                        </span>
                        <button className="text-[#274D60] hover:text-red-700 text-sm font-medium whitespace-nowrap">
                          Download
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Prescriptions */}
              <div>
                <h3 className="text-lg font-medium text-gray-800 mb-4">Current Prescriptions</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { medication: "Vitamin D3", dosage: "1000 IU daily", prescribed: "Dr. Sarah Johnson", refills: "2 remaining" },
                    { medication: "Lisinopril", dosage: "10mg daily", prescribed: "Dr. Michael Chen", refills: "5 remaining" },
                  ].map((prescription, index) => (
                    <div key={index} className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 border border-gray-200 rounded-lg gap-4 sm:gap-0">
                      <div>
                        <p className="font-medium text-gray-800">{prescription.medication}</p>
                        <p className="text-sm text-gray-600">{prescription.dosage}</p>
                        <p className="text-xs text-gray-500">Prescribed by {prescription.prescribed}</p>
                      </div>
                      <div className="text-right sm:text-left">
                        <p className="text-sm text-gray-700">{prescription.refills}</p>
                        <button className="text-[#DC2626] hover:text-red-700 text-sm font-medium mt-1 whitespace-nowrap">
                          Request Refill
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default PatientDashboard;