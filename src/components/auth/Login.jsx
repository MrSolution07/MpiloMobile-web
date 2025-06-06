import { Link } from "react-router-dom";
import { RiAdminFill } from "react-icons/ri";
import { FaUser, FaLock, FaSignInAlt } from "react-icons/fa";

function Login() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-md p-6">
        <div className="flex justify-center mb-6">
          <Link to="/">
            <img
              src="../assets/images/mpiloLogo.png"
              alt="Mpilo Logo"
              className="h-14 w-auto"
            />
          </Link>
        </div>

        <div className="text-center mb-6">
          <h2 className="text-xl font-bold text-gray-800">
            Healthcare Practitioner Login
          </h2>
          <p className="text-sm text-gray-500">
            Sign in to continue to Mpilo Mobile
          </p>
        </div>

        <form className="space-y-4">
          {/* Username */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <div className="flex items-center mt-1 border border-gray-300 rounded-md px-3 py-2 bg-white">
              <FaUser className="text-gray-400 mr-2" />
              <input
                id="email"
                type="text"
                placeholder="Enter email"
                className="w-full outline-none bg-transparent text-sm"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="userpassword"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <div className="flex items-center mt-1 border border-gray-300 rounded-md px-3 py-2 bg-white">
              <FaLock className="text-gray-400 mr-2" />
              <input
                id="userpassword"
                type="password"
                placeholder="Enter password"
                className="w-full outline-none bg-transparent text-sm"
              />
            </div>
          </div>

            <div className="flex justify-between items-center text-sm mt-2">
            <label className="flex items-center text-gray-600">
              <input type="checkbox" className="form-checkbox text-[#274D60] mr-2" />
              Remember me
            </label>
            <a href="/forgot-password" className="text-primary hover:underline">
              Forgot password?
            </a>
          </div>

          {/* Login Button */}
          <Link to="/Dashboard">
          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#274D60] to-[#274D60] text-white py-2 rounded-md hover:opacity-90 transition"
          >
            Log In <FaSignInAlt />
          </button>
          </Link>
        </form>

        {/* Register & Admin */}
        <div className="mt-6 text-center text-sm text-gray-600">
          Don't have an account?
          <Link to="/Register" className="text-primary ml-1 hover:underline">
            Register
          </Link>
        </div>

        <div className="mt-4 flex justify-center">
          <Link to="/AdminLogin">
            <button className="flex items-center gap-2 px-4 py-2 border border-[#274D60] text-[#274D60] rounded-md hover:bg-blue-50 transition">
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
