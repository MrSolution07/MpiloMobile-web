import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import HeaderDashboard from "./HeaderDashboard";
import Sidebar from "./Sidebar";

function Layout() {
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
    <div className="flex bg-gray-50 h-screen">
      <div id="sidebar-container">
        <Sidebar isSidebarOpen={isSidebarOpen} />
      </div>

      <div className="flex flex-col flex-1 overflow-hidden">
        <HeaderDashboard toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />

        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-white w-full max-w-full">
        <div className="w-full max-w-full flex flex-col gap-4">
          <Outlet />
        </div>
      </main>
      </div>

      {isSidebarOpen && (
        <div
          className="lg:hidden z-10 fixed inset-0 bg-opacity-50"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}
    </div>
  );
}

export default Layout;
