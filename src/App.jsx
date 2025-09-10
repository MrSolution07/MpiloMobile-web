import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Toaster } from "./components/admin/ui/toaster";
import { Toaster as Sonner } from "./components/admin/ui/sonner";
import { TooltipProvider } from "./components/admin/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "./context";

import { router } from "./routes";

// // Main site pages
// import {
//   Home,
//   Services,
//   About,
//   Clients,
//   Gallery,
//   Contact,
//   Error,
//   UserDashboard,
// } from "./pages";

// import {
//   Register,
//   Login,
//   AdminLogin,
//   DoctorLogin,
//   ForgotPassword,
// } from "./components/auth";

// // Dashboard layout and pages
// import { Layout, AdminLayout } from "./components/layout";
// import { Dashboard } from "./components/DoctorDashboard";
// import { AppointmentsList, NewAppointment } from "./components/appointments";
// import { MessagesList } from "./components/messages";
// import {
//   PatientsList,
//   PatientDetails,
//   AddPatient,
// } from "./components/patients";
// import { TriageList, NewTriage } from "./components/triage";
// import { MedicalRecordsList, NewRecord } from "./components/records";
// import { DoctorSettings } from "./components/settings";
// import { DoctorProfile } from "./components/profile";

// // Admin dashboard pages
// import {
//   AdminDashboard,
//   AdminPatients,
//   AdminDoctors,
//   AdminRecords,
//   AdminNotFound,
//   AdminAddPatient,
//   AdminAddDoctor,
//   AdminAddRecord,
//   AdminMessages,
//   AdminSettings,
//   AdminProfile,
//   AdminInventory,
//   Routes,
// } from "./pages/admin";
// import { VideoCall } from "./components/shared";

const queryClient = new QueryClient();

// const router = createBrowserRouter([
//   {
//     path: "/call",
//     element: <VideoCall />,
//   },
//   // Main website routes
//   {
//     path: "/",
//     element: <Home />,
//   },
//   {
//     path: "/services",
//     element: <Services />,
//   },
//   {
//     path: "/about",
//     element: <About />,
//   },
//   {
//     path: "/clients",
//     element: <Clients />,
//   },
//   {
//     path: "/gallery",
//     element: <Gallery />,
//   },
//   {
//     path: "/contact",
//     element: <Contact />,
//   },
//   {
//     path: "/register",
//     element: <Register />,
//   },
//   {
//     path: "/login",
//     element: <Login />,
//   },
//   {
//     path: "/adminlogin",
//     element: <AdminLogin />,
//   },
//   {
//     path: "/doctorlogin",
//     element: <DoctorLogin />,
//   },
//   {
//     path: "/forgot-password",
//     element: <ForgotPassword />,
//   },
//   {
//     path: "/Userdashboard",
//     element: <UserDashboard />,
//   },

//   // Dashboard routes (nested under /dashboard path)
//   {
//     path: "/dashboard",
//     element: <Layout />,
//     children: [
//       {
//         path: "",
//         element: <Dashboard />,
//       },
//       {
//         path: "appointments",
//         element: <AppointmentsList />,
//       },
//       {
//         path: "appointments/new",
//         element: <NewAppointment />,
//       },
//       {
//         path: "messages",
//         element: <MessagesList />,
//       },
//       {
//         path: "patients",
//         element: <PatientsList />,
//       },
//       {
//         path: "patients/:id",
//         element: <PatientDetails />,
//       },
//       {
//         path: "patients/add",
//         element: <AddPatient />,
//       },
//       {
//         path: "triage",
//         element: <TriageList />,
//       },
//       {
//         path: "triage/new",
//         element: <NewTriage />,
//       },
//       {
//         path: "records",
//         element: <MedicalRecordsList />,
//       },
//       {
//         path: "records/new",
//         element: <NewRecord />,
//       },
//       {
//         path: "settings",
//         element: <DoctorSettings />,
//       },
//       {
//         path: "profile",
//         element: <DoctorProfile />,
//       },
//     ],
//   },

//   // Admin dashboard
//   {
//     path: "/admin",
//     element: <AdminLayout />,
//     children: [
//       {
//         path: "",
//         element: <AdminDashboard />,
//       },
//       {
//         path: "patients",
//         element: <AdminPatients />,
//       },
//       {
//         path: "doctors",
//         element: <AdminDoctors />,
//       },
//       {
//         path: "adminmessages",
//         element: <AdminMessages />,
//       },
//       {
//         path: "records",
//         element: <AdminRecords />,
//       },
//       {
//         path: "*",
//         element: <AdminNotFound />,
//       },
//       {
//         path: "adminaddpatient",
//         element: <AdminAddPatient />,
//       },
//       {
//         path: "routes",
//         element: <Routes />,
//       },
//       {
//         path: "adminadddoctor",
//         element: <AdminAddDoctor />,
//       },
//       {
//         path: "adminaddpatient",
//         element: <AdminAddPatient />,
//       },
//       {
//         path: "adminaddrecord",
//         element: <AdminAddRecord />,
//       },
//       {
//         path: "adminsettings",
//         element: <AdminSettings />,
//       },
//       {
//         path: "adminprofile",
//         element: <AdminProfile />,
//       },
//       {
//         path: "admininventory",
//         element: <AdminInventory />,
//       },
//     ],
//   },

//   // Catch-all
//   { path: "*", element: <Error /> },
// ]);

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
