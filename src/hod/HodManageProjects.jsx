import React, { useState, useEffect, useContext } from "react";
import { databases, database_id, account, ID } from "../lib/appwrite"; // Import Appwrite configuration
import { HodContext, UserContext } from "../context/contextApi";
import { Query } from "appwrite";
import { FaReact, FaAngular, FaVuejs, FaNodeJs, FaPython, FaGithub, FaNpm, FaSwift } from "react-icons/fa";
import {
  SiDjango, SiTailwindcss, SiFirebase, SiAppwrite, SiTensorflow, SiPytorch, SiScikitlearn, SiKeras,
  SiOpencv, SiJupyter, SiGooglecolab, SiFigma, SiAdobexd, SiSketch, SiInvision, SiFramer, SiZelle,
  SiCanva, SiTableau, SiPowers, SiFlutter,
  SiKotlin,
  SiAndroidstudio
} from "react-icons/si";
import { TbBrandReactNative } from "react-icons/tb";
import './HodCss.css';
import { div } from "motion/react-client";

function HodManageProjects() {
  const { user, fetchStudentData } = useContext(UserContext); // Access the logged-in HOD
  const { hodUser } = useContext(HodContext); // Access HOD-specific context

  const [projects, setProjects] = useState([]); // State to store assigned projects
  const [currentHod, setCurrentHod] = useState(""); // State for the current HOD
  const [loading, setLoading] = useState(true); // State to handle loading
  const [searchQuery, setSearchQuery] = useState(""); // State for the search query
  const [selectedProjectCategory, setSelectedProjectCategory] = useState("All Categories"); // State for the selected category
  const [selectedSortOption, setSelectedSortOption] = useState("Newest"); // State for the selected sort option
  const [isModalOpen, setIsModalOpen] = useState(false); // State for modal visibility
  const [selectedProject, setSelectedProject] = useState(null); // State for the selected project
  const [projectUploaderMap, setProjectUploaderMap] = useState({}); // Map of project IDs to uploader data
  const [projectUploader, setProjectUploader] = useState({}); // State to store project uploader
  const [projectFiles, setProjectFiles] = useState([]); // State to store project files
  const [projectStatus, setProjectStatus] = useState("");
  const [rating, setRating] = useState(0); // State to store the selected rating
  const [feedback, setFeedback] = useState("no feedback");
  const [assignedHod, setAssignedHod] = useState(""); // State for the selected HOD
  const [hods, setHods] = useState([]); // State to store HODs

  const [totalProjects, setTotalProjects] = useState(0); // Total projects assigned to HOD
  const [approvedProjects, setApprovedProjects] = useState(0); // Approved projects count
  const [pendingReviews, setPendingReviews] = useState(0); // Pending reviews count
  const [rejectedProjects, setRejectedProjects] = useState(0); // Rejected projects count


  // Fetch projects assigned to the logged-in HOD
  const fetchAssignedProjects = async () => {
    try {
      setLoading(true);
      const response = await databases.listDocuments(
        database_id,
        "67d08e5700221884ebb9", // Replace with your projects collection ID
        [Query.equal("assignedReviewer", hodUser.name)] // Fetch projects assigned to the HOD
      );

      const projects = response.documents;

      // Calculate counts
      const total = projects.length;
      const approved = projects.filter((project) => project.hodStatus === "Approve").length;
      const pending = projects.filter((project) => project.hodStatus === "Pending").length;
      const rejected = projects.filter((project) => project.hodStatus === "Reject").length;

      // Update state
      setTotalProjects(total);
      setApprovedProjects(approved);
      setPendingReviews(pending);
      setRejectedProjects(rejected);

      // Loop through the projects and fetch the uploader's data
      const uploaderPromises = projects.map(async (project) => {
        const uploaderData = await fetchStudentData(project.uploadBy);
        return { projectId: project.$id, uploader: uploaderData };
      })

      const uploaderResults = await Promise.all(uploaderPromises);

      // Map the uploader data to the projects ids
      const uploaderMap = uploaderResults.reduce((acc, { projectId, uploader }) => {
        acc[projectId] = uploader;
        return acc;
      }, {});

      setProjects(projects); // Store assigned projects in state
      setProjectUploaderMap(uploaderMap);


    } catch (error) {
      console.error("Failed to fetch assigned projects:", error);
    } finally {
      setLoading(false); // Set loading to false
    }
  };

  // Fetch current HOD details
  const getHOD = async () => {
    const data = await account.get();
    setCurrentHod(data);
  };

  useEffect(() => {
    const fetchData = async () => {
      await getHOD(); // Fetch the current HOD details
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (hodUser) {
      fetchAssignedProjects(); // Fetch assigned projects only after hodUser is set
    }
  }, [hodUser]);

  // Generate file download/view URL
  const generateFileUrl = (fileId) => {
    const image = JSON.parse(fileId);
    return `https://cloud.appwrite.io/v1/storage/buckets/67d541b9000f5101fd5d/files/${image[0].imageId}/view?project=67d013a6000a87361603`;
  };

  const directGenerateFileUrl = (fileID) => {
    return `https://cloud.appwrite.io/v1/storage/buckets/67d541b9000f5101fd5d/files/${fileID}/view?project=67d013a6000a87361603`;
  };

  // Filtering, sorting, and searching logic
  const filteredProjects = projects
    .filter((project) => {
      // Filter by category
      if (selectedProjectCategory !== "All Categories") {
        return project.category === selectedProjectCategory;
      }
      return true;
    })
    .filter((project) => {
      // Filter by search query (case-insensitive)
      return (
        project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    });

  const sortedProjects = [...filteredProjects].sort((a, b) => {
    if (selectedSortOption === "Newest") {
      return new Date(b.$createdAt) - new Date(a.$createdAt); // Sort by newest
    } else if (selectedSortOption === "Oldest") {
      return new Date(a.$createdAt) - new Date(b.$createdAt); // Sort by oldest
    } else if (selectedSortOption === "Alphabetical") {
      return a.title.localeCompare(b.title); // Sort alphabetically by title
    }
    return 0;
  });

  // Handle card click to open modal
  const handleCardClick = async (project) => {

    setSelectedProject(project); // Set the selected project
    setProjectUploader(projectUploaderMap[project.$id]); // Set the project uploader
    setProjectFiles(JSON.parse(project.attachments)); // Parse and store project files
    setRating(project.rating || 0);
    setIsModalOpen(true);

  };

  // Handle modal close
  const handleCloseClick = () => {
    setIsModalOpen(false);
    setSelectedProject(null);
    setProjectFiles([]);
  };


  // get file icons
  const getFileIcon = (fileName) => {
    const extension = fileName.split('.').pop().toLowerCase(); // Extract file extension

    switch (extension) {
      case 'pdf':
        return 'fas fa-file-pdf text-red-500'; // PDF icon
      case 'doc':
      case 'docx':
        return 'fas fa-file-word text-blue-500'; // Word icon
      case 'xls':
      case 'xlsx':
        return 'fas fa-file-excel text-green-500'; // Excel icon
      case 'zip':
      case 'rar':
        return 'fas fa-file-archive text-yellow-500'; // Archive icon
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
        return 'fas fa-file-image text-purple-500'; // Image icon
      case 'txt':
        return 'fas fa-file-alt text-gray-500'; // Text file icon
      default:
        return 'fas fa-file text-gray-400'; // Default file icon
    }
  };

  // select project technologies
  const categoryTechnologies = {
    "Web Development": [
      "React",
      "Angular",
      "Vue",
      "Node.js",
      "Django",
      "TailwindCSS",
      "Bootstrap",
      "Firebase",
      "Appwrite",
      "GitHub",
      "NPM",
    ],
    "Mobile App": [
      "React Native",
      "Flutter",
      "Swift",
      "Kotlin",
      "Ionic",
      "Firebase",
      "Appwrite",
      "Expo",
      "Android Studio",
    ],
    "Machine Learning": [
      "TensorFlow",
      "PyTorch",
      "Scikit-learn",
      "Keras",
      "OpenCV",
      "Jupyter Notebook",
      "Google Colab",
      "Pandas",
      "NumPy",
    ],
    "UI/UX Design": [
      "Figma",
      "Adobe XD",
      "Sketch",
      "InVision",
      "Framer",
      "Canva",
      "Zeplin",
    ],
    "Data Science": [
      "Pandas",
      "NumPy",
      "Matplotlib",
      "Seaborn",
      "Jupyter Notebook",
      "Google Colab",
      "Tableau",
      "Power BI",
    ],
  };

  // technology icons
  const technologyIcons = {
    React: <FaReact className="text-blue-500" />,
    Angular: <FaAngular className="text-red-500" />,
    Vue: <FaVuejs className="text-green-500" />,
    "Node.js": <FaNodeJs className="text-green-600" />,
    Django: <SiDjango className="text-green-700" />,
    TailwindCSS: <SiTailwindcss className="text-blue-400" />,
    Bootstrap: <FaReact className="text-purple-500" />,
    Firebase: <img className="h-5 w-5" src="https://img.icons8.com/?size=100&id=62452&format=png&color=000000" />,
    Appwrite: <SiAppwrite className="text-pink-500" />,
    GitHub: <FaGithub className="text-gray-500" />,
    NPM: <FaNpm className="text-red-600" />,
    TensorFlow: <SiTensorflow className="text-orange-500" />,
    PyTorch: <SiPytorch className="text-red-500" />,
    "Scikit-learn": <SiScikitlearn className="text-blue-500" />,
    Keras: <SiKeras className="text-red-400" />,
    OpenCV: <SiOpencv className="text-blue-600" />,
    "Jupyter Notebook": <SiJupyter className="text-orange-400" />,
    "Google Colab": <SiGooglecolab className="text-yellow-400" />,
    Figma: <SiFigma className="text-purple-400" />,
    "Adobe XD": <SiAdobexd className="text-pink-400" />,
    Sketch: <SiSketch className="text-yellow-400" />,
    InVision: <SiInvision className="text-purple-500" />,
    Framer: <SiFramer className="text-blue-500" />,
    Canva: <SiCanva className="text-blue-400" />,
    Zeplin: <SiZelle className="text-yellow-500" />,
    Tableau: <SiTableau className="text-blue-500" />,
    "Power BI": <SiPowers className="text-yellow-500" />,
    "React Native": <TbBrandReactNative className="text-blue-400" />,
    "Flutter": <SiFlutter className="text-blue-400" />,
    Swift: <FaSwift className="text-orange-400" />,
    Kotlin: <SiKotlin className="text-purple-700  text-sm" />,
    // "Android Studio": <SiAndroidstudio className="text-blue-700" />,
    "Android Studio": <img className="h-5 w-5" src="https://img.icons8.com/?size=100&id=04OFrkjznvcd&format=png&color=000000" />,
    Pandas: <img className="h-5 w-5" src="https://img.icons8.com/?size=100&id=xSkewUSqtErH&format=png&color=000000" />,
    NumPy: <img className="h-5 w-5" src="https://img.icons8.com/?size=100&id=aR9CXyMagKIS&format=png&color=000000" />,
    Matplotlib: <img className="h-5 w-5" src="https://img.icons8.com/?size=100&id=AuUafKkHkYAO&format=png&color=000000" />,


  };

  const handleFeedbackSubmit = async () => {


    if (!rating) {
      alert("Please select project rating .");
      return;
    }

    if (!feedback) {
      alert("Please give your feedback .");
      return;
    }

    try {

      // Update the project document in the database
      const response = await databases.updateDocument(
        database_id,
        "67d08e5700221884ebb9", // Replace with your projects collection ID
        selectedProject.$id, // Project ID
        {
          hodComment: feedback,
          hodrating: rating,
          hodStatus: projectStatus, // Status selected by the HOD
          lastApproval: currentHod.name,
        }
      );

      if (response) {
        // Notify the student about the feedback
        await databases.createDocument(
          database_id,
          "67d08e62003a0547f663", // Replace with your notifications collection ID
          ID.unique(), // Generate a unique ID for the notification
          {
            studentId: selectedProject.uploadBy, // The ID of the student
            message: `Your project "${selectedProject.title}" has been reviewed by the HOD. Please check the feedback and complete the approval process.`,
            isRead: false, // Mark the notification as unread
            timestamp: new Date().toLocaleString(), // Current timestamp
            ApprovedBy: `HOD - ${currentHod.name}`
          }
        );
      }

      // Show success message
      alert("Feedback submitted successfully!");

      // Close the modal and refresh the project list
      setIsModalOpen(false);
      fetchAssignedProjects(); // Refresh the project list


    } catch (error) {
      console.error("Failed to submit feedback:", error);
      alert("Failed to submit feedback. Please try again.");
    }
  };


  return (
    <div className="bg-gray-900 min-h-screen text-white">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-gray-800 rounded-lg shadow px-5 py-6 sm:px-6 mb-8">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-4">
            <div className="bg-gray-800 overflow-hidden rounded-lg border border-gray-700">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <i className="fas fa-folder text-custom text-3xl"></i>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-400 truncate">Total Projects</dt>
                      <dd className="text-lg font-semibold text-white">{totalProjects}</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gray-800 overflow-hidden rounded-lg border border-gray-700">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <i className="fas fa-clock text-yellow-400 text-3xl"></i>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-400 truncate">Pending Reviews</dt>
                      <dd className="text-lg font-semibold text-white">{pendingReviews}</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gray-800 overflow-hidden rounded-lg border border-gray-700">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <i className="fas fa-check-circle text-green-500 text-3xl"></i>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-400 truncate">Approved Projects</dt>
                      <dd className="text-lg font-semibold text-white">{approvedProjects}</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gray-800 overflow-hidden rounded-lg border border-gray-700">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <i className="fas fa-times-circle text-red-500 text-3xl"></i>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-400 truncate">Rejected Projects</dt>
                      <dd className="text-lg font-semibold text-white">{rejectedProjects}</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Header and Filters */}
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-xl font-semibold text-white">Assigned Projects</h1>
          </div>
          <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
            <div className="flex space-x-4">
              <div className="relative">
                <input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  type="text"
                  className="block w-full rounded-md border-gray-700 bg-gray-700 text-white pr-10 focus:border-custom focus:ring-custom sm:text-sm"
                  placeholder="Search projects..."
                />
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                  <i className="fas fa-search text-gray-400"></i>
                </div>
              </div>
              <select
                value={selectedProjectCategory}
                onChange={(e) => setSelectedProjectCategory(e.target.value)}
                className="rounded-md border-gray-700 bg-gray-700 text-white py-2 pl-3 pr-10 text-base focus:border-custom focus:outline-none focus:ring-custom sm:text-sm"
              >
                <option>All Categories</option>
                <option>Web Development</option>
                <option>Mobile App</option>
                <option>Machine Learning</option>
                <option>UI/UX Design</option>
                <option>Data Science</option>
              </select>
              <select
                value={selectedSortOption}
                onChange={(e) => setSelectedSortOption(e.target.value)}
                className="rounded-md border-gray-700 bg-gray-700 text-white py-2 pl-3 pr-10 text-base focus:border-custom focus:outline-none focus:ring-custom sm:text-sm"
              >
                <option value="Newest">Sort by: Newest</option>
                <option value="Oldest">Sort by: Oldest</option>
                <option value="Alphabetical">Sort by: Alphabetical</option>
              </select>
            </div>
          </div>
        </div>

        {/* Project Cards */}
        {loading ? (
          <p className="text-gray-400 mt-6">Loading assigned projects...</p>
        ) : (
          <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {sortedProjects.length > 0 ? (
              sortedProjects.map((project) => (
                <div
                  key={project.$id}
                  onClick={() => {
                    handleCardClick(project)
                  }}
                  className="group relative rounded-lg border border-gray-700 cursor-pointer hover:shadow-lg transition-shadow duration-200 bg-gray-800"
                >
                  {/* Project Image */}
                  <div className="aspect-w-16 aspect-h-9 block w-full overflow-hidden rounded-t-lg bg-gray-900">
                    <img
                      src={project.images?.[0] ? generateFileUrl(project.images?.[0]) : "https://via.placeholder.com/300"}
                      alt={project.title}
                      className="object-cover w-full h-full"
                    />
                  </div>

                  {/* Project Details */}
                  <div className="flex-1 p-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-medium text-white">{project.title}</h3>



                    </div>
                    <p className="mt-2 text-sm text-gray-400">{project.description}</p>
                    {/* Badge for Approval by Project Head */}
                    {project.proheadStatus === "Approve" && (
                      <div className="mt-2">
                        <span className="inline-flex items-center rounded-full bg-green-900 text-green-300 px-2.5 py-0.5 text-xs font-medium">
                          Approved by Project Head
                        </span>
                      </div>
                    )}
                    {/* Project Uploader */}
                    <div className="mt-4 flex items-center">
                      <div className="flex-shrink-0">
                        <img
                          className="h-8 w-8 rounded-full"
                          src={
                            directGenerateFileUrl(projectUploaderMap[project.$id]?.userPicture) ||
                            "https://via.placeholder.com/150"
                          }
                          alt="Uploader"
                        />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-white">{projectUploaderMap[project.$id]?.Name || "Unknown"}</p>
                        <p className="text-xs text-gray-400">
                          Submitted on {new Date(project.$createdAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-400">No assigned projects available.</p>
            )}
          </div>
        )}

        {/* Modal for Project Details */}
        {isModalOpen && (
          <div id="project-modal" className=" fixed inset-0 mt-20 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">

            <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
              <div className="fixed inset-0 bg-gray-900 bg-opacity-75 transition-opacity"></div>
              <div className="inline-block align-bottom bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
                <div className="bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start">
                    <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                      <div className="flex justify-between items-start">
                        <h3 className="text-lg leading-6 font-medium text-white" id="modal-title">
                          Analytics Dashboard
                        </h3>
                        <button type="button" onClick={handleCloseClick} className="rounded-md text-gray-400 hover:text-white">
                          <span className="sr-only">Close</span>
                          <i className="fas fa-times"></i>
                        </button>
                      </div>
                      <div className="mt-4">
                        <img src={selectedProject.images[0] ? generateFileUrl(selectedProject.images[0]) : "no image"} alt="" className="w-full h-[55vh] rounded-lg" />
                        <div className="mt-4 grid grid-cols-3 gap-4">
                          <div className="space-y-2">
                            <h4 className="font-medium text-white">Student Details</h4>
                            <div className="flex items-center">
                              <img className="h-10 w-10 rounded-full" src={directGenerateFileUrl(projectUploaderMap[selectedProject.$id]?.userPicture) || "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS4GQuewxLfMh2olMxwVIVsJmu1qFf5Q4dwZw&s"} alt="" />
                              <div className="ml-3">
                                <p className="text-lg font-medium text-white">{projectUploader.Name}</p>
                                <p className="text-xs text-gray-400 mt-1">ID: {projectUploader.Roll}</p>
                              </div>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <h4 className="font-medium text-white">Submission Details</h4>
                            <p className="text-sm text-gray-400">Submitted: {new Date(selectedProject.$createdAt).toLocaleString()}</p>
                            <p className="text-sm text-gray-400">Category: {selectedProject.category}</p>
                          </div>


                          <div className="mt-7">

                            {/* Project Head Approval Badge */}
                            <div className="flex items-center space-x-2">
                              <span
                                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium
                                 ${selectedProject.proheadStatus === "Approve"
                                    ? "bg-green-900 text-green-300"
                                    : "bg-gray-700 text-gray-400"
                                  }`}
                              >
                                {selectedProject.proheadStatus === "Approve"
                                  ? "Stage 1: Approved by Project Head"
                                  : "Stage 1: Pending Approval"}
                              </span>
                              {selectedProject.proheadStatus === "Approve" && (
                                <i className="fas fa-check-circle text-green-300"></i>
                              )}
                            </div>

                            {/* HOD Approval Badge */}
                            <div className="flex items-center space-x-2 mt-2">
                              <span
                                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium 
                                ${selectedProject.hodStatus === "Approve"
                                    ? "bg-blue-900 text-blue-300"
                                    : "bg-gray-700 text-gray-400"
                                  }`}
                              >
                                {selectedProject.hodStatus === "Approve"
                                  ? "Stage 2: Approved by HOD"
                                  : "Stage 2: Pending Approval"}
                              </span>
                              {selectedProject.hodStatus === "Approve" && (
                                <i className="fas fa-check-circle text-blue-300"></i>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="mt-6">
                          <h4 className="font-medium text-white">Project Assignment</h4>
                          <div className="mt-2 flex items-center space-x-4">
                            <div className="flex items-center">
                              <img
                                className="h-10 w-10 rounded-full"
                                src={
                                  directGenerateFileUrl(selectedProject.assignedByPicture) || "https://via.placeholder.com/150"
                                }

                              />
                              <div className="ml-3">
                                <p className="text-sm font-medium text-white">
                                  Assigned By: {selectedProject.assignedBy || "Unknown"}
                                </p>
                                <p className="text-xs text-gray-400">
                                  Assigned on : {selectedProject.assignedDate}
                                  {/* Assigned on: {new Date(selectedProject.assignedDate).toLocaleString()} */}
                                </p>
                              </div>
                            </div>
                          </div>

                          {selectedProject.assignedBy && (
                            <div className="mt-4">
                              <h4 className="font-medium text-white">Project Approval</h4>
                              <div className="mt-2 flex items-center space-x-4">
                                <div className="flex items-center">
                                  <img
                                    className="h-10 w-10 rounded-full"
                                    src={
                                      directGenerateFileUrl(selectedProject.assignedByPicture) || "https://via.placeholder.com/150"
                                    }

                                  />
                                  <div className="ml-3">
                                    <p className="text-sm font-medium text-white">
                                      Approved By: {selectedProject.assignedBy || "Unknown"}
                                    </p>
                                    <p className="text-xs text-gray-400">
                                      Approved on : {selectedProject.assignedDate}
                                      {/* Approved on: {new Date(selectedProject.approvedDate).toLocaleString()} */}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                        <div className="mt-6">

                          <h4 className="font-medium text-white mt-5">Project Description</h4>
                          <p className="mt-2 text-sm text-gray-400">{selectedProject.description}</p>
                        </div>
                        <div className="mt-6">
                          <h4 className="font-medium text-white">Technical Specifications</h4>
                          <ul className="mt-2 text-sm text-gray-400 list-disc list-inside">
                            {
                              selectedProject.technologies.map((tech, index) => (
                                <li className="flex items-center">
                                  <p>{technologyIcons[tech]}</p>
                                  <p className="ml-2">{tech}</p>

                                </li>
                              ))
                            }

                          </ul>
                          <div className="mt-4">
                            <h4 className="font-medium text-white mb-2">Project Files</h4>
                            <div className="space-y-2">

                              {/* project attachements */}

                              <div className="text-gray-400 mb-2">

                                {projectFiles && projectFiles.length > 0 ? (
                                  <ul className="list-disc list-inside ml-4 space-y-2">
                                    {projectFiles.map((file, fileIndex) => (
                                      <li
                                        key={fileIndex}
                                        className="flex items-center justify-between p-3 rounded-lg bg-gray-800 hover:bg-gray-700 transition duration-200"
                                      >
                                        <div className="flex items-center gap-3">
                                          <i className={`${getFileIcon(file.fileName)} text-lg`}></i>
                                          <span className="text-sm text-white">{file.fileName || "Unnamed File"}</span>
                                        </div>
                                        <div className="flex gap-2">
                                          <button
                                            className="px-3 text-sm  bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-200"
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
                                            className="px-3 text-sm bg-green-500 text-white rounded-lg hover:bg-green-600 transition duration-200"
                                          >
                                            Download
                                          </a>
                                        </div>
                                      </li>
                                    ))}
                                  </ul>
                                ) : (
                                  <p className="text-sm text-gray-400">No attachments available.</p>
                                )}
                              </div>


                            </div></div>
                        </div>
                        <div className="mt-6">

                          <h4 className="font-medium text-white">Feedback</h4>

                          {selectedProject.proheadStatus === "Approve" && selectedProject.hodStatus === "Approve" ? (
                            // Show HOD's response if the project is approved by both
                            <div className="mt-2">
                              <p className="text-sm text-gray-400">
                                <strong>Your Feedback:</strong> {selectedProject.hodComment || "No feedback provided."}
                              </p>
                              <p className="text-sm text-gray-400 mt-2">
                                <strong>Your Rating:</strong> {selectedProject.hodrating || "No rating provided."}
                              </p>
                              <p className="text-sm text-gray-400 mt-2">
                                <strong>Project Status:</strong> {selectedProject.hodStatus || "No status provided."}
                              </p>
                            </div>
                          ) : (
                            <div>
                              <div className="mt-2">
                                <textarea rows="4"
                                  className="block w-full rounded-md border-gray-700 bg-gray-700 text-white shadow-sm focus:border-custom focus:ring-custom sm:text-sm"
                                  placeholder="Enter your feedback here..."
                                  value={feedback}
                                  onChange={(e) => setFeedback(e.target.value)}
                                >
                                </textarea>

                              </div>


                              <div className="mt-4 flex items-center space-x-4">

                                {/* rating system */}
                                <div className="mt-6">
                                  <h4 className="font-medium text-white">Rating</h4>
                                  <h6>select rating</h6>
                                  <div className="flex items-center mt-2">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                      <i
                                        key={star}
                                        className={`fas fa-star cursor-pointer ${star <= rating ? "text-yellow-400" : "text-gray-500"
                                          }`}
                                        onClick={() => setRating(star)} // Set the rating when a star is clicked
                                      ></i>
                                    ))}
                                  </div>



                                </div>


                                <select onChange={(e) => setProjectStatus(e.target.value)} className="rounded-md border-gray-700 bg-gray-700 text-white py-2 pl-3 pr-10 text-sm focus:border-custom focus:outline-none focus:ring-custom !rounded-button">
                                  <option>Update Status</option>
                                  <option>Approve</option>
                                  <option>Reject</option>
                                  <option>Request Revision</option>
                                </select>
                                <button className="ml-4 inline-flex items-center px-3 py-2 border border-gray-600 rounded-md text-sm text-gray-300 bg-gray-800 hover:bg-gray-700">
                                  <i className="fas fa-flag mr-2"></i>Flag Issue
                                </button>


                              </div>
                            </div>
                          )}

                        </div>

                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-900 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                    {
                      selectedProject.proheadStatus === "Approve" && selectedProject.hodStatus === "Approve"
                        ?
                        <span className="inline-flex items-center rounded-full bg-green-900 text-green-300 px-3 py-3 text-xs font-medium">
                          Approval process completed <i className="fas fa-check-circle text-green-300 ml-2 text-sm"></i>
                        </span> 
                        :
                          <button type="button"
                            className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-3 bg-custom text-base font-medium text-white hover:bg-custom/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-custom sm:ml-3 sm:w-auto sm:text-sm !rounded-button"
                            onClick={handleFeedbackSubmit}
                          >
                            Submit Feedback
                          </button>
                      
                    }

                  </div>
                </div>

                <button type="button" onClick={handleCloseClick} className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-600 shadow-sm px-4 py-2 bg-gray-800 text-base font-medium text-gray-300 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-custom sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm !rounded-button">
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

export default HodManageProjects;