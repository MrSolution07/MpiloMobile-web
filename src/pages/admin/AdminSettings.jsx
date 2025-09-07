import React, { useState } from 'react';

export default function AdminSettings() {
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    currentPassword: '',
    newPassword: '',
    receiveEmails: true,
    receiveSMS: false,
    activeStatus: true,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Admin settings saved:", form);
    // You could add an API call here
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Admin Settings</h2>
      <form onSubmit={handleSubmit} className="space-y-6">

        <div>
          <label className="block text-sm font-medium text-gray-700">Full Name</label>
          <input
            name="fullName"
            value={form.fullName}
            onChange={handleChange}
            className="mt-1 w-full border px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            type="text"
            placeholder="e.g. Lesedi Ntamane"
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
            placeholder="admin@example.com"
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
            placeholder="Enter new password"
          />
        </div>

        {/* Notification Preferences */}
        <div className="border-t pt-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Notification Preferences</label>
          <div className="space-y-2">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                name="receiveEmails"
                checked={form.receiveEmails}
                onChange={handleChange}
              />
              <span>Email Notifications</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                name="receiveSMS"
                checked={form.receiveSMS}
                onChange={handleChange}
              />
              <span>SMS Notifications</span>
            </label>
          </div>
        </div>

        {/* Admin Active Status */}
        <div className="border-t pt-4">
          <label className="flex items-center space-x-3">
            <input
              type="checkbox"
              name="activeStatus"
              checked={form.activeStatus}
              onChange={handleChange}
            />
            <span>Active / Available for admin tasks</span>
          </label>
        </div>

        {/* Actions */}
  <div className="flex justify-end gap-4 pt-6">
          <button
            type="button"
            className="px-4 py-2 rounded-md border border-gray-300 hover:bg-gray-100 whitespace-nowrap min-w-0 flex items-center justify-center text-center"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-5 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 whitespace-nowrap min-w-0 flex items-center justify-center text-center"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}
