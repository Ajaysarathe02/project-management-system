import React,{useState,useEffect, useContext} from 'react'
import { useNavigate,useLocation,Router,Routes,Route,Link } from 'react-router-dom';
import ProjectHeadOverview from './ProjectHeadOverview';
import ProjectHeadProfile from './ProjectHeadProfile'
import { motion } from 'motion/react';
import { account } from '../lib/appwrite';
import { ProjectHeadContext } from '../context/contextApi';
import { toast, ToastContainer } from 'react-toastify';
import ProjectHeadReports from './ProjectHeadReports'
import ProjectHeadSettings from './ProjectHeadSettings'
import ProjectHeadManageProjects from './ProjectHeadManageProjects';

function ProjectHeadDashBoard() {

  const navigate = useNavigate();
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { getProjectHeadDetails, projectHead } = useContext(ProjectHeadContext);

  const getProjectHead = async () => {
    try {

      const res = await account.get();
      getProjectHeadDetails(res.$id);

    } catch (error) {
      console.error("Error fetching project head:", error);
    }
  }
  useEffect(() => {
  getProjectHead()
  }, [])
  

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const handleLogout = async () => {
    try {
      await account.deleteSession("current");
      toast.success("Logged out successfully.",{position:'top-center',autoClose:3000});
      navigate("/"); // Redirect to the home page or login page
    } catch (error) {
      console.error("Error logging out:", error);
      alert("Error logging out.");
    }
  };

  // Define the navigation items
  const navItems = [
    {
      path: "/projecthead-dash",
      label: "Overview",
      icon: "fas fa-home",
    },
    {
      path: "/projecthead-dash/profile",
      label: "Profile",
      icon: "fas fa-user",
    },
    {
      path: "/projecthead-dash/manage-projects",
      label: "Manage Projects",
      icon: "fas fa-tasks",
    },
    {
      path: "/projecthead-dash/reports",
      label: "Reports",
      icon: "fas fa-chart-line",
    },
    {
      path: "/projecthead-dash/settings",
      label: "Settings",
      icon: "fas fa-cog",
    },
  ];

  return (
    <div className="flex h-screen text-white bg-black">
      <ToastContainer />
      <aside
        className={`bg-gray-900 p-6 flex flex-col text-white m-3 rounded-3xl mb-[100px] transition-all duration-300 ${
          isCollapsed ? "w-20" : "w-64"
        }`}
      >
        <div className="flex justify-between items-center mb-8">
          <h1
            className={`text-2xl font-bold transition-opacity duration-300 ${
              isCollapsed ? "opacity-0" : "opacity-100"
            }`}
          >
            Project-Head Dashboard
          </h1>
          <button onClick={toggleCollapse} className="text-white">
            <i
              className={`fas ${
                isCollapsed ? "fa-chevron-right" : "fa-chevron-left"
              }`}
            ></i>
          </button>
        </div>
        <hr className="my-4" />

        {/* Navigation */}
        <nav className="flex-1 space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex relative items-center p-3 rounded-lg ${
                location.pathname === item.path
                  ? "bg-blue-600 text-white"
                  : "hover:bg-gray-800 text-gray-200"
              }`}
            >
              <i className={`${item.icon} w-5 mr-5`}></i>
              <span
                className={`ml-3 transition-opacity duration-300 ${
                  isCollapsed ? "opacity-0" : "opacity-100"
                }`}
              >
                {item.label}
              </span>

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

        <div className="pt-6 space-y-2 mb-[60px]">
          <button
            onClick={handleLogout}
            className="flex items-center p-3 rounded-lg hover:bg-gray-800"
          >
            <i className="fas fa-sign-out-alt w-5"></i>
            <span
              className={`ml-3 transition-opacity duration-300 ${
                isCollapsed ? "opacity-0" : "opacity-100"
              }`}
            >
              Sign Out
            </span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto bg-black">
        <div className="w-full mx-auto">
          <Routes>
            <Route path="/" element={<ProjectHeadOverview />} />
            <Route path="/profile" element={<ProjectHeadProfile />} />
            <Route
              path="/manage-projects"
              element={<ProjectHeadManageProjects />}
            />
            <Route path="/reports" element={<ProjectHeadReports />} />
            <Route path="/settings" element={<ProjectHeadSettings />} />

            {/* Add more routes as needed */}
          </Routes>
        </div>
      </main>
    </div>
  );
}

export default ProjectHeadDashBoard