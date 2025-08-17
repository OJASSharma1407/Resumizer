// MainLayout.jsx
import React from "react";
import Navbar from "../main/Navbar";  // Adjust path
import { Outlet } from "react-router-dom";

export default function MainLayout() {
  return (
    <>
      <Navbar />
      <div className="main-content">
        {/* Outlet renders nested route components */}
        <Outlet />
      </div>
    </>
  );
}
