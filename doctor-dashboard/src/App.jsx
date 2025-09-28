import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Toaster } from "./components/admin/ui/toaster";
import { Toaster as Sonner } from "./components/admin/ui/sonner";
import { TooltipProvider } from "./components/admin/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider, CallProvider } from "./context";

// Doctor pages
import { Error } from "./pages";
import { DoctorLogin, ForgotPassword } from "./components/auth";

// Dashboard layout and pages
import { Layout } from "./components/layout";
import { Dashboard } from "./components/DoctorDashboard";
import { AppointmentsList, NewAppointment } from "./components/appointments";
import { MessagesList } from "./components/messages";
import {
  PatientsList,
  PatientDetails,
  AddPatient,
} from "./components/patients";
import { TriageList, NewTriage } from "./components/triage";
import { MedicalRecordsList, NewRecord } from "./components/records";
import { DoctorSettings } from "./components/settings";
import { DoctorProfile } from "./components/profile";
import { CallHandler } from "./components/video-call";

const queryClient = new QueryClient();

const router = createBrowserRouter([
  // Doctor login
  {
    path: "/",
    element: <DoctorLogin />,
  },
  {
    path: "/login",
    element: <DoctorLogin />,
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
        path: "appointments/new",
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
        path: "patients/add",
        element: <AddPatient />,
      },
      {
        path: "triage",
        element: <TriageList />,
      },
      {
        path: "triage/new",
        element: <NewTriage />,
      },
      {
        path: "records",
        element: <MedicalRecordsList />,
      },
      {
        path: "records/new",
        element: <NewRecord />,
      },
      {
        path: "settings",
        element: <DoctorSettings />,
      },
      {
        path: "profile",
        element: <DoctorProfile />,
      },
    ],
  },

  // Catch-all
  { path: "*", element: <Error /> },
]);

function App() {
  return (
    <AuthProvider>
      <CallProvider>
        <CallHandler />
        <QueryClientProvider client={queryClient}>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <RouterProvider router={router} />
          </TooltipProvider>
        </QueryClientProvider>
      </CallProvider>
    </AuthProvider>
  );
}

export default App;
