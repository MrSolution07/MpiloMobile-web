import React, { useState } from 'react';
import { Bell, Search, Menu, X, Settings } from 'lucide-react';
import Avatar from '../ui/Avatar';
import { currentUser } from '../../data/mockData';

const Header = ({ toggleSidebar, isSidebarOpen }) => {
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  const toggleProfileDropdown = () => {
    setIsProfileDropdownOpen(!isProfileDropdownOpen);
    if (isNotificationsOpen) setIsNotificationsOpen(false);
  };

  const toggleNotifications = () => {
    setIsNotificationsOpen(!isNotificationsOpen);
    if (isProfileDropdownOpen) setIsProfileDropdownOpen(false);
  };

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-gray-200 shadow-sm">
      <div className="flex items-center justify-between px-4 h-16">
        <div className="flex items-center">
          <button
            onClick={toggleSidebar}
            className="p-2 mr-2 text-gray-600 rounded-md lg:hidden hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            aria-label={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
          >
            {isSidebarOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
          
          <div className={`ml-0 lg:ml-4 ${isSearchActive ? 'hidden md:flex' : 'flex'}`}>
            <h1 className="text-xl font-semibold text-gray-800">MpiloMobile</h1>
          </div>
        </div>

        <div className="flex items-center flex-1 justify-end md:justify-between">
          <div className={`relative ${isSearchActive ? 'flex-1 max-w-2xl mx-auto' : 'hidden md:block w-64'}`}>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Search className="w-5 h-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search patients, appointments..."
                className="w-full py-2 pl-10 pr-4 text-gray-700 bg-gray-100 border-none rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-500"
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
          </div>

          <div className="flex items-center ml-4 space-x-3">
            {!isSearchActive && (
              <button
                onClick={() => setIsSearchActive(true)}
                className="p-2 text-gray-600 rounded-full md:hidden hover:text-gray-900 hover:bg-gray-100"
                aria-label="Search"
              >
                <Search className="w-5 h-5" />
              </button>
            )}

            <div className="relative">
              <button
                onClick={toggleNotifications}
                className="relative p-2 text-gray-600 rounded-full hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                aria-label="Notifications"
              >
                <Bell className="w-5 h-5" />
                <span className="absolute top-0 right-0 block w-2 h-2 bg-red-500 rounded-full ring-2 ring-white"></span>
              </button>

              {isNotificationsOpen && (
                <div className="absolute right-0 w-80 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <h3 className="text-sm font-semibold text-gray-900">Notifications</h3>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    <div className="px-4 py-3 border-b border-gray-100 bg-blue-50">
                      <p className="text-sm font-medium text-gray-900">Michael Rodriguez sent an urgent message</p>
                      <p className="text-xs text-gray-500 mt-1">10 minutes ago</p>
                    </div>
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900">New triage case: Jennifer Lee</p>
                      <p className="text-xs text-gray-500 mt-1">30 minutes ago</p>
                    </div>
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900">Your next appointment starts in 15 minutes</p>
                      <p className="text-xs text-gray-500 mt-1">45 minutes ago</p>
                    </div>
                  </div>
                  <div className="px-4 py-2 text-center border-t border-gray-100">
                    <button className="text-sm font-medium text-blue-600 hover:text-blue-800">
                      View all notifications
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="relative">
              <button
                onClick={toggleProfileDropdown}
                className="flex items-center focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-full"
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
                <div className="absolute right-0 w-48 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="text-sm font-semibold text-gray-900">{currentUser.name}</p>
                    <p className="text-xs text-gray-500 mt-1">{currentUser.email}</p>
                  </div>
                  <div className="py-1">
                    <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      Your Profile
                    </a>
                    <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      Settings
                    </a>
                    <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      Sign out
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;