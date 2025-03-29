import React, { useContext, useState, useEffect } from "react";
import { databases, database_id } from "../lib/appwrite"; // Import Appwrite configuration
import { UserContext } from "../context/contextApi"; // Import UserContext
import { Query } from "appwrite";

const ProjectStatus = () => {
  const { user } = useContext(UserContext); // Get the logged-in user from context
  const [projects, setProjects] = useState([]); // State to store projects
  const [loading, setLoading] = useState(true); // State to handle loading

  // Fetch projects for the logged-in student
  const fetchProjects = async (studentId) => {
    try {
      setLoading(true);
      const response = await databases.listDocuments(
        database_id,
        "67d08e5700221884ebb9", // Replace with your projects collection ID
        [Query.equal("uploadBy", studentId)] // Fetch projects uploaded by the student
      );
      setProjects(response.documents); // Store projects in state
    } catch (error) {
      console.error("Failed to fetch projects:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchProjects(user.$id); // Fetch projects when the user is available
    }
  }, [user]);

  return (
    <div className="flex min-h-screen bg-gray-900 text-white">
      <main className="w-full">
        <div className="p-8">
          <h1 className="text-2xl font-semibold mb-6">Project Status</h1>

          {/* Project Summary */}
          <div className="grid grid-cols-4 gap-6 mb-8">
            <div className="bg-gray-800 p-6 rounded-lg">
              <div className="flex items-center">
                <div className="p-3 bg-custom bg-opacity-20 rounded-lg">
                  <i className="fas fa-folder text-custom text-xl"></i>
                </div>
                <div className="ml-4">
                  <h3 className="text-gray-400 text-sm">Total Projects</h3>
                  <p className="text-white text-2xl font-semibold">
                    {projects.length}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-gray-800 p-6 rounded-lg">
              <div className="flex items-center">
                <div className="p-3 bg-yellow-500 bg-opacity-20 rounded-lg">
                  <i className="fas fa-clock text-yellow-500 text-xl"></i>
                </div>
                <div className="ml-4">
                  <h3 className="text-gray-400 text-sm">Pending</h3>
                  <p className="text-white text-2xl font-semibold">
                    {projects.filter((project) => project.hodStatus === "Pending").length}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-gray-800 p-6 rounded-lg">
              <div className="flex items-center">
                <div className="p-3 bg-green-500 bg-opacity-20 rounded-lg">
                  <i className="fas fa-check text-green-500 text-xl"></i>
                </div>
                <div className="ml-4">
                  <h3 className="text-gray-400 text-sm">Approved</h3>
                  <p className="text-white text-2xl font-semibold">
                    {projects.filter((project) => project.hodStatus === "Approve").length}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-gray-800 p-6 rounded-lg">
              <div className="flex items-center">
                <div className="p-3 bg-red-500 bg-opacity-20 rounded-lg">
                  <i className="fas fa-times text-red-500 text-xl"></i>
                </div>
                <div className="ml-4">
                  <h3 className="text-gray-400 text-sm">Rejected</h3>
                  <p className="text-white text-2xl font-semibold">
                    {projects.filter((project) => project.hodStatus === "Reject").length}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Projects Table */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-white mb-6">
              Recent Projects
            </h2>
            {loading ? (
              <p className="text-gray-400">Loading projects...</p>
            ) : projects.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-gray-400 text-left">
                      <th className="pb-4">Project Name</th>
                      <th className="pb-4">Submission Date</th>
                      <th className="pb-4">HOD Status</th>
                      <th className="pb-4">Project Head Status</th>
                      <th className="pb-4">HOD Comments</th>
                      <th className="pb-4">Project Head Comments</th>
                      <th className="pb-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="text-gray-300">
                    {projects.map((project, index) => (
                      <tr key={index} className="border-t border-gray-700">
                        <td className="py-4">{project.title}</td>
                        <td>{new Date(project.dueDate).toLocaleDateString()}</td>
                        <td>
                          <span
                            className={
                              project.hodStatus === "Reject"
                                ? `px-2 py-1 text-sm bg-red-500 bg-opacity-20 text-red-500 rounded`
                                : project.hodStatus === "Approve"
                                  ? `px-2 py-1 text-sm bg-green-500 bg-opacity-20 text-green-500 rounded`
                                  : `px-2 py-1 text-sm bg-yellow-500 bg-opacity-20 text-yellow-500 rounded`
                            }
                          >
                            {project.hodStatus || "Pending"}
                          </span>
                        </td>
                        <td>
                          <span
                            className={
                              project.proheadStatus === "Reject"
                                ? `px-2 py-1 text-sm bg-red-500 bg-opacity-20 text-red-500 rounded`
                                : project.proheadStatus === "Approve"
                                  ? `px-2 py-1 text-sm bg-green-500 bg-opacity-20 text-green-500 rounded`
                                  : `px-2 py-1 text-sm bg-yellow-500 bg-opacity-20 text-yellow-500 rounded`
                            }
                          >
                            {project.proheadStatus || "Pending"}
                          </span>
                        </td>
                        <td>
                          {project.hodComment ? (
                            project.hodComment.length > 50 ? (
                              <span>
                                {`${project.hodComment.substring(0, 50)}... `}
                                <button
                                  className="text-blue-500 hover:underline"
                                  onClick={() => alert(project.hodComment)} // Replace with a modal or tooltip if needed
                                >
                                  Read More
                                </button>
                              </span>
                            ) : (
                              project.hodComment
                            )
                          ) : (
                            "No comments"
                          )}
                        </td>
                        <td>
                          {project.proheadComment ? (
                            project.proheadComment.length > 50 ? (
                              <span>
                                {`${project.proheadComment.substring(0, 50)}... `}
                                <button
                                  className="text-blue-500 hover:underline"
                                  onClick={() => alert(project.proheadComment)} // Replace with a modal or tooltip if needed
                                >
                                  Read More
                                </button>
                              </span>
                            ) : (
                              project.proheadComment
                            )
                          ) : (
                            "No comments"
                          )}
                        </td>
                        <td>
                          <button className="text-custom hover:text-custom-600 !rounded-button">
                            View Details
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-gray-400">No projects found.</p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProjectStatus;