import { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { FaCalendarAlt, FaClock, FaUserMd, FaMapMarkerAlt, FaVideo, FaPhone, FaNotesMedical, FaSpinner } from "react-icons/fa";
import { supabase } from "../../services/supabaseClient";
import { useAuth } from "../../context/AuthProvider";
import { useAppointmentBooking } from "../../hooks/useAppointmentBooking";
import profile from "../../../../src/assets/profileImg.png";


export default function AppointmentDetails() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { cancelAppointment } = useAppointmentBooking();
  
  const [appointment, setAppointment] = useState(location.state?.appointment);
  const [loading, setLoading] = useState(!location.state?.appointment);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!appointment && id) {
      fetchAppointmentDetails();
    }
  }, [id, appointment]);

  const fetchAppointmentDetails = async () => {
    if (!id || !user) return;
    
    setLoading(true);
    setError(null);

    try {
      const { data, error: supabaseError } = await supabase
        .from('appointments')
        .select(`
          *,
          doctors (
            first_name,
            last_name,
            specialization,
            profile_image_url
          )
        `)
        .eq('id', id)
        .eq('patient_id', user.id)
        .single();

      if (supabaseError) {
        throw supabaseError;
      }

      if (data) {
        const appointmentData = {
          id: data.id,
          doctor: `${data.doctors?.first_name || ''} ${data.doctors?.last_name || ''}`.trim() || "Doctor",
          specialty: data.doctors?.specialization || "General Medicine",
          date: new Date(data.scheduled_datetime).toLocaleDateString(),
          time: new Date(data.scheduled_datetime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          type: data.appointment_type || "In-Person",
          avatar: data.doctors?.profile_image_url || profile,
          status: data.status,
          notes: data.reason_for_visit,
          symptoms: data.symptoms,
          special_requirements: data.special_requirements,
          appointment_number: data.appointment_number,
          scheduled_datetime: data.scheduled_datetime,
          estimated_duration: data.estimated_duration
        };
        setAppointment(appointmentData);
      }
    } catch (err) {
      console.error('Error fetching appointment details:', err);
      setError(err.message || 'Failed to fetch appointment details');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelAppointment = async () => {
    if (!appointment) return;
    
    if (window.confirm('Are you sure you want to cancel this appointment?')) {
      const result = await cancelAppointment(appointment.id);
      if (result.success) {
        // Refresh the appointment details
        fetchAppointmentDetails();
      }
    }
  };

  const handleReschedule = () => {
    if (appointment) {
      navigate("/Userappointment", {
        state: {
          doctor: {
            id: appointment.doctor_id,
            name: appointment.doctor,
            specialty: appointment.specialty
          },
          editingAppointmentId: appointment.id
        }
      });
    }
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="flex items-center justify-center py-12">
          <FaSpinner className="animate-spin text-red-600 text-2xl mr-2" />
          <span className="text-gray-600">Loading appointment details...</span>
        </div>
      </div>
    );
  }

  if (error || !appointment) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="text-center py-8">
          <p className="text-red-600 mb-2">Error: {error || 'Appointment not found'}</p>
          <p className="text-gray-600 mb-4">We couldn't find the appointment details you're looking for.</p>
          <button 
            onClick={() => navigate("/UserDashboard?tab=appointments")}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
          >
            Back to Appointments
          </button>
        </div>
      </div>
    );
  }

  const getAppointmentTypeIcon = (type) => {
    switch (type) {
      case 'video':
      case 'Video Call': 
        return <FaVideo className="text-blue-500" />;
      case 'phone':
      case 'Phone Call': 
        return <FaPhone className="text-green-500" />;
      default: 
        return <FaMapMarkerAlt className="text-red-500" />;
    }
  };

  const formatAppointmentType = (type) => {
    switch (type) {
      case 'video': return 'Video Call';
      case 'phone': return 'Phone Call';
      case 'in_person': return 'In-Person';
      default: return type;
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md mt-8">
      <button 
        onClick={() => navigate("/UserDashboard?tab=appointments")}
        className="mb-6 text-red-600 hover:text-red-800 font-medium flex items-center"
      >
        ← Back to Appointments
      </button>

      <h1 className="text-2xl font-bold text-gray-900 mb-6">Appointment Details</h1>

      <div className="bg-gray-50 rounded-lg p-6 mb-6">
        <div className="flex items-center space-x-4 mb-4">
          <img 
            src={appointment.avatar} 
            alt={appointment.doctor} 
            className="w-16 h-16 rounded-full object-cover"
          />
          <div>
            <h2 className="text-xl font-semibold text-gray-900">{appointment.doctor}</h2>
            <p className="text-gray-600">{appointment.specialty}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center">
            <FaCalendarAlt className="text-red-600 mr-2" />
            <span className="font-medium">Date:</span>
            <span className="ml-2">{appointment.date}</span>
          </div>

          <div className="flex items-center">
            <FaClock className="text-red-600 mr-2" />
            <span className="font-medium">Time:</span>
            <span className="ml-2">{appointment.time}</span>
          </div>

          <div className="flex items-center">
            {getAppointmentTypeIcon(appointment.type)}
            <span className="font-medium ml-2">Type:</span>
            <span className="ml-2">{formatAppointmentType(appointment.type)}</span>
          </div>

          <div className="flex items-center">
            <span className={`px-2 py-1 rounded-full text-xs ${
              appointment.status === 'scheduled' ? 'bg-green-100 text-green-800' :
              appointment.status === 'completed' ? 'bg-blue-100 text-blue-800' :
              appointment.status === 'cancelled' ? 'bg-red-100 text-red-800' :
              'bg-yellow-100 text-yellow-800'
            }`}>
              {appointment.status?.charAt(0).toUpperCase() + appointment.status?.slice(1)}
            </span>
          </div>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <FaNotesMedical className="text-red-600 mr-2" />
          Appointment Information
        </h3>

        <div className="space-y-3">
          <div>
            <span className="font-medium text-gray-700">Appointment Number:</span>
            <span className="ml-2 text-gray-600">{appointment.appointment_number || `#${appointment.id}`}</span>
          </div>

          <div>
            <span className="font-medium text-gray-700">Duration:</span>
            <span className="ml-2 text-gray-600">{appointment.estimated_duration || 30} minutes</span>
          </div>

          <div>
            <span className="font-medium text-gray-700">Location:</span>
            <span className="ml-2 text-gray-600">
              {appointment.type === 'in_person' || appointment.type === 'In-Person' 
                ? 'Mpilo Hospital Main Campus' 
                : 'Virtual Consultation'}
            </span>
          </div>

          {appointment.notes && (
            <div>
              <span className="font-medium text-gray-700">Reason for Visit:</span>
              <p className="ml-2 text-gray-600 mt-1">{appointment.notes}</p>
            </div>
          )}

          {appointment.symptoms && (
            <div>
              <span className="font-medium text-gray-700">Symptoms:</span>
              <p className="ml-2 text-gray-600 mt-1">{appointment.symptoms}</p>
            </div>
          )}

          {appointment.special_requirements && (
            <div>
              <span className="font-medium text-gray-700">Special Requirements:</span>
              <p className="ml-2 text-gray-600 mt-1">{appointment.special_requirements}</p>
            </div>
          )}
        </div>
      </div>

      <div className="mt-6 flex gap-4 flex-wrap">
        {appointment.status === 'scheduled' && (
          <>
            <button 
              onClick={handleCancelAppointment}
              className="bg-red-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-700 transition"
            >
              Cancel Appointment
            </button>
            <button 
              onClick={handleReschedule}
              className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-50 transition"
            >
              Reschedule
            </button>
          </>
        )}
        
        <button 
          onClick={() => navigate("/UserDashboard?tab=appointments")}
          className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-50 transition"
        >
          Back to Appointments
        </button>
      </div>
    </div>
  );
}