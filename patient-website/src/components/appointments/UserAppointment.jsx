

import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAppointmentBooking } from "../../hooks/useAppointmentBooking";
import { useAuth } from "../../context/AuthProvider";
import profile from "../../../public/assets/images/profileImg.png";


export default function NewAppointment() {
  const [form, setForm] = useState({
    date: "",
    time: "",
    duration: 30,
    notes: "",
    consultationType: "In-Person"
  });
  
  const navigate = useNavigate();
  const location = useLocation();
  const { bookAppointment, isLoading, error } = useAppointmentBooking();
  const { user } = useAuth();
  
  // Get doctor details from navigation state
  const doctor = location.state?.doctor;

  useEffect(() => {
    if (!doctor) {
      // Redirect back if no doctor data
      navigate("/UserDashboard?tab=doctors");
    }
  }, [doctor, navigate]);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    
    if (!doctor || !user) return;
    
    const result = await bookAppointment({
      doctor,
      consultationType: form.consultationType,
      selectedDate: form.date,
      selectedTime: form.time,
      notes: form.notes,
      estimatedDuration: form.duration
    });
    
    if (result.success) {
      navigate("/UserDashboard?tab=appointments");
    }
  }

  if (!doctor) {
    return (
      <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md mt-8">
        <p className="text-center text-gray-600">Loading doctor information...</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md mt-8">
      {/* Doctor Information Header */}
      <div className="flex items-center space-x-4 mb-6 p-4 bg-gray-50 rounded-lg">
        <img 
          src={doctor.avatar || profile} 
          alt={doctor.name} 
          className="w-16 h-16 rounded-full object-cover" 
        />
        <div>
          <h2 className="text-xl font-bold text-gray-900">{doctor.name}</h2>
          <p className="text-gray-600">{doctor.specialty}</p>
          <div className="flex items-center mt-1">
            <span className="text-yellow-400">⭐ {doctor.rating || 'No rating'}</span>
            <span className="mx-2 text-gray-300">•</span>
            <span className="text-gray-500">{doctor.experience} years experience</span>
            <span className="mx-2 text-gray-300">•</span>
            <span className="text-gray-500">R{doctor.fee}</span>
          </div>
        </div>
      </div>

      <h1 className="mb-6 text-2xl font-bold text-gray-900">Book an Appointment</h1>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="consultationType" className="block text-sm font-medium text-gray-700">
            Consultation Type
          </label>
          <select
            id="consultationType"
            name="consultationType"
            required
            value={form.consultationType}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm"
          >
            <option value="In-Person">In-Person</option>
            <option value="Video Call">Video Call</option>
            <option value="Phone Call">Phone Call</option>
          </select>
        </div>

        <div className="flex space-x-4">
          <div className="flex-1">
            <label htmlFor="date" className="block text-sm font-medium text-gray-700">
              Date
            </label>
            <input
              id="date"
              name="date"
              type="date"
              required
              value={form.date}
              onChange={handleChange}
              min={new Date().toISOString().split('T')[0]}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm"
            />
          </div>

          <div className="flex-1">
            <label htmlFor="time" className="block text-sm font-medium text-gray-700">
              Time
            </label>
            <select
              id="time"
              name="time"
              required
              value={form.time}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm"
            >
              <option value="">Select a time</option>
              <option value="09:00 AM">09:00 AM</option>
              <option value="10:00 AM">10:00 AM</option>
              <option value="11:00 AM">11:00 AM</option>
              <option value="02:00 PM">02:00 PM</option>
              <option value="03:00 PM">03:00 PM</option>
              <option value="04:00 PM">04:00 PM</option>
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="duration" className="block text-sm font-medium text-gray-700">
            Duration (minutes)
          </label>
          <select
            id="duration"
            name="duration"
            required
            value={form.duration}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm"
          >
            <option value={15}>15 minutes</option>
            <option value={30}>30 minutes</option>
            <option value={45}>45 minutes</option>
            <option value={60}>60 minutes</option>
          </select>
        </div>

        <div>
          <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
            Reason for Appointment
          </label>
          <textarea
            id="notes"
            name="notes"
            rows={3}
            required
            value={form.notes}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm"
            placeholder="Describe your symptoms or reason for visit"
          />
        </div>

        <div className="bg-blue-50 p-4 rounded-md">
          <h3 className="font-medium text-blue-900">Appointment Summary</h3>
          <p className="text-sm text-blue-700 mt-1">
            Dr. {doctor.name} • {form.consultationType} • {form.date} at {form.time} • {form.duration} minutes
          </p>
          <p className="text-sm font-medium text-blue-900 mt-2">
            Total: R{doctor.fee}
          </p>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full rounded-md bg-red-600 py-2 px-4 text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Booking Appointment...' : 'Confirm Appointment'}
        </button>
        
        <button
          type="button"
          onClick={() => navigate("/UserDashboard?tab=doctors")}
          className="w-full rounded-md border border-gray-300 py-2 px-4 text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
        >
          Cancel
        </button>
      </form>
    </div>
  );
}