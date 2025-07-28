
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { TbStethoscope } from "react-icons/tb";
import { FaSignInAlt, FaEye, FaEyeSlash } from "react-icons/fa";
import { useAuth } from "../../context";
import { FaEnvelope } from "react-icons/fa";

function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      setLoading(true);
      await login(email.trim().toLowerCase(), password);
      navigate("/admin");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center bg-gray-100 min-h-screen">
      <div className="bg-white shadow-lg p-8 rounded-lg w-full max-w-md">
        <div className="flex justify-center mb-6">
          <Link to="/">
            <img
              src="../assets/images/mpiloLogo.png"
              alt="Mpilo Logo"
              className="h-12"
              onClick={() => navigate("/")}
            />
          </Link>
        </div>

        <div className="mb-6 text-center">
          <h2 className="font-semibold text-gray-800 text-xl">
            Administrator Login
          </h2>
          <p className="text-gray-500 text-sm">
            Sign in to continue to Mpilo Mobile
          </p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <div className="flex items-center mt-1 px-3 border rounded-md">
              <FaEnvelope className="mr-2 text-gray-400" />

              <input
                type="email"
                id="email"
                placeholder="Enter email"
                className="w-full py-2 outline-none text-sm"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <div className="flex items-center mt-1 border border-gray-300 rounded-md px-3 py-2 hover:rounded-none">
              <input
                id="userpassword"
                type={showPassword ? "text" : "password"}
                placeholder="Enter password"
                className="w-full outline-none bg-transparent text-sm"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="focus:outline-none text-gray-400 ml-2"
              >
                {showPassword ? <FaEyeSlash size={20}/> : <FaEye size={20} />}
              </button>
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

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-red-500 text-white py-2 rounded-[0.8rem] mt-4 hover:opacity-90 transition flex items-center justify-center gap-2"
          >
            {loading ? "Logging in..." : "Log In"} <FaSignInAlt />
          </button>
        </form>

        <div className="mt-6 text-sm text-center">
          <p className="text-gray-500">
            Don't have an account?
            <Link
              to="/Register"
              className="bg-[#274D60] hover:opacity-90 ml-1 px-1 py-1 rounded-md font-medium text-primary"
            >
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default AdminLogin;
