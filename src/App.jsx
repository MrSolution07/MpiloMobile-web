import { createBrowserRouter, RouterProvider } from "react-router-dom";

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
import { Layout } from "./components/layout";
import { Dashboard } from "./components/dashboard";
import { AppointmentsList } from "./components/appointments";
import { MessagesList } from "./components/messages";
import { PatientsList, PatientDetails } from "./components/patients";
import { TriageList } from "./components/triage";
import { MedicalRecordsList } from "./components/records";

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
        path: "triage",
        element: <TriageList />,
      },
      {
        path: "records",
        element: <MedicalRecordsList />,
      },
    ],
  },

  // Catch-all
  { path: "*", element: <Error /> },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
