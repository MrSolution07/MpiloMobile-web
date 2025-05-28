import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  UserRound,
  MessageSquare,
  FileText,
  MapPin,
} from "lucide-react";

const AdminSidebar = () => {
  const navigation = [
    {
      title: "Dashboard",
      icon: LayoutDashboard,
      path: "/admin",
    },
    {
      title: "Patients",
      icon: Users,
      path: "/admin/patients",
    },
    {
      title: "Doctors",
      icon: UserRound,
      path: "/admin/doctors",
    },
    {
      title: "Messages",
      icon: MessageSquare,
      path: "/admin/messages",
    },
    {
      title: "Records",
      icon: FileText,
      path: "/admin/records",
    },
    {
      title: "Routes",
      icon: MapPin,
      path: "/admin/routes",
    },
  ];

  return (
    <div className="flex flex-col bg-white border-r w-64 h-screen">
      <div className="px-4 py-5">
        <div className="flex items-center">
          <img
            src="./assets/images/mpiloLogo.png"
            alt="Mpilo Mobile Logo"
            className="w-8 h-8 rounded-full object-cover"
          />
          <span className="ml-2 font-bold text-[#274D60] text-xl">
            Mpilo Mobile
          </span>
        </div>
        <div className="mt-1 text-gray-500 text-xs">Admin Dashboard</div>
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

export default AdminSidebar;
