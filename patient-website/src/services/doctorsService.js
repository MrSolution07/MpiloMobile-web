import { supabase } from './supabaseClient';

// Utility function to transform doctor data
export const transformDoctorData = (doctor) => {
  return {
    id: doctor.id,
    name: `${doctor.first_name} ${doctor.last_name}`,
    specialty: doctor.specialization,
    fee: parseFloat(doctor.consultation_fee) || 0,
    experience: `${doctor.experience_years} years`,
    rating: parseFloat(doctor.rating) || 0,
    total_reviews: doctor.total_reviews || 0,
    is_available: doctor.is_available,
    languages: doctor.languages || [],
    biography: doctor.biography,
    profile_image_url: doctor.profile_image_url,
    email: doctor.email,
    phone_number: doctor.phone_number,
    license_number: doctor.license_number,
    hpcsa_number: doctor.hpcsa_number,
    qualification: doctor.qualification,
    first_name: doctor.first_name,
    last_name: doctor.last_name,
    specialization: doctor.specialization,
    experience_years: doctor.experience_years,
    consultation_fee: doctor.consultation_fee,
    // Include all original fields for backward compatibility
    ...doctor
  };
};

export const doctorsService = {
  // Get all doctors
  async getAllDoctors() {
    try {
      const { data, error } = await supabase
        .from('doctors')
        .select('*')
        .order('first_name', { ascending: true });

      if (error) throw error;
      
      const transformedData = data.map(transformDoctorData);
      return { data: transformedData, error: null };
    } catch (error) {
      console.error('Error fetching doctors:', error);
      return { data: null, error };
    }
  },

  // Get available doctors only
  async getAvailableDoctors() {
    try {
      const { data, error } = await supabase
        .from('doctors')
        .select('*')
        .eq('is_available', true)
        .order('first_name', { ascending: true });

      if (error) throw error;
      
      const transformedData = data.map(transformDoctorData);
      return { data: transformedData, error: null };
    } catch (error) {
      console.error('Error fetching available doctors:', error);
      return { data: null, error };
    }
  },

  // Get doctors by specialty
  async getDoctorsBySpecialty(specialty) {
    try {
      const { data, error } = await supabase
        .from('doctors')
        .select('*')
        .eq('specialization', specialty)
        .order('first_name', { ascending: true });

      if (error) throw error;
      
      const transformedData = data.map(transformDoctorData);
      return { data: transformedData, error: null };
    } catch (error) {
      console.error('Error fetching doctors by specialty:', error);
      return { data: null, error };
    }
  },

  // Get doctors by price range
  async getDoctorsByPriceRange(minPrice, maxPrice) {
    try {
      const { data, error } = await supabase
        .from('doctors')
        .select('*')
        .gte('consultation_fee', minPrice)
        .lte('consultation_fee', maxPrice)
        .order('consultation_fee', { ascending: true });

      if (error) throw error;
      
      const transformedData = data.map(transformDoctorData);
      return { data: transformedData, error: null };
    } catch (error) {
      console.error('Error fetching doctors by price range:', error);
      return { data: null, error };
    }
  },

  // Search doctors by name
  async searchDoctorsByName(searchTerm) {
    try {
      const { data, error } = await supabase
        .from('doctors')
        .select('*')
        .or(`first_name.ilike.%${searchTerm}%,last_name.ilike.%${searchTerm}%`)
        .order('first_name', { ascending: true });

      if (error) throw error;
      
      const transformedData = data.map(transformDoctorData);
      return { data: transformedData, error: null };
    } catch (error) {
      console.error('Error searching doctors:', error);
      return { data: null, error };
    }
  },

  // Get doctor by ID
  async getDoctorById(id) {
    try {
      const { data, error } = await supabase
        .from('doctors')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      
      if (data) {
        const transformedData = transformDoctorData(data);
        return { data: transformedData, error: null };
      }
      
      return { data: null, error: null };
    } catch (error) {
      console.error('Error fetching doctor by ID:', error);
      return { data: null, error };
    }
  },

  // Get all unique specialties
  async getUniqueSpecialties() {
    try {
      const { data, error } = await supabase
        .from('doctors')
        .select('specialization')
        .order('specialization', { ascending: true });

      if (error) throw error;
      
      // Extract unique specialties
      const specialties = [...new Set(data.map(item => item.specialization))];
      return { data: specialties, error: null };
    } catch (error) {
      console.error('Error fetching specialties:', error);
      return { data: null, error };
    }
  },

  // Get doctors by rating (minimum rating)
  async getDoctorsByRating(minRating) {
    try {
      const { data, error } = await supabase
        .from('doctors')
        .select('*')
        .gte('rating', minRating)
        .order('rating', { ascending: false });

      if (error) throw error;
      
      const transformedData = data.map(transformDoctorData);
      return { data: transformedData, error: null };
    } catch (error) {
      console.error('Error fetching doctors by rating:', error);
      return { data: null, error };
    }
  },

  // Get doctors by experience (minimum years)
  async getDoctorsByExperience(minYears) {
    try {
      const { data, error } = await supabase
        .from('doctors')
        .select('*')
        .gte('experience_years', minYears)
        .order('experience_years', { ascending: false });

      if (error) throw error;
      
      const transformedData = data.map(transformDoctorData);
      return { data: transformedData, error: null };
    } catch (error) {
      console.error('Error fetching doctors by experience:', error);
      return { data: null, error };
    }
  },

  // Update doctor availability
  async updateDoctorAvailability(id, isAvailable) {
    try {
      const { data, error } = await supabase
        .from('doctors')
        .update({ is_available: isAvailable, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select();

      if (error) throw error;
      
      if (data && data.length > 0) {
        const transformedData = transformDoctorData(data[0]);
        return { data: transformedData, error: null };
      }
      
      return { data: null, error: null };
    } catch (error) {
      console.error('Error updating doctor availability:', error);
      return { data: null, error };
    }
  },

  // Update doctor rating
  async updateDoctorRating(id, newRating, newReviewCount) {
    try {
      const { data, error } = await supabase
        .from('doctors')
        .update({ 
          rating: newRating, 
          total_reviews: newReviewCount, 
          updated_at: new Date().toISOString() 
        })
        .eq('id', id)
        .select();

      if (error) throw error;
      
      if (data && data.length > 0) {
        const transformedData = transformDoctorData(data[0]);
        return { data: transformedData, error: null };
      }
      
      return { data: null, error: null };
    } catch (error) {
      console.error('Error updating doctor rating:', error);
      return { data: null, error };
    }
  },

  // Create a new doctor
  async createDoctor(doctorData) {
    try {
      const { data, error } = await supabase
        .from('doctors')
        .insert([{
          ...doctorData,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }])
        .select();

      if (error) throw error;
      
      if (data && data.length > 0) {
        const transformedData = transformDoctorData(data[0]);
        return { data: transformedData, error: null };
      }
      
      return { data: null, error: null };
    } catch (error) {
      console.error('Error creating doctor:', error);
      return { data: null, error };
    }
  },

  // Delete a doctor
  async deleteDoctor(id) {
    try {
      const { error } = await supabase
        .from('doctors')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      return { data: { success: true }, error: null };
    } catch (error) {
      console.error('Error deleting doctor:', error);
      return { data: null, error };
    }
  }
};

export default doctorsService;