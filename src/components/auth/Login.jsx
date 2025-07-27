import { useState } from "react";
import { User, LogIn, UserCog} from "lucide-react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context";

function Login() {
  const [isPractitioner, setIsPractitioner] = useState(false);
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
      if (isPractitioner) {
        navigate("/Dashboard");
      } else {
        navigate("/UserDashboard");
      }
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

        <div className="flex items-center justify-between bg-gray-100 rounded-xl px-4 py-2 mb-5 shadow-inner">
          <span className="flex items-center gap-2 text-gray-800 font-medium text-sm">
            <User size={16} /> Healthcare Practitioner
          </span>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={isPractitioner}
              onChange={() => setIsPractitioner(!isPractitioner)}
            />
            <div className={`relative w-11 h-6 peer-focus:outline-none rounded-full transition duration-300 ${isPractitioner ? 'bg-red-600' : 'bg-gray-300'}`}>
              <div className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform duration-300 shadow-sm ${isPractitioner ? 'translate-x-5' : ''}`}></div>
            </div>
          </label>
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
            className="w-full bg-red-500 text-white hover:opacity-90 font-semibold py-2 rounded-[0.8rem] transition flex items-center justify-center gap-2 border border-gray-300"
          >
            {loading ? "Logging in..." : "Login"} <LogIn size={16} />
          </button>
        </form>

        {/* Divider */}
        <div className="my-4 flex items-center">
          <span className="flex-1 h-px bg-gray-200"></span>
          <span className="px-4 text-sm text-gray-500 whitespace-nowrap">or</span>
          <span className="flex-1 h-px bg-gray-200"></span>
        </div>

        {/* Google Sign-in */}
        <button className="w-full border border-gray-300 rounded-md py-2 flex items-center justify-center gap-2 text-sm font-medium hover:bg-gray-50">
          <img src="assets/images/google.png" alt="Google" className="w-5 h-5" />
          Continue with Google
        </button>

        {/* Admin Button */}
        <div className="mt-6 flex justify-center">
          <button className="flex items-center gap-2 px-4 py-2 border border-red-500 text-red-500 rounded-[0.8rem] hover:bg-red-50 transition" onClick={() => navigate("/AdminLogin")}>
            <UserCog size={18} />
            I'm an Admin
          </button>
        </div>
        <div className="text-center mt-6 text-sm">
          <p className="text-gray-500">
            Don't have an account?
            <Link
              to="/Register"
              className="ml-1 px-1 py-1 rounded-md text-primary font-medium hover:opacity-90"
            >
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;