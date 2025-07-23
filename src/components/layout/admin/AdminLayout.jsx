import { Outlet, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import AdminSidebar from "./AdminSidebar";
import AdminHeader from "./AdminHeader";
import { useAuth } from "../../../context";

const AdminLayout = () => {
  const { isLoggedIn } = useAuth();
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

  if (!isLoggedIn) return <Navigate to="/login" replace />;

  return (
    <div className="flex w-full h-screen">
      {/* Sidebar */}
      <div
        id="sidebar-container"
        className={`fixed top-0 left-0 z-20 h-full bg-white shadow-lg transition-transform duration-300 lg:static lg:translate-x-0 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <AdminSidebar />
      </div>

      {isSidebarOpen && (
        <div
          className="lg:hidden z-10 fixed inset-0 bg-opacity-50"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      <div className="flex flex-col flex-1 overflow-hidden">
        <AdminHeader
          toggleSidebar={toggleSidebar}
          isSidebarOpen={isSidebarOpen}
        />
        <main className="flex-1 p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
