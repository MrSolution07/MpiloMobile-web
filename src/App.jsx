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
import { AppointmentsList,NewAppointment } from "./components/appointments";
import { MessagesList } from "./components/messages";
import { PatientsList, PatientDetails,AddPatient } from "./components/patients";
import { TriageList, NewTriage } from "./components/triage";
import { MedicalRecordsList, NewRecord } from "./components/records";

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
    ],
  },

  // Catch-all
  { path: "*", element: <Error /> },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
