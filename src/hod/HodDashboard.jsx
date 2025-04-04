import React, { useState, useEffect, useContext } from "react";
import { databases, database_id, account } from "../lib/appwrite"; // Import Appwrite configuration
import { HodContext, UserContext } from "../context/contextApi";
import { toast, ToastContainer } from "react-toastify";
import HodOverview from "./HodOverview";
import HodProfile from "./HodProfile";
import HodManageProjects from "./HodManageProjects";
import HodReports from "./HodReports";
import HodSettings from "./HodSettings";
import { Link, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { motion } from 'motion/react';
import HodChat from "./HodChat";

function HodDashboard() {
    const { user } = useContext(UserContext); // Access the logged-in user
    const {hodUser,getHodUser} = useContext(HodContext);
    const [currentHod, setCurrentHod] = useState("");
    const [isCollapsed, setIsCollapsed] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true); // Add a loading state

    const getHOD = async () => {
        try {
            const data = await account.get();
            setCurrentHod(data);
        } catch (error) {
            console.error("Error fetching HOD data:", error);
            toast.error("Failed to load HOD data.", {
                position: "top-center",
                autoClose: 3000,
            });
        }
    };

    const toggleCollapse = () => {
        setIsCollapsed(!isCollapsed);
    };

    const handleLogout = async () => {
        try {
            await account.deleteSession("current");
            toast.success("Logged out successfully.", { position: 'top-center', autoClose: 3000 });
            navigate("/"); // Redirect to the home page or login page
        } catch (error) {
            console.error("Error logging out:", error);
            alert("Error logging out.");
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true); // Set loading to true before fetching
            await getHodUser(); // Fetch HOD user details
            await getHOD(); // Fetch current HOD data
            setLoading(false); // Set loading to false after fetching
        };

        fetchData(); // Fetch data on component mount
    }, []);


    // Define the navigation items
    const navItems = [
        {
            path: "/hod-dash",
            label: "Overview",
            icon: "fas fa-home",
        },
        {
            path: "/hod-dash/profile",
            label: "Profile",
            icon: "fas fa-user",
        },
        {
            path: "/hod-dash/reports",
            label: "Reports",
            icon: "fas fa-chart-line",
        },
        {
            path: "/hod-dash/settings",
            label: "Settings",
            icon: "fas fa-cog",
        },
        {
            path: "/hod-dash/chat",
            label: "Chat",
            icon: "fas fa-cog",
        },
    ];

    if (loading) {
        // Show a loading spinner or message while data is being fetched
        return (
            <div className="flex items-center justify-center h-screen bg-black text-white">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 border-solid mb-4"></div>
                    <p className="text-lg font-medium">Loading Dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex h-screen text-white bg-black">
            <ToastContainer />
            <aside
                className={`bg-gray-900 p-6 flex flex-col text-white m-3 rounded-3xl mb-[100px] transition-all duration-300 ${isCollapsed ? "w-20" : "w-64"
                    }`}
            >
                <div className="flex justify-between items-center mb-8">
                    <h1
                        className={`text-2xl font-bold transition-opacity duration-300 ${isCollapsed ? "opacity-0" : "opacity-100"
                            }`}
                    >
                        {`Hello ${currentHod.name}`}
                    </h1>
                    <button onClick={toggleCollapse} className="text-white">
                        <i
                            className={`fas ${isCollapsed ? "fa-chevron-right" : "fa-chevron-left"
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
                            className={`flex relative items-center p-3 rounded-lg ${location.pathname === item.path
                                    ? "bg-blue-600 text-white"
                                    : "hover:bg-gray-800 text-gray-200"
                                }`}
                        >
                            <i className={`${item.icon} w-5 mr-5`}></i>
                            <span
                                className={`ml-3 transition-opacity duration-300 ${isCollapsed ? "opacity-0" : "opacity-100"
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
                            className={`ml-3 transition-opacity duration-300 ${isCollapsed ? "opacity-0" : "opacity-100"
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
                        <Route path="/" element={<HodManageProjects />} />
                        <Route path="/profile" element={<HodProfile />} />
                        <Route path="/reports" element={<HodReports />} />
                        <Route path="/settings" element={<HodSettings />} />
                        <Route path="/chat" element={<HodChat />} />

                        {/* Add more routes as needed */}
                    </Routes>
                </div>
            </main>
        </div>
    );
}

export default HodDashboard;