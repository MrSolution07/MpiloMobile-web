import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function AddMedicalRecordForm({ onSubmit, onCancel }) {
  const [form, setForm] = useState({
    patientId: "",
    diagnosis: "",
    treatment: "",
    medication: "",
    notes: "",
    date: new Date().toISOString().split("T")[0], // today’s date
  });

  const navigate = useNavigate();

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
      className="space-y-4 p-4 bg-white border rounded-md shadow-sm"
    >
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Patient ID / Name
        </label>
        <input
          type="text"
          name="patientId"
          value={form.patientId}
          onChange={handleChange}
          required
          className="mt-1 w-full rounded-md border px-3 py-2"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Diagnosis
        </label>
        <input
          type="text"
          name="diagnosis"
          value={form.diagnosis}
          onChange={handleChange}
          required
          className="mt-1 w-full rounded-md border px-3 py-2"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Treatment Plan
        </label>
        <textarea
          name="treatment"
          value={form.treatment}
          onChange={handleChange}
          required
          className="mt-1 w-full rounded-md border px-3 py-2"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Medication Prescribed
        </label>
        <input
          type="text"
          name="medication"
          value={form.medication}
          onChange={handleChange}
          className="mt-1 w-full rounded-md border px-3 py-2"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Doctor's Notes
        </label>
        <textarea
          name="notes"
          value={form.notes}
          onChange={handleChange}
          className="mt-1 w-full rounded-md border px-3 py-2"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Date</label>
        <input
          type="date"
          name="date"
          value={form.date}
          onChange={handleChange}
          className="mt-1 w-full rounded-md border px-3 py-2"
        />
      </div>

      <div className="flex justify-end space-x-2">
        <button
          type="button"
          // onClick={onCancel}
          onClick={() => navigate("/dashboard/records")}
          className="rounded-md border px-4 py-2 hover:bg-gray-100"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="rounded-md bg-[#274D60] text-white px-4 py-2 hover:bg-blue-700"
        >
          Save Record
        </button>
      </div>
    </form>
  );
}

export default AddMedicalRecordForm;
