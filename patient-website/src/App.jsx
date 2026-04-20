import { lazy, Suspense } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Toaster } from "./components/admin/ui/toaster";
import { Toaster as Sonner } from "./components/admin/ui/sonner";
import { TooltipProvider } from "./components/admin/ui/tooltip";
import { QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "./context";
import { queryClient } from "./queryClient";
import { LegacyStylesDeferred } from "./components/LegacyStylesDeferred";
import { Preloader } from "./components/preloader";

const Home = lazy(() => import("./pages/Home"));
const Services = lazy(() => import("./pages/Services"));
const About = lazy(() => import("./pages/About"));
const Clients = lazy(() => import("./pages/Clients"));
const Gallery = lazy(() => import("./pages/Gallery"));
const Contact = lazy(() => import("./pages/Contact"));
const Error = lazy(() => import("./pages/Error"));
const UserDashboard = lazy(() => import("./pages/UserDashboard"));
const DoctorProfile = lazy(() =>
  import("./components/doctorProfile/DoctorProfile")
);
const AppointmentDetails = lazy(() =>
  import("./components/appointments/AppointmentDetails")
);
const UserAppointment = lazy(() =>
  import("./components/appointments/UserAppointment")
);
const Register = lazy(() => import("./components/auth/Register"));
const Login = lazy(() => import("./components/auth/Login"));
const ForgotPassword = lazy(() => import("./components/auth/ForgotPassword"));

const routeFallback = <Preloader />;

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <Suspense fallback={routeFallback}>
        <Home />
      </Suspense>
    ),
  },
  {
    path: "/services",
    element: (
      <Suspense fallback={routeFallback}>
        <Services />
      </Suspense>
    ),
  },
  {
    path: "/about",
    element: (
      <Suspense fallback={routeFallback}>
        <About />
      </Suspense>
    ),
  },
  {
    path: "/clients",
    element: (
      <Suspense fallback={routeFallback}>
        <Clients />
      </Suspense>
    ),
  },
  {
    path: "/gallery",
    element: (
      <Suspense fallback={routeFallback}>
        <Gallery />
      </Suspense>
    ),
  },
  {
    path: "/contact",
    element: (
      <Suspense fallback={routeFallback}>
        <Contact />
      </Suspense>
    ),
  },
  {
    path: "/register",
    element: (
      <Suspense fallback={routeFallback}>
        <Register />
      </Suspense>
    ),
  },
  {
    path: "/login",
    element: (
      <Suspense fallback={routeFallback}>
        <Login />
      </Suspense>
    ),
  },
  {
    path: "/forgot-password",
    element: (
      <Suspense fallback={routeFallback}>
        <ForgotPassword />
      </Suspense>
    ),
  },
  {
    path: "/Userdashboard",
    element: (
      <Suspense fallback={routeFallback}>
        <UserDashboard />
      </Suspense>
    ),
  },
  {
    path: "/doctor-profile",
    element: (
      <Suspense fallback={routeFallback}>
        <DoctorProfile />
      </Suspense>
    ),
  },
  {
    path: "/appointment-details",
    element: (
      <Suspense fallback={routeFallback}>
        <AppointmentDetails />
      </Suspense>
    ),
  },
  {
    path: "/Userappointment",
    element: (
      <Suspense fallback={routeFallback}>
        <UserAppointment />
      </Suspense>
    ),
  },

  {
    path: "*",
    element: (
      <Suspense fallback={routeFallback}>
        <Error />
      </Suspense>
    ),
  },
]);

function App() {
  return (
    <AuthProvider>
      <LegacyStylesDeferred />
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
