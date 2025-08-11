import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const clientId = process.env.REACT_APP_CLIENT_ID; // Must be in .env

export default function Signin() {
  const navigate = useNavigate();

  useEffect(() => {
    // Ensure Google script is loaded
    const loadGoogleScript = () => {
      const script = document.createElement("script");
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.defer = true;
      script.onload = initGoogle;
      document.body.appendChild(script);
    };

    const initGoogle = () => {
      /* global google */
      if (window.google && clientId) {
        google.accounts.id.initialize({
          client_id: clientId,
          callback: handleGoogleResponse,
        });

        google.accounts.id.renderButton(
          document.getElementById("googleSignUpDiv"),
          { theme: "outline", size: "large", shape: "pill" }
        );
      } else {
        console.error("Google API not loaded or CLIENT_ID missing");
      }
    };

    loadGoogleScript();
  }, []);

  const handleGoogleResponse = (response) => {
    console.log("Google token:", response.credential);
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-white to-indigo-50 px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white shadow-lg rounded-2xl p-8 max-w-md w-full"
      >
        <h2 className="text-3xl font-bold text-center text-indigo-600">Sign Up</h2>
        <p className="text-gray-500 text-center mt-2">
          Create your account and start building your resume today.
        </p>

        <form className="mt-6 space-y-4">
          <input
            type="text"
            placeholder="Full Name"
            className="w-full px-4 py-3 border rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
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
            Sign Up
          </button>
        </form>

        <div className="my-6 flex items-center">
          <hr className="flex-1 border-gray-300" />
          <span className="px-3 text-gray-500 text-sm">OR</span>
          <hr className="flex-1 border-gray-300" />
        </div>

        <div id="googleSignUpDiv" className="flex justify-center"></div>

        <p className="text-sm text-center mt-6">
          Already have an account?{" "}
          <a href="/login" className="text-indigo-600 hover:underline">
            Login
          </a>
        </p>
      </motion.div>
    </div>
  );
}
