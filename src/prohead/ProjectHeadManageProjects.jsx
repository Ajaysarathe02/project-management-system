import React, { useState, useEffect } from "react";
import { databases, database_id } from "../lib/appwrite"; // Import Appwrite configuration
import { storage } from "../lib/appwrite"; // Import Appwrite storage

function ProjectHeadManageProjects() {
  const [projects, setProjects] = useState([]); // State to store project data
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null); // State for the selected project

  // Fetch projects from the database
  const fetchProjects = async () => {
    try {
      const response = await databases.listDocuments(
        database_id,
        "67d08e5700221884ebb9" // Replace with your projects collection ID
      );
      setProjects(response.documents); // Store fetched projects in state
    } catch (error) {
      console.error("Failed to fetch projects:", error);
    }
  };

  // Fetch projects on component mount
  useEffect(() => {
    fetchProjects();
  }, []);

  // Handle card click to open modal
  const handleCardClick = (project) => {
    setSelectedProject(project); // Set the selected project
    setIsModalOpen(true);
  };

  // Handle modal close
  const handleCloseClick = () => {
    setIsModalOpen(false);
    setSelectedProject(null);
  };

  // Generate file download/view URL
  const generateFileUrl = (fileId) => {
    const image = JSON.parse(fileId)
    console.log(image[0].imageId)
   return `https://cloud.appwrite.io/v1/storage/buckets/67d541b9000f5101fd5d/files/${image[0].imageId}/view?project=67d013a6000a87361603`;
  };

  return (
    <div className="bg-gray-900 min-h-screen text-white">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-gray-800 rounded-lg shadow px-5 py-6 sm:px-6">
          <div className="sm:flex sm:items-center">
            <div className="sm:flex-auto">
              <h1 className="text-xl font-semibold text-white">
                Project Submissions
              </h1>
            </div>
          </div>
          <div className="mt-8 grid grid-cols-3 gap-6 sm:grid-cols-3">
            {/* Dynamically render project cards */}
            {projects.map((project) => (
              <div
                key={project.$id}
                onClick={() => handleCardClick(project)}
                className="group relative rounded-lg border border-gray-700 cursor-pointer hover:shadow-lg transition-shadow duration-200"
              >
                <div className="aspect-w-16 aspect-h-9 block w-full overflow-hidden rounded-t-lg bg-gray-900">
                  <img
                    src={project.images[0] ? generateFileUrl(project.images[0]) : "no image"} // Use first image or placeholder
                    alt={project.title}
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 p-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium text-white">
                      {project.title}
                    </h3>
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        project.proheadStatus === "Approved"
                          ? "bg-green-900 text-green-300"
                          : project.proheadStatus === "Rejected"
                          ? "bg-red-900 text-red-300"
                          : "bg-yellow-900 text-yellow-300"
                      }`}
                    >
                      {project.proheadStatus || "Pending"}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-gray-400">
                    {project.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal for project details */}
      {isModalOpen && selectedProject && (
        <div
          id="project-modal"
          className="fixed inset-0 overflow-y-auto mt-[80px]"
          aria-labelledby="modal-title"
          role="dialog"
          aria-modal="true"
        >
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-900 bg-opacity-75 transition-opacity"></div>
            <div className="inline-block align-bottom bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
              <div className="bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                    <div className="flex justify-between items-start">
                      <h3
                        className="text-lg leading-6 font-medium text-white"
                        id="modal-title"
                      >
                        {selectedProject.title}
                      </h3>
                      <button
                        type="button"
                        className="rounded-md text-gray-400 hover:text-white"
                        onClick={handleCloseClick}
                      >
                        <span className="sr-only">Close</span>
                        <i className="fas fa-times"></i>
                      </button>
                    </div>
                    <div className="mt-4">
                      <p className="text-sm text-gray-400">
                        {selectedProject.description}
                      </p>
                      <div className="mt-4">
                        <h4 className="font-medium text-white mb-2">
                          Project Files
                        </h4>
                        <div className="space-y-2">
                          {selectedProject.attachments.map((fileId, index) => (
                            <div
                              key={index}
                              className="flex items-center justify-between p-2 rounded-md bg-gray-700"
                            >
                              <div className="flex items-center">
                                <i className="fas fa-file text-gray-400 mr-2"></i>
                                <span className="text-sm text-white">
                                  File {index + 1}
                                </span>
                              </div>
                              <a
                                href={generateFileUrl(fileId)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm text-custom hover:underline"
                              >
                                Download
                              </a>
                            </div>
                          ))}
                        </div>
                        <div className="mt-4">
                          <h4 className="font-medium text-white mb-2">
                            Project Images
                          </h4>
                          <div className="grid grid-cols-3 gap-4">
                            {selectedProject.images.map((imageId, index) => (
                              <img
                                key={index}
                                src={generateFileUrl(imageId)}
                                alt={`Image ${index + 1}`}
                                className="rounded-lg object-cover"
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-900 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={handleCloseClick}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-600 shadow-sm px-4 py-2 bg-gray-800 text-base font-medium text-gray-300 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-custom sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProjectHeadManageProjects;