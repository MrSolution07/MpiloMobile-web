import { Link } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../../context";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { resetPassword } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setStatus("");

    try {
      setLoading(true);
      await resetPassword(email.trim().toLowerCase());
      setStatus("Password reset link sent! Check your email.");
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
            />
          </Link>
        </div>

        <div className="mb-6 text-center">
          <h2 className="font-semibold text-gray-800 text-xl">
            Reset Password For Mpilo Mobile
          </h2>
          <p className="mt-1 text-gray-500 text-sm">
            Enter your Email and instructions will be sent to you!
          </p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="useremail"
              className="block font-medium text-gray-700 text-sm"
            >
              Email
            </label>
            <div className="flex items-center mt-1 px-3 border rounded-md">
              <i className="mr-2 text-gray-400 dripicons-mail"></i>
              <input
                type="email"
                id="useremail"
                placeholder="Enter Email"
                className="py-2 outline-none w-full text-sm"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}
          {status && <p className="text-green-600 text-sm">{status}</p>}

          <button
            type="submit"
            disabled={loading}
            className="bg-[#274D60] hover:opacity-90 mt-2 py-2 rounded-md w-full text-white transition"
          >
            {loading ? "Sending..." : "Reset"}{" "}
            <i className="ml-2 fas fa-sign-in-alt"></i>
          </button>
        </form>

        <div className="mt-6 text-sm text-center">
          <p className="text-gray-500">
            Remember it?
            <Link
              to="/login"
              className="ml-2 font-medium text-primary hover:underline"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
