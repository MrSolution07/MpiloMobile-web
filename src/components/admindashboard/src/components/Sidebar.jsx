import React from "react";
import { NavLink } from "react-router-dom";
import { LayoutDashboard, Users, UserRound, MessageSquare, FileText, MapPin } from "lucide-react";

const Sidebar = () => {
  const navigation = [
    {
      title: "Dashboard",
      icon: LayoutDashboard,
      path: "/",
    },
    {
      title: "Patients",
      icon: Users,
      path: "/patients",
    },
    {
      title: "Doctors",
      icon: UserRound,
      path: "/doctors",
    },
    {
      title: "Messages",
      icon: MessageSquare,
      path: "/messages",
    },
    {
      title: "Records",
      icon: FileText,
      path: "/records",
    },
    {
      title: "Routes",
      icon: MapPin,
      path: "/routes",
    },
  ];

  return (
    <div className="flex h-screen w-64 flex-col bg-white border-r">
      <div className="px-4 py-5">
        <div className="flex items-center">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#274D60]">
            <span className="text-lg font-bold text-white">M</span>
          </div>
          <span className="ml-2 text-xl font-bold text-[#274D60]">Mpilo Mobile</span>
        </div>
        <div className="mt-1 text-xs text-gray-500">Admin Dashboard</div>
      </div>

      <nav className="flex-1 px-4 py-4">
        <div className="space-y-2">
          {navigation.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive 
                    ? "bg-[#274D60] text-white" 
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                }`
              }
            >
              <item.icon size={18} />
              <span>{item.title}</span>
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  );
};

export default Sidebar;
