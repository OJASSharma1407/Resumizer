import React, { useEffect } from "react";
import { motion } from "framer-motion";
const clientId = process.env.REACT_APP_OAUTH_ID;
export default function Login() {
  useEffect(() => {
    /* global google */
    google.accounts.id.initialize({
      client_id: clientId, // Replace with your client ID
      callback: handleGoogleResponse,
    });

    google.accounts.id.renderButton(
      document.getElementById("googleSignInDiv"),
      { theme: "outline", size: "large", shape: "pill" }
    );
  }, []);

  const handleGoogleResponse = (response) => {
    console.log("Google Response:", response);
    // Send token to your backend for verification
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-white to-indigo-50 px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white shadow-lg rounded-2xl p-8 max-w-md w-full"
      >
        <h2 className="text-3xl font-bold text-center text-indigo-600">Login</h2>
        <p className="text-gray-500 text-center mt-2">
          Welcome back! Please sign in to your account.
        </p>

        {/* Email/Password Form */}
        <form className="mt-6 space-y-4">
          <input
            type="email"
            placeholder="Email"
            className="w-full px-4 py-3 border rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full px-4 py-3 border rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white font-semibold py-3 rounded-full hover:bg-indigo-700 transition"
          >
            Sign In
          </button>
        </form>

        <div className="my-6 flex items-center">
          <hr className="flex-1 border-gray-300" />
          <span className="px-3 text-gray-500 text-sm">OR</span>
          <hr className="flex-1 border-gray-300" />
        </div>

        {/* Google Sign-In */}
        <div id="googleSignInDiv" className="flex justify-center"></div>

        <p className="text-sm text-center mt-6">
          Don't have an account?{" "}
          <a href="/signin" className="text-indigo-600 hover:underline">
            Sign up
          </a>
        </p>
      </motion.div>
    </div>
  );
}
