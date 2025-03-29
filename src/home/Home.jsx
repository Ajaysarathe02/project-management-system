import React, { useContext, useRef, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom';
import { account } from '../lib/appwrite';
import { toast } from 'react-toastify';
import { UserContext } from '../context/contextApi';

function Home() {

    //student
    const [email, setEmail] = useState("");
    const [pass, setPass] = useState("");
    const [role, setRole] = useState("student");
    const [loading, setLoading] = useState(false);

    const {login,user,fetchStudentData} = useContext(UserContext)
    const loginRef = useRef(null)

    // functions
    const navigate = useNavigate();

    // hnadle login system
    const handleLogin = async (e) => {

        e.preventDefault();
        setLoading(true)

        try {
            const response = login(email,pass);
            if(response){
                toast.success(`user login successful`, { position: 'top-center' })
                if (role === 'student') 
                    {
                        
                        navigate('/student-dash');
                    }
                if(role == 'hod'){
                    navigate('/hod-dash')
                }
                if(role == 'project-head'){navigate('/projecthead-dash')}
            }
            
        } catch (error) {
            console.error(error);
            setLoading(false);
        
        }
    }

    // scroll to login section
    const scrollToLogin = () => {
        loginRef.current.scrollIntoView({behavior:'smooth'})
    }

    // // hero section
    const Hero = () => {
        return (
            <section className="relative bg-gray-900 h-[600px] overflow-hidden">
                <img
                    src="https://img.collegepravesh.com/2018/11/JEC-Jabalpur.png"
                    alt="Campus"
                    className="absolute inset-0 w-full h-full object-cover opacity-40"
                />
                <div className="relative max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
                    <div className="max-w-3xl">
                        <h1 className="text-5xl font-bold text-white mb-6">
                            Welcome to Jabalpur Engineering College's Project Portal
                        </h1>
                        <p className="text-xl text-gray-200 mb-8">
                            Empowering students with seamless project submission and
                            management tools for academic excellence.
                        </p>
                        <div className="space-x-4">
                            <button onClick={scrollToLogin} className="rounded bg-custom text-white px-8 py-3 hover:bg-custom/90">
                                Student Login
                            </button>
                            <button onClick={()=>{navigate('/signup')}} className="rounded bg-white text-custom px-8 py-3 hover:bg-gray-100">
                                Register Now
                            </button>
                        </div>
                    </div>
                </div>
            </section>
        )
    }


    // principal message
    const PrincipalMessage = () => {
        return (
            <div className="bg-white  shadow-gray-300   rounded-[20px] shadow-2xl p-8 space-y-8 border border-gray-100">
                <h2 className="text-xl font-semibold mb-4">Principal's Message</h2>
                <div className="flex items-start space-x-4">
                    <img
                        src="https://www.jecjabalpur.ac.in/images/principal_big_small_n.jpeg"
                        alt="Principal"
                        className="w-24 h-24 rounded-lg object-cover"
                    />
                    <div>
                        <p className="text-sm text-gray-600 mb-4">Dear Students,</p>
                        <p className="text-sm text-gray-600 mb-4">
                            Welcome to Jabalpur Engineering College (JEC)! Since 1947, our
                            institution has been a beacon of academic excellence and innovation.
                        </p>
                        <p className="text-sm text-gray-600 mb-4">
                            I encourage you to dream big, stay curious, and work hard. Make the
                            most of your time here—explore, innovate, and contribute to society.
                        </p>
                        <p className="text-sm text-gray-600">
                            Prof. Dr. Shailendra Jain<br /> Principal, JEC
                        </p>
                    </div>
                </div>
            </div>
        );
    };


    // notification
    const Notifications = () => {
        const notifications = [
            {
                title: "Project Submission Deadline Extended",
                description: "Final year projects due date extended to July 15th",
                time: "2 hours ago",
            },
            {
                title: "New Research Opportunities",
                description: "Applications open for summer research program",
                time: "1 day ago",
            },
            {
                title: "Workshop Announcement",
                description: "Technical writing workshop on June 25th",
                time: "2 days ago",
            },
        ];

        return (
            <div className="bg-white  shadow-gray-300   rounded-[20px] shadow-2xl p-8 space-y-8 border border-gray-100">
                <h2 className="text-xl font-semibold mb-4">Latest Notifications</h2>
                <div className="space-y-4">
                    {notifications.map((note, index) => (
                        <div key={index} className="border-l-4 border-custom pl-4">
                            <p className="text-sm font-medium text-gray-900">{note.title}</p>
                            <p className="text-sm text-gray-500">{note.description}</p>
                            <p className="text-xs text-gray-400 mt-1">{note.time}</p>
                        </div>
                    ))}
                </div>
            </div>
        );
    };


    // footer section
    const Footer = () => {
        return (
            <footer class="bg-gray-900 text-white py-12">
                <div class="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div class="grid grid-cols-4 gap-8">
                        <div>
                            <img src="https://www.jecjabalpur.ac.in/images/logo.jpg" alt="University Logo" class="h-12 w-auto mb-4 rounded-[10px]" />
                            <p class="text-gray-400">Excellence in Engineering Education Since 1947</p>
                        </div>
                        <div>
                            <h3 class="font-medium mb-4">Quick Links</h3>
                            <ul class="space-y-2 text-gray-400">
                                <li><a href="#" class="hover:text-white">About Us</a></li>
                                <li><a href="#" class="hover:text-white">Academics</a></li>
                                <li><a href="#" class="hover:text-white">Research</a></li>
                                <li><a href="#" class="hover:text-white">Contact</a></li>
                            </ul>
                        </div>
                        <div>
                            <h3 class="font-medium mb-4">Contact Us</h3>
                            <ul class="space-y-2 text-gray-400">
                                <li>123 University Ave</li>
                                <li>City, State 12345</li>
                                <li>Phone: (123) 456-7890</li>
                                <li>Email: info@university.edu</li>
                            </ul>
                        </div>
                        <div>
                            <h3 class="font-medium mb-4">Follow Us</h3>
                            <div class="flex space-x-4">
                                <a href="#" class="text-gray-400 hover:text-white"><i class="fab fa-facebook-f"></i></a>
                                <a href="#" class="text-gray-400 hover:text-white"><i class="fab fa-twitter"></i></a>
                                <a href="#" class="text-gray-400 hover:text-white"><i class="fab fa-linkedin-in"></i></a>
                                <a href="#" class="text-gray-400 hover:text-white"><i class="fab fa-instagram"></i></a>
                            </div>
                        </div>
                    </div>
                    <div class="mt-12 pt-8 border-t border-gray-800 text-center text-gray-400">
                        <p>© 2024 Jabalpur Engineering College. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        )
    };



    // feature
    const FeaturesSection = () => (
        <section class="py-16 bg-white">
            <div class="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2 class="text-3xl font-semibold text-center mb-12">Key System Features</h2>
                <div class="grid grid-cols-3 gap-8">
                    <div class="text-center">
                        <div class="bg-custom/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                            <i class="fas fa-cloud-upload-alt text-2xl text-custom"></i>
                        </div>
                        <h3 class="font-medium mb-2">Project Management</h3>
                        <p class="text-gray-600">Comprehensive tools for creating, tracking, and managing student projects</p>
                    </div>
                    <div class="text-center">
                        <div class="bg-custom/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                            <i class="fas fa-clock text-2xl text-custom"></i>
                        </div>
                        <h3 class="font-medium mb-2">Document Control</h3>
                        <p class="text-gray-600">Secure storage and version control for all project documents</p>
                    </div>
                    <div class="text-center">
                        <div class="bg-custom/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                            <i class="fas fa-chart-line text-2xl text-custom"></i>
                        </div>
                        <h3 class="font-medium mb-2">Approval Workflow</h3>
                        <p class="text-gray-600">Streamlined approval process with multiple stakeholder roles</p>
                    </div>

                </div>
            </div>
        </section>
    );

    // registraction
    const RegistrationSection = () => (
        <section class="py-16 bg-custom">
            <div class="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <h2 class="text-3xl font-semibold text-white mb-6">Start Your Project Journey</h2>
                <p class="text-xl text-white/90 mb-8 max-w-2xl mx-auto">Begin your academic project journey with our comprehensive project management system. Get started in minutes.</p>
                <button class="!rounded-button bg-white text-custom px-8 py-3 hover:bg-gray-100">Register Now</button>
                <div class="mt-12 grid grid-cols-3 gap-8 text-white/90">
                    <div>
                        <h3 class="font-medium mb-2">Required Documents</h3>
                        <ul class="space-y-2">
                            <li>Student ID Card</li>
                            <li>Valid Email Address</li>
                            <li>Course Registration Details</li>
                        </ul>
                    </div>
                    <div>
                        <h3 class="font-medium mb-2">Registration Process</h3>
                        <ul class="space-y-2">
                            <li>Fill Basic Information</li>
                            <li>Verify Email</li>
                            <li>Complete Profile</li>
                        </ul>
                    </div>
                    <div>
                        <h3 class="font-medium mb-2">Support Available</h3>
                        <ul class="space-y-2">
                            <li>24/7 Email Support</li>
                            <li>Live Chat During Business Hours</li>
                            <li>Detailed Documentation</li>
                        </ul>
                    </div>
                </div>
            </div>
        </section>
    );



    return (
        <div>

            <Hero />
            <section className="py-16 bg-white">
                <div className=" max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-3 gap-8">
                    <PrincipalMessage />
                    <Notifications />

                    {/* login corner */}
                    <div ref={loginRef}>
                        <div className="bg-white  shadow-gray-300   rounded-[20px] shadow-2xl p-8 space-y-8 border border-gray-100">
                            <h2 className="text-xl font-semibold mb-6">Login</h2>

                            <form className="space-y-6" onSubmit={handleLogin}>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Role</label>
                                    <select value={role} onChange={(e) => setRole(e.target.value)} className="mt-1 block w-full border-gray-300 focus:ring-custom focus:border-custom rounded-md">
                                        <option value="student">Student</option>
                                        <option value="hod">HOD</option>
                                        <option value="project-head">Project Head</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Email</label>
                                    <input
                                        onChange={(e) => setEmail(e.target.value)}
                                        type="email"
                                        className="mt-1 block w-full border-gray-300 focus:ring-custom focus:border-custom rounded-md"
                                        placeholder="Enter your email"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Password</label>
                                    <input
                                        onChange={(e) => setPass(e.target.value)}
                                        type="password"
                                        className="mt-1 block w-full border-gray-300 focus:ring-custom focus:border-custom rounded-md"
                                        placeholder="Enter your password"
                                    />
                                </div>
                                <button type='submit' className="w-full flex justify-center py-2 px-4 border border-transparent text-sm   bg-custom  bg-blue-500 hover:bg-blue-600 text-white font-medium transition-colors duration-300 rounded-md">
                                    {loading ? (
                                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                                        </svg>
                                    ) : (
                                        'Sign in'
                                    )}
                                </button>
                            </form>

                            <br></br>
                            <div className='w-full flex justify-center items-center'>
                                <Link to='/signup' className='text-blue-900 '>not have an account? sign up</Link>
                            </div>

                        </div>
                    </div>
                </div>
            </section>
            <FeaturesSection />
            <RegistrationSection />
            <Footer />
        </div>

    )
}

export default Home