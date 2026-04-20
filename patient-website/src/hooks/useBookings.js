// hooks/useBookings.js
import { useState, useEffect } from 'react';
import { supabase } from '../services/supabaseClient';
import { isFirebaseBackend } from '../services/backendConfig';
import { fetchBookingsForUser } from '../services/firebase/bookingsFirestore';
import { useAuth } from '../context/AuthProvider';

export const useBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();
  const useFirebase = isFirebaseBackend();

  const fetchBookings = async () => {
    if (!user) {
      setError('User not authenticated');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      if (useFirebase) {
        const data = await fetchBookingsForUser(user.id);
        setBookings(data || []);
        return;
      }

      const { data: patientData, error: patientError } = await supabase
        .from('patients')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (patientError) {
        console.error('Error fetching patient:', patientError);
        throw new Error('Patient profile not found');
      }

      if (!patientData) {
        throw new Error('No patient record found for this user');
      }

      const patientId = patientData.id;

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
        .eq('patient_id', patientId)
        .order('scheduled_datetime', { ascending: true });

      if (supabaseError) {
        throw supabaseError;
      }

      setBookings(data || []);

    } catch (err) {
      console.error('Error fetching bookings:', err);
      setError(err.message);
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchBookings();
    } else {
      setLoading(false);
    }
  }, [user, useFirebase]);

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
