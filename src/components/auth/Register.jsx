import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context";
import { FaSignInAlt, FaEye, FaEyeSlash } from "react-icons/fa";

function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);
      await register(email, password);
      navigate("/login");
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center bg-gray-100 px-4 min-h-screen">
      <div className="bg-white shadow-lg p-8 rounded-lg w-full max-w-md h-full">
        <div className="flex justify-center mb-4">
          <Link to="/">
            <img
              src="../assets/images/mpiloLogo.png"
              alt="Mpilo Logo"
              className="h-12"
            />
          </Link>
        </div>

        <div className="mb-6 text-center">
          <h2 className="font-semibold text-gray-800 text-xl">Mpilo Mobile</h2>
          <p className="text-gray-500 text-sm">Register your account now.</p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="email"
              className="block font-medium text-gray-700 text-sm"
            >
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
            <label
              htmlFor="password"
              className="block font-medium text-gray-700 text-sm"
            >
              Password
            </label>
            <div className="flex items-center mt-1 px-3 border rounded-md">
              <FaLock className="mr-2 text-gray-400" />
              <input
                type="password"
                id="password"
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

          <div>
            <label
              htmlFor="confirmPassword"
              className="block font-medium text-gray-700 text-sm"
            >
              Confirm Password
            </label>
            <div className="flex items-center mt-1 px-3 border rounded-md">
              <FaUnlockAlt className="mr-2 text-gray-400" />
              <input
                type="password"
                id="confirmPassword"
                placeholder="Confirm password"
                className="w-full outline-none bg-transparent text-sm"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="focus:outline-none text-gray-400 ml-2"
              >
                {showConfirmPassword ? <FaEyeSlash size={20}/> : <FaEye size={20} />}
              </button>
            </div>
          </div>

          {/* Mobile Number */}
          <div>
            <label
              htmlFor="mobileNumber"
              className="block font-medium text-gray-700 text-sm"
            >
              Mobile Number
            </label>
            <div className="flex items-center mt-1 px-3 border rounded-md">
              <FaPhone className="mr-2 text-gray-400" />
              <input
                type="text"
                id="mobileNumber"
                placeholder="Enter mobile number"
                className="w-full py-2 outline-none text-sm"
                value={mobileNumber}
                onChange={(e) => setMobileNumber(e.target.value)}
              />
            </div>
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-600">
            <input type="checkbox" id="customSwitchSuccess" className="mt-0.5" />
            <label htmlFor="customSwitchSuccess" className="flex items-center">
              By registering you agree to the{" "}
              <Link to="#" className="ml-1 text-primary hover:underline">
                Terms of Use
              </Link>
            </label>
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-red-500 text-white py-2 rounded-[0.8rem] hover:opacity-90 transition flex items-center justify-center gap-2"
          >
            {loading ? "Registering..." : "Register"} <FaSignInAlt />
          </button>
        </form>

        <div className="mt-6 text-gray-600 text-sm text-center">
          Already have an account?
          <Link
            to="/login"
            className="ml-2 font-medium text-primary hover:underline"
          >
            Log in
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Register;