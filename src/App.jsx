import React, { useState, useEffect, useContext } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import Home from "./home/Home";
import Header from "./home/Header";
import Layout from "./home/Layout";
import Signup from "./lib/Signup";
import StudentDashboard from "./student/StudentDashboard";
import { ToastContainer } from "react-toastify";
import "react-toastify/ReactToastify.css";
import { UserContext } from "./context/contextApi";
import { account } from "./lib/appwrite";
import ProjectHeadDashBoard from "./prohead/ProjectHeadDashBoard";
import HodDashboard from "./hod/HodDashboard";

const App = () => {
  const { user, setUser, getUserRole } = useContext(UserContext);
  
  return (
    <Router>
      <Header />
      <main className="mt-[80px]">
        <Routes>
          <Route path="/" element={<Layout />} />
          <Route index element={<Home />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/student-dash/*" element={<StudentDashboard />} />
          <Route path="/hod-dash/*" element={<HodDashboard />} />
          <Route
            path="/projecthead-dash/*"
            element={<ProjectHeadDashBoard />}
          />
        </Routes>
      </main>

      <ToastContainer />
    </Router>
  );
};

export default App;
