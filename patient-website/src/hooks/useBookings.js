// hooks/useBookings.js
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../services/supabaseClient';
import { useAuth } from '../context/AuthProvider';

export const useBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  const fetchBookings = useCallback(async () => {
    if (!user) {
      setError('User not authenticated');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      console.log('Fetching bookings for user:', user.id);

      // First, get the patient ID from the patients table
      let { data: patientData, error: patientError } = await supabase
        .from('patients')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle();

      // If patient doesn't exist, create one automatically
      if (!patientData && !patientError) {
        console.log('Patient profile not found, creating one...');
        
        // Generate patient number
        const patientNumber = `PAT${Date.now().toString().slice(-8)}`;
        
        // Extract name from display_name or email
        const nameParts = user.display_name ? user.display_name.split(' ') : user.email?.split('@')[0].split('.');
        const firstName = nameParts?.[0] || 'User';
        const lastName = nameParts?.slice(1).join(' ') || 'Patient'; // Ensure last_name is never empty
        
        // Create patient record
        const { data: newPatient, error: createError } = await supabase
          .from('patients')
          .insert({
            user_id: user.id,
            patient_number: patientNumber,
            email: user.email || '',
            first_name: firstName,
            last_name: lastName,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
          .select('id')
          .single();

        if (createError) {
          console.error('Error creating patient profile:', createError);
          setError('Could not create patient profile. Please try again.');
          return;
        }

        patientData = newPatient;
        console.log('✅ Patient profile created successfully');
      } else if (patientError) {
        throw patientError;
      }

      if (!patientData) {
        throw new Error('No patient record found for this user');
      }

      const patientId = patientData.id;
      console.log('Found patient ID:', patientId);

      // Now fetch appointments using the correct patient ID
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
        .eq('patient_id', patientId) // Use patientId from patients table, not user.id
        .order('scheduled_datetime', { ascending: true });

      if (supabaseError) {
        throw supabaseError;
      }

      console.log('Fetched appointments:', data);
      setBookings(data || []);

    } catch (err) {
      console.error('Error fetching bookings:', err);
      setError(err.message);
      setBookings([]);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      fetchBookings();
    } else {
      setLoading(false);
    }
  }, [user, fetchBookings]);

  const refetch = () => {
    fetchBookings();
  };

  const getUpcomingBookings = (limit = 3) => {
    const now = new Date();
    return bookings
      .filter(booking => {
        const bookingDate = new Date(booking.scheduled_datetime);
        return bookingDate > now && booking.status === 'scheduled';
      })
      .slice(0, limit);
  };

  const getPastBookings = () => {
    const now = new Date();
    return bookings.filter(booking => {
      const bookingDate = new Date(booking.scheduled_datetime);
      return bookingDate <= now || booking.status !== 'scheduled';
    });
  };

  const getBookingCount = () => {
    const upcoming = getUpcomingBookings().length;
    const past = getPastBookings().length;
    return { upcoming, past, total: bookings.length };
  };

  return {
    bookings,
    upcomingBookings: getUpcomingBookings(),
    pastBookings: getPastBookings(),
    bookingCount: getBookingCount(),
    loading,
    error,
    refetch
  };
};