import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";

// Client ID must start with REACT_APP_ for CRA to read it
const clientId = process.env.REACT_APP_CLIENT_ID;
const Api = process.env.REACT_APP_API_URL;
export default function Signin() {
  const navigate = useNavigate();
  const [fullname, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errMsg, setErrMsg] = useState("");

  // Google Sign-In setup
  useEffect(() => {
    if (!clientId) {
      console.error("Google CLIENT_ID is missing. Check your .env file.");
      return;
    }

    const initGoogle = () => {
      if (window.google) {
        window.google.accounts.id.initialize({
          client_id: clientId,
          callback: handleGoogleResponse,
        });
        window.google.accounts.id.renderButton(
          document.getElementById("googleSignUpDiv"),
          { theme: "outline", size: "large", shape: "pill" }
        );
      }
    };

    // Inject script if not already present
    if (!document.querySelector("#google-gsi-script")) {
      const script = document.createElement("script");
      script.id = "google-gsi-script";
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.defer = true;
      script.onload = initGoogle;
      document.body.appendChild(script);
    } else {
      initGoogle();
    }
  }, );

  const handleGoogleResponse = (response) => {
    // You can send response.credential to your backend for verification
    console.log("Google credential: ", response.credential);
    navigate("/dashboard");
  };

  // Handle normal signup
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`${Api}/user-auth/signIn`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ fullname, email, password }),
      });

      if (res.ok) {
        navigate("/login");
      } else {
        const errorText = await res.json();
        setErrMsg(errorText.error || "Signup failed");
      }
    } catch (err) {
      console.error(err);
      setErrMsg("Something went wrong!");
    }
  };

  // Auto-clear error messages
  useEffect(() => {
    if (errMsg) {
      const timer = setTimeout(() => setErrMsg(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [errMsg]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-white to-indigo-50 px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white shadow-lg rounded-2xl p-8 max-w-md w-full"
      >
        {errMsg && (
          <div className="mb-4 text-sm text-center text-red-600 bg-red-100 py-2 px-4 rounded">
            {errMsg}
          </div>
        )}
        <h2 className="text-3xl font-bold text-center text-indigo-600">
          Sign Up
        </h2>
        <p className="text-gray-500 text-center mt-2">
          Create your account and start building your resume today.
        </p>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Full Name"
            className="w-full px-4 py-3 border rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={fullname}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="Email"
            className="w-full px-4 py-3 border rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full px-4 py-3 border rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
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

        {/* Google Button */}
        <div id="googleSignUpDiv" className="flex justify-center"></div>

        <p className="text-sm text-center mt-6">
          Already have an account?{" "}
          <Link to="/login" className="text-indigo-600 hover:underline">
            Login
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
