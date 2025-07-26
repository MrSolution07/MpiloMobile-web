

import React, { useState, useEffect } from 'react';
import { supabase } from '../../services/supabaseClient';

function AddPatientForm({ onSubmit, onCancel }) {
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    gender: "",
    date_of_birth: "",
    age: "",
    phone_number: "",
    email: "",
    address: "",
    chronic_conditions: "",
    last_visit: "",
    status: "Moderate"
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  // Calculate age when date_of_birth changes
  useEffect(() => {
    if (form.date_of_birth) {
      const today = new Date();
      const birthDate = new Date(form.date_of_birth);
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      
      setForm(prev => ({ ...prev, age: age.toString() }));
    }
  }, [form.date_of_birth]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    
    // Validate on change if the field has been touched
    if (touched[name]) {
      validateField(name, value);
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    validateField(name, value);
  };

  const validateField = (name, value) => {
    let error = "";
    
    switch (name) {
      case "first_name":
      case "last_name":
        if (!value.trim()) error = "This field is required";
        else if (value.length < 2) error = "Must be at least 2 characters";
        break;
      case "email":
        if (!value) error = "Email is required";
        else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value)) {
          error = "Invalid email address";
        }
        break;
      case "phone_number":
        if (!value) error = "Phone number is required";
        else if (!/^[0-9]{10,15}$/.test(value)) {
          error = "Invalid phone number (10-15 digits)";
        }
        break;
      case "date_of_birth":
        if (!value) error = "Date of birth is required";
        else if (new Date(value) > new Date()) {
          error = "Date cannot be in the future";
        }
        break;
      case "age":
        if (!value) error = "Age is required";
        else if (isNaN(value) || parseInt(value) < 0 || parseInt(value) > 120) {
          error = "Age must be between 0 and 120";
        }
        break;
      case "gender":
        if (!value) error = "Please select a gender";
        break;
      default:
        break;
    }
    
    setErrors(prev => ({ ...prev, [name]: error }));
    return !error;
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = {};
    
    // Validate all fields
    Object.keys(form).forEach(field => {
      if (field !== "chronic_conditions" && field !== "last_visit" && field !== "address") {
        if (!validateField(field, form[field])) {
          isValid = false;
        }
      }
    });
    
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Mark all fields as touched to show errors
    const allTouched = {};
    Object.keys(form).forEach(field => {
      allTouched[field] = true;
    });
    setTouched(allTouched);
    
    if (!validateForm()) {
      alert("Please fix the errors in the form before submitting.");
      return;
    }
  
    console.log('Submitting form with data:', form);
  
    try {
      const { data, error } = await supabase
        .from('patients')
        .insert([form]);
    
      if (error) throw error;
      
      console.log('Patient added successfully:', data);
      alert('Patient saved successfully!');
      
      // Reset form
      setForm({
        first_name: "",
        last_name: "",
        gender: "",
        date_of_birth: "",
        age: "",
        phone_number: "",
        email: "",
        address: "",
        chronic_conditions: "",
        last_visit: "",
        status: "Moderate"
      });
      setTouched({});
      setErrors({});
      
      if (onSubmit) onSubmit();
    } catch (error) {
      console.error('Error adding patient:', error.message);
      alert(`Error saving patient: ${error.message}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 border rounded-md bg-white shadow-sm">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="first_name" className="block text-sm font-medium text-gray-700">First Name *</label>
          <input
            id="first_name"
            name="first_name"
            type="text"
            value={form.first_name}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`mt-1 block w-full rounded-md border ${errors.first_name ? 'border-red-500' : 'border-gray-300'} px-3 py-2`}
          />
          {errors.first_name && <p className="mt-1 text-sm text-red-600">{errors.first_name}</p>}
        </div>

        <div>
          <label htmlFor="last_name" className="block text-sm font-medium text-gray-700">Last Name *</label>
          <input
            id="last_name"
            name="last_name"
            type="text"
            value={form.last_name}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`mt-1 block w-full rounded-md border ${errors.last_name ? 'border-red-500' : 'border-gray-300'} px-3 py-2`}
          />
          {errors.last_name && <p className="mt-1 text-sm text-red-600">{errors.last_name}</p>}
        </div>

        <div>
          <label htmlFor="gender" className="block text-sm font-medium text-gray-700">Gender *</label>
          <select
            id="gender"
            name="gender"
            value={form.gender}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`mt-1 block w-full rounded-md border ${errors.gender ? 'border-red-500' : 'border-gray-300'} px-3 py-2`}
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
          {errors.gender && <p className="mt-1 text-sm text-red-600">{errors.gender}</p>}
        </div>

        <div>
          <label htmlFor="date_of_birth" className="block text-sm font-medium text-gray-700">Date of Birth *</label>
          <input
            id="date_of_birth"
            name="date_of_birth"
            type="date"
            value={form.date_of_birth}
            onChange={handleChange}
            onBlur={handleBlur}
            max={new Date().toISOString().split('T')[0]} // Prevent future dates
            className={`mt-1 block w-full rounded-md border ${errors.date_of_birth ? 'border-red-500' : 'border-gray-300'} px-3 py-2`}
          />
          {errors.date_of_birth && <p className="mt-1 text-sm text-red-600">{errors.date_of_birth}</p>}
        </div>

        <div>
          <label htmlFor="age" className="block text-sm font-medium text-gray-700">Age *</label>
          <input
            id="age"
            name="age"
            type="number"
            value={form.age}
            onChange={handleChange}
            onBlur={handleBlur}
            min="0"
            max="120"
            className={`mt-1 block w-full rounded-md border ${errors.age ? 'border-red-500' : 'border-gray-300'} px-3 py-2`}
          />
          {errors.age && <p className="mt-1 text-sm text-red-600">{errors.age}</p>}
        </div>

        <div>
          <label htmlFor="phone_number" className="block text-sm font-medium text-gray-700">Phone Number *</label>
          <input
            id="phone_number"
            name="phone_number"
            type="tel"
            value={form.phone_number}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`mt-1 block w-full rounded-md border ${errors.phone_number ? 'border-red-500' : 'border-gray-300'} px-3 py-2`}
          />
          {errors.phone_number && <p className="mt-1 text-sm text-red-600">{errors.phone_number}</p>}
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email *</label>
          <input
            id="email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`mt-1 block w-full rounded-md border ${errors.email ? 'border-red-500' : 'border-gray-300'} px-3 py-2`}
          />
          {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
        </div>
      </div>

      <div>
        <label htmlFor="address" className="block text-sm font-medium text-gray-700">Address</label>
        <input
          id="address"
          name="address"
          type="text"
          value={form.address}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
        />
      </div>

      <div>
        <label htmlFor="chronic_conditions" className="block text-sm font-medium text-gray-700">Chronic Conditions</label>
        <textarea
          id="chronic_conditions"
          name="chronic_conditions"
          value={form.chronic_conditions}
          onChange={handleChange}
          rows={3}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="last_visit" className="block text-sm font-medium text-gray-700">Last Visit</label>
          <input
            id="last_visit"
            name="last_visit"
            type="date"
            value={form.last_visit}
            onChange={handleChange}
            max={new Date().toISOString().split('T')[0]} // Prevent future dates
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
          />
        </div>

        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700">Status</label>
          <select
            id="status"
            name="status"
            value={form.status}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
          >
            <option value="Moderate">Moderate</option>
            <option value="Stable">Stable</option>
            <option value="Critical">Critical</option>
          </select>
        </div>
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-md border border-gray-300 px-4 py-2 hover:bg-gray-100"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          Save
        </button>
      </div>
    </form>
  );
}

export default AddPatientForm;