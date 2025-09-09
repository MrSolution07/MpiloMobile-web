import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Toaster } from "./components/admin/ui/toaster";
import { Toaster as Sonner } from "./components/admin/ui/sonner";
import { TooltipProvider } from "./components/admin/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "./context";

// Main site pages
import {
  Home,
  Services,
  About,
  Clients,
  Gallery,
  Contact,
  Error,
  UserDashboard,
} from "./pages";

// Import the new components
import DoctorProfile from "./components/doctorProfile/DoctorProfile";
import AppointmentDetails from "./components/appointments/AppointmentDetails";
import UserAppointment from "./components/appointments/UserAppointment";

import { Register, Login, ForgotPassword } from "./components/auth";

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
    path: "/forgot-password",
    element: <ForgotPassword />,
  },
  {
    path: "/Userdashboard",
    element: <UserDashboard />,
  },
  {
    path: "/doctor-profile",
    element: <DoctorProfile />,
  },
  {
    path: "/appointment-details",
    element: <AppointmentDetails />,
  },
  {
    path: "/Userappointment",
    element: <UserAppointment />, // Make sure to import this component too
  },

  // Catch-all
  { 
    path: "*", 
    element: <Error /> 
  },
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