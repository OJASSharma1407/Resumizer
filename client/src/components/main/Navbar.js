import React, { useState } from "react";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { name: "Home", href: "#home" },
    { name: "Features", href: "#features" },
    { name: "Why Us", href: "#why" },
    { name: "Testimonials", href: "#testimonials" },
    { name: "Get Started", href: "#cta" },
  ];

  return (
    <nav className="fixed top-4 left-0 w-full z-50 px-4">
      <div className="bg-white rounded-full shadow-lg max-w-7xl mx-auto px-6 py-3 flex justify-between items-center">
        {/* Logo */}
        <a href="#home" className="text-2xl font-bold text-indigo-600">
          RESUMIZER
        </a>

        {/* Desktop Menu */}
        <div className="hidden md:flex gap-6">
          {navItems.map((item, i) => (
            <a
              key={i}
              href={item.href}
              className="text-gray-600 hover:text-indigo-600 font-medium transition"
            >
              {item.name}
            </a>
          ))}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-gray-700"
          onClick={() => setIsOpen(!isOpen)}
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
            className="md:hidden mt-2 bg-white rounded-2xl shadow-lg max-w-7xl mx-auto"
          >
            <div className="flex flex-col p-4 gap-4">
              {navItems.map((item, i) => (
                <a
                  key={i}
                  href={item.href}
                  className="text-gray-600 hover:text-indigo-600 font-medium transition"
                  onClick={() => setIsOpen(false)}
                >
                  {item.name}
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
