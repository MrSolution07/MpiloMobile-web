import React, { useState } from 'react';

function AddTriageForm({ onSubmit, onCancel }) {
  const [form, setForm] = useState({
    patientId: '',
    symptoms: '',
    priority: 'Low',
    temperature: '',
    bloodPressure: '',
    notes: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 p-4 border rounded-md bg-white shadow-sm"
    >
      <div>
        <label htmlFor="patientId" className="block text-sm font-medium text-gray-700">Patient ID / Name</label>
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
        <label htmlFor="symptoms" className="block text-sm font-medium text-gray-700">Symptoms</label>
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
        <label htmlFor="priority" className="block text-sm font-medium text-gray-700">Priority</label>
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
        <label htmlFor="temperature" className="block text-sm font-medium text-gray-700">Temperature (°C)</label>
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
        <label htmlFor="bloodPressure" className="block text-sm font-medium text-gray-700">Blood Pressure</label>
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
        <label htmlFor="notes" className="block text-sm font-medium text-gray-700">Additional Notes</label>
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
          onClick={onCancel}
          className="rounded-md border border-gray-300 px-4 py-2 hover:bg-gray-100"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="rounded-md bg-[#274D60] px-4 py-2 text-white hover:bg-green-700"
        >
          Save Triage Case
        </button>
      </div>
    </form>
  );
}

export default AddTriageForm;
