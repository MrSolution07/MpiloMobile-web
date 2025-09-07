import React, { useState } from "react";
import { useNavigate } from "react-router-dom";


function NewTriageForm() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    patientId: "",
    symptoms: "",
    priority: "low",
    temperature: "",
    bloodPressure: "",
    notes: "",
  });

  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);


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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const { data, error } = await supabase
        .from("mock_triage_cases")
        .insert([
          {
            patient_id: form.patientId,
            chief_complaint: form.symptoms,
            priority: form.priority.toLowerCase(),
            status: "waiting", // new cases always start in waiting
            arrival_time: new Date().toISOString(),
            vital_signs: {
              temperature: form.temperature
                ? parseFloat(form.temperature)
                : null,
              bloodPressure: form.bloodPressure || null,
            },
            notes: form.notes || null,
          },
        ])
        .select()
        .single();

      if (error) throw error;

      setSuccess(true);
      setForm({
        patientId: "",
        symptoms: "",
        priority: "low",
        temperature: "",
        bloodPressure: "",
        notes: "",
      });

      if (onSubmit) onSubmit(data);
    } catch (err) {
      console.error("Error saving triage case:", err);
      setError(err.message);
    } finally {
      setLoading(false);

    }
  };

  return (
    <>
      {success && (
        <div className="mb-4 p-3 text-green-800 bg-green-100 rounded">
          Triage case added successfully!
        </div>
      )}

      {error && (
        <div className="mb-4 p-3 text-red-800 bg-red-100 rounded">{error}</div>
      )}

      <form
        onSubmit={handleSubmit}
        className="space-y-4 p-4 border rounded-md bg-white shadow-sm"
      >
        <div>
          <label
            htmlFor="patientId"
            className="block text-sm font-medium text-gray-700"
          >
            Patient ID / Name
          </label>
          <input
            id="patientId"
            name="patientId"
            type="text"
            value={form.patientId}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label
            htmlFor="symptoms"
            className="block text-sm font-medium text-gray-700"
          >
            Symptoms
          </label>
          <textarea
            id="symptoms"
            name="symptoms"
            value={form.symptoms}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label
            htmlFor="priority"
            className="block text-sm font-medium text-gray-700"
          >
            Priority
          </label>
          <select
            id="priority"
            name="priority"
            value={form.priority}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
          >
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="temperature"
            className="block text-sm font-medium text-gray-700"
          >
            Temperature (°C)
          </label>
          <input
            id="temperature"
            name="temperature"
            type="number"
            step="0.1"
            value={form.temperature}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
          />
        </div>

        <div>
          <label
            htmlFor="bloodPressure"
            className="block text-sm font-medium text-gray-700"
          >
            Blood Pressure
          </label>
          <input
            id="bloodPressure"
            name="bloodPressure"
            type="text"
            value={form.bloodPressure}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
          />
        </div>

        <div>
          <label
            htmlFor="notes"
            className="block text-sm font-medium text-gray-700"
          >
            Additional Notes
          </label>
          <textarea
            id="notes"
            name="notes"
            value={form.notes}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
          />
        </div>

        <div className="flex justify-end space-x-2">
          <button
            type="button"
            // onClick={onCancel}
            onClick={() => navigate("/dashboard/triage")}
            className="rounded-md border border-gray-300 px-4 py-2 hover:bg-gray-100"

          >
            Cancel
          </button>
          <button
            type="submit"
            className="rounded-md bg-[#274D60] px-4 py-2 text-white hover:bg-green-700"
          >
            {loading ? "Saving..." : "Save Triage Case"}
          </button>
        </div>
      </form>
    </>

  );
}

export default NewTriageForm;