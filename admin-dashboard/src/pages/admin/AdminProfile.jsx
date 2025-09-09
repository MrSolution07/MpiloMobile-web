import { Link } from 'react-router-dom';
import profile from "../../../public/assets/images/profileImg.png";;


export default function AdminProfile() {
  const admin = {
    name: 'Dr. Sarah Johnson',
    email: 'dr.sarah@example.com',
    phone: '+27 12 345 6789',
    role: 'System Administrator',
    status: 'Active',
    imageUrl: profile,
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded-xl shadow-md">
      <div className="flex items-center space-x-6">
        <img
          src={admin.imageUrl}
          alt="Admin profile"
          className="w-24 h-24 rounded-full object-cover border-2 border-blue-500"
        />
        <div>
          <h2 className="text-2xl font-semibold text-gray-800">{admin.name}</h2>
          <p className="text-gray-600">{admin.role}</p>
          <span
            className={`inline-block mt-2 px-3 py-1 text-sm font-medium rounded-full ${
              admin.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
            }`}
          >
            {admin.status}
          </span>
        </div>
      </div>

      <div className="mt-6 space-y-2 text-gray-700">
        <div><strong>Email:</strong> {admin.email}</div>
        <div><strong>Phone:</strong> {admin.phone}</div>
      </div>

      <div className="mt-6">
        <Link to="/admin/adminsettings">
          <button className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700">
            Edit Profile
          </button>
        </Link>
      </div>
    </div>
  );
}
