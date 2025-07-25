import { Link } from "react-router-dom";
import { TbStethoscope } from "react-icons/tb";
import { FaEnvelope, FaLock, FaSignInAlt } from "react-icons/fa";

function AdminLogin() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white shadow-lg rounded-lg w-full max-w-md p-8">
        <div className="flex justify-center mb-6">
          <Link to="/">
            <img
              src="../assets/images/mpiloLogo.png"
              alt="Mpilo Logo"
              className="h-12"
            />
          </Link>
        </div>

        <div className="text-center mb-6">
          <h2 className="text-xl font-semibold text-gray-800">
            Administrator Login
          </h2>
          <p className="text-sm text-gray-500">
            Sign in to continue to Mpilo Mobile
          </p>
        </div>

        <form className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <div className="flex items-center border rounded-md px-3 mt-1">
              <FaEnvelope className="text-gray-400 mr-2" />
              <input
                type="email"
                id="email"
                placeholder="Enter email"
                className="w-full py-2 outline-none text-sm"
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <div className="flex items-center border rounded-md px-3 mt-1">
              <FaLock className="text-gray-400 mr-2" />
              <input
                type="password"
                id="password"
                placeholder="Enter password"
                className="w-full py-2 outline-none text-sm"
              />
            </div>
          </div>

          <div className="flex justify-between items-center text-sm mt-2">
            <label className="flex items-center text-gray-600">
              <input type="checkbox" className="form-checkbox text-[#274D60] mr-2" />
              Remember me
            </label>
            <Link to="/forgot-password" className="text-primary hover:underline">
              Forgot password?
            </Link>
          </div>

          <Link to="/admin">
          <button
            type="button"
            className="w-full bg-[#274D60] text-white py-2 rounded-md mt-4 hover:opacity-90 transition flex items-center justify-center gap-2"
          >
            Log In <FaSignInAlt />
          </button>
          </Link>
        </form>

        <div className="flex justify-center mt-6">
          <Link to="/Login">
            <button
              className="flex items-center gap-2 px-4 py-2 border rounded-md text-[#274D60] border-[#274D60] hover:bg-[#274D60] hover:text-white transition"
            >
              <TbStethoscope size={18} />
              I'm a practitioner
            </button>
          </Link>
        </div>

        <div className="text-center mt-6 text-sm">
          <p className="text-gray-500">
            Don't have an account?
            <Link
              to="/Register"
              className="ml-1 px-1 py-1 rounded-md bg-[#274D60] text-primary font-medium hover:opacity-90"
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
