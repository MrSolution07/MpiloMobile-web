import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./Pages/Home";
import Services from "./Pages/Services";
import About1 from "./Pages/About-1";
import Clients from "./Pages/Clients";
import Gallery from "./Pages/Gallery";
import Contact from "./Pages/Contact";
import Register from "./Component/JoinNow/Register";
import LoginPage from "./Component/ProfileLogin/Login";
import AdminLogin from "./Component/ProfileLogin/AdminLogin";
import Forgotpsw from "./Component/ProfileLogin/Forgotpsw";
import Error from "./Pages/Error";



const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/LoginPage",
    element: <LoginPage />,
  },
   {
    path: "/adminLogin",
    element: <AdminLogin />,
  },
  {
    path: "/Forgotpsw",
    element: <Forgotpsw />,
  },
  {
    path: "/Register",
    element: <Register />,
  },
  {
    path: "/services",
    element: <Services />,
  },
  {
    path: "/about-1",
    element: <About1 />,
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
    path: "*",
    element: <Error />,
  },
]);

function Routers() {
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default Routers;
