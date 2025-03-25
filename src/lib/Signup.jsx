import { useState,useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { account ,ID, databases, database_id} from "./appwrite";
import { ProjectHeadContext, UserContext } from "../context/contextApi";
import { toast, ToastContainer } from "react-toastify";
import { motion } from "motion/react";

const Signup = () => {
  const [role, setRole] = useState("student");
  const [password, setPassword] = useState("");
  const [strength, setStrength] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [notification, setNotification] = useState(false);

  const {signup} = useContext(UserContext);
  const {signupProjectHead} = useContext(ProjectHeadContext)
  const navigate = useNavigate();
  const [loading,setLoading] = useState(false);

  // Student Signup Form State
  const [studentName, setStudentName] = useState("");
  const [studentRoll, setStudentRoll] = useState("");
  const [studentBranch, setStudentBranch] = useState("");
  const [studentEmail, setStudentEmail] = useState("");
  const [studentPassword, setStudentPassword] = useState("");

  // HOD Signup Form State
  const [hodName, setHodName] = useState("");
  const [hodDepartment, setHodDepartment] = useState("");
  const [hodDesignation, setHodDesignation] = useState("");
  const [hodEmail, setHodEmail] = useState("");
  const [hodPassword, setHodPassword] = useState("");

  // Project Head Signup Form State
  const [phName, setPhName] = useState("");
  const [phDepartment, setPhDepartment] = useState("");
  const [phDesignation, setPhDesignation] = useState("");
  const [phEmail, setPhEmail] = useState("");
  const [phPassword, setPhPassword] = useState("");

  const handleRoleChange = (selectedRole) => {
    setRole(selectedRole);
  };

  // for student signup
  const handleStudentSubmit = (e) => {
    e.preventDefault();
    setLoading(true)
    const res = signup(studentEmail,studentPassword,studentName,studentRoll,studentBranch,role);

    setTimeout(() => {
      if(res){
        setStudentName(""); setStudentEmail(""); setStudentPassword(""), setStudentRoll("")
        toast.success(`${studentName} signup successfully`,{position:"top-center"})
        setLoading(false)
      
        setTimeout(()=>{
          navigate('/')
        },2000)
      }else {
        setLoading(false)
        toast.error("signup failed");
      
      }
    },4000)
    
    
  }

  const handleHodSubmit = (e) => {
    e.preventDefault();
    console.log(hodName, hodEmail, hodDepartment, hodDesignation, hodPassword);
  };

  // for project head signup
  const handlePhSubmit =  (e) => {
    setLoading(true)
    e.preventDefault();
    console.log("signup role is ",role)

    try{
    const response =  signupProjectHead(phName,phEmail,phPassword,phDepartment,phDesignation,role);

    setTimeout(() => {
      if(response){
        toast.success(`${phName} signup successfully`,{position:"top-center"})
        setLoading(false)
        setTimeout(()=>{
          navigate('/')
        },2000)
      }else{
        setLoading(false)
        toast.error(`signup failed`,{position:"top-center"})
      } 
    },4000)
  }catch(error){
    console.log("error",error)
    setLoading(false);
      toast.error(`signup failed`, { position: "top-center" });
  }
    
  };
  

  return (
    <div className="bg-gray-50 h-auto flex flex-col items-center justify-center p-4">
<ToastContainer />
      <motion.div 
      initial={{ opacity: 0, scale: 0.8, y: 50 }} // Initial animation state
      animate={{ opacity: 1, scale: 1, y: 0 }} // Final animation state
      transition={{ duration: 0.5, ease: "easeOut" }} // Animation duration and easing
      className="mt-10 w-full max-w-xl bg-white rounded-[20px] shadow-2xl p-8 space-y-8 border border-gray-100">
        <div className="flex flex-col items-center justify-center space-y-4 mb-8">
          <img src="https://www.jecjabalpur.ac.in/images/logo.jpg" alt="Logo" className="h-10" />
          <h1 className="text-3xl font-bold">Create your account</h1>
          <p className="text-gray-500 text-center">Join us and start your journey</p>
        </div>

        <div className="flex flex-wrap justify-center gap-4 mb-8">
          {["student", "hod", "project-head"].map((r) => (
            <button
              key={r}
              className={`role-btn px-6 py-2 font-medium rounded-md ${role === r ? "bg-blue-500 text-white" : "bg-gray-100 hover:bg-gray-200"}`}
              onClick={() => handleRoleChange(r)}
              style={{ width: 150 }}
            >
              {r.charAt(0).toUpperCase() + r.slice(1)}
            </button>
          ))}
        </div>

        {/* student form */}
        {role === "student" &&
          <form onSubmit={handleStudentSubmit} className="space-y-6">
            <input
              onChange={(e) => setStudentName(e.target.value)}
              value={studentName}
              type="text"
              placeholder="Full Name"
              className="w-full border-gray-300 rounded-md p-2"
              required
            />
            <input
              onChange={(e) => setStudentRoll(e.target.value)}
              value={studentRoll}
              type="text"
              placeholder="Roll Number"
              className="w-full border-gray-300 rounded-md p-2"
              required
            />
            <select
              onChange={(e) => setStudentBranch(e.target.value)}
              value={studentBranch}
              className="w-full border-gray-300 rounded-md p-2"
              required
            >
              <option>Select Branch</option>
              <option>Computer Science</option>
              <option>Information Technology</option>
              <option>Electronics</option>
              <option>Mechanical</option>
            </select>
            <input
              onChange={(e) => setStudentEmail(e.target.value)}
              value={studentEmail}
              type="email"
              placeholder="Email"
              className="w-full border-gray-300 rounded-md p-2"
              required
            />
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                className="w-full border-gray-300 rounded-md p-2 pr-10"
                value={studentPassword}
                onChange={(e) => setStudentPassword(e.target.value)}
                required
              />
              <i
                className={`fas ${showPassword ? "fa-eye-slash" : "fa-eye"} absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer hover:text-gray-600`}
                onClick={() => setShowPassword(!showPassword)}
              ></i>
            </div>
            <div className="mt-2 h-1 bg-gray-100 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-300 ${strength < 50 ? "bg-red-500" : strength < 75 ? "bg-yellow-500" : "bg-green-500"}`}
                style={{ width: `${strength}%` }}
              ></div>
            </div>
            <button type="submit" className="w-full flex justify-center items-center bg-blue-500 hover:bg-blue-600 text-white py-3 font-medium rounded-md transition-colors duration-300">
            {loading ? (
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    ></path>
                  </svg>
                ) : (
                  "Create account"
                )}
            </button>
          </form>
        }

        {/* hod form */}
        {role === "hod" &&
          <form onSubmit={handleHodSubmit} className="space-y-6">
            <input
              onChange={(e) => setHodName(e.target.value)}
              value={hodName}
              type="text"
              placeholder="Full Name"
              className="w-full border-gray-300 rounded-md p-2"
              required
            />
            <select
              onChange={(e) => setHodDepartment(e.target.value)}
              value={hodDepartment}
              className="w-full border-gray-300 rounded-md p-2"
              required
            >
              <option>Select Department</option>
              <option>Computer Science</option>
              <option>Information Technology</option>
              <option>Electronics</option>
              <option>Mechanical</option>
            </select>
            <select
              onChange={(e) => setHodDesignation(e.target.value)}
              value={hodDesignation}
              className="w-full border-gray-300 rounded-md p-2"
              required
            >
              <option>Select Designation</option>
              <option>Professor</option>
              <option>Associate Professor</option>
              <option>Assistant Professor</option>
              <option>Other</option>
            </select>
            <input
              onChange={(e) => setHodEmail(e.target.value)}
              value={hodEmail}
              type="email"
              placeholder="Email"
              className="w-full border-gray-300 rounded-md p-2"
              required
            />
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                className="w-full border-gray-300 rounded-md p-2 pr-10"
                value={hodPassword}
                onChange={(e) => setHodPassword(e.target.value)}
                required
              />
              <i
                className={`fas ${showPassword ? "fa-eye-slash" : "fa-eye"} absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer hover:text-gray-600`}
                onClick={() => setShowPassword(!showPassword)}
              ></i>
            </div>
            <div className="mt-2 h-1 bg-gray-100 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-300 ${strength < 50 ? "bg-red-500" : strength < 75 ? "bg-yellow-500" : "bg-green-500"}`}
                style={{ width: `${strength}%` }}
              ></div>
            </div>
            <button type="submit" className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 font-medium rounded-md transition-colors duration-300">
              Create Account
            </button>
          </form>
        }

        {/* project head form */}
        {role === "project-head" &&
          <form onSubmit={handlePhSubmit} className="space-y-6">
            <input
              onChange={(e) => setPhName(e.target.value)}
              value={phName}
              type="text"
              placeholder="Full Name"
              className="w-full border-gray-300 rounded-md p-2"
              required
            />
            <select
              onChange={(e) => setPhDepartment(e.target.value)}
              value={phDepartment}
              className="w-full border-gray-300 rounded-md p-2"
              required
            >
              <option>Select Department</option>
              <option>Computer Science</option>
              <option>Information Technology</option>
              <option>Electronics</option>
              <option>Mechanical</option>
            </select>
            <select
              onChange={(e) => setPhDesignation(e.target.value)}
              value={phDesignation}
              className="w-full border-gray-300 rounded-md p-2"
              required
            >
              <option>Select Designation</option>
              <option>Professor</option>
              <option>Associate Professor</option>
              <option>Assistant Professor</option>
              <option>Other</option>
            </select>
            <input
              onChange={(e) => setPhEmail(e.target.value)}
              value={phEmail}
              type="email"
              placeholder="Email"
              className="w-full border-gray-300 rounded-md p-2"
              required
            />
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                className="w-full border-gray-300 rounded-md p-2 pr-10"
                value={phPassword}
                onChange={(e) => setPhPassword(e.target.value)}
                required
              />
              <i
                className={`fas ${showPassword ? "fa-eye-slash" : "fa-eye"} absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer hover:text-gray-600`}
                onClick={() => setShowPassword(!showPassword)}
              ></i>
            </div>
            <div className="mt-2 h-1 bg-gray-100 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-300 ${strength < 50 ? "bg-red-500" : strength < 75 ? "bg-yellow-500" : "bg-green-500"}`}
                style={{ width: `${strength}%` }}
              ></div>
            </div>
            <button type="submit" className="w-full flex justify-center items-center bg-blue-500 hover:bg-blue-600 text-white py-3 font-medium rounded-md transition-colors duration-300">
            {loading ? (
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    ></path>
                  </svg>
                ) : (
                  "Create account"
                )}
            </button>
          </form>
        }

        <div className="text-center mt-4">
          <Link to="/" className="text-sm text-indigo-600 hover:text-indigo-500 cursor-pointer">
            Already have an account? Sign in
          </Link>
        </div>
      </motion.div>

    
    </div>
  );
};

export default Signup;