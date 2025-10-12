import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { supabase } from "../../services/supabaseClient";
import { Button } from "../ui";
import { useAuth } from "../../context/AuthProvider"; 

function NewRecord() {
  const location = useLocation();
  const navigate = useNavigate();
  const { patientData, fromTriage } = location.state || {};
  const { user } = useAuth(); // Get current user from your auth provider

  const [form, setForm] = useState({
    patientId: patientData?.id || '',
    firstName: patientData?.firstName || patientData?.first_name || '',
    lastName: patientData?.lastName || patientData?.last_name || '',
    diagnosis: '',
    treatment_plan: '',
    medications_prescribed: '',
    notes: '',
    date: new Date().toISOString().split('T')[0],
    record_type: 'clinical_note',
    symptoms: '',
    procedures: '',
    lab_results: '',
    imaging_results: '',
    blood_pressure: patientData?.blood_pressure || patientData?.vitalSigns?.bloodPressure || '',
    heart_rate: patientData?.heart_rate || patientData?.vitalSigns?.heartRate || '',
    temperature: patientData?.temperature || patientData?.vitalSigns?.temperature || '',
    weight: patientData?.weight || patientData?.vitalSigns?.weight || '',
    height: patientData?.height || patientData?.vitalSigns?.height || '',
    oxygen_saturation: patientData?.oxygen_saturation || patientData?.vitalSigns?.oxygenSaturation || '',
    allergies: patientData?.allergies || '',
    chronic_conditions: patientData?.chronic_conditions || '',
    follow_up_instructions: '',
    next_appointment_date: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [showAdditionalFields, setShowAdditionalFields] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const recordData = {
        patient_id: form.patientId,
        first_name: form.firstName,
        last_name: form.lastName,
        diagnosis: form.diagnosis,
        treatment_plan: form.treatment_plan,
        medications_prescribed: form.medications_prescribed,
        notes: form.notes,
        date: form.date,
        record_type: form.record_type,
        symptoms: form.symptoms,
        procedures: form.procedures,
        lab_results: form.lab_results,
        imaging_results: form.imaging_results,
        blood_pressure: form.blood_pressure,
        heart_rate: form.heart_rate,
        temperature: form.temperature,
        weight: form.weight,
        height: form.height,
        oxygen_saturation: form.oxygen_saturation,
        allergies: form.allergies,
        chronic_conditions: form.chronic_conditions,
        follow_up_instructions: form.follow_up_instructions,
        next_appointment_date: form.next_appointment_date || null,
        created_by: user?.id || '', // Use the user ID from your auth provider
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      const { error: supabaseError } = await supabase
        .from('medical_records')
        .insert([recordData]);

      if (supabaseError) throw supabaseError;

      // If coming from triage, mark the case as completed
      if (fromTriage) {
        const { error: statusError } = await supabase
          .from('triage_cases')
          .update({ status: 'completed' })
          .eq('id', form.patientId);

        if (statusError) throw statusError;
      }

      navigate('/dashboard/records'); // Redirect to records list after success

    } catch (err) {
      console.error('Error saving record:', err);
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-2xl font-bold">New Medical Record</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Patient Info (read-only) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Patient ID</label>
            <input
              type="text"
              value={form.patientId}
              readOnly
              className="mt-1 w-full rounded-md border-gray-300 bg-gray-100 p-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">First Name</label>
            <input
              type="text"
              value={form.firstName}
              readOnly
              className="mt-1 w-full rounded-md border-gray-300 bg-gray-100 p-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Last Name</label>
            <input
              type="text"
              value={form.lastName}
              readOnly
              className="mt-1 w-full rounded-md border-gray-300 bg-gray-100 p-2"
            />
          </div>
        </div>

        {/* Record Type and Date */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Record Type</label>
            <select
              name="record_type"
              value={form.record_type}
              onChange={handleChange}
              className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-colors duration-200"
              required
            >
              <option value="clinical_note">Clinical Note</option>
              <option value="triage_followup">Triage Follow-up</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
            <input
              type="date"
              name="date"
              value={form.date}
              onChange={handleChange}
              className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-colors duration-200"
              required
            />
          </div>
        </div>

        {/* Vital Signs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-md">
          <div>
            <label className="block text-sm font-medium text-gray-700">Blood Pressure</label>
            <input
              type="text"
              name="blood_pressure"
              value={form.blood_pressure}
              onChange={handleChange}
              placeholder="e.g., 120/80"
              className="mt-1 w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-colors duration-200"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Heart Rate (bpm)</label>
            <input
              type="number"
              name="heart_rate"
              value={form.heart_rate}
              onChange={handleChange}
              className="mt-1 w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-colors duration-200"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Temperature (°C)</label>
            <input
              type="number"
              name="temperature"
              value={form.temperature}
              onChange={handleChange}
              step="0.1"
              className="mt-1 w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-colors duration-200"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Oxygen Saturation (%)</label>
            <input
              type="number"
              name="oxygen_saturation"
              value={form.oxygen_saturation}
              onChange={handleChange}
              min="0"
              max="100"
              className="mt-1 w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-colors duration-200"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Weight (kg)</label>
            <input
              type="number"
              name="weight"
              value={form.weight}
              onChange={handleChange}
              step="0.1"
              className="mt-1 w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-colors duration-200"
            />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Height (cm)</label>
              <input
                type="number"
                name="height"
                value={form.height}
                onChange={handleChange}
                className="mt-1 w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-colors duration-200"
              />
            </div>
          </div>

          {/* Medical Record Fields */}
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Symptoms</label>
              <textarea
                name="symptoms"
                value={form.symptoms}
                onChange={handleChange}
                className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-colors duration-200 resize-vertical"
                rows={2}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Diagnosis</label>
              <input
                type="text"
                name="diagnosis"
                value={form.diagnosis}
                onChange={handleChange}
                className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-colors duration-200"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Treatment Plan</label>
              <textarea
                name="treatment_plan"
                value={form.treatment_plan}
                onChange={handleChange}
                className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-colors duration-200 resize-vertical"
                rows={3}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Medications Prescribed</label>
              <input
                type="text"
                name="medications_prescribed"
                value={form.medications_prescribed}
                onChange={handleChange}
                className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-colors duration-200"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
              <textarea
                name="notes"
                value={form.notes}
                onChange={handleChange}
                className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-colors duration-200 resize-vertical"
                rows={3}
              />
            </div>
          </div>

          {/* Toggle for additional fields */}
          <div className="flex justify-center">
            <button
              type="button"
              onClick={() => setShowAdditionalFields(!showAdditionalFields)}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              {showAdditionalFields ? 'Hide Additional Fields' : 'Show Additional Fields'}
            </button>
          </div>

          {/* Additional Fields (conditionally shown) */}
          {showAdditionalFields && (
            <div className="grid grid-cols-1 gap-4 bg-blue-50 p-4 rounded-md">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Procedures</label>
                <textarea
                  name="procedures"
                  value={form.procedures}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-colors duration-200 resize-vertical"
                  rows={2}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Lab Results</label>
                <textarea
                  name="lab_results"
                  value={form.lab_results}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-colors duration-200 resize-vertical"
                  rows={2}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Imaging Results</label>
                <textarea
                  name="imaging_results"
                  value={form.imaging_results}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-colors duration-200 resize-vertical"
                  rows={2}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Allergies</label>
                <input
                  type="text"
                  name="allergies"
                  value={form.allergies}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-colors duration-200"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Chronic Conditions</label>
                <input
                  type="text"
                  name="chronic_conditions"
                  value={form.chronic_conditions}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-colors duration-200"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Follow-up Instructions</label>
                <textarea
                  name="follow_up_instructions"
                  value={form.follow_up_instructions}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-colors duration-200 resize-vertical"
                  rows={2}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Next Appointment Date</label>
                <input
                  type="date"
                  name="next_appointment_date"
                  value={form.next_appointment_date}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-colors duration-200"
                />
              </div>
            </div>
          )}

          <div className="flex justify-between items-center">
            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate(-1)} // Go back
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Saving...' : 'Save Record'}
            </Button>
          </div>
        </form>
      </div>
    );
  }

  export default NewRecord;