import React, { useState, useEffect } from "react";
import { Menu, X, User, LogOut } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  // Close mobile menu if screen resizes to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) setIsOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleLogout = () => {
    logout();
    setIsOpen(false);
    navigate("/login");
  };

  const navItems = [
    { name: "Dashboard", path: "/dashboard" },
    { name: "Build Resume", path: "/build-resume" },
    { name: "My Resumes", path: "/view-resume" },
    { name: "Cover Letters", path: "/build-cover-letter" },
    { name: "My Letters", path: "/view-cover-letter" }
  ];

  const linkClass = ({ isActive }) =>
    `font-medium transition-colors px-3 py-2 rounded-lg ${
      isActive 
        ? "text-blue-600 bg-blue-50" 
        : "text-gray-600 hover:text-blue-600 hover:bg-gray-50"
    }`;

  return (
    <nav className="fixed top-4 left-0 w-full z-50 px-4">
      <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-xl max-w-7xl mx-auto px-6 py-4 flex justify-between items-center border border-white/20">
        {/* Logo */}
        <NavLink to="/dashboard" className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          RESUMIZER
        </NavLink>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-6">
          {navItems.map((item, i) => (
            <NavLink key={i} to={item.path} className={linkClass}>
              {item.name}
            </NavLink>
          ))}
          
          {/* User Menu */}
          <div className="flex items-center gap-4 ml-4 pl-4 border-l border-gray-200">
            <div className="flex items-center gap-2 text-gray-700">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                <User size={16} className="text-white" />
              </div>
              <span className="font-medium">{user?.fullname || 'User'}</span>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-gray-600 hover:text-red-600 font-medium transition bg-transparent border-none cursor-pointer"
            >
              <LogOut size={16} />
              Logout
            </button>
          </div>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-gray-700"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden mt-2 bg-white/90 backdrop-blur-md rounded-2xl shadow-xl max-w-7xl mx-auto overflow-hidden border border-white/20"
          >
            <div className="flex flex-col p-6 gap-4">
              {/* User Info */}
              <div className="flex items-center gap-3 pb-4 border-b border-gray-200">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                  <User size={20} className="text-white" />
                </div>
                <div>
                  <p className="font-semibold text-gray-800">{user?.fullname || 'User'}</p>
                  <p className="text-sm text-gray-600">{user?.email}</p>
                </div>
              </div>
              
              {/* Navigation Items */}
              {navItems.map((item, i) => (
                <NavLink
                  key={i}
                  to={item.path}
                  className={linkClass}
                  onClick={() => setIsOpen(false)}
                >
                  {item.name}
                </NavLink>
              ))}
              
              {/* Logout Button */}
              <button
                onClick={() => {
                  handleLogout();
                  setIsOpen(false);
                }}
                className="flex items-center gap-2 text-red-600 hover:text-red-700 font-medium transition bg-transparent border-none text-left cursor-pointer pt-4 border-t border-gray-200"
              >
                <LogOut size={16} />
                Logout
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
