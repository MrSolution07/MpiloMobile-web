import { useState } from "react";
import { Link } from "react-router-dom";
import { FaSignInAlt,FaEye,FaEyeSlash } from "react-icons/fa";

function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post(`${API_URL}/register`, {
        email,
        password,
        confirmPassword,
        mobileNumber,
      })
      .then((response) => console.log(response))
      .catch((err) => console.log(err));
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="bg-white shadow-lg h-full rounded-lg w-full max-w-md p-8">
        <div className="flex justify-center mb-4">
          <Link 
            to="/">
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
           {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <div className="flex items-center border border-gray-300 rounded-md px-3 mt-1 hover:rounded-none">
              <input
                type="email"
                id="email"
                placeholder="Enter email"
                className="w-full py-2 outline-none text-sm"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
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

          {/* Confirm Password */}
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
              Confirm Password
            </label>
            <div className="flex items-center mt-1 border border-gray-300 rounded-md px-3 py-2 bg-white hover:rounded-none">
              <input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm password"
                className="w-full outline-none bg-transparent text-sm"
                onChange={(e) => setConfirmPassword(e.target.value)}
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
            <label htmlFor="mobileNumber" className="block text-sm font-medium text-gray-700">
              Mobile Number
            </label>
            <div className="flex items-center border border-gray-300 rounded-md px-3 mt-1 hover:rounded-none">
              <input
                type="text"
                id="mobileNumber"
                placeholder="Enter mobile number"
                className="w-full py-2 outline-none text-sm"
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

          <button
            type="submit"
            className="w-full bg-[#274D60] text-white py-2 rounded-md hover:opacity-90 transition flex items-center justify-center gap-2"
          >
            Register <FaSignInAlt />
          </button>
        </form>

        <div className="text-center mt-6 text-sm text-gray-600">
          Already have an account?
          <Link to="/login" className="ml-2 text-primary font-medium hover:underline">
            Log in
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Register;
