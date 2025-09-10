import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Toaster } from "./components/admin/ui/toaster";
import { Toaster as Sonner } from "./components/admin/ui/sonner";
import { TooltipProvider } from "./components/admin/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "./context";
import {
  AddPatient,
  AdminLayout,
  AdminLogin,
  AppointmentsList,
  Dashboard,
  DoctorLogin,
  DoctorProfile,
  DoctorSettings,
  ForgotPassword,
  Layout,
  Login,
  MedicalRecordsList,
  MessagesList,
  NewAppointment,
  NewRecord,
  NewTriage,
  PatientDetails,
  PatientsList,
  Register,
  TriageList,
  VideoCall,
} from "./components";
import {
  About,
  AdminAddDoctor,
  AdminAddPatient,
  AdminAddRecord,
  AdminDashboard,
  AdminDoctors,
  AdminInventory,
  AdminMessages,
  AdminNotFound,
  AdminPatients,
  AdminProfile,
  AdminRecords,
  AdminSettings,
  Clients,
  Contact,
  Error,
  Gallery,
  Home,
  Routes,
  Services,
  UserDashboard,
} from "./pages";
import { AuthLayout, PublicLayout } from "./layouts";

const queryClient = new QueryClient();

const router = createBrowserRouter([
  // public routes
  {
    path: "/",
    element: <PublicLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: "services", element: <Services /> },
      { path: "about", element: <About /> },
      { path: "clients", element: <Clients /> },
      { path: "gallery", element: <Gallery /> },
      { path: "contact", element: <Contact /> },
    ],
  },

  { path: "/register", element: <Register /> },
  { path: "/call", element: <VideoCall /> },
  { path: "/login", element: <Login /> },
  { path: "/adminlogin", element: <AdminLogin /> },
  { path: "/doctorlogin", element: <DoctorLogin /> },
  { path: "/forgot-password", element: <ForgotPassword /> },

  // patient routes
  {
    path: "/",
    element: <AuthLayout allowedRoles={["patient"]} />,
    children: [{ path: "/Userdashboard", element: <UserDashboard /> }],
  },

  // doctor routes
  {
    path: "/dashboard",
    element: <AuthLayout allowedRoles={["doctor"]} />,
    children: [
      {
        element: <Layout />,
        children: [
          { index: true, element: <Dashboard /> },
          { path: "appointments", element: <AppointmentsList /> },
          { path: "appointments/new", element: <NewAppointment /> },
          { path: "messages", element: <MessagesList /> },
          { path: "patients", element: <PatientsList /> },
          { path: "patients/:id", element: <PatientDetails /> },
          { path: "patients/add", element: <AddPatient /> },
          { path: "triage", element: <TriageList /> },
          { path: "triage/new", element: <NewTriage /> },
          { path: "records", element: <MedicalRecordsList /> },
          { path: "records/new", element: <NewRecord /> },
          { path: "settings", element: <DoctorSettings /> },
          { path: "profile", element: <DoctorProfile /> },
        ],
      },
    ],
  },

  // admin routes
  {
    path: "/admin",
    element: <AuthLayout allowedRoles={["admin"]} />,
    children: [
      {
        element: <AdminLayout />,
        children: [
          { index: true, element: <AdminDashboard /> },
          { path: "patients", element: <AdminPatients /> },
          { path: "doctors", element: <AdminDoctors /> },
          { path: "adminmessages", element: <AdminMessages /> },
          { path: "records", element: <AdminRecords /> },
          { path: "*", element: <AdminNotFound /> },
          { path: "adminaddpatient", element: <AdminAddPatient /> },
          { path: "routes", element: <Routes /> },
          { path: "adminadddoctor", element: <AdminAddDoctor /> },
          { path: "adminaddpatient", element: <AdminAddPatient /> },
          { path: "adminaddrecord", element: <AdminAddRecord /> },
          { path: "adminsettings", element: <AdminSettings /> },
          { path: "adminprofile", element: <AdminProfile /> },
          { path: "admininventory", element: <AdminInventory /> },
        ],
      },
    ],
  },

  // catch-all
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
