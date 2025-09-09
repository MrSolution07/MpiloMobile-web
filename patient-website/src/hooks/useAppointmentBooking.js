// hooks/useAppointmentBooking.js
import { useState } from 'react';
import { supabase } from '../services/supabaseClient';
import { useAuth } from '../context/AuthProvider';

export const useAppointmentBooking = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  // Browser-compatible alert function
  const showAlert = (title, message) => {
    // You can replace this with your preferred UI library's alert/modal
    window.alert(`${title}: ${message}`);
    // Alternatively, you could use a state to trigger a custom modal component
  };

  // Function to ensure patient exists
  const ensurePatientExists = async () => {
    if (!user) return false;

    try {
      // Check if patient exists
      const { data: existingPatient, error: checkError } = await supabase
        .from('patients')
        .select('id')
        .eq('id', user.id)
        .single();

      if (checkError && checkError.code !== 'PGRST116') { // PGRST116 = no rows found
        throw checkError;
      }

      return !!existingPatient;
    } catch (error) {
      console.error('Error checking patient existence:', error);
      return false;
    }
  };

  const generateAppointmentNumber = () => {
    const timestamp = new Date().getTime();
    return `A${timestamp.toString().slice(-6)}`;
  };

  const parseTimeSlot = (selectedTime) => {
    const [time, period] = selectedTime.split(' ');
    let [hours, minutes] = time.split(':').map(Number);
    
    // Convert to 24-hour format
    if (period === 'PM' && hours !== 12) hours += 12;
    if (period === 'AM' && hours === 12) hours = 0;

    return { hours, minutes };
  };

  const bookAppointment = async (bookingData) => {
    if (!user) {
      setError("You must be logged in to book an appointment.");
      showAlert("Error", "You must be logged in to book an appointment.");
      return { success: false, error: "Not authenticated" };
    }

    // Check if patient exists
    const patientExists = await ensurePatientExists();
    if (!patientExists) {
      setError("Patient profile not found. Please contact support.");
      showAlert("Error", "Patient profile not found. Please contact support.");
      return { success: false, error: "Patient not found" };
    }

    const {
      doctor,
      consultationType,
      selectedDate,
      selectedTime,
      notes,
      symptoms = null,
      specialRequirements = null,
      estimatedDuration = 30,
      mobileUnitScheduleId = null
    } = bookingData;

    if (!selectedTime) {
      setError("Please select a time slot.");
      showAlert("Error", "Please select a time slot.");
      return { success: false, error: "No time selected" };
    }

    setIsLoading(true);
    setError(null);

    try {
      // Combine date and time
      const { hours, minutes } = parseTimeSlot(selectedTime);
      const scheduledDateTime = new Date(selectedDate);
      scheduledDateTime.setHours(hours, minutes, 0, 0);

      // Create appointment data
      const appointmentData = {
        appointment_number: generateAppointmentNumber(),
        patient_id: user.id, // References patients table
        appointment_type: consultationType.toLowerCase(),
        mobile_unit_schedule_id: consultationType.toLowerCase() === 'mobile_unit' ? mobileUnitScheduleId : null,
        doctor_id: doctor.id,
        scheduled_datetime: scheduledDateTime.toISOString(),
        estimated_duration: estimatedDuration,
        status: 'scheduled',
        reason_for_visit: notes || 'General consultation',
        symptoms: symptoms,
        special_requirements: specialRequirements,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      // Insert into Supabase
      const { data, error: supabaseError } = await supabase
        .from('appointments')
        .insert([appointmentData])
        .select()
        .single();

      if (supabaseError) {
        console.error('Error creating appointment:', supabaseError);
        throw supabaseError;
      }

      // Success
      const successMessage = `Appointment booked successfully with ${doctor.name} on ${scheduledDateTime.toLocaleDateString()} at ${selectedTime}`;
      
      showAlert("Success", successMessage);

      return {
        success: true,
        data: {
          appointment: data,
          appointmentNumber: appointmentData.appointment_number,
          doctorName: doctor.name,
          consultationType,
          scheduledDateTime: scheduledDateTime.toISOString(),
          time: `${scheduledDateTime.toDateString()} at ${selectedTime}`,
          notes
        }
      };

    } catch (error) {
      console.error('Appointment booking error:', error);
      const errorMessage = error.message || "Failed to book appointment. Please try again.";
      setError(errorMessage);
      showAlert("Error", errorMessage);
      
      return {
        success: false,
        error: errorMessage
      };
    } finally {
      setIsLoading(false);
    }
  };

  const cancelAppointment = async (appointmentId) => {
    if (!user) {
      setError("You must be logged in to cancel an appointment.");
      showAlert("Error", "You must be logged in to cancel an appointment.");
      return { success: false, error: "Not authenticated" };
    }

    setIsLoading(true);
    setError(null);

    try {
      const { error: supabaseError } = await supabase
        .from('appointments')
        .update({ 
          status: 'cancelled',
          updated_at: new Date().toISOString()
        })
        .eq('id', appointmentId)
        .eq('patient_id', user.id);

      if (supabaseError) {
        throw supabaseError;
      }

      showAlert("Success", "Appointment cancelled successfully.");
      return { success: true };

    } catch (error) {
      console.error('Appointment cancellation error:', error);
      const errorMessage = error.message || "Failed to cancel appointment. Please try again.";
      setError(errorMessage);
      showAlert("Error", errorMessage);
      
      return {
        success: false,
        error: errorMessage
      };
    } finally {
      setIsLoading(false);
    }
  };

  const rescheduleAppointment = async (appointmentId, newDateTime, newTimeSlot = null) => {
    if (!user) {
      setError("You must be logged in to reschedule an appointment.");
      showAlert("Error", "You must be logged in to reschedule an appointment.");
      return { success: false, error: "Not authenticated" };
    }

    setIsLoading(true);
    setError(null);

    try {
      let scheduledDateTime = new Date(newDateTime);
      
      // If a time slot is provided, parse and set the time
      if (newTimeSlot) {
        const { hours, minutes } = parseTimeSlot(newTimeSlot);
        scheduledDateTime.setHours(hours, minutes, 0, 0);
      }

      const { error: supabaseError } = await supabase
        .from('appointments')
        .update({ 
          scheduled_datetime: scheduledDateTime.toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', appointmentId)
        .eq('patient_id', user.id);

      if (supabaseError) {
        throw supabaseError;
      }

      showAlert("Success", "Appointment rescheduled successfully.");
      return { success: true };

    } catch (error) {
      console.error('Appointment rescheduling error:', error);
      const errorMessage = error.message || "Failed to reschedule appointment. Please try again.";
      setError(errorMessage);
      showAlert("Error", errorMessage);
      
      return {
        success: false,
        error: errorMessage
      };
    } finally {
      setIsLoading(false);
    }
  };

  const getDoctorAvailability = async (doctorId, date) => {
    try {
      // Get existing appointments for the doctor on the given date
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);

      const { data: existingAppointments, error } = await supabase
        .from('appointments')
        .select('scheduled_datetime, estimated_duration')
        .eq('doctor_id', doctorId)
        .eq('status', 'scheduled')
        .gte('scheduled_datetime', startOfDay.toISOString())
        .lte('scheduled_datetime', endOfDay.toISOString());

      if (error) throw error;

      // Convert booked slots to time strings for easier comparison
      const bookedSlots = existingAppointments?.map(appt => {
        const date = new Date(appt.scheduled_datetime);
        return date.toLocaleTimeString('en-US', { 
          hour: '2-digit', 
          minute: '2-digit',
          hour12: true 
        });
      }) || [];

      // Define all possible time slots
      const allTimeSlots = ["09:00 AM", "10:00 AM", "11:00 AM", "02:00 PM", "03:00 PM", "04:00 PM"];
      
      // Filter out booked slots
      const availableSlots = allTimeSlots.filter(slot => !bookedSlots.includes(slot));

      return {
        availableSlots,
        bookedSlots: existingAppointments || []
      };

    } catch (error) {
      console.error('Error fetching availability:', error);
      return {
        availableSlots: ["09:00 AM", "10:00 AM", "11:00 AM", "02:00 PM", "03:00 PM", "04:00 PM"],
        bookedSlots: [],
        error: error.message
      };
    }
  };

  const getPatientAppointments = async (status = null) => {
    if (!user) {
      setError("You must be logged in to view appointments.");
      return { success: false, error: "Not authenticated", appointments: [] };
    }

    try {
      let query = supabase
        .from('appointments')
        .select(`
          *,
          doctors:doctor_id (
            first_name,
            last_name,
            specialization,
            profile_image_url
          )
        `)
        .eq('patient_id', user.id)
        .order('scheduled_datetime', { ascending: true });

      if (status) {
        query = query.eq('status', status);
      }

      const { data, error } = await query;

      if (error) throw error;

      return {
        success: true,
        appointments: data || []
      };

    } catch (error) {
      console.error('Error fetching patient appointments:', error);
      return {
        success: false,
        error: error.message,
        appointments: []
      };
    }
  };

  const clearError = () => {
    setError(null);
  };

  return {
    bookAppointment,
    cancelAppointment,
    rescheduleAppointment,
    getDoctorAvailability,
    getPatientAppointments,
    isLoading,
    error,
    clearError
  };
};