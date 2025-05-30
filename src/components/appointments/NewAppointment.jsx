import { useState } from "react";

const appointmentTypes = ["Consultation", "Follow-up", "Emergency"];
const appointmentStatuses = ["scheduled", "completed", "cancelled", "no-show"];

export default function NewAppointment() {
  const [form, setForm] = useState({
    patientName: "",
    date: "",
    time: "",
    duration: 30,
    type: appointmentTypes[0],
    status: appointmentStatuses[0],
    notes: "",
  });

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    console.log("New Appointment:", form);
    alert("Appointment created! (not really, just a demo)");
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="mb-6 text-2xl font-bold text-gray-900">New Appointment</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="patientName" className="block text-sm font-medium text-gray-700">
            Patient Name
          </label>
          <input
            id="patientName"
            name="patientName"
            type="text"
            required
            value={form.patientName}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm"
          />
        </div>

        <div className="flex space-x-4">
          <div className="flex-1">
            <label htmlFor="date" className="block text-sm font-medium text-gray-700">
              Date
            </label>
            <input
              id="date"
              name="date"
              type="date"
              required
              value={form.date}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm"
            />
          </div>

          <div className="flex-1">
            <label htmlFor="time" className="block text-sm font-medium text-gray-700">
              Time
            </label>
            <input
              id="time"
              name="time"
              type="time"
              required
              value={form.time}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm"
            />
          </div>
        </div>

        <div className="flex space-x-4">
          <div className="flex-1">
            <label htmlFor="duration" className="block text-sm font-medium text-gray-700">
              Duration (minutes)
            </label>
            <input
              id="duration"
              name="duration"
              type="number"
              min={1}
              required
              value={form.duration}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm"
            />
          </div>

          <div className="flex-1">
            <label htmlFor="type" className="block text-sm font-medium text-gray-700">
              Type
            </label>
            <select
              id="type"
              name="type"
              value={form.type}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm"
            >
              {appointmentTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700">
            Status
          </label>
          <select
            id="status"
            name="status"
            value={form.status}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm"
          >
            {appointmentStatuses.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
            Notes
          </label>
          <textarea
            id="notes"
            name="notes"
            rows={3}
            value={form.notes}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm"
            placeholder="Any additional details..."
          />
        </div>

        <button
          type="submit"
          className="w-full rounded-md bg-blue-600 py-2 px-4 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Create Appointment
        </button>
      </form>
    </div>
  );
}
