import React, { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { NavLink, useNavigate } from "react-router-dom";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  // Close mobile menu if screen resizes to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) setIsOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    console.log("Logged out!");
    setIsOpen(false);
    navigate("/login");
  };

  const navItems = [
    { name: "Build Resume", path: "/build-resume" },
    { name: "Resumes", path: "/view-resume" },
    { name: "AI resumes", path: "/view-ai-resume" },
    { name: "Build CoverLetter", path: "/build-cover-letter" },
    { name: "CoverLetters", path: "/view-cover-letter" },
    { name: "Logout", handler: handleLogout }
  ];

  const linkClass = ({ isActive }) =>
    `font-medium transition ${
      isActive ? "text-indigo-600" : "text-gray-600 hover:text-indigo-600"
    }`;

  return (
    <nav className="fixed top-4 left-0 w-full z-50 px-4">
      <div className="bg-white rounded-full shadow-lg max-w-7xl mx-auto px-4 md:px-6 py-3 flex justify-between items-center">
        {/* Logo */}
        <NavLink to="/dashboard" className="text-2xl font-bold text-indigo-600">
          RESUMIZER
        </NavLink>

        {/* Desktop Menu */}
        <div className="hidden md:flex gap-6">
          {navItems.map((item, i) =>
            item.handler ? (
              <button
                key={i}
                onClick={item.handler}
                className="text-gray-600 hover:text-indigo-600 font-medium transition bg-transparent border-none cursor-pointer"
              >
                {item.name}
              </button>
            ) : (
              <NavLink key={i} to={item.path} className={linkClass}>
                {item.name}
              </NavLink>
            )
          )}
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
            className="md:hidden mt-2 bg-white rounded-2xl shadow-lg max-w-7xl mx-auto overflow-hidden"
          >
            <div className="flex flex-col p-4 gap-4">
              {navItems.map((item, i) =>
                item.handler ? (
                  <button
                    key={i}
                    onClick={() => {
                      item.handler();
                      setIsOpen(false);
                    }}
                    className="text-gray-600 hover:text-indigo-600 font-medium transition bg-transparent border-none text-left cursor-pointer"
                  >
                    {item.name}
                  </button>
                ) : (
                  <NavLink
                    key={i}
                    to={item.path}
                    className={linkClass}
                    onClick={() => setIsOpen(false)}
                  >
                    {item.name}
                  </NavLink>
                )
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
