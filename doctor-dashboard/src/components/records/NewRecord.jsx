import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { supabase } from "../../services/supabaseClient";
import { Button } from "../ui";

function NewRecord() {
  const location = useLocation();
  const navigate = useNavigate();
  const { patientData, fromTriage } = location.state || {};

  const [form, setForm] = useState({
    patientId: patientData?.id || '',
    firstName: patientData?.firstName || '',
    lastName: patientData?.lastName || '',
    diagnosis: '',
    treatment: '',
    medication: '',
    notes: '',
    date: new Date().toISOString().split('T')[0],
    vitalSigns: patientData?.vitalSigns || {}
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

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
        date: form.date,
        diagnosis: form.diagnosis,
        treatment: form.treatment,
        medication: form.medication,
        notes: form.notes,
       
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

        {/* Vital Signs (read-only) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-md">
          <div>
            <label className="block text-sm font-medium text-gray-700">Heart Rate</label>
            <input
              type="text"
              value={form.vitalSigns.heartRate}
              readOnly
              className="mt-1 w-full rounded-md border-gray-300 bg-gray-100 p-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Blood Pressure</label>
            <input
              type="text"
              value={form.vitalSigns.bloodPressure}
              readOnly
              className="mt-1 w-full rounded-md border-gray-300 bg-gray-100 p-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Temperature (°C)</label>
            <input
              type="text"
              value={form.vitalSigns.temperature}
              readOnly
              className="mt-1 w-full rounded-md border-gray-300 bg-gray-100 p-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Oxygen Saturation</label>
            <input
              type="text"
              value={form.vitalSigns.oxygenSaturation}
              readOnly
              className="mt-1 w-full rounded-md border-gray-300 bg-gray-100 p-2"
            />
          </div>
        </div>

        {/* Medical Record Fields */}
        <div className="grid grid-cols-1 gap-4">
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
            <label className="block text-sm font-medium text-gray-700 mb-2">Treatment</label>
            <textarea
              name="treatment"
              value={form.treatment}
              onChange={handleChange}
              className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-colors duration-200 resize-vertical"
              rows={3}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Medication</label>
            <input
              type="text"
              name="medication"
              value={form.medication}
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