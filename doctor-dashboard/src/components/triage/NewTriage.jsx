


import React, { useState } from 'react';
import { supabase } from '../../services/supabaseClient';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, Heart, Activity, Thermometer, Droplet, Brain, Loader2 } from 'lucide-react';
import OpenAIService from '../../services/openaiService';

function NewTriageForm() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    chief_complaint: '',
    priority: 'medium',
    status: 'waiting',
    arrival_time: new Date().toISOString().slice(0, 16),
    heart_rate: '',
    blood_pressure: '',
    temperature: '',
    oxygen_saturation: '',
    respiratory_rate: '',
    pain_level: '',
    notes: ''
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [possibleSicknesses, setPossibleSicknesses] = useState('');
  const [isGeneratingSuggestion, setIsGeneratingSuggestion] = useState(false);
  const [showPossibleSicknesses, setShowPossibleSicknesses] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    
    if (touched[name]) {
      validateField(name, value);
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    validateField(name, form[name]);
  };

  const validateField = (name, value) => {
    let error = '';
    
    switch (name) {
      case 'first_name':
      case 'last_name':
        if (!value.trim()) error = 'This field is required';
        else if (value.length < 2) error = 'Must be at least 2 characters';
        break;
      case 'chief_complaint':
        if (!value) error = 'Chief complaint is required';
        else if (value.length < 5) error = 'Must be at least 5 characters';
        break;
      case 'heart_rate':
        if (!value) error = 'Heart rate is required';
        else if (isNaN(value) || value < 0 || value > 250) error = 'Invalid heart rate';
        break;
      case 'blood_pressure':
        if (!value) error = 'Blood pressure is required';
        else if (!/^\d{1,3}\/\d{1,3}$/.test(value)) error = 'Format: XXX/XX';
        break;
      case 'temperature':
        if (!value) error = 'Temperature is required';
        else if (isNaN(value) || value < 30 || value > 45) error = 'Invalid temperature';
        break;
      case 'oxygen_saturation':
        if (!value) error = 'O₂ saturation is required';
        else if (isNaN(value) || value < 0 || value > 100) error = 'Must be 0-100%';
        break;
      case 'respiratory_rate':
        if (!value) error = 'Respiratory rate is required';
        else if (isNaN(value) || value < 0 || value > 60) error = 'Invalid respiratory rate';
        break;
      case 'pain_level':
        if (!value) error = 'Pain level is required';
        else if (isNaN(value) || value < 0 || value > 10) error = 'Must be 0-10';
        break;
      default:
        break;
    }
    
    setErrors(prev => ({ ...prev, [name]: error }));
    return !error;
  };

  const validateForm = () => {
    let isValid = true;
    const requiredFields = [
      'first_name',
      'last_name',
      'chief_complaint',
      'heart_rate',
      'blood_pressure',
      'temperature',
      'oxygen_saturation',
      'respiratory_rate',
      'pain_level'
    ];
    
    requiredFields.forEach(field => {
      if (!validateField(field, form[field])) {
        isValid = false;
      }
    });
    
    return isValid;
  };

  const generatePossibleSicknesses = async () => {
    
    const requiredVitals = ['heart_rate', 'blood_pressure', 'temperature', 'oxygen_saturation', 'respiratory_rate', 'pain_level'];
    const hasRequiredVitals = requiredVitals.every(field => form[field] && form[field].trim() !== '');
    
    if (!hasRequiredVitals) {
      alert('Please fill in all vital signs before generating possible sicknesses.');
      return;
    }

    if (!form.chief_complaint.trim()) {
      alert('Please provide a chief complaint before generating possible sicknesses.');
      return;
    }

    setIsGeneratingSuggestion(true);
    setShowPossibleSicknesses(true);

    try {
      const vitalSigns = {
        heart_rate: form.heart_rate,
        blood_pressure: form.blood_pressure,
        temperature: form.temperature,
        oxygen_saturation: form.oxygen_saturation,
        respiratory_rate: form.respiratory_rate,
        pain_level: form.pain_level
      };

      const result = await OpenAIService.generateMedicalSuggestion(
        vitalSigns,
        form.chief_complaint,
        form.notes
      );

      if (result.success) {
        setPossibleSicknesses(result.suggestion);
      } else {
        setPossibleSicknesses(`Error: ${result.error}`);
      }
    } catch (error) {
      console.error('Error generating possible sicknesses:', error);
      setPossibleSicknesses('Error generating possible sicknesses. Please try again.');
    } finally {
      setIsGeneratingSuggestion(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    //
    const allTouched = {};
    Object.keys(form).forEach(field => {
      allTouched[field] = true;
    });
    setTouched(allTouched);
    
    if (!validateForm()) {
      alert('Please fix the errors in the form before submitting.');
      return;
    }
    
    try {
      const { error } = await supabase
        .from('triage_cases')
        .insert([{
          first_name: form.first_name,
          last_name: form.last_name,
          chief_complaint: form.chief_complaint,
          priority: form.priority,
          status: form.status,
          arrival_time: form.arrival_time,
          heart_rate: form.heart_rate,
          blood_pressure: form.blood_pressure,
          temperature: form.temperature,
          oxygen_saturation: form.oxygen_saturation,
          respiratory_rate: form.respiratory_rate,
          pain_level: form.pain_level,
          notes: form.notes,
          vital_signs: {
            heart_rate: form.heart_rate,
            blood_pressure: form.blood_pressure,
            temperature: form.temperature,
            oxygen_saturation: form.oxygen_saturation,
            respiratory_rate: form.respiratory_rate
          }
        }]);
      
      if (error) throw error;
      
      alert('Triage case created successfully!');
      navigate('/dashboard/triage');
    } catch (error) {
      console.error('Error creating triage case:', error);
      alert(`Error: ${error.message}`);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex sm:flex-row flex-col sm:justify-between sm:items-center space-y-2 sm:space-y-0">
        <div>
          <h1 className="font-bold text-gray-900 text-2xl">New Triage Case</h1>
          <p className="mt-1 text-gray-500 text-sm">
            Record initial assessment for emergency patients
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 p-6 border rounded-lg bg-white shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Patient Information */}
          <div className="md:col-span-2">
            <h2 className="font-medium text-gray-900 text-lg mb-4 pb-2 border-b border-gray-200">
              Patient Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="first_name" className="block text-sm font-medium text-gray-700">
                  First Name *
                </label>
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
                <label htmlFor="last_name" className="block text-sm font-medium text-gray-700">
                  Last Name *
                </label>
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
                <label htmlFor="arrival_time" className="block text-sm font-medium text-gray-700">
                  Arrival Time
                </label>
                <input
                  id="arrival_time"
                  name="arrival_time"
                  type="datetime-local"
                  value={form.arrival_time}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                />
              </div>
            </div>
          </div>

          {/* Chief Complaint */}
          <div className="md:col-span-2">
            <label htmlFor="chief_complaint" className="block text-sm font-medium text-gray-700">
              Chief Complaint *
            </label>
            <textarea
              id="chief_complaint"
              name="chief_complaint"
              rows={3}
              value={form.chief_complaint}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`mt-1 block w-full rounded-md border ${errors.chief_complaint ? 'border-red-500' : 'border-gray-300'} px-3 py-2`}
              placeholder="Describe the patient's primary complaint..."
            />
            {errors.chief_complaint && <p className="mt-1 text-sm text-red-600">{errors.chief_complaint}</p>}
          </div>

          {/* Priority and Status */}
          <div>
            <label htmlFor="priority" className="block text-sm font-medium text-gray-700">
              Priority *
            </label>
            <select
              id="priority"
              name="priority"
              value={form.priority}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
            >
              <option value="high">High (Immediate)</option>
              <option value="medium">Medium (Urgent)</option>
              <option value="low">Low (Non-urgent)</option>
            </select>
          </div>

          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700">
              Status *
            </label>
            <select
              id="status"
              name="status"
              value={form.status}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
            >
              <option value="waiting">Waiting</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          {/* Vital Signs */}
          <div className="md:col-span-2">
            <h2 className="font-medium text-gray-900 text-lg mb-4 pb-2 border-b border-gray-200">
              Vital Signs
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label htmlFor="heart_rate" className="flex items-center text-sm font-medium text-gray-700">
                  <Heart className="mr-2 w-4 h-4 text-red-500" />
                  Heart Rate (bpm) *
                </label>
                <input
                  id="heart_rate"
                  name="heart_rate"
                  type="number"
                  min="0"
                  max="250"
                  value={form.heart_rate}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`mt-1 block w-full rounded-md border ${errors.heart_rate ? 'border-red-500' : 'border-gray-300'} px-3 py-2`}
                />
                {errors.heart_rate && <p className="mt-1 text-sm text-red-600">{errors.heart_rate}</p>}
              </div>

              <div>
                <label htmlFor="blood_pressure" className="flex items-center text-sm font-medium text-gray-700">
                  <Activity className="mr-2 w-4 h-4 text-blue-500" />
                  Blood Pressure (mmHg) *
                </label>
                <input
                  id="blood_pressure"
                  name="blood_pressure"
                  type="text"
                  placeholder="120/80"
                  value={form.blood_pressure}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`mt-1 block w-full rounded-md border ${errors.blood_pressure ? 'border-red-500' : 'border-gray-300'} px-3 py-2`}
                />
                {errors.blood_pressure && <p className="mt-1 text-sm text-red-600">{errors.blood_pressure}</p>}
              </div>

              <div>
                <label htmlFor="temperature" className="flex items-center text-sm font-medium text-gray-700">
                  <Thermometer className="mr-2 w-4 h-4 text-orange-500" />
                  Temperature (°C) *
                </label>
                <input
                  id="temperature"
                  name="temperature"
                  type="number"
                  step="0.1"
                  min="30"
                  max="45"
                  value={form.temperature}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`mt-1 block w-full rounded-md border ${errors.temperature ? 'border-red-500' : 'border-gray-300'} px-3 py-2`}
                />
                {errors.temperature && <p className="mt-1 text-sm text-red-600">{errors.temperature}</p>}
              </div>

              <div>
                <label htmlFor="oxygen_saturation" className="flex items-center text-sm font-medium text-gray-700">
                  <Droplet className="mr-2 w-4 h-4 text-blue-300" />
                  O₂ Saturation (%) *
                </label>
                <input
                  id="oxygen_saturation"
                  name="oxygen_saturation"
                  type="number"
                  min="0"
                  max="100"
                  value={form.oxygen_saturation}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`mt-1 block w-full rounded-md border ${errors.oxygen_saturation ? 'border-red-500' : 'border-gray-300'} px-3 py-2`}
                />
                {errors.oxygen_saturation && <p className="mt-1 text-sm text-red-600">{errors.oxygen_saturation}</p>}
              </div>

              <div>
                <label htmlFor="respiratory_rate" className="block text-sm font-medium text-gray-700">
                  Respiratory Rate (breaths/min) *
                </label>
                <input
                  id="respiratory_rate"
                  name="respiratory_rate"
                  type="number"
                  min="0"
                  max="60"
                  value={form.respiratory_rate}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`mt-1 block w-full rounded-md border ${errors.respiratory_rate ? 'border-red-500' : 'border-gray-300'} px-3 py-2`}
                />
                {errors.respiratory_rate && <p className="mt-1 text-sm text-red-600">{errors.respiratory_rate}</p>}
              </div>

              <div>
                <label htmlFor="pain_level" className="block text-sm font-medium text-gray-700">
                  Pain Level (0-10) *
                </label>
                <input
                  id="pain_level"
                  name="pain_level"
                  type="number"
                  min="0"
                  max="10"
                  value={form.pain_level}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`mt-1 block w-full rounded-md border ${errors.pain_level ? 'border-red-500' : 'border-gray-300'} px-3 py-2`}
                />
                {errors.pain_level && <p className="mt-1 text-sm text-red-600">{errors.pain_level}</p>}
              </div>
            </div>
          </div>

          {/* Additional Notes */}
          <div className="md:col-span-2">
            <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
              Additional Notes
            </label>
            <textarea
              id="notes"
              name="notes"
              rows={4}
              value={form.notes}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
              placeholder="Any additional observations or information..."
            />
          </div>

          {/* AI Medical Diagnosis */}
          <div className="md:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium text-gray-900 text-lg flex items-center">
                <Brain className="mr-2 w-5 h-5 text-blue-600" />
                Medical Diagnosis Assistant
              </h3>
              <button
                type="button"
                onClick={generatePossibleSicknesses}
                disabled={isGeneratingSuggestion}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isGeneratingSuggestion ? (
                  <>
                    <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Brain className="mr-2 w-4 h-4" />
                    See Possible Sicknesses
                  </>
                )}
              </button>
            </div>
            
            {showPossibleSicknesses && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start">
                  <Brain className="mr-2 w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <h4 className="font-medium text-blue-900 mb-3">Top 3 Possible Medical Conditions</h4>
                    <div className="text-sm text-blue-800">
                      {isGeneratingSuggestion ? (
                        <div className="flex items-center">
                          <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                          Analyzing symptoms and vital signs...
                        </div>
                      ) : (
                        <div className="space-y-2">
                          {possibleSicknesses ? (
                            <div className="whitespace-pre-wrap">
                              {possibleSicknesses}
                            </div>
                          ) : (
                            <p className="text-blue-600">Click "See Possible Sicknesses" to analyze the patient's condition.</p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-between items-center pt-4">
          <button
            type="button"
            onClick={() => navigate('/dashboard/triage')}
            className="rounded-md border border-gray-300 px-6 py-2 text-gray-700 hover:bg-gray-100 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="rounded-md bg-red-600 px-6 py-2 text-white hover:bg-red-700 transition-colors"
          >
            Save Triage Case
          </button>
        </div>
      </form>
    </div>
  );
}

export default NewTriageForm;