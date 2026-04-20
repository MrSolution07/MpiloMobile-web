import { lazy, Suspense } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Toaster } from "./components/admin/ui/toaster";
import { Toaster as Sonner } from "./components/admin/ui/sonner";
import { TooltipProvider } from "./components/admin/ui/tooltip";
import { QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "./context";
import { queryClient } from "./queryClient";

const AdminLogin = lazy(() => import("./components/auth/AdminLogin.jsx"));
const ForgotPassword = lazy(() => import("./components/auth/ForgotPassword.jsx"));
const Error = lazy(() => import("./pages/Error.jsx"));
const AdminLayout = lazy(() =>
  import("./components/layout/admin/AdminLayout.jsx")
);
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard.jsx"));
const AdminPatients = lazy(() => import("./pages/admin/AdminPatients.jsx"));
const AdminDoctors = lazy(() => import("./pages/admin/AdminDoctors.jsx"));
const AdminRecords = lazy(() => import("./pages/admin/AdminRecords.jsx"));
const AdminNotFound = lazy(() => import("./pages/admin/AdminNotFound.jsx"));
const AdminAddPatient = lazy(() =>
  import("./pages/admin/AdminAddPatient.jsx")
);
const AdminAddDoctor = lazy(() => import("./pages/admin/AdminAddDoctor.jsx"));
const AdminAddRecord = lazy(() => import("./pages/admin/AdminAddRecord.jsx"));
const AdminMessages = lazy(() => import("./pages/admin/AdminMessages.jsx"));
const AdminSettings = lazy(() => import("./pages/admin/AdminSettings.jsx"));
const AdminProfile = lazy(() => import("./pages/admin/AdminProfile.jsx"));
const AdminInventory = lazy(() => import("./pages/admin/AdminInventory.tsx"));
const Routes = lazy(() => import("./pages/admin/AdminRoutes.jsx"));

const fallback = (
  <div className="flex min-h-screen items-center justify-center bg-slate-50 text-slate-600">
    Loading…
  </div>
);

const withSuspense = (node) => <Suspense fallback={fallback}>{node}</Suspense>;

const router = createBrowserRouter([
  {
    path: "/",
    element: withSuspense(<AdminLogin />),
  },
  {
    path: "/login",
    element: withSuspense(<AdminLogin />),
  },
  {
    path: "/forgot-password",
    element: withSuspense(<ForgotPassword />),
  },
  {
    path: "/admin",
    element: withSuspense(<AdminLayout />),
    children: [
      { path: "", element: withSuspense(<AdminDashboard />) },
      { path: "patients", element: withSuspense(<AdminPatients />) },
      { path: "doctors", element: withSuspense(<AdminDoctors />) },
      { path: "adminmessages", element: withSuspense(<AdminMessages />) },
      { path: "records", element: withSuspense(<AdminRecords />) },
      { path: "adminaddpatient", element: withSuspense(<AdminAddPatient />) },
      { path: "routes", element: withSuspense(<Routes />) },
      { path: "adminadddoctor", element: withSuspense(<AdminAddDoctor />) },
      { path: "adminaddrecord", element: withSuspense(<AdminAddRecord />) },
      { path: "adminsettings", element: withSuspense(<AdminSettings />) },
      { path: "adminprofile", element: withSuspense(<AdminProfile />) },
      { path: "admininventory", element: withSuspense(<AdminInventory />) },
      { path: "*", element: withSuspense(<AdminNotFound />) },
    ],
  },
  { path: "*", element: withSuspense(<Error />) },
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
