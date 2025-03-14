import React, { useState, useEffect, useRef, useContext } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { client, databases, database_id, ID, account } from "../lib/appwrite";
import { UserContext } from "../context/contextApi";

const SubmitProject = () => {
  // project data
  const fileInputRef = useRef(null);
  const [fileNames, setFileNames] = useState([]);
  const [newTeamMember, setNewTeamMember] = useState("");
  const { user, fetchProjects, uploadProject, projects } =
    useContext(UserContext);
  const [loading, setLoading] = useState(false);

  const [projectData, setProjectData] = useState({
    title: "",
    category: "Web Development",
    head: "",
    teamMembers: [],
    dueDate: "",
    githubLink: "",
    description: "",
    attachments: [],
    hodStatus:'not approved',
    proheadStatus:'not approved',
    hodComment:'no comments',
    proheadComment:'no comment',
    uploadBy:user.$id
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProjectData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setProjectData((prevData) => ({
      ...prevData,
      attachments: files,
    }));
    setFileNames(files.map((file) => file.name));
  };

  const handleAddTeamMember = () => {
    if (newTeamMember.trim() !== "") {
      setProjectData((prevData) => ({
        ...prevData,
        teamMembers: [...prevData.teamMembers, newTeamMember],
      }));
      setNewTeamMember(""); // Clear the input field
    }
  };

  const handleRemoveTeamMember = (index) => {
    setProjectData((prevData) => ({
      ...prevData,
      teamMembers: prevData.teamMembers.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {

      console.log("user id", user);
      await uploadProject(user.$id, projectData);
      toast.success("Project submitted successfully");
      console.log("projects", projects);

    } catch (error) {

      console.error(error);
      toast.error("Failed to submit project");
      
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center p-1 mb-15">
      <ToastContainer />
      <main className="p-8 flex justify-center bg-gray-800 w-5/7 rounded-xl mr-2">
        <div className="max-w-4xl w-full">
          <div className="mb-8">
            <h1 className="text-3xl font-bold">Submit New Project</h1>
            <p className="text-gray-400 mt-2">
              Fill in the project details below to submit your project
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="bg-gray-800 p-6 rounded-lg space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Project Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={projectData.title}
                  onChange={handleChange}
                  required
                  className="w-full bg-gray-700 border-gray-600 text-white rounded-lg"
                  placeholder="Enter project title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Project Category
                </label>
                <select
                  name="category"
                  value={projectData.category}
                  onChange={handleChange}
                  className="w-full bg-gray-700 border-gray-600 text-white rounded-lg"
                >
                  <option>Web Development</option>
                  <option>Mobile App</option>
                  <option>UI/UX Design</option>
                  <option>Data Science</option>
                </select>
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium mb-2">
                  Project Head
                </label>
                <select
                  name="head"
                  value={projectData.head}
                  onChange={handleChange}
                  className="w-full bg-gray-700 border-gray-600 text-white rounded-lg"
                >
                  <option>Select Project Head</option>
                  <option>John Doe</option>
                  <option>Jane Smith</option>
                  <option>Alex Johnson</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Team Members
                </label>
                <div className="space-y-3">
                  <div className="flex gap-3">
                    <input
                      type="text"
                      name="teamMember"
                      value={newTeamMember}
                      onChange={(e) => setNewTeamMember(e.target.value)}
                      className="flex-1 bg-gray-700 border-gray-600 text-white rounded-lg"
                      placeholder="Enter team member name"
                    />
                    <button
                      type="button"
                      onClick={handleAddTeamMember}
                      className="px-4 py-2 bg-custom text-white rounded-lg"
                    >
                      <i className="fas fa-plus"></i>
                    </button>
                  </div>
                  {projectData.teamMembers.map((member, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 bg-gray-700 px-3 py-2 rounded-lg"
                    >
                      <span className="flex-1">{member}</span>
                      <button
                        type="button"
                        className="text-red-400"
                        onClick={() => handleRemoveTeamMember(index)}
                      >
                        <i className="fas fa-times"></i>
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Due Date
                </label>
                <input
                  type="date"
                  name="dueDate"
                  value={projectData.dueDate}
                  onChange={handleChange}
                  className="w-full bg-gray-700 border-gray-600 text-white rounded-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  GitHub Repository Link
                </label>
                <input
                  type="url"
                  name="githubLink"
                  value={projectData.githubLink}
                  onChange={handleChange}
                  className="w-full bg-gray-700 border-gray-600 text-white rounded-lg"
                  placeholder="Enter GitHub repository URL"
                  pattern="https://github.com/.*"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Project Description
                </label>
                <textarea
                  name="description"
                  value={projectData.description}
                  onChange={handleChange}
                  rows="4"
                  className="w-full bg-gray-700 border-gray-600 text-white rounded-lg"
                  placeholder="Enter project description"
                ></textarea>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Attachments
                </label>
                <div className="border-2 border-dashed border-gray-600 rounded-lg p-6 text-center">
                  <i className="fas fa-cloud-upload-alt text-4xl text-gray-400 mb-3"></i>
                  <p className="text-gray-400">Drag and drop files here or</p>
                  <button
                    type="button"
                    className="mt-2 px-4 py-2 bg-custom text-white bg-green-500 rounded-lg"
                    onClick={() => fileInputRef.current.click()}
                  >
                    Browse Files
                  </button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    name="attachments"
                    className="hidden"
                    multiple
                    onChange={handleFileChange}
                  />
                  <p className="mt-2 text-sm text-gray-500">
                    Supported formats: PDF, DOC, DOCX, ZIP (Max 10MB)
                  </p>
                  {fileNames.length > 0 && (
                    <div className="mt-2 text-sm text-gray-500">
                      <p>Selected files:</p>
                      <ul>
                        {fileNames.map((fileName, index) => (
                          <li key={index}>{fileName}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-4">
              <button
                type="button"
                className="px-6 py-2 bg-gray-700 text-white rounded-lg"
              >
                Clear Form
              </button>
              <button
                type="button"
                className="px-6 py-2 bg-blue-600 text-white rounded-lg"
              >
                Save Draft
              </button>
              <button
                onClick={handleSubmit}
                type="submit"
                className="px-6 py-2 bg-custom text-white rounded-lg bg-green-500"
              >
                {loading ? (
                  <svg
                    className="animate-spin h-5 w-5 text-white"
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
                ) : (
                  "Submit Project"
                )}
              </button>
            </div>
          </form>
        </div>
      </main>

      <aside className="bg-gray-800 h-full p-6 w-2/7 rounded-xl overflow-y-auto ml-5">
        <h2 className="text-xl font-bold mb-4">Submission Guidelines</h2>
        <div className="space-y-4">
          <div className="bg-gray-700 p-4 rounded-lg">
            <h3 className="font-medium mb-2">Project Requirements</h3>
            <ul className="text-sm text-gray-300 space-y-2">
              <li>Project title must be unique</li>
              <li>Detailed description required (min. 200 characters)</li>
              <li>At least one team member required</li>
              <li>Due date must be in the future</li>
            </ul>
          </div>
          <div className="bg-gray-700 p-4 rounded-lg">
            <h3 className="font-medium mb-2">File Requirements</h3>
            <ul className="text-sm text-gray-300 space-y-2">
              <li>Maximum file size: 10MB per file</li>
              <li>Allowed formats: PDF, DOC, DOCX, ZIP</li>
              <li>Maximum 5 files per submission</li>
            </ul>
          </div>
          <div className="bg-gray-700 p-4 rounded-lg">
            <h3 className="font-medium mb-2">Team Guidelines</h3>
            <ul className="text-sm text-gray-300 space-y-2">
              <li>Maximum 5 team members</li>
              <li>Each member must have a valid name</li>
              <li>No duplicate team members allowed</li>
            </ul>
          </div>
        </div>
      </aside>
    </div>
  );
};

export default SubmitProject;
