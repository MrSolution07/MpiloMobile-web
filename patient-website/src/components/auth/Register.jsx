import { useState } from "react";
import { FaEye, FaEyeSlash, FaSignInAlt } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context";

function Register() {
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
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
      const fullName = `${firstname.trim()} ${lastname.trim()}`.trim();
      await register(email.trim().toLowerCase(), password, fullName);
      alert(
        "Registration successful! Please check your email to confirm your account."
      );
      navigate("/login");
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="bg-white shadow-lg h-full rounded-lg w-full max-w-md p-8">
        <div className="flex justify-center mb-4">
          <Link to="/">
            <img
              src="../assets/images/mpiloLogo.png"
              alt="Mpilo Logo"
              className="h-12"
            />
          </Link>
        </div>

        <div className="text-center mb-6">
          <h2 className="text-xl font-semibold text-gray-800">Mpilo Mobile</h2>
          <p className="text-sm text-gray-500">Register your account now.</p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* First Name */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              First Name
            </label>
            <div className="flex items-center border border-gray-300 rounded-md px-3 mt-1 hover:rounded-none">
              <input
                type="letters"
                id="firstname"
                placeholder="Enter first name"
                className="w-full py-2 outline-none text-sm"
                value={firstname}
                onChange={(e) => setFirstname(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Last Name */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Last Name
            </label>
            <div className="flex items-center border border-gray-300 rounded-md px-3 mt-1 hover:rounded-none">
              <input
                type="letters"
                id="lastname"
                placeholder="Enter last name"
                className="w-full py-2 outline-none text-sm"
                value={lastname}
                onChange={(e) => setLastname(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <div className="flex items-center border border-gray-300 rounded-md px-3 mt-1 hover:rounded-none">
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

          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <div className="flex items-center mt-1 border border-gray-300 rounded-md px-3 py-2 bg-white hover:rounded-none">
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
                {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-gray-700"
            >
              Confirm Password
            </label>
            <div className="flex items-center mt-1 border border-gray-300 rounded-md px-3 py-2 bg-white hover:rounded-none">
              <input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
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
                {showConfirmPassword ? (
                  <FaEyeSlash size={20} />
                ) : (
                  <FaEye size={20} />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Number */}
          <div>
            <label
              htmlFor="mobileNumber"
              className="block text-sm font-medium text-gray-700"
            >
              Mobile Number
            </label>
            <div className="flex items-center border border-gray-300 rounded-md px-3 mt-1 hover:rounded-none">
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
            <input
              type="checkbox"
              id="customSwitchSuccess"
              className="mt-0.5"
            />
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

        <div className="text-center mt-6 text-sm text-gray-600">
          Already have an account?
          <Link
            to="/login"
            className="ml-2 text-primary font-medium hover:underline"
          >
            Log in
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Register;
