import { Outlet } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";

const AdminLayout = () => (
  <div className="flex w-full h-screen">
    <AdminSidebar />
    <main className="flex-1 p-6 overflow-auto">
      <Outlet />
    </main>
  </div>
);

export default AdminLayout;
