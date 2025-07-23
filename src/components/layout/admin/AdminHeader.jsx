import { useState } from "react";
import { Bell, Search, Menu, X } from "lucide-react";
import { Avatar } from "../../ui";
import { currentUser } from "../../../data";
import { useAuth } from "../../../context";

function HeaderDashboard({ toggleSidebar, isSidebarOpen }) {
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  const { logout } = useAuth();

  const toggleProfileDropdown = () => {
    setIsProfileDropdownOpen(!isProfileDropdownOpen);
    if (isNotificationsOpen) setIsNotificationsOpen(false);
  };

  const toggleNotifications = () => {
    setIsNotificationsOpen(!isNotificationsOpen);
    if (isProfileDropdownOpen) setIsProfileDropdownOpen(false);
  };

  return (
    <header className="top-0 z-30 bg-white shadow-sm border-gray-200 border-b w-full">
      <div className="flex flex-wrap justify-between items-center gap-4 px-4 py-2 w-full sm:h-16">
        <div className="flex items-center gap-2">
          <button
            onClick={toggleSidebar}
            className="lg:hidden hover:bg-gray-100 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-600 hover:text-gray-900"
            aria-label={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
          >
            {isSidebarOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
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

        <div
          className={`flex-1 ${
            isSearchActive ? "flex" : "hidden sm:flex"
          } justify-center`}
        >
          <div className="relative w-full max-w-md">
            <div className="left-0 absolute inset-y-0 flex items-center pl-3 pointer-events-none">
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
                className="right-0 absolute inset-y-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative">
            <button
              onClick={toggleNotifications}
              className="hover:bg-gray-100 p-2 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-600 hover:text-gray-900"
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5" />
              <span className="top-0 right-0 absolute bg-red-500 rounded-full ring-2 ring-white w-2 h-2" />
            </button>

            {isNotificationsOpen && (
              <div className="right-0 z-40 absolute bg-white shadow-lg mt-2 border border-gray-200 rounded-lg w-80">
                <div className="px-4 py-2 border-gray-100 border-b">
                  <h3 className="font-semibold text-gray-900 text-sm">
                    Notifications
                  </h3>
                </div>
                <div className="max-h-96 overflow-y-auto"></div>
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
                src={currentUser.avatar}
                alt={currentUser.name}
                size="sm"
                status="online"
              />
            </button>

            {isProfileDropdownOpen && (
              <div className="right-0 z-40 absolute bg-white shadow-lg mt-2 border border-gray-200 rounded-lg w-48">
                <div className="px-4 py-3 border-gray-100 border-b">
                  <p className="font-semibold text-gray-900 text-sm">
                    {currentUser.name}
                  </p>
                  <p className="mt-1 text-gray-500 text-xs">
                    {currentUser.email}
                  </p>
                </div>
                <div className="py-1">
                  <a
                    href="/admin/adminprofile"
                    className="block hover:bg-gray-100 px-4 py-2 text-gray-700 text-sm"
                  >
                    Your Profile
                  </a>
                  <a
                    href="/admin/adminsettings"
                    className="block hover:bg-gray-100 px-4 py-2 text-gray-700 text-sm"
                  >
                    Settings
                  </a>
                  <a
                    onClick={() => logout()}
                    className="block hover:bg-gray-100 px-4 py-2 text-gray-700 text-sm"
                  >
                    Sign out
                  </a>
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
