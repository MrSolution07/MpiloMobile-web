import { Preloader } from "@/components";
import { useAuth } from "@/context";
import { Navigate, Outlet } from "react-router-dom";

function AuthLayout({ allowedRoles = [] }) {
  const { user, loading, isLoggedIn } = useAuth();

  if (loading) return <Preloader />;

  // if not logged in redirect to login
  if (!isLoggedIn) return <Navigate to="/login" replace />;

  // extract current user's roles
  const userRoles = user.roles?.map((r) => r.role?.name) ?? [];

  // check if allowedRoles is empty (no restriction) OR user has at least one required role
  const isAllowed =
    allowedRoles.length === 0 ||
    userRoles.some((role) => allowedRoles.includes(role));

  // redirect or show "not authorized"
  // TODO: add a `/unauthorized` route component/page
  if (!isAllowed) return <Navigate to="/unauthorized" replace />;

  return <Outlet />;
}

export default AuthLayout;
