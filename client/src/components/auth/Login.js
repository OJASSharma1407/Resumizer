import React, { useEffect,useState } from "react";
import { motion } from "framer-motion";
import { useNavigate,Link } from "react-router-dom";
const clientId = process.env.REACT_APP_CLIENT_ID;

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errMsg, setErrMsg] = useState("");

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
  useEffect(() => {
      if (errMsg) {
        const timer = setTimeout(() => setErrMsg(""), 3000);
        return () => clearTimeout(timer);
      }
  }, [errMsg]);

const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const res = await fetch('http://localhost:5000/user-auth/logIn', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const data = await res.text(); // ✅ parse JSON properly

    if (res.ok) {
      console.log("Login response:", data); // debug
      localStorage.setItem("token", data || data.token); // ✅ store the actual token key your backend returns
      navigate('/dashboard');
    } else {
      setErrMsg(data.error || "Login failed");
    }
  } catch (err) {
    console.log(err);
    setErrMsg("Something went wrong. Please try again.");
  }
};


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
        <h2 className="text-3xl font-bold text-center text-indigo-600">Login</h2>
        <p className="text-gray-500 text-center mt-2">
          Welcome back! Please sign in to your account.
        </p>

        {/* Email/Password Form */}
        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            className="w-full px-4 py-3 border rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={email}
            onChange={(e)=>setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full px-4 py-3 border rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={password}
            onChange={(e)=>setPassword(e.target.value)}
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
          <Link to="/" className="text-indigo-600 hover:underline">
            Sign up
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
