import { useState, useEffect } from 'react';
import { doctorsService } from '../services/doctorsService';

export const useSpecialties = () => {
  const [specialties, setSpecialties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSpecialties = async () => {
    try {
      setLoading(true);
      const { data, error } = await doctorsService.getUniqueSpecialties();
      
      if (error) throw error;
      setSpecialties(data || []);
    } catch (err) {
      console.error('Error fetching specialties:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSpecialties();
  }, []);

  return {
    specialties,
    loading,
    error,
    refetch: fetchSpecialties
  };
};

export default useSpecialties;