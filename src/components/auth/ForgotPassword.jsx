import React from 'react';
import { Link } from 'react-router-dom';


function ForgotPassword() {
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
            Reset Password For Mpilo Mobile
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Enter your Email and instructions will be sent to you!
          </p>
        </div>

        <form className="space-y-4">
          <div>
            <label htmlFor="useremail" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <div className="flex items-center border rounded-md px-3 mt-1">
              <i className="dripicons-mail text-gray-400 mr-2"></i>
              <input
                type="email"
                id="useremail"
                placeholder="Enter Email"
                className="w-full py-2 outline-none text-sm"
              />
            </div>
          </div>

          <button
            type="button"
            className="w-full bg-red-500 text-white py-2 rounded-[0.8rem] mt-2 hover:opacity-90 transition"
          >
            Reset <i className="fas fa-sign-in-alt ml-2"></i>
          </button>
        </form>

        <div className="text-center mt-6 text-sm">
          <p className="text-gray-500">
            Remember it?
            <Link to="/login" className="ml-2 text-primary font-medium hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
