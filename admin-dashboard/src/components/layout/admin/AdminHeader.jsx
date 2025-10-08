// import { useState } from "react";
// import { Bell, Search, Menu, X } from "lucide-react";
// import { Avatar } from "../../ui";
// import { currentUser } from "../../../data";

// function HeaderDashboard({ toggleSidebar, isSidebarOpen }) {
//   const [isSearchActive, setIsSearchActive] = useState(false);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
//   const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

//   const toggleProfileDropdown = () => {
//     setIsProfileDropdownOpen(!isProfileDropdownOpen);
//     if (isNotificationsOpen) setIsNotificationsOpen(false);
//   };

//   const toggleNotifications = () => {
//     setIsNotificationsOpen(!isNotificationsOpen);
//     if (isProfileDropdownOpen) setIsProfileDropdownOpen(false);
//   };

//   return (
// <header className="top-0 z-30 bg-white shadow-sm border-b border-gray-200 w-full">
//   <div className="flex items-center justify-between px-4 py-2 sm:h-16 w-full flex-wrap gap-4">
//     <div className="flex items-center gap-2">
//       <button
//         onClick={toggleSidebar}
//         className="lg:hidden hover:bg-gray-100 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-600 hover:text-gray-900"
//         aria-label={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
//       >
//         {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
//       </button>

//       {!isSearchActive && (
//         <button
//           onClick={() => setIsSearchActive(true)}
//           className="sm:hidden hover:bg-gray-100 p-2 rounded-full text-gray-600 hover:text-gray-900"
//           aria-label="Search"
//         >
//           <Search className="w-5 h-5" />
//         </button>
//       )}
//     </div>

//     {/* <div className={`flex-1 ${isSearchActive ? "flex" : "hidden sm:flex"} justify-center`}>
//       <div className="relative w-full max-w-md">
//         <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
//           <Search className="w-5 h-5 text-gray-400" />
//         </div>
//         <input
//           type="text"
//           placeholder="Search patients, appointments..."
//           className="bg-gray-100 focus:bg-white py-2 pr-10 pl-10 border-none rounded-lg focus:ring-2 focus:ring-blue-500 w-full text-gray-700"
//           value={searchQuery}
//           onChange={(e) => setSearchQuery(e.target.value)}
//         />
//         {isSearchActive && (
//           <button
//             onClick={() => setIsSearchActive(false)}
//             className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
//           >
//             <X className="w-5 h-5" />
//           </button>
//         )}
//       </div>
//     </div> */}

//     <div className="flex items-center gap-4">
//       <div className="relative">
//         <button
//           onClick={toggleNotifications}
//           className="hover:bg-gray-100 p-2 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-600 hover:text-gray-900"
//           aria-label="Notifications"
//         >
//           <Bell className="w-5 h-5" />
//           <span className="absolute top-0 right-0 bg-red-500 rounded-full ring-2 ring-white w-2 h-2" />
//         </button>

//         {isNotificationsOpen && (
//           <div className="absolute right-0 mt-2 bg-white shadow-lg border border-gray-200 rounded-lg w-80 z-40">
//             <div className="px-4 py-2 border-b border-gray-100">
//               <h3 className="font-semibold text-gray-900 text-sm">Notifications</h3>
//             </div>
//             <div className="max-h-96 overflow-y-auto">
              
//             </div>
//           </div>
//         )}
//       </div>

//       <div className="relative">
//         <button
//           onClick={toggleProfileDropdown}
//           className="flex items-center rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
//           aria-label="User menu"
//         >
//           <Avatar
//             src={currentUser.avatar}
//             alt={currentUser.name}
//             size="sm"
//             status="online"
//           />
//         </button>

//         {isProfileDropdownOpen && (
//           <div className="absolute right-0 mt-2 bg-white shadow-lg border border-gray-200 rounded-lg w-48 z-40">
//             <div className="px-4 py-3 border-b border-gray-100">
//               <p className="font-semibold text-sm text-gray-900">{currentUser.name}</p>
//               <p className="text-xs mt-1 text-gray-500">{currentUser.email}</p>
//             </div>
//             <div className="py-1">
//               <a
//                 href="/admin/adminprofile"
//                 className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
//               >
//                 Your Profile
//               </a>
//               <a
//                 href="/admin/adminsettings"
//                 className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
//               >
//                 Settings
//               </a>
//               <a
//                 href="/adminlogin"
//                 className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
//               >
//                 Sign out
//               </a>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   </div>
// </header>

//   );
// }

// export default HeaderDashboard;







import { useState, useEffect } from "react";
import { Bell, Search, Menu, X } from "lucide-react";
import { Avatar } from "../../ui";
import { useAuth } from "../../../context/AuthProvider";
import { supabase } from "../../../services/supabaseClient";
import profile from "../../../../public/assets/images/profileImg.png";
import { Link } from "react-router-dom";

function HeaderDashboard({ toggleSidebar, isSidebarOpen }) {
  const { user, logout } = useAuth();
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [adminProfile, setAdminProfile] = useState({
    name: '',
    email: '',
    role: 'Administrator'
  });
  

  // Toggle profile dropdown
  const toggleProfileDropdown = () => {
    setIsProfileDropdownOpen(!isProfileDropdownOpen);
    if (isNotificationsOpen) setIsNotificationsOpen(false);
  };

  // Toggle notifications dropdown
  const toggleNotifications = () => {
    setIsNotificationsOpen(!isNotificationsOpen);
    if (isProfileDropdownOpen) setIsProfileDropdownOpen(false);
  };

  // Fetch admin profile data
  useEffect(() => {
    const fetchAdminProfile = async () => {
      if (user?.email) {
        try {
          // Fetch from admin table
          const { data: adminData, error: adminError } = await supabase
            .from('admins')
            .select('first_name, last_name, email, role')
            .eq('email', user.email)
            .single();

          if (adminData && !adminError) {
            setAdminProfile({
              name: `${adminData.first_name} ${adminData.last_name}`,
              email: adminData.email,
              role: adminData.role || 'Administrator'
            });
          } else {
            // Fallback to user metadata or email
            const fallbackName = user.user_metadata?.full_name || user.email?.split('@')[0] || 'Admin';
            setAdminProfile({
              name: fallbackName,
              email: user.email,
              role: 'Administrator'
            });
          }
        } catch (error) {
          console.error('Error fetching admin profile:', error);
          // Fallback to user metadata or email
          const fallbackName = user.user_metadata?.full_name || user.email?.split('@')[0] || 'Admin';
          setAdminProfile({
            name: fallbackName,
            email: user.email,
            role: 'Administrator'
          });
        }
      }
    };

    fetchAdminProfile();
  }, [user]);

  // Handle logout
  const handleLogout = async () => {
    try {
      await logout();
      // Redirect to login page
      window.location.href = '/login';
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };


  const handleProfileClick = () => {
    setIsProfileDropdownOpen(false);
    navigate('/admin/profile');};

  return (
    <header className="top-0 z-30 bg-white shadow-sm border-b border-gray-200 w-full">
      <div className="flex items-center justify-between px-4 py-2 sm:h-16 w-full flex-wrap gap-4">
        {/* Left Section: Sidebar Toggle and Mobile Search */}
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

        {/* Center Section: Search Bar (Hidden on mobile when not active) */}
        <div className={`flex-1 ${isSearchActive ? "flex" : "hidden sm:flex"} justify-center`}>
          <div className="relative w-full max-w-md">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search className="w-5 h-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search users, reports, settings..."
              className="bg-gray-100 focus:bg-white py-2 pr-10 pl-10 border-none rounded-lg focus:ring-2 focus:ring-red-500 w-full text-gray-700"
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
        </div>

        {/* Right Section: Notifications and Profile */}
        <div className="flex items-center gap-4">
          {/* Notifications Dropdown */}
          <div className="relative">
            <button
              onClick={toggleNotifications}
              className="hover:bg-gray-100 p-2 rounded-full focus:outline-none focus:ring-1 focus:ring-red-500 text-gray-600 hover:text-gray-900"
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-0 right-0 bg-red-500 rounded-full ring-2 ring-white w-2 h-2" />
            </button>

            {isNotificationsOpen && (
              <div className="absolute right-0 mt-2 bg-white shadow-lg border border-gray-200 rounded-lg w-64 sm:w-70 z-40">
                <div className="px-3 sm:px-4 py-2 border-b border-gray-100">
                  <span className="font-semibold text-gray-900 text-xs sm:text-sm">Notifications</span>
                </div>
                <div className="max-h-72 sm:max-h-96 overflow-y-auto">
                  <div className="px-4 py-3 text-center text-gray-500 text-sm">
                    No new notifications
                  </div>
                  {/* Notification items would go here */}
                  {/* Example notification item:
                  <div className="px-4 py-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer">
                    <p className="text-sm font-medium text-gray-900">New user registration</p>
                    <p className="text-xs text-gray-500 mt-1">A new practitioner has registered</p>
                    <p className="text-xs text-gray-400 mt-1">2 minutes ago</p>
                  </div>
                  */}
                </div>
                <div className="px-4 py-2 border-t border-gray-100">
                  <button className="text-xs text-red-600 hover:text-red-700 font-medium">
                    Mark all as read
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Profile Dropdown */}
          <div className="relative">
            <button
              onClick={toggleProfileDropdown}
              className="flex items-center rounded-full focus:outline-none focus:ring-2 focus:ring-red-500"
              aria-label="Admin menu"
            >
              <Avatar
                src={profile}
                alt={adminProfile.name}
                size="sm"
                status="online"
              />
            </button>

            {isProfileDropdownOpen && (
              <div className="absolute right-0 mt-2 bg-white shadow-lg border border-gray-200 rounded-lg w-48 z-40">
                {/* Profile Info */}
                <div className="px-4 py-3 border-b border-gray-100">
                  <p className="font-semibold text-sm text-gray-900">{adminProfile.name}</p>
                  <p className="text-xs mt-1 text-gray-500">{adminProfile.email}</p>
                  <p className="text-xs mt-1 text-red-600 font-medium">{adminProfile.role}</p>
                </div>
                
                {/* Menu Items */}
                <div className="py-1">
                <Link
  to="/admin/adminprofile"
  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
  onClick={() => setIsProfileDropdownOpen(false)}
>
  Admin Profile
</Link>
                  <a
                    href="/admin/settings"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    System Settings
                  </a>
                  {/* <a
                    href="/admin/users"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    User Management
                  </a> */}
                  {/* <a
                    href="/admin/reports"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    Reports & Analytics
                  </a> */}
                  
                  {/* Divider */}
                  <div className="border-t border-gray-100 my-1"></div>
                  
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
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