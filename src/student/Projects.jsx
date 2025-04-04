import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../context/contextApi";
import { motion } from "motion/react";
import { databases, database_id, ID, account, client, storage } from "../lib/appwrite";
import { Query } from "appwrite";
import { APPWRITE_CONFIG } from "../lib/appwriteConfig";

const Projects = () => {

  const { fetchProjects, user, projects } = useContext(UserContext);
  const [projectsList, SetProjectsList] = useState([]);
  const [isRevisionModalOpen, setIsRevisionModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null); // Store the project being edited
  const [updatedProjectData, setUpdatedProjectData] = useState({}); // Store updated project data
  const [newImages, setNewImages] = useState([]); // Store new images
  const [newAttachments, setNewAttachments] = useState([]); // Store new attachments
  const [oldAttachments, setOldAttachments] = useState({});
  const [oldImages, setOldImages] = useState({});


  useEffect(() => {
    if (user) {
      fetchProjectsFromCollection(user.$id);
    }
  }, [projectsList]);

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const fetchProjectsFromCollection = async (userId) => {
    try {
      const response = await databases.listDocuments(
        APPWRITE_CONFIG.DATABASE_ID,
        APPWRITE_CONFIG.COLLECTIONS.PROJECTS, // Replace with your Project collection ID
        [Query.equal("uploadBy", userId)] // Assuming "createdBy" is the field storing the user ID
      );

      const project = response.documents;

      if (response.documents.length > 0) {
        SetProjectsList(project)
      }

    } catch (error) {
      console.error("Error fetching projects:", error);

    }
  };

  // delete project button
  const handleDelete = async (projectId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this project?");
    if (!confirmDelete) return;

    try {
      // Fetch the student's document
      const studentDoc = await databases.getDocument(
        database_id,
        "67d08e060038dec0bac3", // Replace with your Students collection ID
        user.$id // The logged-in student's document ID
      );

      // Parse the Projects array (convert JSON strings to objects)
      // Parse the Projects array (convert JSON strings to objects)
      const parsedProjects = studentDoc.Projects.map((project) => JSON.parse(project));

      // Filter out the project to be deleted
      const updatedProjects = parsedProjects.filter((project) => project.projectId !== projectId);
      // Serialize the updated Projects array back to JSON strings
      const serializedProjects = updatedProjects.map((project) => JSON.stringify(project));

      console.log("updated project ", serializedProjects)

      const deleteProject = await databases.updateDocument(
        database_id,
        "67d08e060038dec0bac3", // Replace with your Students collection ID
        user.$id, // The logged-in student's document ID
        { Projects: serializedProjects }
      );


      if (deleteProject) {
        alert("Project deleted successfully! and marked as deletebystudent in project collection");
      }

    } catch (error) {
      console.error("Failed to delete project:", error);
      alert("Failed to delete the project. Please try again.");
    }
  };

  // for opening the model
  const handleOpenRevisionModal = (project) => {
    setEditingProject(project);
    console.log(project)

    setUpdatedProjectData({
      title: project.title,
      description: project.description,
      category: project.category,
      teamMembers: project.teamMembers,
      dueDate: project.dueDate,
      githubLink: project.githubLink,
      technologies: project.technologies,
      attachments: project.attachments, // Use parsed attachments
      images: project.images, // Use parsed images
    });

    setOldAttachments(project.attachments)
    setOldImages(project.images); // Set old images

    setIsRevisionModalOpen(true);

  };

  // for closing the modal
  const handleCloseRevisionModal = () => {
    setIsRevisionModalOpen(false);
    setEditingProject(null);
  };



  const generateFileUrl = (fileId) => {
    const image = JSON.parse(fileId);
    return `https://cloud.appwrite.io/v1/storage/buckets/67d541b9000f5101fd5d/files/${image[0].imageId}/view?project=67d013a6000a87361603`;
  };
  // for submit the revised project


  const handleSubmitRevision = async () => {
    try {

      const parsedAttachments = JSON.parse(editingProject.attachments || "[]");
      const parsedImages = JSON.parse(editingProject.images || "[]");

      let uploadedImages = []; // Default to existing images
      let uploadedAttachments = []; // Default to existing attachments

      // Check if new images are selected
      if (newImages.length > 0) {
        // Delete old images
        if (parsedImages.length > 0) {
          await Promise.all(
            parsedImages.map(async (image) => {
              if (image.imageId) {
                try {
                  await storage.deleteFile(APPWRITE_CONFIG.BUCKETS.FILES, image.imageId);
                  console.log(`Deleted image: ${image.imageName}`);
                } catch (error) {
                  console.error(`Failed to delete image: ${image.imageName}`, error);
                }
              } else {
                console.warn("Missing imageId for image:", image);
              }
            })
          );
        }

        // Upload new images
        await Promise.all(
          newImages.map(async (image) => {
            const response = await storage.createFile(
              APPWRITE_CONFIG.BUCKETS.FILES,
              ID.unique(),
              image
            );
            uploadedImages.push({
              imageId: response.$id,
              imageName: image.name,
              imageSize: image.size,
              imageType: image.type,
            })

          })
        );
      }

      // Check if new attachments are selected
      if (newAttachments.length > 0) {
        // Delete old attachments
        if (parsedAttachments.length > 0) {
          await Promise.all(
            parsedAttachments.map(async (attachment) => {
              if (attachment.fileId) {
                try {
                  await storage.deleteFile(APPWRITE_CONFIG.BUCKETS.FILES, attachment.fileId);
                  console.log(`Deleted attachment: ${attachment.fileName}`);
                } catch (error) {
                  console.error(`Failed to delete attachment: ${attachment.fileName}`, error);
                }
              } else {
                console.warn("Missing fileId for attachment:", attachment);
              }
            })
          );
        }

        // Upload new attachments
        await Promise.all(
          newAttachments.map(async (attachment) => {
            const response = await storage.createFile(
              APPWRITE_CONFIG.BUCKETS.FILES,
              ID.unique(),
              attachment
            );

            uploadedAttachments.push({
              fileId: response.$id,
              fileName: attachment.name,
              fileSize: attachment.size,
              fileType: attachment.type,
            })

          })
        );
      }


      // Explicitly define the fields to update
      const updatedProject = {
        title: updatedProjectData.title,
        description: updatedProjectData.description,
        category: updatedProjectData.category,
        teamMembers: updatedProjectData.teamMembers,
        githubLink: updatedProjectData.githubLink,
        images: [], // Use new images if uploaded, otherwise keep existing
        attachments: [], // Use new attachments if uploaded, otherwise keep existing
        proheadStatus: "Pending Review", // Reset status to pending review
        revisionSubmittedAt: new Date().toLocaleString(), // Track submission time
      };


      console.log("updated project is ", updatedProject)

      const res = await databases.updateDocument(
        APPWRITE_CONFIG.DATABASE_ID,
        APPWRITE_CONFIG.COLLECTIONS.PROJECTS,
        editingProject.$id,
        updatedProject
      );

      const projectCollection = await databases.listDocuments(
        APPWRITE_CONFIG.DATABASE_ID,
        APPWRITE_CONFIG.COLLECTIONS.PROJECTS,
        [Query.equal("uploadBy", user.$id)]
      )

      if (projectCollection.documents.length > 0) {
        const docs = projectCollection.documents[0];

        const updatedImages = [...docs.images, JSON.stringify(uploadedImages)];

        const updatedFiles = [...docs.attachments, JSON.stringify(uploadedAttachments)];

        await databases.updateDocument(
          APPWRITE_CONFIG.DATABASE_ID,
          APPWRITE_CONFIG.COLLECTIONS.PROJECTS,
          editingProject.$id,
          {
            attachments: updatedFiles,
            images: updatedImages,
          }
        );
      }


      if (res) {
        alert("Revised project submitted successfully.");

        // Notify the project-head about the revision request
        await databases.createDocument(
          APPWRITE_CONFIG.DATABASE_ID,
          APPWRITE_CONFIG.COLLECTIONS.NOTIFICATIONS, // Replace with your notifications collection ID
          ID.unique(),
          {
            studentId: user.$id,
            message: `Your assignment project "${editingProject.title}" is updated according to your feedback . Please check the feedback sir.`,
            isRead: false,
            timestamp: new Date().toLocaleString(),
            projectHeadId: editingProject.proheadId,

          }
        );
      } else {
        console.log("no")
      }


      fetchProjectsFromCollection(user.$id); // Refresh the project list
      handleCloseRevisionModal(); // Close the modal
    } catch (error) {
      console.error("Failed to submit revised project:", error);
      alert("Failed to submit revised project. Please try again.");
    }
  };

  return (
    <div className="bg-gray-800 rounded-xl p-6">
      <h2 className="text-2xl font-semibold mb-6 text-white">Projects</h2>
      <p className="text-gray-400 mb-4">List of projects will be displayed here.</p>

      {/* {loading ? */}
      <div>
        {projectsList.length > 0 ? (
          <motion.div
            animate="visible"
            initial="hidden"
            variants={{
              visible: {
                transition: {
                  staggerChildren: 0.1,
                },
              },
            }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {projectsList.map((data, index) => (
              <motion.div
                key={index}
                variants={cardVariants}
                className="bg-gray-700 p-6 rounded-lg shadow-lg"
              >
                <h3 className="text-xl font-bold text-white mb-2">{data.title}</h3>
                <p className="text-gray-400 mb-4">{data.description}</p>
                <div className="text-gray-400 mb-2">
                  <strong>Category:</strong> {data.category}
                </div>
                <div className="text-gray-400 mb-2">
                  <strong>Project Head:</strong> {data.projectHead}
                </div>
                <div className="text-gray-400 mb-2">
                  <strong>GitHub Link:</strong>{" "}
                  <a
                    href={data.githubLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 underline"
                  >
                    {data.githubLink}
                  </a>
                </div>
                <div className="text-gray-400 mb-2">
                  <strong>Due Date:</strong> {data.dueDate}
                </div>

                {data.proheadStatus === "Request Revision" &&
                  <div className="text-gray-400 mb-2">
                    <strong>Deadline Date:</strong> {data.revisionDeadline}
                  </div>
                }
                <div className="text-gray-400 mb-2">
                  <strong>Team Members:</strong>
                  <ul className="list-disc list-inside ml-4">
                    {data.teamMembers.map((member, memberIndex) => (
                      <li key={memberIndex}>{member}</li>
                    ))}
                  </ul>
                </div>
                <div className="text-gray-400 mb-2">
                  <strong>Attachments:</strong>
                  {data.attachments && data.attachments.length > 0 ? (
                    <ul className="list-disc list-inside ml-4">
                      {data.attachments.map((file, fileIndex) => (
                        <li key={fileIndex} className="flex items-center gap-4">
                          <span>{file.fileName}</span>

                          <button
                            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                            onClick={() =>
                              window.open(
                                `https://cloud.appwrite.io/v1/storage/buckets/67d541b9000f5101fd5d/files/${file.fileId}/view?project=67d013a6000a87361603`,
                                "_blank"
                              )
                            }
                          >
                            Preview
                          </button>
                          <a
                            href={`https://cloud.appwrite.io/v1/storage/buckets/67d541b9000f5101fd5d/files/${file.fileId}/download?project=67d013a6000a87361603`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                          >
                            Download
                          </a>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p>No attachments available.</p>
                  )}
                </div>
                {/* Delete Button */}
                <button
                  className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                  onClick={() => handleDelete(data.projectId)} // Pass the project ID to the delete function
                >
                  Delete
                </button>

                {/* appear when request reviision */}
                {data.proheadStatus === "Request Revision" && (
                  <button
                    className="mt-4 px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600"
                    onClick={() => handleOpenRevisionModal(data)} // Open the modal with project data
                  >
                    Revise Project
                  </button>
                )}
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <p className="text-gray-400">No projects found.</p>
        )}

      </div>

      {isRevisionModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 mt-[100px] ">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-3/4 max-w-4xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-semibold text-white mb-4">Revise Project</h2>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-white">Project Title</label>
                <input
                  type="text"
                  value={updatedProjectData.title}
                  onChange={(e) =>
                    setUpdatedProjectData({ ...updatedProjectData, title: e.target.value })
                  }
                  className="w-full bg-gray-700 border-gray-600 text-white rounded-lg p-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-white">Description</label>
                <textarea
                  value={updatedProjectData.description}
                  onChange={(e) =>
                    setUpdatedProjectData({ ...updatedProjectData, description: e.target.value })
                  }
                  rows="4"
                  className="w-full bg-gray-700 border-gray-600 text-white rounded-lg p-2"
                ></textarea>
              </div>
              <div>
                <label className="block text-sm font-medium text-white">Category</label>
                <select
                  value={updatedProjectData.category}
                  onChange={(e) =>
                    setUpdatedProjectData({ ...updatedProjectData, category: e.target.value })
                  }
                  className="w-full bg-gray-700 border-gray-600 text-white rounded-lg p-2"
                >
                  <option>Web Development</option>
                  <option>Mobile App</option>
                  <option>Machine Learning</option>
                  <option>UI/UX Design</option>
                  <option>Data Science</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-white">Team Members</label>
                <textarea
                  value={updatedProjectData.teamMembers.join(", ")}
                  onChange={(e) =>
                    setUpdatedProjectData({
                      ...updatedProjectData,
                      teamMembers: e.target.value.split(",").map((member) => member.trim()),
                    })
                  }
                  rows="2"
                  className="w-full bg-gray-700 border-gray-600 text-white rounded-lg p-2"
                ></textarea>
              </div>

              {/* Section for editing project images */}
              <div>
                <label className="block text-sm font-medium text-white">Project Images</label>
                <div className="border-2 border-dashed border-gray-600 rounded-lg p-4 text-center">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={(e) => setNewImages([...e.target.files])}
                    className="hidden"
                    id="image-upload"
                  />
                  <label
                    htmlFor="image-upload"
                    className="cursor-pointer px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                  >
                    Upload Images
                  </label>
                  <p className="text-sm text-gray-400 mt-2">Supported formats: JPG, PNG, GIF</p>

                  {/* Display Existing Images */}
                  <div className="mt-4 grid grid-cols-4 gap-4">
                    {newImages.length > 0
                      ? newImages.map((image, index) => (
                        <div
                          key={index}
                          className="relative border border-gray-600 rounded-lg p-2 bg-gray-700"
                        >
                          <img
                            src={URL.createObjectURL(image)}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-24 object-cover rounded-md"
                          />
                          <button
                            type="button"
                            className="absolute top-1 right-1 bg-red-600 text-white rounded-full px-1"
                            onClick={() =>
                              setNewImages((prev) => prev.filter((_, i) => i !== index))
                            }
                          >
                            <i className="fas fa-times"></i>
                          </button>
                        </div>
                      ))
                      : updatedProjectData.images.map((image, index) => (
                        <div
                          key={index}
                          className="relative border border-gray-600 rounded-lg p-2 bg-gray-700"
                        >
                          <img
                            // src={`https://cloud.appwrite.io/v1/storage/buckets/${APPWRITE_CONFIG.BUCKETS.FILES}/files/${image.imageId}/view?project=${APPWRITE_CONFIG.PROJECT_ID}`}
                            alt={`Image ${index + 1}`}
                            className="w-full h-24 object-cover rounded-md"
                            src={generateFileUrl(image)}
                          />
                          <button
                            type="button"
                            className="absolute top-1 right-1 bg-red-600 text-white rounded-full px-1"
                            onClick={() =>
                              setUpdatedProjectData((prev) => ({
                                ...prev,
                                images: prev.images.filter((_, i) => i !== index),
                              }))
                            }
                          >
                            <i className="fas fa-times"></i>
                          </button>
                        </div>
                      ))}
                  </div>
                </div>
              </div>

              {/* Section for editing project attachments */}
              <div>
                <label className="block text-sm font-medium text-white">Project Attachments</label>
                <div className="border-2 border-dashed border-gray-600 rounded-lg p-4 text-center">
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx,.ppt,.zip"
                    multiple
                    onChange={(e) => setNewAttachments([...e.target.files])}
                    className="hidden"
                    id="attachment-upload"
                  />
                  <label
                    htmlFor="attachment-upload"
                    className="cursor-pointer px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                  >
                    Upload Attachments
                  </label>
                  <p className="text-sm text-gray-400 mt-2">
                    Supported formats: PDF, DOC, DOCX, PPT, ZIP
                  </p>

                  {/* Display Existing Attachments */}
                  <div className="mt-4 grid grid-cols-4 gap-4">
                    {newAttachments.length > 0
                      ? newAttachments.map((file, index) => (
                        <div
                          key={index}
                          className="relative border border-gray-600 rounded-lg p-2 bg-gray-700"
                        >
                          <p className="text-sm text-white truncate">{file.name}</p>
                          <button
                            type="button"
                            className="absolute top-1 right-1 bg-red-600 text-white rounded-full px-1"
                            onClick={() =>
                              setNewAttachments((prev) => prev.filter((_, i) => i !== index))
                            }
                          >
                            <i className="fas fa-times"></i>
                          </button>
                        </div>
                      ))
                      : updatedProjectData.attachments.map((attachment, index) => (
                        <div
                          key={index}
                          className="relative border border-gray-600 rounded-lg p-2 bg-gray-700"
                        >
                          <p className="text-sm text-white truncate">{oldAttachments.fileName}</p>


                          <button
                            type="button"
                            className="absolute top-1 right-1 bg-red-600 text-white rounded-full px-1"
                            onClick={() =>
                              setUpdatedProjectData((prev) => ({
                                ...prev,
                                attachments: prev.attachments.filter((_, i) => i !== index),
                              }))
                            }
                          >
                            <i className="fas fa-times"></i>
                          </button>
                        </div>
                      ))}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-white">GitHub Link</label>
                <input
                  type="url"
                  value={updatedProjectData.githubLink}
                  onChange={(e) =>
                    setUpdatedProjectData({ ...updatedProjectData, githubLink: e.target.value })
                  }
                  className="w-full bg-gray-700 border-gray-600 text-white rounded-lg p-2"
                />
              </div>

              {/* Submit and Cancel Buttons */}
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={handleCloseRevisionModal}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSubmitRevision}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  Submit Revision
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* : "loading projects ......" */}
      {/* } */}


    </div>
  );
};

export default Projects;