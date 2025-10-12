import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthProvider';
import { supabase } from '../../services/supabaseClient';

export default function DoctorSettings() {
  const { user } = useAuth();
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    specialization: '',
    licenseNumber: '',
    currentPassword: '',
    newPassword: '',
    receiveEmails: true,
    receiveSMS: false,
    activeStatus: true,
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [isLoading, setIsLoading] = useState(true);

  // Load existing doctor data
  useEffect(() => {
    const loadDoctorData = async () => {
      if (user?.email) {
        try {
          // Try to load doctor data with flexible querying
          let doctorData = null;
          let error = null;

          // Load doctor data using email (since it exists in the schema)
          const { data, err } = await supabase
            .from('doctors')
            .select('*')
            .eq('email', user.email)
            .single();
          doctorData = data;
          error = err;

          if (doctorData && !error) {
            setForm(prev => ({
              ...prev,
              fullName: `${doctorData.first_name || ''} ${doctorData.last_name || ''}`.trim(),
              email: doctorData.email || user.email,
              phone: '', // Phone field doesn't exist in the schema
              specialization: doctorData.specialization || '',
              licenseNumber: doctorData.license_number || '',
              activeStatus: doctorData.is_available !== false, // Use is_available boolean field
            }));
          } else {
            // Set default values if no doctor record exists
            setForm(prev => ({
              ...prev,
              email: user.email,
            }));
          }
        } catch (error) {
          console.error('Error loading doctor data:', error);
          setMessage({ type: 'error', text: 'Failed to load doctor data' });
        } finally {
          setIsLoading(false);
        }
      }
    };

    loadDoctorData();
  }, [user]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      // Split full name into first and last name
      const nameParts = form.fullName.trim().split(' ');
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';

      // First, let's check what columns exist in the doctors table
      console.log('Checking doctors table schema...');
      
      // Try to get the table schema by doing a simple select
      const { data: schemaData, error: schemaError } = await supabase
        .from('doctors')
        .select('*')
        .limit(1);

      console.log('Schema check result:', { schemaData, schemaError });

      // Prepare data for database using the actual schema
      const doctorData = {
        first_name: firstName,
        last_name: lastName,
        email: form.email || '',
        specialization: form.specialization && form.specialization.trim() !== '' ? form.specialization.trim() : null,
        license_number: form.licenseNumber && form.licenseNumber.trim() !== '' ? form.licenseNumber.trim() : null,
        is_available: form.activeStatus,
        updated_at: new Date().toISOString(),
      };

      // Note: doctor_number is required in the schema but not in our form
      // We'll add it later when we know if it's a new record or update

      // Add phone if it exists (you might want to add a phone field to the form)
      if (form.phone && form.phone.trim() !== '') {
        // Note: phone field doesn't exist in the schema, you might want to add it
        console.log('Phone field not in schema, skipping:', form.phone);
      }

      console.log('Prepared doctor data:', doctorData);

      // Check if doctor record exists using email (since it exists in the schema)
      let existingDoctor = null;
      let checkError = null;
      
      try {
        // Match by email since it exists in the schema
        const { data, error } = await supabase
          .from('doctors')
          .select('id, email')
          .eq('email', form.email)
          .single();
        
        existingDoctor = data;
        checkError = error;
      } catch (err) {
        console.log('Error checking existing doctor:', err);
        checkError = err;
      }

      console.log('Existing doctor check:', { existingDoctor, checkError });

      if (existingDoctor && !checkError) {
        // Update existing record
        console.log('Updating existing doctor record...');
        
        const { error: updateError } = await supabase
          .from('doctors')
          .update(doctorData)
          .eq('email', form.email);

        if (updateError) {
          console.error('Update error:', updateError);
          throw updateError;
        }
        console.log('Doctor record updated successfully');
      } else {
        // Create new record
        console.log('Creating new doctor record...');
        const insertData = {
          ...doctorData,
          doctor_number: `DR${Date.now()}`, // Required field - auto-generated
          created_at: new Date().toISOString(),
        };
        
        console.log('Insert data:', insertData);
        
        const { error: insertError } = await supabase
          .from('doctors')
          .insert([insertData]);

        if (insertError) {
          console.error('Insert error:', insertError);
          throw insertError;
        }
        console.log('Doctor record created successfully');
      }

      // Handle password change if new password is provided
      if (form.newPassword && form.newPassword.trim() !== '') {
        const { error: passwordError } = await supabase.auth.updateUser({
          password: form.newPassword
        });

        if (passwordError) {
          console.error('Password update error:', passwordError);
          setMessage({ type: 'warning', text: 'Profile updated but password change failed. Please try updating password separately.' });
        } else {
          setMessage({ type: 'success', text: 'Profile and password updated successfully!' });
        }
      } else {
        setMessage({ type: 'success', text: 'Profile updated successfully!' });
      }

      // Clear password fields
      setForm(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
      }));

    } catch (error) {
      console.error('Error saving doctor settings:', error);
      console.error('Error details:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code
      });
      
      let errorMessage = 'Failed to save settings. Please try again.';
      
      // Provide more specific error messages
      if (error.message?.includes('duplicate key')) {
        errorMessage = 'A doctor with this email already exists.';
      } else if (error.message?.includes('violates foreign key')) {
        errorMessage = 'Invalid data provided. Please check your information.';
      } else if (error.message?.includes('violates check constraint')) {
        errorMessage = 'Invalid data format. Please check your input.';
      } else if (error.message?.includes('permission denied')) {
        errorMessage = 'Permission denied. Please contact administrator.';
      } else if (error.details) {
        errorMessage = `Database error: ${error.details}`;
      }
      
      setMessage({ type: 'error', text: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto mt-10 p-6 bg-white rounded-lg shadow">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Doctor Settings</h2>
      
      {/* Message Display */}
      {message.text && (
        <div className={`mb-6 p-4 rounded-md ${
          message.type === 'success' ? 'bg-green-100 text-green-700 border border-green-200' :
          message.type === 'error' ? 'bg-red-100 text-red-700 border border-red-200' :
          message.type === 'warning' ? 'bg-yellow-100 text-yellow-700 border border-yellow-200' :
          'bg-blue-100 text-blue-700 border border-blue-200'
        }`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">

        <div>
          <label className="block text-sm font-medium text-gray-700">Full Name</label>
          <input
            name="fullName"
            value={form.fullName}
            onChange={handleChange}
            className="mt-1 w-full border px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            type="text"
            placeholder="e.g. Dr. Lesedi Ntamane"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Email Address</label>
          <input
            name="email"
            value={form.email}
            onChange={handleChange}
            className="mt-1 w-full border px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            type="email"
            placeholder="doctor@example.com"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Phone Number</label>
          <input
            name="phone"
            value={form.phone}
            onChange={handleChange}
            className="mt-1 w-full border px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            type="text"
            placeholder="+27 12 345 6789"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Specialization</label>
          <input
            name="specialization"
            value={form.specialization}
            onChange={handleChange}
            className="mt-1 w-full border px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            type="text"
            placeholder="e.g. General Practice, Cardiology, Pediatrics"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Medical License Number</label>
          <input
            name="licenseNumber"
            value={form.licenseNumber}
            onChange={handleChange}
            className="mt-1 w-full border px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            type="text"
            placeholder="e.g. HPCSA123456"
          />
        </div>

        {/* Password Section */}
        <div className="border-t pt-4">
          <label className="block text-sm font-medium text-gray-700">Current Password</label>
          <input
            name="currentPassword"
            value={form.currentPassword}
            onChange={handleChange}
            className="mt-1 w-full border px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            type="password"
            placeholder="Enter current password"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">New Password</label>
          <input
            name="newPassword"
            value={form.newPassword}
            onChange={handleChange}
            className="mt-1 w-full border px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            type="password"
            placeholder="Enter new password (optional)"
          />
          <p className="mt-1 text-sm text-gray-500">Leave blank to keep current password</p>
        </div>


        {/* Doctor Active Status */}
        <div className="border-t pt-4">
          <label className="flex items-center space-x-3">
            <input
              type="checkbox"
              name="activeStatus"
              checked={form.activeStatus}
              onChange={handleChange}
            />
            <span>Active / Available for patient consultations</span>
          </label>
        </div>

        {/* Actions */}
        <div className="flex justify-between pt-6">
          <button
            type="button"
            className="px-4 py-2 rounded-md border border-gray-300 hover:bg-gray-100 whitespace-nowrap min-w-0 flex items-center justify-center text-center"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-3 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed whitespace-nowrap min-w-0 flex items-center justify-center text-center"
            disabled={loading}
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                Saving...
              </>
            ) : (
              'Save Changes'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
