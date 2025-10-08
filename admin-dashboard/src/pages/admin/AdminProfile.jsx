import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthProvider';
import { supabase } from '../../services/supabaseClient';
import profile from "../../../public/assets/images/profileImg.png";

export default function AdminProfile() {
  const { user } = useAuth();
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAdminProfile = async () => {
      if (!user?.email) {
        setError('User not authenticated');
        setLoading(false);
        return;
      }

      try {
        const { data: adminData, error: adminError } = await supabase
          .from('admins')
          .select('*')
          .eq('email', user.email)
          .single();

        if (adminError) {
          throw new Error(adminError.message);
        }

        if (!adminData) {
          throw new Error('Admin profile not found');
        }

        setAdmin(adminData);
      } catch (err) {
        console.error('Error fetching admin profile:', err);
        setError(err instanceof Error ? err.message : 'An error occurred while fetching profile');
      } finally {
        setLoading(false);
      }
    };

    fetchAdminProfile();
  }, [user]);

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded-xl shadow-md">
        <div className="flex justify-center items-center">
          <div className="text-lg">Loading profile...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded-xl shadow-md">
        <div className="flex justify-center items-center">
          <div className="text-red-600">Error: {error}</div>
        </div>
        <div className="mt-4 flex justify-center">
          <Link to="/admin/adminsettings">
            <button className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700">
              Try Again
            </button>
          </Link>
        </div>
      </div>
    );
  }

  if (!admin) {
    return (
      <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded-xl shadow-md">
        <div className="flex justify-center items-center">
          <div className="text-gray-600">No admin data found</div>
        </div>
      </div>
    );
  }

  const fullName = `${admin.first_name} ${admin.last_name}`;
  const status = admin.is_active ? 'Active' : 'Inactive';
  const profileImage = admin.profile_image_url || profile;
  const phoneNumber = admin.phone_number || 'Not provided';

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded-xl shadow-md">
      <div className="flex items-center space-x-6">
        <img
          src={profileImage}
          alt="Admin profile"
          className="w-24 h-24 rounded-full object-cover border-2 border-blue-500"
          onError={(e) => {
            // Fallback to default image if profile image fails to load
            e.target.src = profile;
          }}
        />
        <div>
          <h2 className="text-2xl font-semibold text-gray-800">{fullName}</h2>
          <p className="text-gray-600">System Administrator</p>
          <span
            className={`inline-block mt-2 px-3 py-1 text-sm font-medium rounded-full ${
              status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
            }`}
          >
            {status}
          </span>
        </div>
      </div>

      <div className="mt-6 space-y-2 text-gray-700">
        <div><strong>Admin ID:</strong> {admin.admin_number}</div>
        <div><strong>Email:</strong> {admin.email}</div>
        <div><strong>Phone:</strong> {phoneNumber}</div>
        <div><strong>Member since:</strong> {new Date(admin.created_at).toLocaleDateString()}</div>
        <div><strong>Last updated:</strong> {new Date(admin.updated_at).toLocaleDateString()}</div>
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