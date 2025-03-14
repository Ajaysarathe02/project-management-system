import React, { useState,useEffect, useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Home from './home/Home';
import Header from './home/Header';
import Layout from './home/Layout';
import Signup from './lib/Signup';
import StudentDashboard from './student/StudentDashboard';
import StudentProfile from './student/StudentProfile';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/ReactToastify.css'
import { UserContext } from './context/contextApi';
import ProjectHeadDashboard from './prohead/ProjectHeadDashboard';
import { account } from './lib/appwrite';

const App = () => { 
  const {user,setUser} = useContext(UserContext);
  const [pref,setPref] = useState({})

  const checkCurrentUser = async () => {
    try {
      const currentUser = await account.get();
      setUser(currentUser);
    } catch (error) {
      console.error('No user is currently logged in:');
    }
  };

  useEffect(() => {
checkCurrentUser()
console.log("user settle wala",user)
  }, [])
  

  return (
    <Router>
      <Header />
      <main className='mt-[80px]'>
        <Routes>
          <Route path="/" element={<Layout/>} />
          <Route  index element={<Home />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/student-dash/*" element={ <StudentDashboard/> } />
          <Route path='/projecthead-dash/*' element={<ProjectHeadDashboard />} />
         
        </Routes>
        </main>
       
     <ToastContainer />
    </Router>

  );
};

export default App;
