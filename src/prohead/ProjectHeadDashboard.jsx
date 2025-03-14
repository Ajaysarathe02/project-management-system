import React, { useContext, useEffect } from "react";
import { Link, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { account } from "../lib/appwrite";
import { ProjectHeadContext, UserContext } from "../context/contextApi";
import ProjectHeadProjects from "./ProjectHeadProjects";
import ProjectHeadApprove from "./ProjectHeadApprove";

const ProjectHeadDashboard = () => {
  const { user, getCurrentUser } = useContext(UserContext);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    getCurrentUser();
  }, []);

  const handleLogout = async () => {
    try {
      await account.deleteSession("current");
      navigate("/"); // Redirect to the home page or login page
    } catch (error) {
      console.error("Error logging out:", error);
      alert("Error logging out.");
    }
  };

  // Define the navigation items
  const navItems = [
    { path: "/prohead-dash", label: "Overview", icon: "fas fa-home" },
    { path: "/prohead-dash/projects", label: "Projects", icon: "fas fa-project-diagram" },
    { path: "/prohead-dash/approve-projects", label: "Approve Projects", icon: "fas fa-check-circle" },
    { path: "/prohead-dash/profile", label: "Profile", icon: "fas fa-user" },
  ];

  return (
    <div className="flex h-screen text-white">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 p-6 flex flex-col text-white">
        <div className="flex items-center mb-8">
          <i className="fas fa-user-tie mr-2"></i>
          <span className="text-xl font-semibold">Project Head</span>
        </div>

        <nav className="flex-1 space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex relative items-center p-3 rounded-lg ${
                location.pathname === item.path ? "bg-blue-600 text-white" : "hover:bg-gray-800 text-gray-400"
              }`}
            >
              <i className={`${item.icon} w-5`}></i>
              <span className="ml-3">{item.label}</span>
              {location.pathname === item.path && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 bg-blue-600 rounded-lg z-[-1]"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
            </Link>
          ))}
        </nav>

        <div className="pt-6 space-y-2">
          <button onClick={handleLogout} className="flex items-center p-3 rounded-lg hover:bg-gray-800">
            <i className="fas fa-sign-out-alt w-5"></i>
            <span className="ml-3">Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto bg-black">
        <div className="w-full mx-auto">
          <header className="mb-8">
            <h1 className="text-3xl text-white font-bold mb-6">
              Welcome back, {user ? user.name : "Project Head"}
            </h1>
          </header>

          <Routes>
            <Route path="/" element={<div>Overview Content</div>} />
            <Route path="/projects" element={<ProjectHeadProjects />} />
            <Route path="/approve-projects" element={<ProjectHeadApprove />} />
            <Route path="/profile" element={<div>Profile Content</div>} />
          </Routes>
        </div>
      </main>
    </div>
  );
};

export default ProjectHeadDashboard;