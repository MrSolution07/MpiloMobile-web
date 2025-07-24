import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Toaster } from "./components/admin/ui/toaster";
import { Toaster as Sonner } from "./components/admin/ui/sonner";
import { TooltipProvider } from "./components/admin/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Main site pages
import {
  Home,
  Services,
  About,
  Clients,
  Gallery,
  Contact,
  Error,
} from "./pages";

import { Register, Login, AdminLogin, ForgotPassword } from "./components/auth";

// Dashboard layout and pages
import { Layout, AdminLayout } from "./components/layout";
import { Dashboard } from "./components/DoctorDashboard";
import { AppointmentsList,NewAppointment } from "./components/appointments";
import { MessagesList } from "./components/messages";
import { PatientsList, PatientDetails,AddPatient } from "./components/patients";
import { TriageList, NewTriage } from "./components/triage";
import { MedicalRecordsList, NewRecord } from "./components/records";
import { DoctorSettings } from "./components/settings";
import {DoctorProfile} from "./components/profile";

// Admin dashboard pages
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
  // Main website routes
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/services",
    element: <Services />,
  },
  {
    path: "/about",
    element: <About />,
  },
  {
    path: "/clients",
    element: <Clients />,
  },
  {
    path: "/gallery",
    element: <Gallery />,
  },
  {
    path: "/contact",
    element: <Contact />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/adminlogin",
    element: <AdminLogin />,
  },
  {
    path: "/forgot-password",
    element: <ForgotPassword />,
  },

  // Dashboard routes (nested under /dashboard path)
  {
    path: "/dashboard",
    element: <Layout />,
    children: [
      {
        path: "",
        element: <Dashboard />,
      },
      {
        path: "appointments",
        element: <AppointmentsList />,
      },
      {
        path: "newappointment",
        element: <NewAppointment />,
      },
      {
        path: "messages",
        element: <MessagesList />,
      },
      {
        path: "patients",
        element: <PatientsList />,
      },
      {
        path: "patients/:id",
        element: <PatientDetails />,
      },
      {
        path: "addpatient",
        element: <AddPatient />,
      },
      {
        path: "triage",
        element: <TriageList />,
      },
      {
        path: "newtriage",
        element: <NewTriage />,
      },
      {
        path: "records",
        element: <MedicalRecordsList />,
      },
      {
        path: "newrecord",
        element: <NewRecord />,
      },
      {
        path:"settings",
        element: <DoctorSettings/>
      },
      {
        path: "profile",
        element: <DoctorProfile />,
      },
      { path: "inventory",
        element: <AdminInventory />,
      },

    ],
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

      { path: "inventory",
        element: <AdminInventory />,
      },
    ],
  },

  // Catch-all
  { path: "*", element: <Error /> },
]);

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <RouterProvider router={router} />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
