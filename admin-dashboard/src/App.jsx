import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Toaster } from "./components/admin/ui/toaster";
import { Toaster as Sonner } from "./components/admin/ui/sonner";
import { TooltipProvider } from "./components/admin/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "./context";

// Admin pages
import { Error } from "./pages";
import { AdminLogin, ForgotPassword } from "./components/auth";

// Admin dashboard layout and pages
import { AdminLayout } from "./components/layout";
import {
  AdminDashboard,
  AdminPatients,
  AdminDoctors,
  AdminRecords,
  AdminNotFound,
  AdminAddPatient,
  AdminAddDoctor,
  AdminAddRecord,
  AdminMessages,
  AdminSettings,
  AdminProfile,
  AdminInventory,
  Routes
} from "./pages/admin";

const queryClient = new QueryClient();

const router = createBrowserRouter([
  // Admin login
  {
    path: "/",
    element: <AdminLogin />,
  },
  {
    path: "/login",
    element: <AdminLogin />,
  },
  {
    path: "/forgot-password",
    element: <ForgotPassword />,
  },

  // Admin dashboard
  {
    path: "/admin",
    element: <AdminLayout />,
    children: [
      {
        path: "",
        element: <AdminDashboard />,
      },
      {
        path: "patients",
        element: <AdminPatients />,
      },
      {
        path: "doctors",
        element: <AdminDoctors />,
      },
      {
        path: "adminmessages",
        element: <AdminMessages />,
      },
      {
        path: "records",
        element: <AdminRecords />,
      },
      {
        path: "*",
        element: <AdminNotFound />,
      },
      {
        path: "adminaddpatient",
        element: <AdminAddPatient />,
      },
      {
        path: "routes",
        element: <Routes />,
      },
      {
        path: "adminadddoctor",
        element: <AdminAddDoctor />,
      },
      {
        path: "adminaddpatient",
        element: <AdminAddPatient />,
      },
      {
        path: "adminaddrecord",
        element: <AdminAddRecord />,
      },
      {
        path: "adminsettings",
        element: <AdminSettings />,
      },
      {
        path: "adminprofile",
        element: <AdminProfile />,
      },
      {
        path: "admininventory",
        element: <AdminInventory />,
      },
    ],
  },

  // Catch-all
  { path: "*", element: <Error /> },
]);

function App() {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <RouterProvider router={router} />
        </TooltipProvider>
      </QueryClientProvider>
    </AuthProvider>
  );
}

export default App;
