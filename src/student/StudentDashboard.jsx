import React, { useContext, useEffect, useState } from 'react';
import { account,databases,database_id } from '../lib/appwrite';
import { Link, Route, Routes, useLocation, useNavigate, useParams } from 'react-router-dom';
import Profile from './Profile';
import Projects from './Projects';
import SubmitProject from './SubmitProject';
import ProjectStatus from './ProjectStatus';
import StudentProfile from './StudentProfile';
import { UserContext } from '../context/contextApi';
import { motion } from 'motion/react';
import Overview from './Overview';
import StudentNotifications from './StudentNotifcations';
import { Query } from 'appwrite';
import StudentChat from './StudentChat';

function StudentDashboard() {
  const { user, getCurrentUser, studentDetailInfo, fetchStudentData } = useContext(UserContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0); // State for unread notifications count


  useEffect(() => {
    const fetchUser = async () => {
      await fetchStudentData(user.$id);
      await getCurrentUser();
      setLoading(false); // Set loading to false after fetching user data
    };

    fetchUser();
  }, []);

  useEffect(() => {
    const fetchUnreadNotifications = async () => {
      try {
        if (user) {
          const response = await databases.listDocuments(
            database_id,
            "67d08e62003a0547f663", // Replace with your notifications collection ID
            [Query.equal("studentId", user.$id), Query.equal("isRead", false)] // Fetch unread notifications for the student
          );
          setUnreadCount(response.total); // Set the unread notifications count
        }
      } catch (error) {
        console.error("Failed to fetch unread notifications:", error);
      }
    };

    fetchUnreadNotifications();
  }, [user]); // Re-fetch notifications when the user changes


  const handleLogout = async () => {
    try {
      await account.deleteSession('current');
      navigate('/'); // Redirect to the home page or login page
    } catch (error) {
      console.error('Error logging out:', error);
      alert('Error logging out.');
    }
  };

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Loading...</p>
      </div>
    );
  }



  // Define the navigation items
  const navItems = [
    { path: `/student-dash`, label: 'Overview', icon: 'fas fa-home' },
    { path: `/student-dash/notifications`, label: 'Notifications', icon: 'fas fa-bell' },
    { path: `/student-dash/profile`, label: 'Profile', icon: 'fas fa-user' },
    { path: `/student-dash/projects`, label: 'Projects', icon: 'fas fa-project-diagram' },
    { path: `/student-dash/submit-project`, label: 'Submit Project', icon: 'fas fa-plus' },
    { path: `/student-dash/chat`, label: 'Chat', icon: 'fas fa-plus' },
  ];

  return (
    <div className="flex h-screen text-white bg-black">
      {/* Sidebar */}
      <aside className={`bg-gray-900 p-6 flex flex-col text-white m-3 rounded-3xl mb-[100px] transition-all duration-300 ${isCollapsed ? 'w-20' : 'w-64'}`}>
        <div className="flex justify-between items-center mb-8">
          <h1 className={`text-2xl font-bold transition-opacity duration-300 ${isCollapsed ? 'opacity-0' : 'opacity-100'}`}>Student Dashboard</h1>
          <button onClick={toggleCollapse} className="text-white">
            <i className={`fas ${isCollapsed ? 'fa-chevron-right' : 'fa-chevron-left'}`}></i>
          </button>
        </div>
        <hr className="my-4" />

        {/* Navigation */}
        <nav className="flex-1 space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex relative items-center p-3 rounded-lg ${location.pathname === item.path ? "bg-blue-600 text-white" : "hover:bg-gray-800 text-gray-200"
                }`}
            >
              <i className={`${item.icon} w-5 mr-5`}></i>
              <span className={`ml-3 transition-opacity duration-300 ${isCollapsed ? "opacity-0" : "opacity-100"}`}>
                {item.label}
              </span>

              {/* Show badge for Notifications */}
              {item.path === "/student-dash/notifications" && unreadCount > 0 && (
                <span className="absolute right-4 top-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                  {unreadCount}
                </span>
              )}

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
          <button onClick={handleLogout} className="flex items-center p-3 rounded-lg hover:bg-gray-800">
            <i className="fas fa-sign-out-alt w-5"></i>
            <span className={`ml-3 transition-opacity duration-300 ${isCollapsed ? 'opacity-0' : 'opacity-100'}`}>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto bg-black">
        <div className="w-full mx-auto">
          <Routes>
            <Route path="/" element={<ProjectStatus />} />
            <Route path="/profile" element={<StudentProfile />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/submit-project" element={<SubmitProject />} />
            <Route path="/notifications" element={<StudentNotifications />} />
            <Route path="/chat" element={<StudentChat />} />
            {/* Add more routes as needed */}
          </Routes>
        </div>
      </main>
    </div>
  );
}

export default StudentDashboard;