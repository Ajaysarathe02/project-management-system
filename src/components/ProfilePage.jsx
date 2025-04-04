import React, { useState, useEffect } from "react";
import { storage, databases, database_id, ID } from "../lib/appwrite";
import StatusModal from "./StatusModal";

function ProfilePage({
    userData,
    onUpdateProfilePicture,
    roleSpecificFields,
    bucketId,
    collectionId,
}) {

    const [profilePicture, setProfilePicture] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedPicture, setSelectedPicture] = useState(null);
    const [previewPicture, setPreviewPicture] = useState(null); // For previewing the selected image
    const [uploadStatus, setUploadStatus] = useState(null); // "uploading", "success", "error"
    const [statusMessage, setStatusMessage] = useState(""); // Message to display in the modal

    const DEFAULT_PROFILE_PICTURE =
        "https://e7.pngegg.com/pngimages/799/987/png-clipart-computer-icons-avatar-icon-design-avatar-heroes-computer-wallpaper-thumbnail.png";

    const generateFileUrl = (fileId) => {
        return `https://cloud.appwrite.io/v1/storage/buckets/${bucketId}/files/${fileId}/view?project=67d013a6000a87361603`;
    };

    const handleProfilePictureUpload = (e) => {
        const file = e.target.files[0];
        if (file && file.size > 2 * 1024 * 1024) {
            alert("File size exceeds 2MB. Please upload a smaller file.");
            return;
        }
        if (file) {
            setSelectedPicture(file);
            setPreviewPicture(URL.createObjectURL(file)); // Show a preview of the selected image
        }
    };

    const uploadProfilePicture = async () => {
        if (!selectedPicture) {
            alert("Please select a profile picture first.");
            return;
        }

        setUploadStatus("uploading");
        setStatusMessage("Uploading your profile picture...");

        try {
            const fileId = ID.unique();
            const newPic = await storage.createFile(bucketId, fileId, selectedPicture);

            if (newPic) {
                if (userData?.profilePictureId) {
                    try {
                        await storage.deleteFile(bucketId, userData.profilePictureId);
                    } catch (deleteError) {
                        console.error("Error deleting old profile picture:", deleteError);
                    }
                }

                const updatedUser = await databases.updateDocument(
                    database_id,
                    collectionId,
                    userData.id,
                    { profilePictureId: newPic.$id }
                );

                if (updatedUser) {
                    const newPicUrl = `${generateFileUrl(newPic.$id)}&timestamp=${new Date().getTime()}`;
                    onUpdateProfilePicture(newPicUrl); // Notify parent about the new profile picture URL
                    setProfilePicture(newPicUrl); // Update the profile picture only after successful upload
                    setPreviewPicture(null); // Clear the preview
                    setIsModalOpen(false);

                    setUploadStatus("success");
                    setStatusMessage("Profile picture uploaded successfully!");
                }
            }
        } catch (error) {
            setUploadStatus("error");
            setStatusMessage("Failed to upload. Please try again.");
        } finally {
            setTimeout(() => setUploadStatus(null), 3000);
        }
    };

    useEffect(() => {
      setProfilePicture(generateFileUrl(userData?.profilePictureId));
    }, [userData?.profilePictureId]);
    

    return (
        <div className="bg-gray-900 min-h-screen rounded-2xl">
            <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <h1 className="text-2xl font-semibold text-white">Profile</h1>
                <p className="mt-2 text-gray-400">View and edit your profile details</p>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-5">
                    <div className="lg:col-span-1">
                        <div className="bg-gray-800 shadow rounded-lg p-6">
                            <div className="text-center">
                                <div className="relative inline-block">
                                    <img
                                        className="h-32 w-32 rounded-full object-cover mx-auto"
                                        src={profilePicture ? profilePicture : DEFAULT_PROFILE_PICTURE}
                                        alt="Profile photo 1"
                                    />
                                    <button
                                        onClick={() => setIsModalOpen(true)}
                                        className="absolute bottom-0 right-0 bg-custom text-white p-2 rounded-full shadow-lg"
                                    >
                                        <i className="fas fa-camera"></i>
                                    </button>
                                </div>
                                <h2 className="mt-4 text-xl font-semibold text-white">
                                    {userData?.name}
                                </h2>
                                <p className="text-gray-400">{userData?.role}</p>
                            </div>
                        </div>

                        <div className="bg-gray-800 shadow rounded-lg p-6 mt-8">
                            <h3 className="text-lg font-semibold text-white mb-4">Bio</h3>
                            <p className="text-gray-300">{userData?.bio}</p>
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
                                    <p className="mt-1 text-white">{userData?.name}</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-300">
                                        Email Address
                                    </label>
                                    <p className="mt-1 text-white">{userData?.email}</p>
                                </div>
                                {roleSpecificFields.map((field) => (
                                    <div key={field.label}>
                                        <label className="block text-sm font-medium text-gray-300">
                                            {field.label}
                                        </label>
                                        <p className="mt-1 text-white">{field.value}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

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
                                aria-label="Upload profile picture"
                                className="block w-full text-sm text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700"
                            />
                            {previewPicture && (
                                <img
                                    src={previewPicture}
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
                                    onClick={() => {
                                        setIsModalOpen(false);
                                        setPreviewPicture(null); // Clear the preview if canceled
                                    }}
                                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg shadow-lg"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <StatusModal status={uploadStatus} message={statusMessage} />
        </div>
    );
}

export default ProfilePage;

