import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/extra/ProtectedRoutes";
import MainLayout from "./components/extra/MainLayout";
import Dashboard from "./components/main/Dashboard";
import Login from "./components/auth/Login";
import Signin from "./components/auth/Signin";
import Buildresume from "./components/main/Buildresume";
import Viewresume from "./components/main/Viewresume";
import Buildcoverletter from "./components/main/Buildcoverletter";
import Viewcoverletter from "./components/main/Viewcoverletter";
import Editresume from "./components/main/Editresume";
import AIresume from "./components/main/AIresume";

function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<Signin />} />
      <Route path="/login" element={<Login />} />

      {/* Protected routes */}
      <Route element={<ProtectedRoute />}>
        <Route element={<MainLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/build-resume" element={<Buildresume />} />
          <Route path="/view-resume" element={<Viewresume />} />
          <Route path="/build-cover-letter" element={<Buildcoverletter />} />
          <Route path="/view-cover-letter" element={<Viewcoverletter />} />  
          <Route path="/edit-resume/:id" element={<Editresume />} />  
          <Route path="/view-ai-resume/:id" element={<AIresume/>}/>               
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
