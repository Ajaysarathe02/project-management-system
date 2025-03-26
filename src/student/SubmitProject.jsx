import React, { useState, useEffect, useRef, useContext } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { client, databases, database_id, ID, account, storage } from "../lib/appwrite";
import { UserContext } from "../context/contextApi";
import Uploading from "../animations/Uploading.json"
import Success from "../animations/Success.json"
import Lottie from "lottie-react";

const SubmitProject = () => {
  // project data
  const fileInputRef = useRef(null);
  const [fileNames, setFileNames] = useState([]);
  const [newTeamMember, setNewTeamMember] = useState("");
  const [uploadStatus, setUploadStatus] = useState("idle");

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
    hodStatus: 'not approved',
    proheadStatus: 'not approved',
    hodComment: 'no comments',
    proheadComment: 'no comment',
    uploadBy: user.$id,
    images: [],
  });


  // for clear the form
  const clearForm = () => {
    setProjectData({
      title: "",
      category: "Web Development",
      head: "",
      teamMembers: [],
      dueDate: "",
      githubLink: "",
      description: "",
      attachments: [],
      hodStatus: "not approved",
      proheadStatus: "not approved",
      hodComment: "no comments",
      proheadComment: "no comment",
      uploadBy: user.$id,
      images: [],
    });
    setFileNames([]);
    setNewTeamMember("");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProjectData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // for image selection
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setProjectData((prevData) => ({
      ...prevData,
      images: files,
    }));
  };

  // handle file selection
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);

    // Validate file size (max 10MB)
    const validFiles = files.filter((file) => file.size <= 10 * 1024 * 1024); // 10MB in bytes
    const invalidFiles = files.filter((file) => file.size > 10 * 1024 * 1024);

    if (invalidFiles.length > 0) {
      toast.error("Some files exceed the 10MB size limit and were not added.");
    }

    setProjectData((prevData) => ({
      ...prevData,
      attachments: validFiles,
    }));

    setFileNames(validFiles.map((file) => file.name));
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

  // project submit function
  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploadStatus("uploading");
    setLoading(true);

    try {

      await uploadProject(user.$id, projectData);
      setUploadStatus("success");

      // hide the success animation
      setTimeout(() => {
        setUploadStatus("idle")
        clearForm(); // for clear form
      }, 2000)

    } catch (error) {
      console.error("Failed to submit project:", error);
      setUploadStatus("idle");
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

              {/* for project image */}
              <div>
                <label className="block text-sm font-medium mb-2">Project Images</label>
                <div
                  className="border-2 border-dashed border-gray-600 rounded-lg p-6 text-center"
                  onDragOver={(e) => e.preventDefault()} // Prevent default behavior to allow drop
                  onDrop={(e) => {
                    e.preventDefault();
                    const files = Array.from(e.dataTransfer.files);

                    // Validate file size (max 5MB per image)
                    const validFiles = files.filter((file) => file.size <= 5 * 1024 * 1024); // 5MB in bytes
                    const invalidFiles = files.filter((file) => file.size > 5 * 1024 * 1024);

                    if (invalidFiles.length > 0) {
                      toast.error("Some images exceed the 5MB size limit and were not added.");
                    }

                    setProjectData((prevData) => ({
                      ...prevData,
                      images: [...prevData.images, ...validFiles],
                    }));
                  }}
                >
                  <i className="fas fa-image text-4xl text-gray-400 mb-3"></i>
                  <p className="text-gray-400">Drag and drop images here or</p>
                  <button
                    type="button"
                    className="mt-2 px-4 py-2 bg-custom text-white bg-blue-700 rounded-lg"
                    onClick={() => fileInputRef.current.click()}
                  >
                    Browse Images
                  </button>
                  <input
                    type="file"
                    name="images"
                    accept="image/*"
                    multiple
                    className="hidden"
                    ref={fileInputRef}
                    onChange={(e) => {
                      const files = Array.from(e.target.files);

                      // Validate file size (max 5MB per image)
                      const validFiles = files.filter((file) => file.size <= 5 * 1024 * 1024);
                      const invalidFiles = files.filter((file) => file.size > 5 * 1024 * 1024);

                      if (invalidFiles.length > 0) {
                        toast.error("Some images exceed the 5MB size limit and were not added.");
                      }

                      setProjectData((prevData) => ({
                        ...prevData,
                        images: [...prevData.images, ...validFiles],
                      }));
                    }}
                  />
                  <p className="mt-2 text-sm text-gray-500">
                    Supported formats: JPG, PNG, GIF (Max 5MB per image)
                  </p>

                  {/* Display selected images */}
                  {projectData.images.length > 0 && (
                    <div className="mt-4 grid grid-cols-4 gap-4">
                      {projectData.images.map((image, index) => (
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
                            onClick={() => {
                              setProjectData((prevData) => ({
                                ...prevData,
                                images: prevData.images.filter((_, i) => i !== index),
                              }));
                            }}
                          >
                            <i className="fas fa-times"></i>
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

              </div>

              {/* for project files */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Attachments
                </label>
                <div
                  className="border-2 border-dashed border-gray-600 rounded-lg p-6 text-center"
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    const files = Array.from(e.dataTransfer.files);
                    // Validate file size (max 10MB)
                    const validFiles = files.filter((file) => file.size <= 10 * 1024 * 1024); // 10MB in bytes
                    const invalidFiles = files.filter((file) => file.size > 10 * 1024 * 1024);

                    if (invalidFiles.length > 0) {
                      alert("Some files exceed the 10MB size limit and were not added.");
                    }
                    setProjectData((prevData) => ({
                      ...prevData,
                      attachments: [...prevData.attachments, ...validFiles],
                    }));

                    setFileNames((prevFileNames) => [
                      ...prevFileNames,
                      ...validFiles.map((file) => file.name),
                    ]);
                  }}
                >


                  <i className="fas fa-cloud-upload-alt text-4xl text-gray-400 mb-3"></i>
                  <p className="text-gray-400">Drag and drop files here or</p>
                  <button
                    type="button"
                    className="mt-2 px-4 py-2 bg-custom text-white bg-green-600 rounded-lg"
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
                    accept=".pdf, .ppt, .doc, .docx, .zip"
                    onChange={handleFileChange}
                  />
                  <p className="mt-2 text-sm text-gray-500">
                    Supported formats: PDF, PPT, DOC, DOCX, ZIP (Max 10MB)
                  </p>
                  {/* Display selected files */}
                  {projectData.attachments.length > 0 && (
                    <div className="mt-4 grid grid-cols-3 gap-4">
                      {projectData.attachments.map((file, index) => (
                        <div
                          key={index}
                          className="relative border border-gray-600 rounded-lg p-2 bg-gray-700"
                        >
                          {/* File preview */}
                          {file.type.startsWith("image/") ? (
                            <img
                              src={URL.createObjectURL(file)}
                              alt={`Preview ${index + 1}`}
                              className="w-full h-24 object-cover rounded-md"
                            />
                          ) : file.type === "application/pdf" ? (
                            <embed
                              src={URL.createObjectURL(file)}
                              type="application/pdf"
                              className="w-full h-24 rounded-md"
                            />
                          ) : (
                            <div className="flex items-center justify-center h-24 text-white">
                              <i className="fas fa-file-alt text-4xl"></i>
                              <p className="text-sm truncate ml-2">{file.name}</p>
                            </div>
                          )}

                          {/* Remove button */}
                          <button
                            type="button"
                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1"
                            onClick={() => {
                              setProjectData((prevData) => ({
                                ...prevData,
                                attachments: prevData.attachments.filter((_, i) => i !== index),
                              }));
                            }}
                          >
                            <i className="fas fa-times"></i>
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-4">
              <button
                type="button"
                onClick={clearForm}
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
                className="px-6 py-2 bg-custom text-white rounded-lg bg-green-600"
              >
                Submit Project
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
  );
};

export default SubmitProject;
