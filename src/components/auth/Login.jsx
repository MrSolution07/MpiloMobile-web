import { Link, useNavigate } from "react-router-dom";
import { RiAdminFill } from "react-icons/ri";
import { FaUser, FaLock, FaSignInAlt } from "react-icons/fa";
import { useState } from "react";
import { useAuth } from "../../context";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      setLoading(true);
      await login(email.trim().toLowerCase(), password);
      navigate("/Dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center bg-gray-100 px-4 min-h-screen">
      <div className="bg-white shadow-md p-6 rounded-xl w-full max-w-md">
        <div className="flex justify-center mb-6">
          <Link to="/">
            <img
              src="../assets/images/mpiloLogo.png"
              alt="Mpilo Logo"
              className="w-auto h-14"
            />
          </Link>
        </div>

        <div className="mb-6 text-center">
          <h2 className="font-bold text-gray-800 text-xl">
            Healthcare Practitioner Login
          </h2>
          <p className="text-gray-500 text-sm">
            Sign in to continue to Mpilo Mobile
          </p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* Username */}
          <div>
            <label
              htmlFor="email"
              className="block font-medium text-gray-700 text-sm"
            >
              Email
            </label>
            <div className="flex items-center bg-white mt-1 px-3 py-2 border border-gray-300 rounded-md">
              <FaUser className="mr-2 text-gray-400" />
              <input
                id="email"
                type="text"
                placeholder="Enter email"
                className="bg-transparent outline-none w-full text-sm"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="userpassword"
              className="block font-medium text-gray-700 text-sm"
            >
              Password
            </label>
            <div className="flex items-center bg-white mt-1 px-3 py-2 border border-gray-300 rounded-md">
              <FaLock className="mr-2 text-gray-400" />
              <input
                id="userpassword"
                type="password"
                placeholder="Enter password"
                className="bg-transparent outline-none w-full text-sm"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="flex justify-between items-center mt-2 text-sm">
            <label className="flex items-center text-gray-600">
              <input
                type="checkbox"
                className="mr-2 text-[#274D60] form-checkbox"
              />
              Remember me
            </label>
            <Link
              to="/forgot-password"
              className="text-primary hover:underline"
            >
              Forgot password?
            </Link>
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          {/* Login Button */}
          <button
            type="submit"
            disabled={loading}
            className="flex justify-center items-center gap-2 bg-gradient-to-r from-[#274D60] to-[#274D60] hover:opacity-90 py-2 rounded-md w-full text-white transition"
          >
            {loading ? "Logging in..." : "Log In"} <FaSignInAlt />
          </button>
        </form>

        {/* Register & Admin */}
        <div className="mt-6 text-gray-600 text-sm text-center">
          Don't have an account?
          <Link to="/Register" className="ml-1 text-primary hover:underline">
            Register
          </Link>
        </div>

        <div className="flex justify-center mt-4">
          <Link to="/AdminLogin">
            <button className="flex items-center gap-2 hover:bg-blue-50 px-4 py-2 border border-[#274D60] rounded-md text-[#274D60] transition">
              <RiAdminFill className="text-lg" />
              I'm an Admin
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Login;