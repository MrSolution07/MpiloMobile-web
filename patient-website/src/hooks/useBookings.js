// hooks/useBookings.js
import { useState, useEffect } from 'react';
import { supabase } from '../services/supabaseClient';
import { useAuth } from '../context/AuthProvider';

export const useBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  const fetchBookings = async () => {
    if (!user) {
      setError('User not authenticated');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

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
        .eq('patient_id', user.id)
        .order('scheduled_datetime', { ascending: true });

      if (supabaseError) {
        throw supabaseError;
      }

      setBookings(data || []);

    } catch (err) {
      console.error('Error fetching bookings:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchBookings();
    }
  }, [user]);

  const refetch = () => {
    fetchBookings();
  };

  const getUpcomingBookings = (limit = 3) => {
    const now = new Date();
    return bookings
      .filter(booking => new Date(booking.scheduled_datetime) > now && booking.status === 'scheduled')
      .slice(0, limit);
  };

  const getPastBookings = () => {
    const now = new Date();
    return bookings.filter(booking => new Date(booking.scheduled_datetime) <= now || booking.status !== 'scheduled');
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