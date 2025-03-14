import React, { useContext, useEffect, useState } from 'react';
import { account } from '../lib/appwrite';
import { Link, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import Profile from './Profile';
import Projects from './Projects';
import SubmitProject from './SubmitProject';
import UpdateProject from './UpdateProject';
import ProjectStatus from './ProjectStatus';

import StudentProfile from './StudentProfile';
import { UserContext } from '../context/contextApi';
import { motion } from 'motion/react';

function StudentDashboard() {

  const {user,getCurrentUser} = useContext(UserContext)
  const navigate = useNavigate();
  const loaction = useLocation()

  useEffect(() => {
    getCurrentUser();
  }, []);

  const handleLogout = async () => {
    try {
      await account.deleteSession('current');
      navigate('/'); // Redirect to the home page or login page
    } catch (error) {
      console.error('Error logging out:', error);
      alert('Error logging out.');
    }
  };

   // Define the navigation items
   const navItems = [
    { path: '/student-dash', label: 'Overview', icon: 'fas fa-home' },
    { path: '/student-dash/notifications', label: 'Notifications', icon: 'fas fa-bell' },
    { path: '/student-dash/profile', label: 'Profile', icon: 'fas fa-user' },
    { path: '/student-dash/projects', label: 'Projects', icon: 'fas fa-project-diagram' },
    { path: '/student-dash/submit-project', label: 'Submit Project', icon: 'fas fa-plus' },
    { path: '/student-dash/update-project', label: 'Update Project', icon: 'fas fa-edit' },
    { path: '/student-dash/project-status', label: 'Project Status', icon: 'fas fa-tasks' },
  ];


  return (
    <div className="flex h-screen text-white">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 p-6 flex flex-col text-white">
        <div className="flex items-center mb-8">
          <i className="fas fa-clock mr-2"></i>
          <span className="text-xl font-semibold">Upcoming</span>
        </div>

        <nav className="flex-1 space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex relative items-center p-3 rounded-lg ${
                location.pathname === item.path ? 'bg-blue-600 text-white' : 'hover:bg-gray-800 text-gray-400'
              }`}
            >
              <i className={`${item.icon} w-5`}></i>
              <span className="ml-3">{item.label}</span>
              {location.pathname === item.path && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 bg-blue-600 rounded-lg z-[-1]"
                  initial={{ opacity: 0, scale:0.9 }}
                  animate={{ opacity: 1 , scale:1}}
                  exit={{ scale: 0.9, opacity: 0 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}

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
          <a href="#" className="flex items-center p-3 rounded-lg hover:bg-gray-800">
            <i className="fas fa-crown w-5"></i>
            <span className="ml-3">Upgrade Plan</span>
          </a>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto bg-black">
        <div className="w-full mx-auto">
          <header className="mb-8">
            <h1 className="text-3xl text-white font-bold mb-6">Welcome back, {user ? user.name : "Students"}</h1>
          </header>

          <Routes>
            <Route path="/" element={<div>Overview Content</div>} />
            <Route path="/profile" element={<StudentProfile  />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/submit-project" element={<SubmitProject />} />
            <Route path="/update-project" element={<UpdateProject />} />
            <Route path="/project-status" element={<ProjectStatus />} />
            {/* Add more routes as needed */}
          </Routes>
        </div>
      </main>
    </div>
  );
}

export default StudentDashboard;