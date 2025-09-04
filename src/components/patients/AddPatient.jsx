import React, { useState } from "react";
import { supabase } from "../../services";
import { useNavigate } from "react-router-dom";

function AddPatientForm({ onSubmit, onCancel }) {
  const [form, setForm] = useState({
    name: "",
    surname: "",
    dateOfBirth: "",
    address: "",
    condition: "",
  });

  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const { data, error } = await supabase
        .from("mock_patients")
        .insert([
          {
            id: `${form.name}-${form.surname}`.toLowerCase(),
            name: `${form.name} ${form.surname}`, // combine name + surname
            address: form.address,
            status: form.condition, // should probably switch this to dropdown input
            phone: "(555) 123-4567",
            email: `${form.name}.${form.surname}@example.com`.toLowerCase(),
            gender: "male",
          },
        ])
        .select()
        .single();

      if (error) throw error;

      setSuccess(true);
      setForm({
        name: "",
        surname: "",
        dateOfBirth: "",
        address: "",
        condition: "",
      });

      if (onSubmit) onSubmit(data);
    } catch (err) {
      console.error("Error adding patient:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {success && (
        <div className="mb-4 p-3 text-green-800 bg-green-100 rounded">
          Patient added successfully!
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
            htmlFor="name"
            className="block text-sm font-medium text-gray-700"
          >
            Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            value={form.name}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label
            htmlFor="surname"
            className="block text-sm font-medium text-gray-700"
          >
            Surname
          </label>
          <input
            id="surname"
            name="surname"
            type="text"
            value={form.surname}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label
            htmlFor="dateOfBirth"
            className="block text-sm font-medium text-gray-700"
          >
            Date of Birth
          </label>
          <input
            id="dateOfBirth"
            name="dateOfBirth"
            type="date"
            value={form.dateOfBirth}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label
            htmlFor="address"
            className="block text-sm font-medium text-gray-700"
          >
            Address
          </label>
          <input
            id="address"
            name="address"
            type="text"
            value={form.address}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label
            htmlFor="condition"
            className="block text-sm font-medium text-gray-700"
          >
            Condition
          </label>
          <input
            id="condition"
            name="condition"
            type="text"
            value={form.condition}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex justify-end space-x-2">
          <button
            type="button"
            // onClick={onCancel}
            onClick={() => navigate("/dashboard/patients")}
            className="rounded-md border border-gray-300 px-4 py-2 hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
      </form>
    </>
  );
}

export default AddPatientForm;
