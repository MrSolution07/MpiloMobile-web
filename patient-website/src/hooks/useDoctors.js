import { useState, useEffect } from 'react';
import { doctorsService } from '../services/doctorsService';

export const useDoctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDoctors = async () => {
    try {
      setLoading(true);
      const { data, error } = await doctorsService.getAllDoctors();
      
      if (error) throw error;
      setDoctors(data || []);
    } catch (err) {
      console.error('Error fetching doctors:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchDoctorsBySpecialty = async (specialty) => {
    try {
      setLoading(true);
      const { data, error } = await doctorsService.getDoctorsBySpecialty(specialty);
      
      if (error) throw error;
      setDoctors(data || []);
    } catch (err) {
      console.error('Error fetching doctors by specialty:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const searchDoctors = async (searchTerm) => {
    try {
      setLoading(true);
      const { data, error } = await doctorsService.searchDoctorsByName(searchTerm);
      
      if (error) throw error;
      setDoctors(data || []);
    } catch (err) {
      console.error('Error searching doctors:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  return {
    doctors,
    loading,
    error,
    refetch: fetchDoctors,
    fetchBySpecialty: fetchDoctorsBySpecialty,
    searchDoctors
  };
};

export default useDoctors;