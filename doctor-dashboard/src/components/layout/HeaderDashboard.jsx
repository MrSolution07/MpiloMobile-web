import { useState, useEffect } from "react";
import { Bell, Search, Menu, X } from "lucide-react";
import { Avatar } from "../ui";
import { useAuth } from "../../context/AuthProvider";
import { supabase } from "../../services/supabaseClient";

function HeaderDashboard({ toggleSidebar, isSidebarOpen }) {
  const { user, logout } = useAuth();
  const [isSearchActive, setIsSearchActive] = useState(false);
  // const [searchQuery, setSearchQuery] = useState("");
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [doctorProfile, setDoctorProfile] = useState({
    name: '',
    email: '',
    department: 'Doctor'
  });

  const toggleProfileDropdown = () => {
    setIsProfileDropdownOpen(!isProfileDropdownOpen);
    if (isNotificationsOpen) setIsNotificationsOpen(false);
  };

  const toggleNotifications = () => {
    setIsNotificationsOpen(!isNotificationsOpen);
    if (isProfileDropdownOpen) setIsProfileDropdownOpen(false);
  };

  //doc details here 
  useEffect(() => {
    const fetchDoctorProfile = async () => {
      if (user?.email) {
        try {
          // Fetch from doctors table
          const { data: doctorData, error: doctorError } = await supabase
            .from('doctors')
            .select('first_name, last_name, email')
            .eq('email', user.email)
            .single();

          if (doctorData && !doctorError) {
            setDoctorProfile({
              name: `Dr ${doctorData.first_name} ${doctorData.last_name}`,
              email: doctorData.email,
              department: 'Doctor'
            });
          } else {
            // Fallback to user metadata or email
            const fallbackName = user.user_metadata?.full_name || user.email?.split('@')[0] || 'Doctor';
            setDoctorProfile({
              name: `Dr ${fallbackName}`,
              email: user.email,
              department: 'Doctor'
            });
          }
        } catch (error) {
          console.error('Error fetching doctor profile:', error);
          // Fallback to user metadata or email
          const fallbackName = user.user_metadata?.full_name || user.email?.split('@')[0] || 'Doctor';
          setDoctorProfile({
            name: `Dr ${fallbackName}`,
            email: user.email,
            department: 'Doctor'
          });
        }
      }
    };

    fetchDoctorProfile();
  }, [user]);

  const handleLogout = async () => {
    try {
      await logout();
      // Redirect to login page
      window.location.href = '/login';
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
<header className="top-0 z-30 bg-white shadow-sm border-b border-gray-200 w-full">
  <div className="flex items-center justify-between px-4 py-2 sm:h-16 w-full flex-wrap gap-4">
    <div className="flex items-center gap-2">
      <button
        onClick={toggleSidebar}
        className="lg:hidden hover:bg-gray-100 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-600 hover:text-gray-900"
        aria-label={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
      >
        {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {!isSearchActive && (
        <button
          onClick={() => setIsSearchActive(true)}
          className="sm:hidden hover:bg-gray-100 p-2 rounded-full text-gray-600 hover:text-gray-900"
          aria-label="Search"
        >
          <Search className="w-5 h-5" />
        </button>
      )}
    </div>

    {/* <div className={`flex-1 ${isSearchActive ? "flex" : "hidden sm:flex"} justify-center`}>
      <div className="relative w-full max-w-md">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <Search className="w-5 h-5 text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Search patients, appointments..."
          className="bg-gray-100 focus:bg-white py-2 pr-10 pl-10 border-none rounded-lg focus:ring-2 focus:ring-blue-500 w-full text-gray-700"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        {isSearchActive && (
          <button
            onClick={() => setIsSearchActive(false)}
            className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>
    </div> */}

    <div className="flex items-center gap-4">
      <div className="relative">
        <button
          onClick={toggleNotifications}
          className="hover:bg-gray-100 p-2 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-600 hover:text-gray-900"
          aria-label="Notifications"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute top-0 right-0 bg-red-500 rounded-full ring-2 ring-white w-2 h-2" />
        </button>

        {isNotificationsOpen && (
          <div className="absolute right-0 mt-2 bg-white shadow-lg border border-gray-200 rounded-lg w-80 z-40">
            <div className="px-4 py-2 border-b border-gray-100">
              <h3 className="font-semibold text-gray-900 text-sm">Notifications</h3>
            </div>
            <div className="max-h-96 overflow-y-auto">
              
            </div>
          </div>
        )}
      </div>

      <div className="relative">
        <button
          onClick={toggleProfileDropdown}
          className="flex items-center rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="User menu"
        >
          <Avatar
            src="https://www.gravatar.com/avatar/?d=mp"
            alt={doctorProfile.name}
            size="sm"
            status="online"
          />
        </button>

        {isProfileDropdownOpen && (
          <div className="absolute right-0 mt-2 bg-white shadow-lg border border-gray-200 rounded-lg w-48 z-40">
            <div className="px-4 py-3 border-b border-gray-100">
              <p className="font-semibold text-sm text-gray-900">{doctorProfile.name}</p>
              <p className="text-xs mt-1 text-gray-500">{doctorProfile.email}</p>
              <p className="text-xs mt-1 text-blue-600 font-medium">{doctorProfile.department}</p>
            </div>
            <div className="py-1">
              <a
                href="/dashboard/profile"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Your Profile
              </a>
              <a
                href="/dashboard/settings"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Settings
              </a>
              <button
                onClick={handleLogout}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Sign out
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  </div>
</header>

  );
}

export default HeaderDashboard;
