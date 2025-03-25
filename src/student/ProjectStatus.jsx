import React, { useContext, useState, useEffect } from "react";
import { UserContext } from "../context/contextApi";
const ProjectStatus = () => {
  const { fetchProjects, user, projects } = useContext(UserContext);

  useEffect(() => {
    if (user) {
      fetchProjects(user.$id);
    }
  }, [user, fetchProjects]);

  return (
    <div className="flex min-h-screen ">
      <main className="w-full">
        
        <div className="p-8">
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
                  <p className="text-white text-2xl font-semibold">2</p>
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
                  <p className="text-white text-2xl font-semibold">0</p>
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
                  <p className="text-white text-2xl font-semibold">0</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-white mb-6">
              Recent Projects
            </h2>
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
                  {projects.map((data, index) => (
                    <tr key={index} className="border-t border-gray-700">
                      <td className="py-4">{data?.title}</td>
                      <td>{data?.dueDate}</td>
                      <td>
                        <span
                          className={
                            data?.hodStatus === "not approved"
                              ? `px-2 py-1 text-sm bg-red-500 bg-opacity-20 text-red-500 rounded`
                              : `px-2 py-1 text-sm bg-green-500 bg-opacity-20 text-green-500 rounded`
                          }
                        >
                          {data?.proheadStatus}
                        </span>
                      </td>
                      <td>
                        <span
                          className={
                            data?.proheadStatus === "not approved"
                              ? `px-2 py-1 text-sm bg-red-500 bg-opacity-20 text-red-500 rounded`
                              : `px-2 py-1 text-sm bg-green-500 bg-opacity-20 text-green-500 rounded`
                          }
                        >
                          {data?.proheadStatus}
                        </span>
                      </td>
                      <td>{data?.hodComment}</td>
                      <td>{data?.proheadComment}</td>
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
          </div>

          {/* <div className="grid grid-cols-2 gap-6 mt-8">
            <div className="bg-gray-800 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-white mb-6">
                Recent Notifications
              </h2>
              <div className="space-y-4">
                <div className="flex items-start p-4 bg-gray-700 rounded-lg">
                  <i className="fas fa-info-circle text-custom mt-1"></i>
                  <div className="ml-4">
                    <p className="text-white">
                      Your AI Research Project has been approved
                    </p>
                    <p className="text-gray-400 text-sm">2 hours ago</p>
                  </div>
                </div>
                <div className="flex items-start p-4 bg-gray-700 rounded-lg">
                  <i className="fas fa-comment text-yellow-500 mt-1"></i>
                  <div className="ml-4">
                    <p className="text-white">
                      New comment on ML Algorithm Analysis
                    </p>
                    <p className="text-gray-400 text-sm">5 hours ago</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gray-800 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-white mb-6">
                Project Timeline
              </h2>
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-custom rounded-full"></div>
                  <div className="ml-4">
                    <p className="text-white">Project Submission</p>
                    <p className="text-gray-400 text-sm">Jan 15, 2024</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <div className="ml-4">
                    <p className="text-white">Initial Review</p>
                    <p className="text-gray-400 text-sm">Jan 18, 2024</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <div className="ml-4">
                    <p className="text-white">Final Approval</p>
                    <p className="text-gray-400 text-sm">Jan 20, 2024</p>
                  </div>
                </div>
              </div>
            </div>
          </div> */}
        </div>
      </main>
    </div>
  );
};

export default ProjectStatus;
