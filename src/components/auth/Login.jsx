import { useState } from "react";
import { User, LogIn, UserCog} from "lucide-react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate,Link } from "react-router-dom";


function Login() {
  const [isPractitioner, setIsPractitioner] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const handleLogin = () => {
    if (isPractitioner) {
      navigate("/Dashboard");
    } else {
      navigate("/UserDashboard"); 
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
        <div className="space-y-4">
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
            <button onClick={() => setIsPractitioner(!isPractitioner)} className="flex items-center text-gray-600">
              <input type="checkbox" checked={isPractitioner} onChange={() => setIsPractitioner(!isPractitioner)} className="form-checkbox text-white mr-2" />
              Remember Me
            </button>
            <button className="text-primary font-medium hover:underline">
              Forgot Password?
            </button>
          </div>

          {/* Login Button */}
          <button
          onClick={handleLogin}
          type="button"
          className="w-full bg-[#274D60] text-white hover:opacity-90 text-gray-800 font-semibold py-2 rounded-md transition flex items-center justify-center gap-2 border border-gray-300"
        >
          Login <LogIn size={16} />
        </button>

        </div>

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
          <button className="flex items-center gap-2 px-4 py-2 border border-[#274D60] text-[#274D60] rounded-md hover:bg-blue-50 transition" onClick={() => navigate("/AdminLogin")}>
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