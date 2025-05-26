import { useState, useEffect } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";

function Layout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsSidebarOpen(false); // For large screens, sidebar is always visible
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
        <Header toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />

        <main className="flex-1 bg-gray-50 p-4 md:p-6 overflow-x-hidden overflow-y-auto">
          {children}
        </main>
      </div>

      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div
          className="lg:hidden z-10 fixed inset-0 bg-gray-900 bg-opacity-50"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}
    </div>
  );
}

export default Layout;
