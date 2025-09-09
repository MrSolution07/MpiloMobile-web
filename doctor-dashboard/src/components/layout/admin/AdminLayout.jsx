import { Outlet } from "react-router-dom";
import { useState, useEffect } from "react";
import AdminSidebar from "./AdminSidebar";
import AdminHeader from "./AdminHeader";

const AdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsSidebarOpen(false);
      }
    };

    const handleClickOutside = (event) => {
      const sidebar = document.getElementById("sidebar-container");
      const sidebarButton = document.getElementById("sidebar-button");

      if (
        isSidebarOpen &&
        sidebar &&
        !sidebar.contains(event.target) &&
        sidebarButton &&
        !sidebarButton.contains(event.target) &&
        window.innerWidth < 1024
      ) {
        setIsSidebarOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      window.removeEventListener("resize", handleResize);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isSidebarOpen]);

  return (
    <div className="flex w-full h-screen">
      {/* Sidebar */}
      <div
        id="sidebar-container"
        className={`fixed top-0 left-0 z-20 h-full bg-white shadow-lg transition-transform duration-300 lg:static lg:translate-x-0 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <AdminSidebar  isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar}  />
      </div>

      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-opacity-50 z-10 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      <div className="flex flex-col flex-1 overflow-hidden">
        <AdminHeader toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />
        <main className="flex-1 overflow-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
