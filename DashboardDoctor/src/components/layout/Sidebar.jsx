import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  Calendar, 
  MessageSquare, 
  Users, 
  AlertTriangle, 
  FileText,
  CheckSquare,
  Settings
} from 'lucide-react';

const Sidebar = ({ isSidebarOpen }) => {
  const location = useLocation();
  
  const navItems = [
    { 
      name: 'Dashboard', 
      path: '/', 
      icon: <Home className="w-5 h-5" /> 
    },
    { 
      name: 'Appointments', 
      path: '/appointments', 
      icon: <Calendar className="w-5 h-5" /> 
    },
    { 
      name: 'Messages', 
      path: '/messages', 
      icon: <MessageSquare className="w-5 h-5" />,
      badge: 2
    },
    { 
      name: 'Patients', 
      path: '/patients', 
      icon: <Users className="w-5 h-5" /> 
    },
    { 
      name: 'Triage', 
      path: '/triage', 
      icon: <AlertTriangle className="w-5 h-5" />,
      badge: 4
    },
    { 
      name: 'Medical Records', 
      path: '/records', 
      icon: <FileText className="w-5 h-5" /> 
    },
  
  ];

  return (
    <aside 
      className={`
        h-full inset-y-0 left-0 z-20 flex flex-col w-64 bg-white border-r border-gray-200 shadow-sm transform 
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
        lg:translate-x-0 transition-transform duration-300 ease-in-out
      `}
    >
      <div className="h-16 flex items-center justify-center border-b border-gray-200">
        <h1 className="text-xl font-bold text-blue-700">MpiloMobile</h1>
      </div>

      <div className="flex-1 overflow-y-auto">
        <nav className="px-2 py-4">
          <ul className="space-y-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <li key={item.name}>
                  <Link
                    to={item.path}
                    className={`
                      flex items-center justify-between px-3 py-2.5 rounded-lg transition-colors group
                      ${isActive 
                        ? 'bg-blue-50 text-blue-700' 
                        : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                      }
                    `}
                  >
                    <div className="flex items-center">
                      <span className={isActive ? 'text-blue-600' : 'text-gray-500 group-hover:text-gray-700'}>
                        {item.icon}
                      </span>
                      <span className="ml-3 font-medium">{item.name}</span>
                    </div>
                    {item.badge && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>

      <div className="p-4 border-t border-gray-200">
        <Link
          to="/settings"
          className="flex items-center px-3 py-2.5 rounded-lg text-gray-700 hover:bg-gray-100 hover:text-gray-900"
        >
          <Settings className="w-5 h-5 text-gray-500" />
          <span className="ml-3 font-medium">Settings</span>
        </Link>
      </div>
    </aside>
  );
};

export default Sidebar;