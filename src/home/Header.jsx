import React, { useRef, useContext, useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { UserContext } from '../context/contextApi';
import { account } from '../lib/appwrite';

function Header() {

  const navigate = useNavigate();
  const { currentRole } = useContext(UserContext);
  const { user, fetchUserRole,studentDetailInfo} = useContext(UserContext); // Get the current user from context
  const [headerPic, setHeaderPic] = useState(null);

  const handleDashboardRedirect = () => {
    // if (currentRole === "student") {
    //   navigate("/student-dash"); // Redirect to Student Dashboard
    // } else if (currentRole === "project-head") {
    //   navigate("/projecthead-dash"); // Redirect to Project Head Dashboard
    // } else {
    //   alert("Unauthorized access or role not defined!");
    // }
  };

  const generateFileUrl = (fileId) => {
    // const image = JSON.parse(fileId);
    return `https://cloud.appwrite.io/v1/storage/buckets/67d541b9000f5101fd5d/files/${fileId}/view?project=67d013a6000a87361603`;
};

useEffect(() => {
  setHeaderPic(generateFileUrl(studentDetailInfo?.userPicture));
},[studentDetailInfo])

  useEffect(() => {
    handleDashboardRedirect()
  }, [currentRole])



  return (
    <header className="bg-gray-900  w-full top-0 fixed z-[1000] p-[10px 20px] shadow-md" >
      <nav className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          <div className="flex items-center">
            <img
              src="https://www.jecjabalpur.ac.in/images/logo.jpg"
              alt="University Logo"
              className="h-12 w-auto rounded-[10px] cursor-pointer"
              onClick={() => navigate('/')}
            />
            <div className="ml-4">
              <h1 className="text-[30px] font-semibold text-white">
                Jabalpur Engineering College
              </h1>
              <p className="text-sm text-white">since 1947</p>
            </div>
          </div>
          <div className="flex items-center space-x-15 text-white font-bold">
            <Link to='/' className=" hover:text-custom">
              Home
            </Link>
            <Link onClick={handleDashboardRedirect} className=" hover:text-custom">
              Dashboard
            </Link>
            <a href="#" className=" hover:text-custom">
              Academics
            </a>
            <a href="#" className=" hover:text-custom">
              Contact
            </a>
            <div className=''>
             <img
                src={ user ? headerPic : "https://www.jecjabalpur.ac.in/images/logo.jpg"}
              
                className="h-10  w-10 rounded-full cursor-pointer"

              />
             
            </div>
          </div>
        </div>
      </nav>
    </header>
  )
}


export default Header


