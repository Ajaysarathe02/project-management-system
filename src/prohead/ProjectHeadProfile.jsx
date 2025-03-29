import React, { useContext, useState } from "react";
import { ProjectHeadContext } from "../context/contextApi";
import { storage, databases, database_id, ID } from "../lib/appwrite";

function ProjectHeadProfile() {
  const { projectHead, setProjectHeadPicture } = useContext(ProjectHeadContext); // Access context
  const [projectHeadPicture, setProjectHeadPictureState] = useState(null); // Local state for profile picture
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal state
  const [uploadStatus, setUploadStatus] = useState("idle"); // Upload status
  const [selectedPicture, setSelectedPicture] = useState(null); // Selected picture for upload

  // Generate file URL
  const generateFileUrl = (fileId) => {
    return `https://cloud.appwrite.io/v1/storage/buckets/67d541b9000f5101fd5d/files/${fileId}/view?project=67d013a6000a87361603`;
  };

  // Handle profile picture selection
  const handleProfilePictureUpload = (e) => {
    const file = e.target.files[0];

    // Validate file size (max 2MB)
    if (file && file.size > 2 * 1024 * 1024) {
      alert("File size exceeds 2MB. Please upload a smaller file.");
      return;
    }

    // Update the selected picture state
    if (file) {
      setSelectedPicture(file);
      setProjectHeadPictureState(URL.createObjectURL(file)); // Temporary preview
    }
  };

  // Upload profile picture to the server
  const uploadProfilePicture = async () => {
    if (!selectedPicture) {
      alert("Please select a profile picture first.");
      return;
    }

    setUploadStatus("uploading");

    try {
      const fileId = ID.unique(); // Generate a unique ID for the new file
      const newPic = await storage.createFile(
        "67d541b9000f5101fd5d", // Replace with your Appwrite bucket ID
        fileId,
        selectedPicture
      );

      if (newPic) {
        // Check if the project head already has an existing profile picture
        if (projectHead?.userPicture?.imageId) {
          try {
            // Delete the old profile picture
            await storage.deleteFile(
              "67d541b9000f5101fd5d", // Replace with your Appwrite bucket ID
              projectHead.userPicture.imageId
            );
            console.log("Old profile picture deleted successfully.");
          } catch (deleteError) {
            console.error("Error deleting old profile picture:", deleteError);
          }
        }

        // Update the profile picture in the database
        const updatePICinCollection = await databases.updateDocument(
          database_id,
          "67d08e060038dec0bac3", // Replace with your Appwrite collection ID
          projectHead.$id,
          {
            userPicture: { imageId: newPic.$id }, // Save the new picture's file ID
          }
        );

        if (updatePICinCollection) {
          const newPicUrl = generateFileUrl(newPic.$id);
          setProjectHeadPicture(newPicUrl); // Update the context with the new profile picture URL
          setProjectHeadPictureState(newPicUrl); // Update the local state
          setIsModalOpen(false); // Close the modal
          alert("Profile picture uploaded successfully!");
        }
      }
    } catch (error) {
      console.error("Error uploading profile picture:", error);
      alert("Failed to upload profile picture. Please try again.");
    } finally {
      setUploadStatus("idle");
    }
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
                  <img
                    className="h-32 w-32 rounded-full object-cover mx-auto"
                    src={
                      projectHeadPicture ||
                      "https://e7.pngegg.com/pngimages/799/987/png-clipart-computer-icons-avatar-icon-design-avatar-heroes-computer-wallpaper-thumbnail.png"
                    }
                    alt="Profile photo"
                  />
                  <button
                    onClick={() => setIsModalOpen(true)} // Open the modal
                    className="absolute bottom-0 right-0 bg-custom text-white p-2 rounded-full shadow-lg"
                  >
                    <i className="fas fa-camera"></i>
                  </button>
                </div>
                <h2 className="mt-4 text-xl font-semibold text-white">
                  {projectHead?.Name}
                </h2>
                <p className="text-gray-400">Professor ID : ST2023456</p>
              </div>
            </div>

            <div className="bg-gray-800 shadow rounded-lg p-6 mt-8">
              <h3 className="text-lg font-semibold text-white mb-4">Bio</h3>
              <p className="text-gray-300">
                Passionate about guiding students and contributing to innovative
                projects in the field of computer science and engineering.
              </p>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-8">
            {/* Personal Information */}
            <div className="bg-gray-800 shadow rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-6">
                Personal Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300">
                    Full Name
                  </label>
                  <p className="mt-1 text-white">{projectHead?.Name}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300">
                    Email Address
                  </label>
                  <p className="mt-1 text-white">{projectHead?.Email}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300">
                    Phone Number
                  </label>
                  <p className="mt-1 text-white">+1 (555) 123-4567</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300">
                    Date of Birth
                  </label>
                  <p className="mt-1 text-white">March 15, 2000</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300">
                    Gender
                  </label>
                  <p className="mt-1 text-white">Female</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300">
                    Address
                  </label>
                  <p className="mt-1 text-white">
                    123 University Ave, College Town, ST 12345
                  </p>
                </div>
              </div>
            </div>

            {/* Academic Information */}
            <div className="bg-gray-800 shadow rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-6">
                Academic Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300">
                    Professor ID
                  </label>
                  <p className="mt-1 text-white">ST2023456</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300">
                    Branch/Department
                  </label>
                  <p className="mt-1 text-white">{projectHead?.Department}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300">
                    Designation
                  </label>
                  <p className="mt-1 text-white">{projectHead?.Designation}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300">
                    Admission Year
                  </label>
                  <p className="mt-1 text-white">2020</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal for Uploading Profile Picture */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-gray-800 rounded-lg shadow-lg p-6 w-96">
              <h2 className="text-lg font-semibold text-white mb-4">
                Upload Profile Picture
              </h2>
              <input
                type="file"
                accept="image/*"
                onChange={handleProfilePictureUpload}
                className="block w-full text-sm text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700"
              />
              {projectHeadPicture && (
                <img
                  src={projectHeadPicture}
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
                  onClick={() => setIsModalOpen(false)}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg shadow-lg"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProjectHeadProfile;