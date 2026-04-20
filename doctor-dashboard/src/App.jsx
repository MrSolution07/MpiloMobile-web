import { lazy, Suspense } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Toaster } from "./components/admin/ui/toaster";
import { Toaster as Sonner } from "./components/admin/ui/sonner";
import { TooltipProvider } from "./components/admin/ui/tooltip";
import { QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider, CallProvider } from "./context";
import { queryClient } from "./queryClient";

const DoctorLogin = lazy(() => import("./components/auth/DoctorLogin.jsx"));
const ForgotPassword = lazy(() => import("./components/auth/ForgotPassword.jsx"));
const Error = lazy(() => import("./pages/Error.jsx"));
const Layout = lazy(() => import("./components/layout/Layout.jsx"));
const Dashboard = lazy(() =>
  import("./components/DoctorDashboard/Dashboard.jsx")
);
const AppointmentsList = lazy(() =>
  import("./components/appointments/AppointmentsList.jsx")
);
const NewAppointment = lazy(() =>
  import("./components/appointments/NewAppointment.jsx")
);
const MessagesList = lazy(() =>
  import("./components/messages/MessagesList.jsx")
);
const PatientsList = lazy(() =>
  import("./components/patients/PatientsList.jsx")
);
const PatientDetails = lazy(() =>
  import("./components/patients/PatientDetails.jsx")
);
const AddPatient = lazy(() => import("./components/patients/AddPatient.jsx"));
const TriageList = lazy(() => import("./components/triage/TriageList.jsx"));
const NewTriage = lazy(() => import("./components/triage/NewTriage.jsx"));
const MedicalRecordsList = lazy(() =>
  import("./components/records/MedicalRecordsList.jsx")
);
const NewRecord = lazy(() => import("./components/records/NewRecord.jsx"));
const DoctorSettings = lazy(() =>
  import("./components/settings/DoctorSettings.jsx")
);
const DoctorProfile = lazy(() =>
  import("./components/profile/DoctorProfile.jsx")
);
const CallHandler = lazy(() =>
  import("./components/video-call/CallHandler.jsx").then((m) => ({
    default: m.CallHandler,
  }))
);

const fallback = (
  <div className="flex min-h-screen items-center justify-center bg-slate-50 text-slate-600">
    Loading…
  </div>
);

const withSuspense = (node) => <Suspense fallback={fallback}>{node}</Suspense>;

const router = createBrowserRouter([
  {
    path: "/",
    element: withSuspense(<DoctorLogin />),
  },
  {
    path: "/login",
    element: withSuspense(<DoctorLogin />),
  },
  {
    path: "/forgot-password",
    element: withSuspense(<ForgotPassword />),
  },
  {
    path: "/dashboard",
    element: withSuspense(<Layout />),
    children: [
      { path: "", element: withSuspense(<Dashboard />) },
      { path: "appointments", element: withSuspense(<AppointmentsList />) },
      { path: "appointments/new", element: withSuspense(<NewAppointment />) },
      { path: "messages", element: withSuspense(<MessagesList />) },
      { path: "patients", element: withSuspense(<PatientsList />) },
      { path: "patients/:id", element: withSuspense(<PatientDetails />) },
      { path: "patients/add", element: withSuspense(<AddPatient />) },
      { path: "triage", element: withSuspense(<TriageList />) },
      { path: "triage/new", element: withSuspense(<NewTriage />) },
      { path: "records", element: withSuspense(<MedicalRecordsList />) },
      { path: "records/new", element: withSuspense(<NewRecord />) },
      { path: "settings", element: withSuspense(<DoctorSettings />) },
      { path: "profile", element: withSuspense(<DoctorProfile />) },
    ],
  },
  { path: "*", element: withSuspense(<Error />) },
]);

function App() {
  return (
    <AuthProvider>
      <CallProvider>
        <Suspense fallback={null}>
          <CallHandler />
        </Suspense>
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
