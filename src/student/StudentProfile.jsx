import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../context/contextApi";
import { client, databases, database_id, ID, account, storage } from "../lib/appwrite";
import { Query } from "appwrite";


function StudentProfile() {
    const { user, fetchStudentData } = useContext(UserContext);
    const [profilePicture, setProfilePicture] = useState(null); // State for profile picture
    const [isEditing, setIsEditing] = useState(false); // State for edit mode
    const [studentData, setStudentData] = useState(null);
    const [loading, setLoading] = useState(true); // Loading state
    const [studentPicture, setStudentPicture] = useState(null);
    const [studentTempPic, setStudentTempPic] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false); // State for modal visibility
    const [uploadStatus, setUploadStatus] = useState("idle");

    const [editableData, setEditableData] = useState({
        name: user?.name || "",
        email: user?.email || "",
        phone: "+1 (555) 123-4567",
        dob: "March 15, 2000",
        gender: "Female",
        address: "123 University Ave, College Town, ST 12345",
    });

    useEffect(() => {
        const fetchData = async () => {
            if (user) {
                setLoading(true)
                const data = await fetchStudentData(user.$id);
                setStudentData(data); // Update the state with the fetched data
                console.log("Student Data: ", data);
                setLoading(false); // Update the loading state    
            } else {
                setLoading(false);
            }
        };
        fetchData();
    }, [user]);

    useEffect(() => {
        if (studentData) {
            setAcademicData((prevData) => ({
                ...prevData,
                enrollmentNumber: studentData.Roll, // Set enrollmentNumber to studentData.Roll
                course: "B.Tech Computer Science",
                year: "3rd Year",
                cgpa: studentData.CGPA,
            }));
        }

        if (studentData != null) {
            const data = generateFileUrl(studentData.userPicture)
            setStudentTempPic(data)
        }


    }, [studentData]);



    const [academicData, setAcademicData] = useState({
        enrollmentNumber: "",
        course: "B.Tech Computer Science",
        year: "3rd Year",
        cgpa: "8.5",
    });

    // update the information of the user
    const updateStudentInfo = async (e) => {
        e.preventDefault();

        try {
            // checking if student is available in the database
            const studentDoc = await databases.listDocuments(
                database_id,
                "67d08e060038dec0bac3", // students collection
                [Query.equal("userid", user.$id)]
            );

            if (studentDoc.documents.length > 0) {

                await databases.updateDocument(
                    database_id,
                    "67d08e060038dec0bac3",
                    user.$id,
                    {
                        Name: editableData.name,
                        Email: editableData.email,
                        Phone: editableData.phone,
                        DOB: editableData.dob,
                        Address: editableData.address,
                        CGPA: academicData.cgpa,
                        Semester: academicData.year,

                    }
                ).then(() => { alert("Student information updated successfully") });

            } else {
                alert("Student not found in the database");
            }


        }
        catch (error) {
            console.log("Error: ", error);
        }
    }

    const [bio, setBio] = useState(
        "Passionate computer science student with a keen interest in artificial intelligence and machine learning. Always eager to learn new technologies and contribute to innovative projects."
    );

    // Handle profile picture upload
    const handleProfilePictureUpload = (e) => {
        const file = e.target.files[0];

        // Validate file size (max 2MB)
        if (file && file.size > 2 * 1024 * 1024) {
            alert("File size exceeds 2MB. Please upload a smaller file.");
            return;
        }

        // Update the profile picture state
        if (file) {
            setProfilePicture(URL.createObjectURL(file)); // Create a temporary URL for the uploaded file
            setStudentPicture(file);
        }
    };

    // Upload profile picture to the server
    const uploadProfilePicture = async () => {
        setUploadStatus("uploading");

        if (!studentPicture) {
            alert("Please select a profile picture first.");
            return;
        }

        try {
            const fileId = ID.unique(); // Generate a unique ID for the file
            const picID = await storage.createFile(
                "67d541b9000f5101fd5d", // Replace with your Appwrite bucket ID
                fileId,
                studentPicture
            );

            if (picID) {
                if (studentData?.userPicture) {

                    try {
                        // deleting old picture
                        await storage.deleteFile(
                            "67d541b9000f5101fd5d",
                            studentData?.userPicture
                        ).then(() => console.log("old picture deleting successfully"));

                    } catch (e) {
                        alert("old picture error")
                        setUploadStatus("idle");
                    }

                }

                // update the profile picture
                const updatePICinCollection = await databases.updateDocument(
                    database_id,
                    "67d08e060038dec0bac3", // student collection
                    user.$id,
                    {
                        userPicture: picID.$id
                    }
                )

                if (updatePICinCollection) {
                    setUploadStatus("success");
                    setStudentTempPic(generateFileUrl(picID.$id))
                    setIsModalOpen(false);

                }

            } else {
                console.log("image uploading error ")
                setUploadStatus("idle");
            }

            setTimeout(() => {
                setUploadStatus("idle")
                // for clear form
            }, 2000)

        } catch (error) {
            console.error("Error uploading profile picture:", error);
            alert("Failed to upload profile picture. Please try again.");
        }
    };

    // Handle input changes for editable fields
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditableData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    // Handle input changes for academic information
    const handleAcademicChange = (e) => {
        const { name, value } = e.target;
        setAcademicData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    // Save changes and exit edit mode
    const handleSave = () => {
        // Here, you can send the updated data to the server if needed
        console.log("Updated Profile Data:", editableData);
        console.log("Updated Academic Data:", academicData);
        console.log("Updated Bio:", bio);
        updateStudentInfo();
        setIsEditing(false);
    };

    // Generate file download/view URL
    const generateFileUrl = (fileId) => {
        // const image = JSON.parse(fileId);
        return `https://cloud.appwrite.io/v1/storage/buckets/67d541b9000f5101fd5d/files/${fileId}/view?project=67d013a6000a87361603`;
    };

    // Cancel editing and reset changes
    const handleCancel = () => {
        setEditableData({
            name: user?.name || "",
            email: user?.email || "",
            phone: "+1 (555) 123-4567",
            dob: "March 15, 2000",
            gender: "Female",
            address: "123 University Ave, College Town, ST 12345",
        });
        setAcademicData({
            enrollmentNumber: "EN2023456",
            course: "B.Tech Computer Science",
            year: "3rd Year",
            cgpa: "8.5",
        });
        setBio(
            "Passionate computer science student with a keen interest in artificial intelligence and machine learning. Always eager to learn new technologies and contribute to innovative projects."
        );
        setIsEditing(false); // Exit edit mode
    };

    if (loading) {
        return <p>Loading...</p>; // Show a loading message while fetching data
    }

    if (!studentData) {
        return <p>No student data found.</p>; // Show a message if no data is found
    }

    return (
        <div className="bg-gray-900 min-h-screen rounded-2xl">
            <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <h1 className="text-2xl font-semibold text-white">Profile</h1>
                <p className="mt-2 text-gray-400">View and edit your profile details</p>

                <div className="">
                    <div className="">
                        <div className="bg-gray-800 shadow rounded-lg p-6">
                            <div className="text-center">
                                <div className="relative inline-block">
                                    {/* Display profile picture or default image */}
                                    <img
                                        className="h-32 w-32 rounded-full object-cover mx-auto"
                                        src={
                                            studentTempPic ? studentTempPic
                                                : "https://e7.pngegg.com/pngimages/799/987/png-clipart-computer-icons-avatar-icon-design-avatar-heroes-computer-wallpaper-thumbnail.png"
                                        }
                                        alt="Profile photo"
                                    />
                                    <label
                                        onClick={() => setIsModalOpen(true)} // Open the modal
                                        className="absolute bottom-0 right-0 bg-custom text-white p-2 rounded-full shadow-lg cursor-pointer"
                                    >
                                        <i className="fas fa-camera"></i>
                                    </label>

                                    

                                    {isModalOpen && (
                                        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                                            <div className="bg-gray-800 rounded-lg shadow-lg p-6 w-96">
                                                <h2 className="text-lg font-semibold text-white mb-4">Upload Profile Picture</h2>
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={handleProfilePictureUpload}
                                                    className="block w-full text-sm text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700"
                                                />
                                                {studentPicture && (
                                                    <img
                                                        src={URL.createObjectURL(studentPicture)}
                                                        alt="Preview"
                                                        className="mt-4 h-32 w-32 rounded-full object-cover mx-auto"
                                                    />
                                                )}
                                                <div className="mt-6 flex justify-between">
                                                    <button
                                                        onClick={uploadProfilePicture}
                                                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-lg"
                                                    >
                                                        Upload
                                                    </button>
                                                    <button
                                                        onClick={() => setIsModalOpen(false)} // Close the modal
                                                        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg shadow-lg"
                                                    >
                                                        Cancel
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                </div>

                                <div className="mt-10">
                                        <label className="block text-sm font-medium text-gray-300">
                                            Student ID :
                                        </label>

                                        <p className="mt-1 text-white">
                                            {academicData.enrollmentNumber}
                                        </p>

                                    </div>
                            </div>

                            {/* Bio Section */}
                            <div className="bg-gray-800 shadow rounded-lg p-6 mt-8">
                                <h3 className="text-lg font-semibold text-white mb-6">Bio</h3>
                                {isEditing ? (
                                    <textarea
                                        value={bio}
                                        onChange={(e) => setBio(e.target.value)}
                                        className="mt-1 w-full bg-gray-700 text-white rounded-lg p-2"
                                        rows="4"
                                    />
                                ) : (
                                    <p className="mt-1 text-white">{bio}</p>
                                )}
                            </div>
                        </div>

                        <div className=" space-y-8">
                            {/* Personal Information Section */}
                            <div className="bg-gray-800 shadow rounded-lg p-6 mt-8">
                                <h3 className="text-lg font-semibold text-white mb-6">
                                    Personal Information
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300">
                                            Full Name
                                        </label>

                                        <p className="mt-1 text-white">{editableData.name}</p>

                                    </div>
                                    <div>

                                        <label className="block text-sm font-medium text-gray-300">
                                            Email Address
                                        </label>

                                        <p className="mt-1 text-white">{editableData.email}</p>

                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300">
                                            Phone Number
                                        </label>
                                        {isEditing ? (
                                            <input
                                                type="text"
                                                name="phone"
                                                value={editableData.phone}
                                                onChange={handleInputChange}
                                                className="mt-1 w-full bg-gray-700 text-white rounded-lg p-2"
                                            />
                                        ) : (
                                            <p className="mt-1 text-white">{editableData.phone}</p>
                                        )}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300">
                                            Date of Birth
                                        </label>
                                        {isEditing ? (
                                            <input
                                                type="date"
                                                name="dob"
                                                value={editableData.dob}
                                                onChange={handleInputChange}
                                                className="mt-1 w-full bg-gray-700 text-white rounded-lg p-2"
                                            />
                                        ) : (
                                            <p className="mt-1 text-white">{editableData.dob}</p>
                                        )}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300">
                                            Gender
                                        </label>
                                        {isEditing ? (
                                            <select
                                                name="gender"
                                                value={editableData.gender}
                                                onChange={handleInputChange}
                                                className="mt-1 w-full bg-gray-700 text-white rounded-lg p-2"
                                            >
                                                <option>Male</option>
                                                <option>Female</option>
                                                <option>Other</option>
                                            </select>
                                        ) : (
                                            <p className="mt-1 text-white">{editableData.gender}</p>
                                        )}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300">
                                            Address
                                        </label>
                                        {isEditing ? (
                                            <textarea
                                                name="address"
                                                value={editableData.address}
                                                onChange={handleInputChange}
                                                className="mt-1 w-full bg-gray-700 text-white rounded-lg p-2"
                                            />
                                        ) : (
                                            <p className="mt-1 text-white">{editableData.address}</p>
                                        )}
                                    </div>
                                </div>
                            </div>



                            {/* Academic Information Section */}
                            <div className="bg-gray-800 shadow rounded-lg p-6">
                                <h3 className="text-lg font-semibold text-white mb-6">
                                    Academic Information
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300">
                                            Enrollment Number
                                        </label>

                                        <p className="mt-1 text-white">
                                            {academicData.enrollmentNumber}
                                        </p>

                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300">
                                            Course
                                        </label>
                                        {isEditing ? (
                                            <input
                                                type="text"
                                                name="course"
                                                value={academicData.course}
                                                onChange={handleAcademicChange}
                                                className="mt-1 w-full bg-gray-700 text-white rounded-lg p-2"
                                            />
                                        ) : (
                                            <p className="mt-1 text-white">{academicData.course}</p>
                                        )}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300">
                                            Year
                                        </label>
                                        {isEditing ? (
                                            <input
                                                type="text"
                                                name="year"
                                                value={academicData.year}
                                                onChange={handleAcademicChange}
                                                className="mt-1 w-full bg-gray-700 text-white rounded-lg p-2"
                                            />
                                        ) : (
                                            <p className="mt-1 text-white">{academicData.year}</p>
                                        )}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300">
                                            CGPA
                                        </label>
                                        {isEditing ? (
                                            <input
                                                type="text"
                                                name="cgpa"
                                                value={academicData.cgpa}
                                                onChange={handleAcademicChange}
                                                className="mt-1 w-full bg-gray-700 text-white rounded-lg p-2"
                                            />
                                        ) : (
                                            <p className="mt-1 text-white">{academicData.cgpa}</p>
                                        )}
                                    </div>
                                </div>
                            </div>


                        </div>
                    </div>

                    {/* Save and Cancel Buttons */}
                    <div className="mt-8 flex justify-center space-x-4">
                        {isEditing ? (
                            <>
                                <button
                                    onClick={handleSave}
                                    className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg shadow-lg transition-all duration-200"
                                >
                                    Save
                                </button>
                                <button
                                    onClick={handleCancel}
                                    className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-lg shadow-lg transition-all duration-200"
                                >
                                    Cancel
                                </button>
                            </>
                        ) : (
                            <button
                                onClick={() => setIsEditing(true)}
                                className="bg-custom hover:bg-custom/90 text-white px-8 py-3 rounded-lg shadow-lg transition-all duration-200"
                            >
                                <i className="fas fa-edit mr-2"></i>
                                Update Profile
                            </button>
                        )}
                    </div>
                </div >
            </div >
            {/* overlay for uploading animation */}
            {uploadStatus === "uploading" &&

                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg flex flex-col items-center">

                        <svg
                            className="animate-spin h-10 w-10 text-blue-500 mb-4"
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
                        <p className="text-lg font-medium text-gray-700">Uploading...</p>
                    </div>
                </div>

            }

            {uploadStatus === "success" &&

                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg flex flex-col items-center">

                        <svg
                            className="h-10 w-10 text-green-500 mb-4"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth="2"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M5 13l4 4L19 7"
                            />
                        </svg>
                        <p className="text-lg font-medium text-gray-700">Uploaded Successfully!</p>
                    </div>
                </div>

            }
        </div>

    )
};

export default StudentProfile;