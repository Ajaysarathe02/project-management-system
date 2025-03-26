import React, { useContext, useState } from "react";
import { UserContext } from "../context/contextApi";

function StudentProfile() {
  const { user } = useContext(UserContext);
  const [profilePicture, setProfilePicture] = useState(null); // State for profile picture
  const [isEditing, setIsEditing] = useState(false); // State for edit mode
  const [editableData, setEditableData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: "+1 (555) 123-4567",
    dob: "March 15, 2000",
    gender: "Female",
    address: "123 University Ave, College Town, ST 12345",
  });

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

  // Save changes and exit edit mode
  const handleSave = () => {
    // Here, you can send the updated data to the server if needed
    console.log("Updated Profile Data:", editableData);
    setIsEditing(false); // Exit edit mode
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
    setIsEditing(false); // Exit edit mode
  };

  return (
    <div className="bg-gray-900 min-h-screen rounded-2xl">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-semibold text-white">Profile</h1>
        <p className="mt-2 text-gray-400">View and edit your profile details</p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <div className="bg-gray-800 shadow rounded-lg p-6">
              <div className="text-center">
                <div className="relative inline-block">
                  {/* Display profile picture or default image */}
                  <img
                    className="h-32 w-32 rounded-full object-cover mx-auto"
                    src={
                      profilePicture ||
                      "https://e7.pngegg.com/pngimages/799/987/png-clipart-computer-icons-avatar-icon-design-avatar-heroes-computer-wallpaper-thumbnail.png"
                    }
                    alt="Profile photo"
                  />
                  <label
                    htmlFor="profilePictureInput"
                    className="absolute bottom-0 right-0 bg-custom text-white p-2 rounded-full shadow-lg cursor-pointer"
                  >
                    <i className="fas fa-camera"></i>
                  </label>
                  <input
                    id="profilePictureInput"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleProfilePictureUpload}
                  />
                </div>
                <h2 className="mt-4 text-xl font-semibold text-white">
                  {editableData.name}
                </h2>
                <p className="text-gray-400">Student ID: ST2023456</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-8">
            <div className="bg-gray-800 shadow rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-6">
                Personal Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300">
                    Full Name
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="name"
                      value={editableData.name}
                      onChange={handleInputChange}
                      className="mt-1 w-full bg-gray-700 text-white rounded-lg p-2"
                    />
                  ) : (
                    <p className="mt-1 text-white">{editableData.name}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300">
                    Email Address
                  </label>
                  {isEditing ? (
                    <input
                      type="email"
                      name="email"
                      value={editableData.email}
                      onChange={handleInputChange}
                      className="mt-1 w-full bg-gray-700 text-white rounded-lg p-2"
                    />
                  ) : (
                    <p className="mt-1 text-white">{editableData.email}</p>
                  )}
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
          </div>
        </div>

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
      </div>
    </div>
  );
}

export default StudentProfile;