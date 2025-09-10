import { useState } from "react";
import { User, LogIn } from "lucide-react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context";

function Login() {
  const [showPassword, setShowPassword] = useState(false);
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
      navigate("/UserDashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-6 border border-gray-200">
        <div className="flex justify-center mb-6">
          <div>
            <img
              src="../assets/images/mpiloLogo.png"
              alt="Mpilo Logo"
              className="h-14 w-auto"
              onClick={() => navigate("/")}
            />
          </div>
        </div>

        <div className="text-center mb-4">
          <h2 className="text-2xl font-extrabold text-gray-800">Welcome Back</h2>
          <p className="text-sm text-gray-500">Sign in to continue your health journey</p>
        </div>

        <div className="flex items-center justify-center bg-green-50 rounded-xl px-4 py-2 mb-5 shadow-inner">
          <span className="flex items-center gap-2 text-green-800 font-medium text-sm">
            <User size={16} /> Patient Portal
          </span>
        </div>

        {/* Form */}
        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <div className="flex items-center mt-1 border border-gray-300 rounded-md px-3 py-2 bg-white hover:rounded-none">
              <input
                id="email"
                type="text"
                placeholder="Enter email"
                className="w-full outline-none bg-transparent text-sm"
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
                {showPassword ? <FaEyeSlash size={20}/> : <FaEye size={20} />}
              </button>
            </div>
          </div>

          {/* Remember & Forgot */}
          <div className="flex justify-between items-center text-sm">
            <label className="flex items-center text-gray-600">
              <input type="checkbox" className="form-checkbox text-white mr-2" />
              Remember Me
            </label>
            <Link to="/forgot-password" className="text-primary font-medium hover:underline">
              Forgot Password?
            </Link>
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          {/* Login Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-500 text-white hover:opacity-90 font-semibold py-2 rounded-[0.8rem] transition flex items-center justify-center gap-2 border border-gray-300"
          >
            {loading ? "Logging in..." : "Patient Login"} <LogIn size={16} />
          </button>
        </form>
        {/* <div className="text-center mt-6 text-sm">
          <p className="text-gray-500">
            Don't have an account?
            <Link
              to="/Register"
              className="ml-1 px-1 py-1 rounded-md text-primary font-medium hover:opacity-90"
            >
              Register
            </Link>
          </p>
        </div> */}
      </div>
    </div>
  );
}

export default Login;